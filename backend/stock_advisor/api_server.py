# api_server.py
"""
FastAPI server exposing the /predict/{ticker} endpoint for stock prediction and advice.
"""

from fastapi import FastAPI, HTTPException
from predict_and_advice import predict_and_advise
import yfinance as yf

app = FastAPI(
    title="XGBoost Stock Prediction & Advisory API",
    description="Predicts next-day stock prices and provides trading advice using XGBoost ensemble.",
    version="1.0"
)

@app.get("/predict/{ticker}")
def predict(ticker: str):
    """
    Predict next-day closing price and provide trading advice for the given ticker.
    """
    try:
        # Validate ticker by fetching minimal data
        data = yf.download(ticker, period="1d", progress=False)
        if data.empty:
            raise ValueError("Invalid ticker or no data available.")
        result = predict_and_advise(ticker)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
