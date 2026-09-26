"""
Model Registry and Training Orchestration API Routes.
"""
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from backend.app.schemas.model import (
    ModelMetadata,
    ModelCatalogResponse,
    TrainingStartRequest,
    TrainingCancelRequest,
    TrainingStatusResponse
)
from backend.app.services.model_registry import model_registry
from backend.app.services.training_orchestrator import (
    training_orchestrator,
    TrainingConflictException,
    FrozenModelRetrainException,
    InvalidModelException,
    TaskNotFoundException
)
from backend.app.infrastructure.logging import get_audit_logs

router = APIRouter(tags=["Models & Training"])

@router.get("/models", response_model=ModelCatalogResponse)
@router.get("/orchestration/models", response_model=ModelCatalogResponse)
def list_models():
    models = model_registry.list_models()
    return ModelCatalogResponse(total_models=len(models), models=models)

@router.get("/models/{model_id}", response_model=ModelMetadata)
def get_model(model_id: str):
    model = model_registry.get_model(model_id.upper())
    if not model:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Model '{model_id}' not found in registry."
        )
    return model

@router.get("/training/status", response_model=TrainingStatusResponse)
def get_training_status():
    return training_orchestrator.get_status()

@router.post("/training/start")
def start_training(req: TrainingStartRequest):
    try:
        result = training_orchestrator.start_training(
            model_id=req.model_id.upper(),
            dataset_version=req.dataset_version,
            hyperparameters=req.hyperparameters,
            agent_id=req.agent_id
        )
        return result
    except TrainingConflictException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except FrozenModelRetrainException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except InvalidModelException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/training/cancel")
def cancel_training(req: TrainingCancelRequest):
    try:
        return training_orchestrator.cancel_training(
            task_id=req.task_id,
            reason=req.reason
        )
    except TaskNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.get("/audit/logs")
def view_audit_logs(limit: int = 50):
    return {"logs": get_audit_logs(limit=limit)}
