"""
Baseline models for Model 2 comparison.
Includes Raw NWP, Persistence, Frozen Model 1, and Linear/Ridge benchmarks.
"""
from typing import Dict, Any
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from src.models.model2_temperature_refinement.evaluation import compute_point_metrics


def evaluate_model2_baselines(train_df: pd.DataFrame, eval_df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
    """
    Computes all 5 mandatory baseline benchmarks on the evaluation split.
    """
    y_true = eval_df["target_temp_c"].values

    # Baseline 1: Raw Coarse NWP
    b1_preds = eval_df["coarse_t2m"].values
    b1_metrics = compute_point_metrics(y_true, b1_preds)

    # Baseline 2: Persistence (T_{t-1})
    b2_preds = eval_df["lag_1h_temp"].values
    b2_metrics = compute_point_metrics(y_true, b2_preds)

    # Baseline 3: Frozen Model 1 Downscaler
    b3_preds = eval_df["model1_pred_c"].values
    b3_metrics = compute_point_metrics(y_true, b3_preds)

    # Baseline 4: Linear Model 1 + Coarse + Solar
    b4_features = ["model1_pred_c", "coarse_t2m", "cos_solar_zenith", "solar_elevation_deg"]
    reg_b4 = LinearRegression()
    reg_b4.fit(train_df[b4_features], train_df["target_temp_c"])
    b4_preds = reg_b4.predict(eval_df[b4_features])
    b4_metrics = compute_point_metrics(y_true, b4_preds)

    # Baseline 5: Ridge Topography + Solar Geometry
    b5_features = ["elevation_m", "slope_deg", "aspect_sin", "aspect_cos", "cos_solar_zenith", "solar_elevation_deg"]
    reg_b5 = Ridge(alpha=1.0, random_state=42)
    reg_b5.fit(train_df[b5_features], train_df["target_temp_c"])
    b5_preds = reg_b5.predict(eval_df[b5_features])
    b5_metrics = compute_point_metrics(y_true, b5_preds)

    return {
        "baseline_1_raw_coarse_nwp": b1_metrics,
        "baseline_2_persistence": b2_metrics,
        "baseline_3_frozen_model1": b3_metrics,
        "baseline_4_linear_model1_solar": b4_metrics,
        "baseline_5_ridge_terrain_solar": b5_metrics
    }
