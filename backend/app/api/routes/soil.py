"""
Soil Moisture Intelligence API Routes (Model 4).
Readiness Status: NOT_AVAILABLE (Pending Sentinel-1/2 & SoilGrids audit).
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from backend.app.schemas.prediction import PredictionRequest, StandardPredictionEnvelope
from backend.app.services.model_registry import model_registry

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
