"""
Model Registry Service for Kisaan Ki Yash.
Manages metadata, lifecycle state, dependency tracking, and artifact cryptographic verification for all 10 intelligence models.
"""
from typing import Dict, List, Optional
import os
from backend.app.config import settings
from backend.app.schemas.common import ModelReadinessState
from backend.app.schemas.model import ModelMetadata
from backend.app.infrastructure.storage import compute_sha256, verify_file_integrity
from backend.app.infrastructure.logging import log_audit_event, logger

class ModelRegistryService:
    def __init__(self):
        self._models: Dict[str, ModelMetadata] = {}
        self._initialize_registry()
        self.verify_frozen_artifacts()

    def _initialize_registry(self):
        """Initializes all 10 intelligence models with strict governance states."""
        models_data = [
            ModelMetadata(
                model_id="M1",
                model_name="Hyperlocal Weather Downscaling",
                version="0.1.0-pilot",
                status=ModelReadinessState.FROZEN_PILOT,
                artifact_path=settings.MODEL1_ARTIFACT_PATH,
                sha256=settings.MODEL1_SHA256,
                training_dataset="data/datasets/tiny/model1/ (AWS_LKO_01, 02, 03)",
                validation_dataset="data/datasets/tiny/model1/ (AWS_LKO_04 val, AWS_LKO_05 locked test)",
                production_ready=False,
                uncertainty_status="PILOT_CALIBRATED",
                created_at="2026-09-24T12:00:00Z",
                updated_at="2026-09-25T18:00:00Z",
                dependencies=[],
                description="Random Forest downscaling 0.25 deg NWP to 1-km metric grid (EPSG:32644)."
            ),
            ModelMetadata(
                model_id="M2",
                model_name="High-Resolution Temperature Refinement",
                version="0.1.0-pilot",
                status=ModelReadinessState.FROZEN_PILOT,
                artifact_path=settings.MODEL2_ARTIFACT_PATH,
                sha256=settings.MODEL2_SHA256,
                training_dataset="data/datasets/tiny/model1/ (AWS_LKO_01, 02, 03)",
                validation_dataset="data/datasets/tiny/model1/ (AWS_LKO_04 val, AWS_LKO_05 locked test)",
                production_ready=False,
                uncertainty_status="PILOT_CALIBRATED",
                created_at="2026-09-25T14:00:00Z",
                updated_at="2026-09-25T20:00:00Z",
                dependencies=["M1"],
                description="Micro-climate temperature refinement consuming M1 temperature, solar geometry, and terrain."
            ),
            ModelMetadata(
                model_id="M3",
                model_name="Precipitation Downscaling",
                version="0.1.0-pilot",
                status=ModelReadinessState.FROZEN_PILOT,
                artifact_path=settings.MODEL3_ARTIFACT_PATH,
                sha256=settings.MODEL3_SHA256,
                training_dataset="data/datasets/tiny/model1/ (AWS_LKO_01, 02, 03)",
                validation_dataset="data/datasets/tiny/model1/ (AWS_LKO_04 val, AWS_LKO_05 locked test)",
                production_ready=False,
                uncertainty_status="LIMITED_CALIBRATION",
                created_at="2026-09-26T10:00:00Z",
                updated_at="2026-09-26T15:00:00Z",
                dependencies=["M1"],
                description="Two-stage hurdle precipitation model (logistic classifier + gradient boosting regressor)."
            ),
            ModelMetadata(
                model_id="M4",
                model_name="Soil Moisture Intelligence",
                version="0.0.0-unreleased",
                status=ModelReadinessState.NOT_AVAILABLE,
                artifact_path=None,
                sha256=None,
                training_dataset=None,
                validation_dataset=None,
                production_ready=False,
                uncertainty_status="UNAVAILABLE",
                created_at="2026-09-26T00:00:00Z",
                updated_at="2026-09-26T00:00:00Z",
                dependencies=["M1", "M2", "M3"],
                description="Sentinel-1/2 SAR and optical fusion for surface and root-zone soil moisture."
            ),
            ModelMetadata(
                model_id="M5",
                model_name="Crop State and Phenology Intelligence",
                version="0.0.0-unreleased",
                status=ModelReadinessState.NOT_AVAILABLE,
                artifact_path=None,
                sha256=None,
                training_dataset=None,
                validation_dataset=None,
                production_ready=False,
                uncertainty_status="UNAVAILABLE",
                created_at="2026-09-26T00:00:00Z",
                updated_at="2026-09-26T00:00:00Z",
                dependencies=["M1", "M2", "M4"],
                description="Crop growth stage classification and phenological GDD tracking."
            ),
            ModelMetadata(
                model_id="M6",
                model_name="ET and Irrigation Demand Intelligence",
                version="0.0.0-unreleased",
                status=ModelReadinessState.NOT_AVAILABLE,
                artifact_path=None,
                sha256=None,
                training_dataset=None,
                validation_dataset=None,
                production_ready=False,
                uncertainty_status="UNAVAILABLE",
                created_at="2026-09-26T00:00:00Z",
                updated_at="2026-09-26T00:00:00Z",
                dependencies=["M1", "M2", "M3", "M4", "M5"],
                description="FAO-56 Penman-Monteith water-balance engine and irrigation demand scheduler."
            ),
            ModelMetadata(
                model_id="M7",
                model_name="Crop Yield Forecasting",
                version="0.0.0-unreleased",
                status=ModelReadinessState.NOT_AVAILABLE,
                artifact_path=None,
                sha256=None,
                training_dataset=None,
                validation_dataset=None,
                production_ready=False,
                uncertainty_status="UNAVAILABLE",
                created_at="2026-09-26T00:00:00Z",
                updated_at="2026-09-26T00:00:00Z",
                dependencies=["M1", "M2", "M3", "M4", "M5", "M6"],
                description="End-of-season yield prediction conditioned on weather anomalies and vegetation indices."
            ),
            ModelMetadata(
                model_id="M8",
                model_name="Flood and Waterlogging Risk Intelligence",
                version="0.0.0-unreleased",
                status=ModelReadinessState.NOT_AVAILABLE,
                artifact_path=None,
                sha256=None,
                training_dataset=None,
                validation_dataset=None,
                production_ready=False,
                uncertainty_status="UNAVAILABLE",
                created_at="2026-09-26T00:00:00Z",
                updated_at="2026-09-26T00:00:00Z",
                dependencies=["M3", "M4"],
                description="Hydrodynamic TWI and DEM depression waterlogging risk prediction."
            ),
            ModelMetadata(
                model_id="M9",
                model_name="Extreme Weather and Hazard Intelligence",
                version="0.0.0-unreleased",
                status=ModelReadinessState.NOT_AVAILABLE,
                artifact_path=None,
                sha256=None,
                training_dataset=None,
                validation_dataset=None,
                production_ready=False,
                uncertainty_status="UNAVAILABLE",
                created_at="2026-09-26T00:00:00Z",
                updated_at="2026-09-26T00:00:00Z",
                dependencies=["M1", "M2", "M3"],
                description="Climatology percentile thresholds for heatwaves, cold waves, and dry spells."
            ),
            ModelMetadata(
                model_id="M10",
                model_name="Agricultural Decision Intelligence Engine",
                version="0.0.0-unreleased",
                status=ModelReadinessState.NOT_AVAILABLE,
                artifact_path=None,
                sha256=None,
                training_dataset=None,
                validation_dataset=None,
                production_ready=False,
                uncertainty_status="UNAVAILABLE",
                created_at="2026-09-26T00:00:00Z",
                updated_at="2026-09-26T00:00:00Z",
                dependencies=["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9"],
                description="Rule engine + expected-loss optimization (rule engine not implemented)."
            ),
        ]
        for m in models_data:
            self._models[m.model_id] = m

    def verify_frozen_artifacts(self) -> Dict[str, bool]:
        """
        Verifies SHA-256 hashes of frozen pilot models (M1, M2, M3) on disk.
        Returns mapping of model_id to boolean verification status.
        """
        results = {}
        for mid in ["M1", "M2", "M3"]:
            model = self._models.get(mid)
            if model and model.artifact_path:
                if os.path.exists(model.artifact_path):
                    valid, actual_hash = verify_file_integrity(model.artifact_path, model.sha256)
                    results[mid] = valid
                    if not valid:
                        logger.error(f"[SECURITY ALERT] {mid} hash mismatch! Expected {model.sha256}, got {actual_hash}")
                    else:
                        logger.info(f"[INTEGRITY VERIFIED] {mid} artifact sha256={actual_hash}")
                else:
                    logger.warning(f"[REGISTRY] Artifact file for {mid} not found at {model.artifact_path}")
                    results[mid] = False
        return results

    def get_model(self, model_id: str) -> Optional[ModelMetadata]:
        return self._models.get(model_id)

    def list_models(self) -> List[ModelMetadata]:
        return list(self._models.values())

    def update_model_status(self, model_id: str, new_status: ModelReadinessState):
        if model_id in self._models:
            self._models[model_id].status = new_status
            log_audit_event(
                action="UPDATE_MODEL_STATUS",
                model_id=model_id,
                status=new_status.value
            )

model_registry = ModelRegistryService()
