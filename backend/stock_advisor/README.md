# Stock Advisor System

This folder contains a modular XGBoost-based stock prediction and advisory system for integration with your backend.

## Structure
- `stock_features.py`: Data fetching and feature engineering
- `train_xgb.py`: Model training and saving
- `predict_and_advice.py`: Prediction and advice logic
- `api_server.py`: FastAPI server exposing `/predict/{ticker}` endpoint

## Setup & Usage

1. **Install dependencies**
   ```sh
   pip install pandas numpy scikit-learn xgboost yfinance ta joblib fastapi uvicorn
   ```

2. **Train models for a ticker (optional, auto-trains on first API call if missing):**
   ```sh
   python train_xgb.py
   ```

3. **Start the API server:**
   ```sh
   uvicorn api_server:app --reload
   ```

4. **Query the API:**
   Visit:
   ```
   http://127.0.0.1:8000/predict/TCS.NS
   ```
   Replace `TCS.NS` with any supported ticker.

## Notes
- Models are saved in `xgb_models/` inside this folder.
- The API will auto-train models if they are missing for a ticker.
- All code is well-commented and modular for easy integration.
