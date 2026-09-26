"""
Prediction envelope and typed payload schemas.
"""
from typing import Dict, Any, Optional, Generic, TypeVar
from pydantic import BaseModel, Field

from backend.app.schemas.common import ModelReadinessState, OODStatus, QualityStatus
from backend.app.schemas.spatial import SpatialReference
from backend.app.schemas.uncertainty import UncertaintyInfo
from backend.app.schemas.provenance import ProvenanceInfo

T = TypeVar("T")

class QualityInfo(BaseModel):
    ood_status: str = "IN_DOMAIN"
    prediction_status: str = "VALID"

class StandardPredictionEnvelope(BaseModel, Generic[T]):
    model_id: str
    model_version: str
    status: ModelReadinessState
    timestamp_utc: str
    spatial_reference: SpatialReference
    prediction: T
    uncertainty: UncertaintyInfo
    quality: QualityInfo = Field(default_factory=QualityInfo)
    provenance: ProvenanceInfo
    ood_status: Optional[OODStatus] = None
    quality_status: Optional[QualityStatus] = None

# Typed Prediction Payloads
class WeatherPredictionPayload(BaseModel):
    temperature_c: float
    feels_like_c: Optional[float] = None
    relative_humidity_pct: float
    surface_pressure_hpa: float
    wind_speed_ms: float
    wind_direction_deg: Optional[float] = None
    solar_radiation_wm2: Optional[float] = None
    diurnal_range_c: Optional[float] = None
    lapse_rate_applied_c_per_km: Optional[float] = None

class PrecipitationPredictionPayload(BaseModel):
    rain_probability: float
    rain_occurrence: int
    conditional_rainfall_mm: float
    expected_rainfall_mm: float
    hurdle_gated_rainfall_mm: Optional[float] = None
    intensity_category: str = "LIGHT"

class GenericModelPayload(BaseModel):
    data: Dict[str, Any]
    message: str = "Model output"

class PredictionRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    timestamp_utc: Optional[str] = None
    grid_cell_id: Optional[str] = None
    elevation_m: Optional[float] = None
    cropland_fraction: Optional[float] = None
