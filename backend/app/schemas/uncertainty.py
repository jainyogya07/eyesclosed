"""
Uncertainty and calibration bounds schemas.
"""
from typing import Optional
from pydantic import BaseModel, Field

class UncertaintyInfo(BaseModel):
    lower: Optional[float] = Field(default=None, description="Lower prediction bound (null if calibration limited)")
    upper: Optional[float] = Field(default=None, description="Upper prediction bound (null if calibration limited)")
    status: str = Field(default="PILOT_INTERVAL", description="e.g. PILOT_INTERVAL, CALIBRATED, LIMITED, UNAVAILABLE")
    prediction: Optional[float] = None
    method: str = Field(default="UNAVAILABLE", description="e.g. CONFORMAL_RESIDUAL, BERNOULLI_ENTROPY, UNAVAILABLE")
    coverage_target: Optional[float] = Field(default=None, description="Nominal coverage e.g. 0.90")
    calibration_status: str = Field(default="UNAVAILABLE", description="e.g. CALIBRATED_HOLD_OUT, LIMITED_CALIBRATION, UNAVAILABLE")
    marginal_uncertainty: Optional[float] = None
    note: Optional[str] = None
