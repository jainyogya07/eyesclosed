"""
Training Queue Manager enforcing the single-active model training invariant.
"""
from typing import Dict, List
import json
import os
import sys

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from agents.shared.schemas import TrainingQueueSlot

class TrainingQueueManager:
    """
    Enforces the strict rule:
    Only ONE ML model can occupy the active RUNNING training slot at any given time.
    """
    def __init__(self):
        self.queue: Dict[str, TrainingQueueSlot] = {
            "model1": TrainingQueueSlot(
                model_id="model1",
                model_name="Hyperlocal Weather Downscaling",
                priority_order=1,
                status="RUNNING",
                active_agent_id="W01",
                dataset_version="m1_small_v1_lucknow",
                validation_status="VALIDATING"
            ),
            "model2": TrainingQueueSlot(
                model_id="model2",
                model_name="High-Resolution Temperature Refinement",
                priority_order=2,
                status="WAITING",
                active_agent_id="W06"
            ),
            "model3": TrainingQueueSlot(
                model_id="model3",
                model_name="Precipitation Downscaling",
                priority_order=3,
                status="WAITING",
                active_agent_id="W07"
            ),
            "model4": TrainingQueueSlot(
                model_id="model4",
                model_name="Soil Moisture Intelligence",
                priority_order=4,
                status="BLOCKED_PENDING_UPSTREAM",
                active_agent_id="SH02"
            ),
            "model5": TrainingQueueSlot(
                model_id="model5",
                model_name="Crop State & Phenology",
                priority_order=5,
                status="BLOCKED_PENDING_UPSTREAM",
                active_agent_id="C02"
            ),
            "model6": TrainingQueueSlot(
                model_id="model6",
                model_name="ET & Irrigation Demand",
                priority_order=6,
                status="BLOCKED_PENDING_UPSTREAM",
                active_agent_id="DI01"
            ),
            "model7": TrainingQueueSlot(
                model_id="model7",
                model_name="Crop Yield Forecasting",
                priority_order=7,
                status="BLOCKED_PENDING_UPSTREAM",
                active_agent_id="C07"
            ),
            "model8": TrainingQueueSlot(
                model_id="model8",
                model_name="Flood & Waterlogging Risk",
                priority_order=8,
                status="BLOCKED_PENDING_UPSTREAM",
                active_agent_id="SH06"
            ),
            "model9": TrainingQueueSlot(
                model_id="model9",
                model_name="Extreme Weather Intelligence",
                priority_order=9,
                status="BLOCKED_PENDING_UPSTREAM",
                active_agent_id="W09"
            ),
            "model10": TrainingQueueSlot(
                model_id="model10",
                model_name="Agricultural Decision Engine",
                priority_order=10,
                status="BLOCKED_PENDING_UPSTREAM",
                active_agent_id="DI07"
            )
        }

    def get_active_training_model(self) -> TrainingQueueSlot:
        active = [m for m in self.queue.values() if m.status == "RUNNING"]
        if len(active) > 1:
            raise RuntimeError(f"FATAL: Invariant violated! Multiple models marked RUNNING: {[m.model_id for m in active]}")
        if not active:
            raise RuntimeError("No model currently in RUNNING state.")
        return active[0]

    def request_training_slot(self, model_id: str, requesting_agent_id: str) -> bool:
        """
        Rejects training request if another model is currently in the active slot.
        """
        active = self.get_active_training_model()
        if active.model_id != model_id:
            raise PermissionError(
                f"[TRAINING QUEUE BLOCKED] Agent {requesting_agent_id} cannot train {model_id}! "
                f"Active slot occupied by: {active.model_id} ({active.model_name}). "
                f"Model {active.model_id} must pass independent validation and freeze before {model_id} can run."
            )
        return True

    def promote_active_model_to_registered(self, model_id: str, validation_passed: bool):
        """
        Freezes active model and unlocks the next model in the queue.
        """
        active = self.get_active_training_model()
        if active.model_id != model_id:
            raise ValueError(f"Cannot promote {model_id}; active slot is {active.model_id}")
        
        if not validation_passed:
            active.status = "RUNNING"
            active.validation_status = "FAILED_RETRAINING_REQUIRED"
            print(f"[QUEUE ALERT] Model {model_id} failed validation. Kept in active slot for hyperparameter adjustment.")
            return

        active.status = "REGISTERED_FROZEN"
        active.validation_status = "PASSED_BENCHMARK"
        print(f"[QUEUE SUCCESS] Model {model_id} registered and frozen!")

        # Unlock next waiting model
        next_order = active.priority_order + 1
        for m in self.queue.values():
            if m.priority_order == next_order:
                m.status = "RUNNING"
                print(f"[QUEUE PROMOTION] Unlocked Model {m.model_id} ({m.model_name}) as active training job.")
                break

    def export_status(self) -> List[Dict]:
        return [slot.dict() for slot in sorted(self.queue.values(), key=lambda s: s.priority_order)]
