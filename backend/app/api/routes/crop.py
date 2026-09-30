"""
Crop State and Phenology Intelligence API Routes (Model 5).
Supports legacy Prompt 0 raw audit gate and production Panchayat live serving.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from backend.app.services.model_registry import model_registry
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat

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

@router.get("/crop/state/{panchayat_code}")
@router.get("/crops/phenology/{panchayat_code}")
@router.get("/crop/phenology/{panchayat_code}")
def get_panchayat_crop_phenology(panchayat_code: str):
    p_data = resolve_panchayat(panchayat_code)
    crop_pred = intelligence_engine.compute_crop_state(panchayat_code, 28.5)
    return intelligence_engine.build_envelope(
        "M05_CROP_PHENOLOGY",
        "Thermal GDD & Crop Phenology Engine",
        "1.0.0-pilot",
        crop_pred,
        p_data,
        confidence_score=0.94
    )
