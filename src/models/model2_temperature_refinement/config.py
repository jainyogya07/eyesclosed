"""
Configuration parameters for Model 2: High-Resolution Temperature Refinement (Pilot Stage).
"""
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))

# Upstream Model 1 Dependencies (Strictly Immutable & Frozen)
MODEL1_ARTIFACT_PATH = os.path.join(PROJECT_ROOT, "models/model1/model1_random_forest.joblib")
MODEL1_CHECKSUM_SHA256 = "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea"

# Data Directories
DATA_DIR_PILOT = os.path.join(PROJECT_ROOT, "data/datasets/tiny/model1")
TERRAIN_FILE = os.path.join(DATA_DIR_PILOT, "terrain_features_1km.npz")
NWP_FILE = os.path.join(DATA_DIR_PILOT, "coarse_nwp_timeseries.npz")
AWS_FILE = os.path.join(DATA_DIR_PILOT, "aws_ground_truth_72h.csv")

# Artifact Output Paths
MODEL2_DIR = os.path.join(PROJECT_ROOT, "models/model2")
WEIGHTS_DIR = os.path.join(PROJECT_ROOT, "artifacts/weights/model2")
REPORTS_DIR = os.path.join(PROJECT_ROOT, "reports/model2")
LOCK_FILE = os.path.join(PROJECT_ROOT, "training_queue/model2.lock")

# Spatial & Temporal Standards
ANALYSIS_CRS = "EPSG:32644"  # UTM Zone 44N Metric Projected Grid
GRID_RESOLUTION_METERS = 1000.0  # 1 km physical cell size
BASE_TIMESTAMP_UTC = "2025-07-15T00:00:00"
RANDOM_SEED = 42

# Strict Station Splitting
TRAIN_STATIONS = ["AWS_LKO_01", "AWS_LKO_02", "AWS_LKO_03"]
VAL_STATION = "AWS_LKO_04"
LOCKED_TEST_STATION = "AWS_LKO_05"

# Missing Datasets Policy
LST_AVAILABLE = False
ERA5_LAND_AVAILABLE = False

# Model Identification
MODEL2_ID = "model2_temperature_refinement"
MODEL2_VERSION = "model2_temperature_refinement_v0.1.0_pilot"
UPSTREAM_MODEL_ID = "model1_downscaling"
UPSTREAM_MODEL_VERSION = "v1.0.0-pilot"
STATUS = "PILOT_VERIFICATION_ONLY"
