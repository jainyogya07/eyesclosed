"""
Backend configuration and system-wide invariants for Kisaan Ki Yash platform.
"""
import os
try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:
        pass

class Settings(BaseSettings):
    PROJECT_NAME: str = "Kisaan Ki Yash Intelligence API"
    VERSION: str = "0.1.0-pilot"
    API_V1_PREFIX: str = "/api/v1"
    
    # Base paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    WORKSPACE_ROOT: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
    
    # Frozen Model Checksums & Paths
    MODEL1_ARTIFACT_PATH: str = os.path.join(WORKSPACE_ROOT, "models/model1/model1_random_forest.joblib")
    MODEL1_SHA256: str = "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea"

    MODEL2_ARTIFACT_PATH: str = os.path.join(WORKSPACE_ROOT, "models/model2/model2_pilot.joblib")
    MODEL2_SHA256: str = "a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8"

    MODEL3_ARTIFACT_PATH: str = os.path.join(WORKSPACE_ROOT, "models/model3/model3_pilot.joblib")
    MODEL3_SHA256: str = "942691966f3c4aad6e1e10ddcf9291d5cf93a18d9b77d750c3e227cfa8205ac3"

    # Geospatial Standards
    PRIMARY_METRIC_CRS: str = "EPSG:32644"  # UTM Zone 44N for 1-km metric analysis
    INTERCHANGE_CRS: str = "EPSG:4326"      # WGS 84 for API I/O
    ANALYSIS_GRID_RESOLUTION_METERS: int = 1000

    # Invariants
    ONE_ACTIVE_TRAINING_JOB: bool = True
    ALLOW_PARALLEL_INFERENCE: bool = True

settings = Settings()
