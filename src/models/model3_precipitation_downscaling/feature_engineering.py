"""
Feature engineering and strictly causal lag construction for Model 3.
Enforces zero temporal leakage: features at timestamp t depend strictly on observations <= t-1.
"""
import numpy as np
import pandas as pd
from typing import Tuple

from src.models.model3_precipitation_downscaling.config import (
    RAIN_THRESHOLD_MM,
    ALL_FEATURE_COLUMNS
)


def compute_causal_rainfall_lags(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes strictly causal historical precipitation lags and rolling aggregates per station.
    Never uses observation at timestamp t or future timestamps t+k.
    """
    df_out = df.copy()
    df_out["dt"] = pd.to_datetime(df_out["timestamp_utc"])
    df_out = df_out.sort_values(by=["station_id", "dt"]).reset_index(drop=True)

    lag_1h = []
    lag_2h = []
    roll_3h = []
    roll_6h = []

    for station_id, group in df_out.groupby("station_id", sort=False):
        rains = group["rainfall_mm"].values
        n = len(rains)
        
        st_lag1 = np.zeros(n, dtype=float)
        st_lag2 = np.zeros(n, dtype=float)
        st_roll3 = np.zeros(n, dtype=float)
        st_roll6 = np.zeros(n, dtype=float)

        for i in range(n):
            # Causal lag 1h: rainfall at i-1
            if i >= 1:
                st_lag1[i] = rains[i - 1]
            else:
                st_lag1[i] = 0.0

            # Causal lag 2h: rainfall at i-2
            if i >= 2:
                st_lag2[i] = rains[i - 2]
            else:
                st_lag2[i] = 0.0

            # Rolling 3h prior rainfall: mean of [i-3 : i] (strictly <= i-1)
            if i >= 1:
                start_idx = max(0, i - 3)
                st_roll3[i] = float(np.mean(rains[start_idx:i]))
            else:
                st_roll3[i] = 0.0

            # Rolling 6h prior rainfall: mean of [i-6 : i] (strictly <= i-1)
            if i >= 1:
                start_idx = max(0, i - 6)
                st_roll6[i] = float(np.mean(rains[start_idx:i]))
            else:
                st_roll6[i] = 0.0

        lag_1h.extend(st_lag1)
        lag_2h.extend(st_lag2)
        roll_3h.extend(st_roll3)
        roll_6h.extend(st_roll6)

    df_out["rainfall_lag_1h"] = lag_1h
    df_out["rainfall_lag_2h"] = lag_2h
    df_out["rolling_3h_rainfall"] = roll_3h
    df_out["rolling_6h_rainfall"] = roll_6h

    # Binary rainfall occurrence target
    df_out["rain_flag"] = (df_out["rainfall_mm"] >= RAIN_THRESHOLD_MM).astype(int)
    
    # Conditional log-transformed intensity target
    df_out["log_rainfall_mm"] = np.log1p(df_out["rainfall_mm"])

    df_out = df_out.drop(columns=["dt"])
    return df_out


def prepare_feature_matrix(df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Extracts numpy feature matrix X, occurrence target y_occ, and raw rainfall target y_rain.
    """
    missing_cols = [c for c in ALL_FEATURE_COLUMNS if c not in df.columns]
    if missing_cols:
        raise KeyError(f"[FEATURE ERROR] Missing expected feature columns: {missing_cols}")

    X = df[ALL_FEATURE_COLUMNS].values.astype(np.float32)
    y_occ = df["rain_flag"].values.astype(int)
    y_rain = df["rainfall_mm"].values.astype(np.float32)
    return X, y_occ, y_rain
