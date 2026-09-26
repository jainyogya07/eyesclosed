"""
Health and System Status API Routes.
"""
from fastapi import APIRouter
from backend.app.config import settings
from backend.app.infrastructure.metrics import get_telemetry_snapshot
from backend.app.services.model_registry import model_registry
from backend.app.services.training_orchestrator import training_orchestrator

router = APIRouter(tags=["Health"])

@router.get("/health")
def get_health():
    telemetry = get_telemetry_snapshot()
    training_status = training_orchestrator.get_status()
    models = model_registry.list_models()

    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "active_training_job": training_status.is_training_active,
        "active_training_task": training_status.active_task_id,
        "total_registered_models": len(models),
        "primary_crs": settings.PRIMARY_METRIC_CRS,
        "interchange_crs": settings.INTERCHANGE_CRS,
        "telemetry": telemetry
    }
