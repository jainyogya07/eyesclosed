"""
Model Registry and Training Orchestration API Routes.
"""
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional, Dict, Any
from backend.app.schemas.model import (
    ModelMetadata,
    ModelCatalogResponse,
    TrainingStartRequest,
    TrainingCancelRequest,
    TrainingStatusResponse
)
from backend.app.services.model_registry import model_registry
from backend.app.services.training_orchestrator import (
    training_orchestrator,
    TrainingConflictException,
    FrozenModelRetrainException,
    InvalidModelException,
    TaskNotFoundException
)
from backend.app.infrastructure.logging import get_audit_logs

router = APIRouter(tags=["Models & Training"])

MODEL_STATUS_CATALOG: List[Dict[str, Any]] = [
    {
        "model_id": "M01",
        "code_name": "model1_downscaling",
        "full_name": "Hyperlocal Weather Downscaling",
        "stage_order": 1,
        "status": "FROZEN",
        "version": "1.0.0-pilot",
        "framework": "Scikit-Learn (Topographic Random Forest)",
        "spatial_resolution": "1 km x 1 km (EPSG:32644)",
        "temporal_cadence": "Hourly (72-hour forecast)",
        "artifact_path": "models/model1/model1_random_forest.joblib",
        "checksum_sha256": "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea",
        "training_dataset": "m1_tiny_v1_lucknow",
        "benchmark_metric": {
            "name": "MAE vs Independent AWS_LKO_05",
            "value": "0.4083°C (39.89% error reduction)",
            "verified": True
        },
        "uncertainty_calibrated": True,
        "dependencies": ["NCMRWF NWP Coarse Grid", "Copernicus GLO-30 DEM"]
    },
    {
        "model_id": "M02",
        "code_name": "model2_temperature_refinement",
        "full_name": "High-Resolution Temperature Refinement",
        "stage_order": 2,
        "status": "FROZEN",
        "version": "0.1.0-pilot",
        "framework": "Ridge Regularized Linear (Solar/Terrain/Canopy)",
        "spatial_resolution": "1 km x 1 km (EPSG:32644)",
        "temporal_cadence": "Hourly",
        "artifact_path": "models/model2/model2_pilot.joblib",
        "checksum_sha256": "a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8",
        "training_dataset": "m1_tiny_v1_lucknow",
        "benchmark_metric": {
            "name": "MAE vs Locked Test AWS",
            "value": "0.4113°C (Ablation: Δ = -0.0030°C vs M1)",
            "verified": True
        },
        "uncertainty_calibrated": True,
        "dependencies": ["M01 Downscaled Weather", "Copernicus Aspect/Slope"]
    },
    {
        "model_id": "M03",
        "code_name": "model3_precipitation_downscaling",
        "full_name": "Precipitation Downscaling (Two-Stage Hurdle)",
        "stage_order": 3,
        "status": "FROZEN",
        "version": "0.1.0-pilot",
        "framework": "Hurdle Model (Logistic Regression + Ridge on log1p)",
        "spatial_resolution": "1 km x 1 km (EPSG:32644)",
        "temporal_cadence": "Hourly precipitation",
        "artifact_path": "models/model3/model3_pilot.joblib",
        "checksum_sha256": "942691966f3c4aad6e1e10ddcf9291d5cf93a18d9b77d750c3e227cfa8205ac3",
        "training_dataset": "m1_tiny_v1_lucknow (72h, 5 stations, 0 extreme events)",
        "benchmark_metric": {
            "name": "Locked Test RMSE vs Raw NWP",
            "value": "0.9725 mm/h vs 1.1438 mm/h (15.0% error reduction)",
            "verified": True
        },
        "uncertainty_calibrated": False,
        "dependencies": ["M01 Temperature", "Copernicus DEM & Topography", "IMD AWS (Ground Calibration/LOSO Only)"]
    },
    {
        "model_id": "M04",
        "code_name": "model4_soil_moisture",
        "full_name": "SAR C-Band Optical Soil Moisture Retrieval",
        "stage_order": 4,
        "status": "NOT_AVAILABLE",
        "version": "0.0.1-PLANNED",
        "framework": "SAR Backscatter Water Balance Model",
        "spatial_resolution": "1 km x 1 km",
        "temporal_cadence": "Daily",
        "training_dataset": "Sentinel-1 GRD + SoilGrids 250m",
        "uncertainty_calibrated": False,
        "dependencies": ["M03 Precipitation", "Sentinel-1 SAR", "SoilGrids Clay/Sand"]
    },
    {
        "model_id": "M05",
        "code_name": "model5_crop_state",
        "full_name": "Crop State & Phenology Tracking",
        "stage_order": 5,
        "status": "NOT_AVAILABLE",
        "version": "0.0.1-PLANNED",
        "framework": "Harmonic Spectral Curve & GDD Model",
        "spatial_resolution": "Field parcel / 1 km",
        "temporal_cadence": "5-day Sentinel cadence",
        "training_dataset": "Sentinel-2 L2A + DAC&FW Crop Calendars",
        "uncertainty_calibrated": False,
        "dependencies": ["M01 GDD Accumulation", "Sentinel-2 NDVI/NDRE"]
    },
    {
        "model_id": "M06",
        "code_name": "model6_irrigation_demand",
        "full_name": "FAO-56 Penman-Monteith ET & Irrigation Engine",
        "stage_order": 6,
        "status": "NOT_AVAILABLE",
        "version": "0.0.1-PLANNED",
        "framework": "Deterministic Physical Energy Balance",
        "spatial_resolution": "1 km x 1 km",
        "temporal_cadence": "Daily advisory",
        "training_dataset": "Physics-based equation (No black box ML)",
        "uncertainty_calibrated": False,
        "dependencies": ["M01 Weather", "M04 Soil Moisture", "M05 Crop Kc"]
    },
    {
        "model_id": "M07",
        "code_name": "model7_yield_forecast",
        "full_name": "Crop Yield Forecasting",
        "stage_order": 7,
        "status": "NOT_AVAILABLE",
        "version": "0.0.1-PLANNED",
        "framework": "Cumulative Stress Gradient Boosting",
        "spatial_resolution": "Panchayat boundary",
        "temporal_cadence": "Mid-season to pre-harvest",
        "training_dataset": "District CCE Records (DAC&FW)",
        "uncertainty_calibrated": False,
        "dependencies": ["M04 Soil Water Deficit", "M05 NDRE Time-Series", "M06 ET"]
    },
    {
        "model_id": "M08",
        "code_name": "model8_flood_risk",
        "full_name": "Flood & Waterlogging Risk Inundation",
        "stage_order": 8,
        "status": "NOT_AVAILABLE",
        "version": "0.0.1-PLANNED",
        "framework": "Topographic Wetness Index & Catchment Runoff",
        "spatial_resolution": "1 km / Micro-catchment",
        "temporal_cadence": "Hourly forecast",
        "training_dataset": "SRTM Flow Accumulation + Sentinel-1 Flood History",
        "uncertainty_calibrated": False,
        "dependencies": ["M03 Peak Rainfall Intensity", "M04 Soil Saturation"]
    },
    {
        "model_id": "M09",
        "code_name": "model9_extreme_weather",
        "full_name": "Extreme Weather Hazard Intelligence",
        "stage_order": 9,
        "status": "NOT_AVAILABLE",
        "version": "0.0.1-PLANNED",
        "framework": "Empirical Climatological Quantile Exceedance",
        "spatial_resolution": "1 km x 1 km",
        "temporal_cadence": "6-hourly scan",
        "training_dataset": "IMD 30-Year High-Res Gridded Data",
        "uncertainty_calibrated": False,
        "dependencies": ["M01 Temperature", "M03 Rainfall", "30-Year Climatology"]
    },
    {
        "model_id": "M10",
        "code_name": "model10_agricultural_decision",
        "full_name": "Agricultural Decision Intelligence Engine",
        "stage_order": 10,
        "status": "NOT_AVAILABLE",
        "version": "0.0.1-PLANNED",
        "framework": "Multi-Criteria Optimization & Uncertainty Gating",
        "spatial_resolution": "Panchayat & Farmer Parcel",
        "temporal_cadence": "Continuous real-time",
        "training_dataset": "Agronomic SOPs + ICAR Advisory Rules",
        "uncertainty_calibrated": True,
        "dependencies": ["M01 through M09 Synthesized Cascade"]
    }
]

@router.get("/models", response_model=ModelCatalogResponse)
def list_models():
    models = model_registry.list_models()
    return ModelCatalogResponse(total_models=len(models), models=models)

@router.get("/orchestration/models")
def get_orchestration_models():
    return MODEL_STATUS_CATALOG

@router.get("/models/{model_id}", response_model=ModelMetadata)
def get_model(model_id: str):
    model = model_registry.get_model(model_id.upper())
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model '{model_id}' not found in registry."
        )
    return model

@router.get("/training/status", response_model=TrainingStatusResponse)
def get_training_status():
    return training_orchestrator.get_status()

@router.post("/training/start")
def start_training(req: TrainingStartRequest):
    try:
        result = training_orchestrator.start_training(
            model_id=req.model_id.upper(),
            dataset_version=req.dataset_version,
            hyperparameters=req.hyperparameters,
            agent_id=req.agent_id
        )
        return result
    except TrainingConflictException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except FrozenModelRetrainException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except InvalidModelException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/training/cancel")
def cancel_training(req: TrainingCancelRequest):
    try:
        return training_orchestrator.cancel_training(task_id=req.task_id, reason=req.reason)
    except TaskNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.get("/audit/logs")
def get_audit_trail(limit: int = 50):
    logs = get_audit_logs(limit=limit)
    return {"total": len(logs), "logs": logs}

