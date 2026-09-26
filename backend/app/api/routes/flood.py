"""
Flood and Waterlogging Risk Intelligence API Routes (Model 8).
Readiness Status: NOT_AVAILABLE (Pending DEM hydro-enforcement and validated flood masks).
"""
from fastapi import APIRouter, HTTPException, Query, status
from backend.app.services.model_registry import model_registry

router = APIRouter(tags=["Flood Risk (M8)"])

@router.get("/flood/risk")
def get_flood_risk(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    model = model_registry.get_model("M8")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M8",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 8 is currently NOT_AVAILABLE. DEM hydrodynamic and waterlogging audit pending."
        }
    )
