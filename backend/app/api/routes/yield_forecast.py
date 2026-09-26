"""
Crop Yield Forecasting API Routes (Model 7).
Readiness Status: NOT_AVAILABLE (Pending official agricultural statistics/CCE yield labels audit).
"""
from fastapi import APIRouter, HTTPException, Query, status
from backend.app.services.model_registry import model_registry

router = APIRouter(tags=["Crop Yield (M7)"])

@router.get("/yield/forecast")
def get_yield_forecast(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    model = model_registry.get_model("M7")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M7",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 7 is currently NOT_AVAILABLE. District/Panchayat CCE yield data audit pending."
        }
    )
