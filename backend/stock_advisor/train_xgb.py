# train_xgb.py
"""
Trains an ensemble of XGBoost regressors for a given ticker and saves them to disk.
"""

import os
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import TimeSeriesSplit
from joblib import dump
from stock_features import get_latest_features

N_MODELS = 5
MODEL_PATH = "xgb_models"

def train_xgb_ensemble(ticker):
    """
    Train an ensemble of XGBoost regressors and save them to disk.
    """
    os.makedirs(MODEL_PATH, exist_ok=True)
    df = get_latest_features(ticker)
    df['target'] = df['Close'].shift(-1)
    df = df.dropna()

    features = [
        'lag1', 'lag2', 'return_1d', 'return_3d',
        'sma_7', 'sma_21', 'ema_12', 'rsi_14', 'volatility_7d'
    ]
    X = df[features]
    y = df['target']

    tscv = TimeSeriesSplit(n_splits=N_MODELS)
    for i, (train_idx, test_idx) in enumerate(tscv.split(X)):
        X_train, y_train = X.iloc[train_idx], y.iloc[train_idx]
        model = XGBRegressor(n_estimators=100, max_depth=3, random_state=42)
        model.fit(X_train, y_train)
        model_file = os.path.join(MODEL_PATH, f"{ticker}_xgb_{i}.joblib")
        dump(model, model_file)
        print(f"Model {i+1} trained and saved to {model_file}")
    print("All models trained and saved.")

if __name__ == "__main__":
    train_xgb_ensemble("TCS.NS")
