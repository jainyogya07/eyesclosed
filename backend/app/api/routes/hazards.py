"""
Extreme Weather and Hazard Intelligence API Routes (Model 9).
Readiness Status: NOT_AVAILABLE (Pending climatology threshold engine implementation).
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Dict, Any
from backend.app.services.model_registry import model_registry

router = APIRouter(tags=["Hazards (M9)"])

@router.get("/hazards")
def get_hazards(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    model = model_registry.get_model("M9")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M9",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 9 is currently NOT_AVAILABLE. Climatology percentiles and threshold engine pending."
        }
    )

@router.post("/hazards/evaluate")
def evaluate_hazards(payload: Dict[str, Any]):
    model = model_registry.get_model("M9")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M9",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Hazard evaluation engine is not yet activated."
        }
    )
