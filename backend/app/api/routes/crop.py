"""
Crop State and Phenology Intelligence API Routes (Model 5).
Readiness Status: NOT_AVAILABLE (Pending phenological validation labels).
"""
from fastapi import APIRouter, HTTPException, Query, status
from backend.app.schemas.prediction import PredictionRequest
from backend.app.services.model_registry import model_registry

router = APIRouter(tags=["Crop State (M5)"])

@router.get("/crop/phenology")
def get_crop_phenology(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    model = model_registry.get_model("M5")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M5",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 5 is currently NOT_AVAILABLE. Phenology data readiness audit required."
        }
    )
