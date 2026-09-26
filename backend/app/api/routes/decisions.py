"""
Agricultural Decision Intelligence Engine API Routes (Model 10).
Readiness Status: NOT_AVAILABLE (Rule Engine Not Implemented).
"""
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from backend.app.schemas.decision import MasterDecisionAdvisory, ScenarioInput, ScenarioResult
from backend.app.services.model_registry import model_registry

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
