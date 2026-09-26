"""
Dataset builder and experiment partitioner for Model 2.
Defines ablation feature combinations and leakage-safe spatial and temporal splits.
"""
from typing import Dict, List, Tuple
import pandas as pd
from src.models.model2_temperature_refinement.config import (
    TRAIN_STATIONS,
    VAL_STATION,
    LOCKED_TEST_STATION
)

# Experiment Feature Sets
EXPERIMENT_FEATURES: Dict[str, List[str]] = {
    "exp_a_coarse_nwp": [
        "coarse_t2m", "coarse_rh", "coarse_sp"
    ],
    "exp_b_model1_only": [
        "model1_pred_c"
    ],
    "exp_c_model1_terrain": [
        "model1_pred_c", "elevation_m", "slope_deg", "aspect_sin", "aspect_cos"
    ],
    "exp_d_model1_terrain_landcover": [
        "model1_pred_c", "elevation_m", "slope_deg", "aspect_sin", "aspect_cos",
        "cropland_fraction"
    ],
    "exp_e_model1_terrain_landcover_solar": [
        "model1_pred_c", "elevation_m", "slope_deg", "aspect_sin", "aspect_cos",
        "cropland_fraction", "cos_solar_zenith", "solar_elevation_deg", "is_daylight"
    ],
    "exp_f_all_available_predictors": [
        "model1_pred_c", "coarse_t2m", "coarse_rh", "coarse_sp",
        "elevation_m", "slope_deg", "aspect_sin", "aspect_cos",
        "cropland_fraction", "cos_solar_zenith", "solar_elevation_deg", "is_daylight",
        "lag_1h_temp"
    ]
}


def get_spatial_splits(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Partitions dataset strictly by station (Leave-Stations-Out).
    Train: AWS_LKO_01, AWS_LKO_02, AWS_LKO_03
    Validation: AWS_LKO_04
    Locked Test: AWS_LKO_05
    """
    train_df = df[df["station_id"].isin(TRAIN_STATIONS)].copy()
    val_df = df[df["station_id"] == VAL_STATION].copy()
    test_df = df[df["station_id"] == LOCKED_TEST_STATION].copy()

    return train_df, val_df, test_df


def get_temporal_split(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Partitions training/validation stations chronologically:
    Train: First 48 hours (t_idx < 48)
    Validation: Last 24 hours (t_idx >= 48)
    Strictly excludes the locked test station.
    """
    sub_df = df[df["station_id"].isin(TRAIN_STATIONS + [VAL_STATION])].copy()
    train_temp = sub_df[sub_df["t_idx"] < 48].copy()
    val_temp = sub_df[sub_df["t_idx"] >= 48].copy()

    return train_temp, val_temp
