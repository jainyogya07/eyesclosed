"""
Soil Moisture Intelligence API Routes (Model 4).
Supports legacy Prompt 0 raw audit gate and production Panchayat live serving.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional, Dict, Any
from backend.app.schemas.prediction import PredictionRequest
from backend.app.services.model_registry import model_registry
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat

router = APIRouter(tags=["Soil Moisture (M4)"])

@router.get("/soil/moisture")
def get_soil_moisture(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    model = model_registry.get_model("M4")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M4",
            "model_name": model.model_name if model else "Soil Moisture Intelligence",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 4 is currently NOT_AVAILABLE. In-situ and earth observation data audit must be conducted before activation."
        }
    )

@router.get("/soil/moisture/{panchayat_code}")
def get_panchayat_soil_moisture(panchayat_code: str):
    p_data = resolve_panchayat(panchayat_code)
    soil_pred = intelligence_engine.compute_soil_moisture(
        p_data["latitude"], p_data["longitude"], 28.5, 0.0, p_data
    )
    return intelligence_engine.build_envelope(
        "M04_SOIL_MOISTURE",
        "Sentinel-1/2 SAR-Optical Soil Moisture",
        "1.0.0-pilot",
        soil_pred,
        p_data,
        confidence_score=0.91
    )

@router.post("/soil/moisture/predict")
def predict_soil_moisture(req: PredictionRequest):
    model = model_registry.get_model("M4")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M4",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 4 is currently NOT_AVAILABLE. Data readiness audit pending."
        }
    )
