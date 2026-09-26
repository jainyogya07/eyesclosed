"""
Model metadata and training orchestration schemas.
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from backend.app.schemas.common import ModelReadinessState

class ModelMetadata(BaseModel):
    model_id: str = Field(..., description="e.g. M1, M2, M3... M10")
    model_name: str = Field(..., description="Human readable model name")
    version: str = Field(..., description="Model version string")
    status: ModelReadinessState = Field(..., description="Lifecycle status")
    artifact_path: Optional[str] = None
    sha256: Optional[str] = None
    training_dataset: Optional[str] = None
    validation_dataset: Optional[str] = None
    production_ready: bool = Field(default=False)
    uncertainty_status: str = Field(default="UNAVAILABLE")
    created_at: str
    updated_at: str
    dependencies: List[str] = Field(default_factory=list)
    description: Optional[str] = None

class ModelCatalogResponse(BaseModel):
    total_models: int
    models: List[ModelMetadata]

class TrainingStartRequest(BaseModel):
    model_id: str
    dataset_version: Optional[str] = None
    hyperparameters: Optional[Dict[str, Any]] = None
    agent_id: str = "orchestrator_agent"

class TrainingCancelRequest(BaseModel):
    task_id: str
    reason: Optional[str] = None

class TrainingStatusResponse(BaseModel):
    is_training_active: bool
    active_task_id: Optional[str] = None
    active_model_id: Optional[str] = None
    started_at: Optional[str] = None
    progress_pct: Optional[float] = None
    message: str
