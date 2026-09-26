"""
Training Orchestrator Service for Kisaan Ki Yash.
Enforces the strict project invariant: ONE_ACTIVE_TRAINING_JOB = True.
Guarantees frozen pilot artifacts (M1, M2, M3) cannot be accidentally retrained or overwritten.
"""
import time
import uuid
import datetime
from typing import Optional, Dict, Any
from backend.app.config import settings
from backend.app.schemas.model import TrainingStatusResponse
from backend.app.schemas.common import ModelReadinessState
from backend.app.services.model_registry import model_registry
from backend.app.infrastructure.logging import log_audit_event, logger
from backend.app.infrastructure.metrics import increment_metric

class TrainingConflictException(Exception):
    """Raised when a training job is initiated while another job is active."""
    pass

class FrozenModelRetrainException(Exception):
    """Raised when an attempt is made to retrain a frozen pilot model."""
    pass

class InvalidModelException(Exception):
    """Raised when training is requested for an unregistered model."""
    pass

class TaskNotFoundException(Exception):
    """Raised when attempting to cancel a non-existent or inactive training task."""
    pass

class TrainingOrchestratorService:
    def __init__(self):
        self._is_active: bool = False
        self._active_task_id: Optional[str] = None
        self._active_model_id: Optional[str] = None
        self._started_at: Optional[str] = None
        self._progress_pct: Optional[float] = None
        self._message: str = "System idle. No active ML training jobs."

    def get_status(self) -> TrainingStatusResponse:
        return TrainingStatusResponse(
            is_training_active=self._is_active,
            active_task_id=self._active_task_id,
            active_model_id=self._active_model_id,
            started_at=self._started_at,
            progress_pct=self._progress_pct,
            message=self._message
        )

    def start_training(
        self,
        model_id: str,
        dataset_version: Optional[str] = None,
        hyperparameters: Optional[Dict[str, Any]] = None,
        agent_id: str = "orchestrator_agent"
    ) -> Dict[str, Any]:
        """
        Initiates an ML training job while strictly enforcing concurrency and frozen invariant rules.
        """
        # Invariant 1: Single active training job
        if settings.ONE_ACTIVE_TRAINING_JOB and self._is_active:
            logger.warning(
                f"[TRAINING REJECTED] Concurrency limit reached. Active: {self._active_model_id} (task {self._active_task_id})"
            )
            raise TrainingConflictException(
                f"Another ML training job ({self._active_task_id} for {self._active_model_id}) is currently in progress. "
                f"Project principle #7 permits only ONE active training job at a time."
            )

        # Invariant 2: Verify model exists
        model = model_registry.get_model(model_id)
        if not model:
            raise InvalidModelException(f"Model '{model_id}' is not recognized in the model registry.")

        # Invariant 3: Frozen models cannot be retrained
        if model.status == ModelReadinessState.FROZEN_PILOT or model_id in ["M1", "M2", "M3"]:
            raise FrozenModelRetrainException(
                f"Model '{model_id}' is currently in FROZEN_PILOT status. "
                f"Retraining frozen artifacts is strictly prohibited to guarantee reproducible benchmarks."
            )

        # Initiate new training session
        task_id = f"train_{model_id.lower()}_{uuid.uuid4().hex[:8]}"
        utc_now = datetime.datetime.now(datetime.timezone.utc).isoformat()
        
        self._is_active = True
        self._active_task_id = task_id
        self._active_model_id = model_id
        self._started_at = utc_now
        self._progress_pct = 0.0
        self._message = f"Training pipeline initialized for model {model_id}."

        increment_metric("active_training_jobs", 1)
        model_registry.update_model_status(model_id, ModelReadinessState.TRAINING)

        log_audit_event(
            action="TRAINING_START",
            model_id=model_id,
            status="TRAINING",
            agent_id=agent_id,
            task_id=task_id,
            dataset_version=dataset_version or "latest",
            model_version=model.version,
            result={"status": "INITIALIZED", "hyperparameters": hyperparameters or {}}
        )

        return {
            "status": "ACCEPTED",
            "task_id": task_id,
            "model_id": model_id,
            "started_at": utc_now,
            "message": f"Training job '{task_id}' for model {model_id} accepted."
        }

    def cancel_training(self, task_id: str, reason: Optional[str] = None, agent_id: str = "orchestrator_agent") -> Dict[str, Any]:
        """
        Cancels an active training task and releases the lock.
        """
        if not self._is_active or self._active_task_id != task_id:
            raise TaskNotFoundException(f"No active training task matches '{task_id}'.")

        model_id = self._active_model_id
        log_audit_event(
            action="TRAINING_CANCEL",
            model_id=model_id,
            status="CANCELLED",
            agent_id=agent_id,
            task_id=task_id,
            result={"reason": reason or "User requested cancellation"}
        )

        self._is_active = False
        self._active_task_id = None
        self._active_model_id = None
        self._started_at = None
        self._progress_pct = None
        self._message = f"Training task '{task_id}' was cancelled. Reason: {reason or 'Not specified'}."

        increment_metric("active_training_jobs", -1)
        model_registry.update_model_status(model_id, ModelReadinessState.DATA_AUDIT)

        return {
            "status": "CANCELLED",
            "task_id": task_id,
            "model_id": model_id,
            "message": f"Training task {task_id} successfully terminated."
        }

    def complete_training(self, task_id: str, success: bool, final_status: ModelReadinessState, agent_id: str = "system"):
        """Called upon completion of an ML training run."""
        if self._active_task_id == task_id:
            model_id = self._active_model_id
            self._is_active = False
            self._active_task_id = None
            self._active_model_id = None
            self._started_at = None
            self._progress_pct = 100.0 if success else 0.0
            self._message = f"Job '{task_id}' finished with status: {final_status.value}."

            increment_metric("active_training_jobs", -1)
            model_registry.update_model_status(model_id, final_status)
            log_audit_event(
                action="TRAINING_FINISH",
                model_id=model_id,
                status=final_status.value,
                agent_id=agent_id,
                task_id=task_id,
                result={"success": success}
            )

training_orchestrator = TrainingOrchestratorService()
