# predict_and_advice.py
"""
Loads XGBoost models, makes predictions, and generates trading advice.
"""

import os
import numpy as np
from joblib import load
from stock_features import get_latest_features
from train_xgb import train_xgb_ensemble, N_MODELS, MODEL_PATH

def load_models(ticker):
    """
    Load all XGBoost models for a ticker. Retrain if missing.
    """
    models = []
    for i in range(N_MODELS):
        model_file = os.path.join(MODEL_PATH, f"{ticker}_xgb_{i}.joblib")
        if not os.path.exists(model_file):
            print(f"Model {model_file} not found. Training models for {ticker}...")
            train_xgb_ensemble(ticker)
            break
    for i in range(N_MODELS):
        model_file = os.path.join(MODEL_PATH, f"{ticker}_xgb_{i}.joblib")
        models.append(load(model_file))
    return models

def predict_next_close(ticker):
    """
    Predict the next closing price using the ensemble.
    """
    df = get_latest_features(ticker)
    latest = df.iloc[-1]
    features = [
        'lag1', 'lag2', 'return_1d', 'return_3d',
        'sma_7', 'sma_21', 'ema_12', 'rsi_14', 'volatility_7d'
    ]
    X_pred = latest[features].values.reshape(1, -1)
    models = load_models(ticker)
    preds = np.array([model.predict(X_pred)[0] for model in models])
    mean_pred = preds.mean()
    std_pred = preds.std()
    return mean_pred, std_pred, latest

def get_advice(current_price, predicted_price, rsi):
    """
    Generate trading advice based on prediction and RSI.
    """
    print(f"DEBUG: current_price type: {type(current_price)}, value: {current_price}")
    print(f"DEBUG: rsi type: {type(rsi)}, value: {rsi}")
    # Ensure rsi is a float, not a Series
    if hasattr(rsi, 'item'):
        rsi = rsi.item() if getattr(rsi, 'size', 1) == 1 else float(rsi.values[-1])
    else:
        rsi = float(rsi)
    pct_change = (predicted_price - current_price) / current_price * 100
    print(f"DEBUG: pct_change: {pct_change}")
    if pct_change > 1 and rsi < 70:
        return "Buy", f"Predicted change {pct_change:.2f}% > 1% and RSI {rsi:.2f} < 70"
    elif abs(pct_change) <= 1:
        return "Hold", f"Predicted change {pct_change:.2f}% within ±1%"
    else:
        return "Sell", f"Predicted change {pct_change:.2f}% and/or RSI {rsi:.2f} >= 70"

def predict_and_advise(ticker):
    """
    Predict and provide trading advice for a ticker.
    """
    mean_pred, std_pred, latest = predict_next_close(ticker)
    current_price = latest['Close']
    rsi = latest['rsi_14']
    signal, reason = get_advice(current_price, mean_pred, rsi)
    # Determine up/down/no_change
    if mean_pred > current_price:
        up_down = "up"
    elif mean_pred < current_price:
        up_down = "down"
    else:
        up_down = "no_change"
    return {
        "current_price": float(current_price),
        "predicted_mean": float(mean_pred),
        "predicted_range": [float(mean_pred - std_pred), float(mean_pred + std_pred)],
        "confidence": float(std_pred),
        "signal": signal,
        "reason": reason,
        "up_down": up_down
    }

if __name__ == "__main__":
    result = predict_and_advise("TCS.NS")
    print(result)
