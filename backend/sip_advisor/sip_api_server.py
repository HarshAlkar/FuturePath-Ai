"""
FastAPI server for SIP recommendations using Gemini AI and mfapi.in
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import pandas as pd
from datetime import datetime
import google.generativeai as genai
import numpy as np
import os
import random
from typing import Optional

app = FastAPI(
    title="SIP Recommendation API",
    description="AI-powered SIP recommendations using Gemini AI and live mutual fund data",
    version="1.0"
)

# Configure Gemini AI
GEMINI_API_KEY = "AIzaSyDq8Ejg1Cx46i9LUDgnLMRsgLY-ijk2Tfg"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# Request/Response Models
class SIPRequest(BaseModel):
    annual_income: int
    horizon_years: int
    risk_level: str  # "low", "moderate", "aggressive"

class SIPResponse(BaseModel):
    success: bool
    monthly_sip: int
    recommendation: str
    fund_recommendations: list
    timestamp: str

# Helper Functions
def get_all_funds():
    """Fetch all available mutual fund schemes from mfapi.in"""
    try:
        url = "https://api.mfapi.in/mf"
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching fund list: {e}")
        return None

def suggest_sip_amount(annual_income, risk_level):
    """Suggest monthly SIP amount based on income and risk appetite"""
    risk_map = {"low": 0.10, "moderate": 0.15, "aggressive": 0.20}
    investment_percentage = risk_map.get(risk_level.lower(), 0.15)
    return max(500, int((annual_income * investment_percentage) / 12))

def fetch_nav_history(scheme_code):
    """Fetch NAV history for a scheme"""
    try:
        url = f"https://api.mfapi.in/mf/{scheme_code}"
        res = requests.get(url, timeout=10).json()
        return res.get("data", [])
    except:
        return []

def calculate_cagr(nav_data, years=3):
    """Calculate Compound Annual Growth Rate"""
    try:
        if len(nav_data) < years * 250:
            return None
        end_nav = float(nav_data[0]['nav'])
        start_nav = float(nav_data[-(years*250)]['nav'])
        return (end_nav/start_nav) ** (1/years) - 1
    except:
        return None

def calculate_volatility(nav_data, days=365):
    """Calculate volatility from NAV data"""
    try:
        nav_values = [float(d['nav']) for d in nav_data[:days]]
        daily_returns = np.diff(nav_values) / nav_values[:-1]
        return np.std(daily_returns)
    except:
        return None

def pick_top_funds(funds, top_n=50):
    """Rank funds by return/risk ratio and return top performers"""
    scored_funds = []
    for f in funds[:200]:  # Limit to first 200 funds for performance
        scheme_code = f['schemeCode']
        nav_data = fetch_nav_history(scheme_code)
        if not nav_data:
            continue
        cagr = calculate_cagr(nav_data, years=3)
        risk = calculate_volatility(nav_data, days=365)
        if cagr and risk and risk > 0:
            score = cagr / risk
            scored_funds.append({"fund": f, "cagr": cagr, "risk": risk, "score": score})

    scored_funds.sort(key=lambda x: x['score'], reverse=True)
    top_funds = [s["fund"] for s in scored_funds[:top_n]]
    return top_funds

def get_gemini_recommendation(annual_income, horizon_years, risk_level):
    """Get AI-powered fund recommendations using Gemini"""
    print(f"\nFetching live fund data...")
    all_funds = get_all_funds()
    if not all_funds:
        return "Could not fetch fund list.", []

    print(f"Found {len(all_funds)} funds. Filtering based on risk level: '{risk_level}'...")

    # Filter funds based on risk level
    if risk_level == "aggressive":
        keywords = ['Small Cap', 'Midcap', 'Sectoral', 'Thematic', 'Technology', 'Infra']
    elif risk_level == 'moderate':
        keywords = ['Flexi Cap', 'Large & Mid Cap', 'Multi Cap', 'Hybrid', 'Balanced Advantage', 'Value']
    else:  # 'low' risk
        keywords = ['Debt', 'Liquid', 'Gilt', 'Conservative', 'Corporate Bond', 'Short Duration']

    filtered_funds = [f for f in all_funds if any(k.lower() in f['schemeName'].lower() for k in keywords)]
    if len(filtered_funds) < 15:
        sample_source = all_funds
    else:
        sample_source = filtered_funds

    print("Ranking funds by return/risk ratio...")
    fund_sample = pick_top_funds(sample_source, 50)
    print(f"Providing top {len(fund_sample)} funds to Gemini API for analysis...")

    prompt = f"""
    You are an expert AI financial advisor. Recommend 3 mutual funds from the provided list.

    **User Profile:**
    - Annual Income: ₹{annual_income:,.0f}
    - Investment Horizon: {horizon_years} years
    - Risk Level: {risk_level.title()}

    **Instructions:**
    1. Recommend exactly 3 funds.
    2. For each: give Scheme Name, Scheme Code, Category, and 2-3 line explanation.
    3. Use only funds from this list:
    {fund_sample}
    """

    try:
        response = model.generate_content(prompt)
        return response.text, fund_sample[:3]  # Return top 3 funds as well
    except Exception as e:
        return f"Error with Gemini API: {e}", []

# API Endpoints
@app.get("/")
async def root():
    return {"message": "SIP Recommendation API is running", "status": "healthy"}

@app.post("/recommend", response_model=SIPResponse)
async def get_sip_recommendation(request: SIPRequest):
    """Get SIP recommendations based on user profile"""
    try:
        # Validate risk level
        if request.risk_level.lower() not in ["low", "moderate", "aggressive"]:
            raise HTTPException(status_code=400, detail="Risk level must be 'low', 'moderate', or 'aggressive'")
        
        # Calculate suggested SIP amount
        monthly_sip = suggest_sip_amount(request.annual_income, request.risk_level)
        
        # Get AI recommendation
        recommendation, fund_recommendations = get_gemini_recommendation(
            request.annual_income, 
            request.horizon_years, 
            request.risk_level
        )
        
        return SIPResponse(
            success=True,
            monthly_sip=monthly_sip,
            recommendation=recommendation,
            fund_recommendations=fund_recommendations,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "gemini_configured": bool(GEMINI_API_KEY),
        "api_version": "1.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
