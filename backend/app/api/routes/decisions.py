"""
Agricultural Decision Intelligence Engine API Routes (Model 10).
Supports legacy Prompt 0 raw audit gate and production Panchayat live advisory / What-If serving.
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from backend.app.schemas.decision import ScenarioInput, ScenarioResult
from backend.app.services.model_registry import model_registry
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat

router = APIRouter(tags=["Decisions (M10)"])

@router.get("/decisions/{panchayat_id}")
def get_panchayat_decision(panchayat_id: str):
    model = model_registry.get_model("M10")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M10",
            "panchayat_id": panchayat_id,
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Model 10 Agricultural Decision Intelligence Engine is NOT_AVAILABLE (Rule Engine Not Implemented). Upstream models must be integrated and verified first."
        }
    )

@router.get("/advisories/{panchayat_code}")
def get_panchayat_advisory(panchayat_code: str):
    p_data = resolve_panchayat(panchayat_code)
    weather = {"temperature_c": 28.5, "wind_speed_ms": 2.8}
    precip = {"rain_probability": 0.12, "expected_rainfall_mm": 0.0}
    soil = intelligence_engine.compute_soil_moisture(p_data["latitude"], p_data["longitude"], 28.5, 0.0, p_data)
    irr = intelligence_engine.compute_et_irrigation(
        28.5, 72.0, 2.8, 450.0, 1003.0, 1.15, soil["root_zone_sm_vwc_pct"],
        soil["field_capacity_pct"], soil["wilting_point_pct"], 0.0
    )
    hazards = intelligence_engine.compute_hazards(28.5, 0.0, 2.8)
    return intelligence_engine.generate_decision_advisory(panchayat_code, weather, precip, soil, irr, hazards)

@router.post("/scenarios/run")
def run_scenario_endpoint(payload: Dict[str, Any]):
    p_code = payload.get("panchayat_code", "PC_092805")
    rain_override = float(payload.get("rainfall_override_mm", payload.get("rainfall_delta_mm", 0.0)))
    temp_override = float(payload.get("temperature_override_c", payload.get("temperature_anomaly_c", 0.0)))
    canal_release = int(payload.get("canal_water_release_hours", 0))
    return intelligence_engine.run_scenario(p_code, rain_override, temp_override, canal_release)

@router.post("/decisions/evaluate")
def evaluate_decision(payload: Dict[str, Any]):
    model = model_registry.get_model("M10")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M10",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "Decision evaluation engine rule pipeline not yet activated."
        }
    )

@router.post("/decisions/simulate")
def simulate_scenario(scenario: ScenarioInput):
    model = model_registry.get_model("M10")
    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "model_id": "M10",
            "status": model.status.value if model else "NOT_AVAILABLE",
            "message": "What-If simulation engine not yet activated."
        }
    )
