"""
ET and Irrigation Demand Intelligence API Routes (Model 6).
Readiness Status: NOT_AVAILABLE (Pending FAO-56 Penman-Monteith engine implementation).
"""
from fastapi import APIRouter, HTTPException, Query, status
from backend.app.services.model_registry import model_registry

router = APIRouter(tags=["ET & Irrigation (M6)"])

@router.get("/irrigation/demand")
def get_irrigation_demand(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    model = model_registry.get_model("M6")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M6",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 6 is currently NOT_AVAILABLE. FAO-56 water-balance engine pending implementation."
        }
    )
