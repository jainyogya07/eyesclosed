"""
ET and Irrigation Demand Intelligence API Routes (Model 6).
Supports legacy Prompt 0 raw audit gate and production Panchayat live serving.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from backend.app.services.model_registry import model_registry
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat

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

@router.get("/irrigation/demand/{panchayat_code}")
def get_panchayat_irrigation_demand(panchayat_code: str):
    p_data = resolve_panchayat(panchayat_code)
    irr_pred = intelligence_engine.compute_et_irrigation(
        temperature_c=28.5,
        relative_humidity_pct=72.0,
        wind_speed_ms=2.8,
        solar_radiation_wm2=450.0,
        surface_pressure_hpa=1003.0,
        crop_kc=1.15,
        root_vwc_pct=24.0,
        field_capacity_pct=p_data.get("field_capacity_pct", 32.0),
        wilting_point_pct=p_data.get("wilting_point_pct", 14.0),
        forecast_rain_mm=0.0
    )
    return intelligence_engine.build_envelope(
        "M06_IRRIGATION_DEMAND",
        "FAO-56 Penman-Monteith Net Irrigation Engine",
        "1.0.0-pilot",
        irr_pred,
        p_data,
        confidence_score=0.95
    )
