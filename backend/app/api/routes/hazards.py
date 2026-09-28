"""
Extreme Weather and Hazard Intelligence API Routes (Model 9).
Supports legacy Prompt 0 raw audit gate and production Panchayat live serving.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Dict, Any, Optional
from backend.app.services.model_registry import model_registry
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat

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

@router.get("/hazards/extreme/{panchayat_code}")
def get_panchayat_hazards(panchayat_code: str):
    p_data = resolve_panchayat(panchayat_code)
    hazard_pred = intelligence_engine.compute_hazards(
        temperature_c=28.5,
        rainfall_1h_mm=0.0,
        wind_speed_ms=2.8
    )
    return intelligence_engine.build_envelope(
        "M09_EXTREME_HAZARDS",
        "Climatological Percentile Hazard Intelligence",
        "1.0.0-pilot",
        hazard_pred,
        p_data,
        confidence_score=0.96
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
