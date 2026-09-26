"""
Configuration and Immutability Contracts for Model 3: Precipitation Downscaling.
Model Version: model3_precipitation_downscaling_v0.1.0_pilot
"""
import os

RANDOM_SEED = 42
MODEL3_VERSION = "model3_precipitation_downscaling_v0.1.0_pilot"
MODEL3_ID = "M3_PRECIPITATION_DOWNSCALING_PILOT"

# Upstream Model Verification Hashes (Strictly Frozen)
MODEL1_ARTIFACT_PATH = "models/model1/model1_random_forest.joblib"
MODEL1_CHECKSUM_SHA256 = "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea"

MODEL2_ARTIFACT_PATH = "models/model2/model2_pilot.joblib"
MODEL2_CHECKSUM_SHA256 = "a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8"

# Data Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
AWS_FILE = os.path.join(BASE_DIR, "data/datasets/tiny/model1/aws_ground_truth_72h.csv")
NWP_FILE = os.path.join(BASE_DIR, "data/datasets/tiny/model1/coarse_nwp_timeseries.npz")
TERRAIN_FILE = os.path.join(BASE_DIR, "data/datasets/tiny/model1/terrain_features_1km.npz")

BASE_TIMESTAMP_UTC = "2025-07-15T00:00:00Z"

# Spatial Holdout Protocol (Strict Station Isolation)
TRAIN_STATIONS = ["AWS_LKO_01", "AWS_LKO_02", "AWS_LKO_03"]
VAL_STATIONS = ["AWS_LKO_04"]
TEST_STATIONS = ["AWS_LKO_05"]  # LOCKED TEST: Never touched during feature engineering, threshold tuning or training

# Precipitation Physical Thresholds
RAIN_THRESHOLD_MM = 0.1       # WMO/IMD measurable precipitation threshold (mm/h)
EXTREME_THRESHOLD_MM = 15.0   # IMD heavy/extreme threshold (mm/h)

# Causal Feature Set
ATMOSPHERIC_FEATURES = [
    "coarse_precip",
    "coarse_t2m",
    "coarse_rh",
    "coarse_sp"
]

HISTORICAL_LAG_FEATURES = [
    "rainfall_lag_1h",
    "rainfall_lag_2h",
    "rolling_3h_rainfall",
    "rolling_6h_rainfall"
]

TERRAIN_FEATURES = [
    "elevation_m",
    "slope_deg",
    "aspect_sin",
    "aspect_cos"
]

LAND_COVER_FEATURES = [
    "cropland_fraction"
]

UPSTREAM_FEATURES = [
    "model1_pred_c"
]

ALL_FEATURE_COLUMNS = (
    ATMOSPHERIC_FEATURES +
    HISTORICAL_LAG_FEATURES +
    TERRAIN_FEATURES +
    LAND_COVER_FEATURES +
    UPSTREAM_FEATURES
)

# Output Paths
MODEL3_SAVE_PATH = os.path.join(BASE_DIR, "models/model3/model3_pilot.joblib")
MODEL3_WEIGHTS_MIRROR = os.path.join(BASE_DIR, "artifacts/weights/model3/model3_pilot.joblib")
MODEL3_CARD_PATH = os.path.join(BASE_DIR, "models/model3/model_card.md")
REPORTS_DIR = os.path.join(BASE_DIR, "reports/model3")
