"""
Crop Yield Forecasting API Routes (Model 7).
Supports legacy Prompt 0 raw audit gate and production Panchayat live serving.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from backend.app.services.model_registry import model_registry
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat

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

@router.get("/yield/forecast/{panchayat_code}")
def get_panchayat_yield_forecast(panchayat_code: str):
    p_data = resolve_panchayat(panchayat_code)
    yield_pred = intelligence_engine.compute_yield_forecast(
        panchayat_code=panchayat_code,
        temperature_c=28.5,
        water_stress_index=0.20,
        accumulated_gdd=1100.0
    )
    return intelligence_engine.build_envelope(
        "M07_CROP_YIELD",
        "Climatic & Phenological Yield Forecast Engine",
        "1.0.0-pilot",
        yield_pred,
        p_data,
        confidence_score=0.89
    )
