"""
Agricultural Decision Intelligence and What-If Simulation schemas (M10).
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DecisionAction(BaseModel):
    action_id: str
    category: str  # IRRIGATION, SPRAYING, SOWING, HARVEST, HAZARD_MITIGATION
    recommendation: str  # RECOMMENDED, PROHIBITED, CONDITIONAL, STANDBY
    urgency: str  # NONE, LOW, MODERATE, CRITICAL
    vernacular_advisory_hi: str
    rationale: str
    relative_expected_loss: float
    monetary_savings_inr: Optional[float] = None
    supporting_models: List[str]
    rules_triggered: List[str]

class MasterDecisionAdvisory(BaseModel):
    advisory_id: str
    timestamp_utc: str
    panchayat_code: str
    panchayat_name: str
    overall_risk_level: str
    actions: List[DecisionAction]
    uncertainty_status: str
    abstained: bool = False
    abstention_reason: Optional[str] = None
    rules_version: str

class ScenarioInput(BaseModel):
    panchayat_code: str
    rainfall_delta_mm: float = 0.0
    temperature_anomaly_c: float = 0.0
    irrigation_override_mm: Optional[float] = None
    canal_release_active: bool = False

class ScenarioResult(BaseModel):
    scenario_id: str
    timestamp_utc: str
    baseline_expected_loss: float
    simulated_expected_loss: float
    loss_delta: float
    risk_direction: str
    action_adjustments: List[str]
    mode: str = "SIMULATION"
