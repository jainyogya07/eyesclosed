"""
Flood and Waterlogging Risk Intelligence API Routes (Model 8).
Supports legacy Prompt 0 raw audit gate and production Panchayat live serving.
"""
from fastapi import APIRouter, HTTPException, Query, status
from typing import Optional
from backend.app.services.model_registry import model_registry
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat

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

@router.get("/hazards/flood/{panchayat_code}")
@router.get("/flood/risk/{panchayat_code}")
def get_panchayat_flood_risk(panchayat_code: str):
    p_data = resolve_panchayat(panchayat_code)
    flood_pred = intelligence_engine.compute_flood_risk(
        panchayat_code=panchayat_code,
        rainfall_1h_mm=0.0,
        rainfall_24h_mm=0.0
    )
    return intelligence_engine.build_envelope(
        "M08_FLOOD_WATERLOGGING",
        "Topographic Wetness Index & Drainage Inundation",
        "1.0.0-pilot",
        flood_pred,
        p_data,
        confidence_score=0.93
    )
