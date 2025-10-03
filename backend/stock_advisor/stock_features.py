# stock_features.py
"""
Handles stock data fetching and feature engineering for prediction.
"""

import yfinance as yf
import pandas as pd
from ta.momentum import RSIIndicator

def fetch_stock_data(ticker, period="2y", interval="1d"):
    """
    Fetch historical stock data using yfinance.
    """
    df = yf.download(ticker, period=period, interval=interval, auto_adjust=True, progress=False)
    if df.empty:
        raise ValueError(f"No data found for ticker: {ticker}")
    df = df.dropna()
    return df

def add_features(df):
    """
    Add lag, returns, moving averages, RSI, and volatility features.
    """
    df = df.copy()
    df['lag1'] = df['Close'].shift(1)
    df['lag2'] = df['Close'].shift(2)
    df['return_1d'] = df['Close'].pct_change(1)
    df['return_3d'] = df['Close'].pct_change(3)
    df['sma_7'] = df['Close'].rolling(window=7).mean()
    df['sma_21'] = df['Close'].rolling(window=21).mean()
    df['ema_12'] = df['Close'].ewm(span=12, adjust=False).mean()
    # Ensure RSIIndicator receives a 1D Series
    df['rsi_14'] = RSIIndicator(df['Close'].squeeze(), window=14).rsi()
    df['volatility_7d'] = df['Close'].rolling(window=7).std()
    df = df.dropna()
    return df

def get_latest_features(ticker):
    """
    Fetch latest data and return the most recent row of engineered features.
    """
    df = fetch_stock_data(ticker)
    df_feat = add_features(df)
    return df_feat

if __name__ == "__main__":
    ticker = "TCS.NS"
    df = get_latest_features(ticker)
    print(df.tail())
