"""
Structured audit logging and operation tracking for Kisaan Ki Yash.
"""
import logging
import json
import datetime
from typing import Dict, Any, Optional

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ"
)
logger = logging.getLogger("kisaankiyash")

# In-memory audit trail buffer (for fast API querying / inspectability)
_AUDIT_LOG_STORE = []

def log_audit_event(
    action: str,
    model_id: str,
    status: str,
    agent_id: str = "backend_system",
    task_id: Optional[str] = None,
    dataset_version: Optional[str] = None,
    model_version: Optional[str] = None,
    result: Optional[Dict[str, Any]] = None,
    confidence: Optional[float] = None
) -> Dict[str, Any]:
    """
    Records an auditable operation event matching the system governance protocol.
    """
    event = {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "action": action,
        "agent_id": agent_id,
        "task_id": task_id or "auto_task",
        "model_id": model_id,
        "dataset_version": dataset_version or "unspecified",
        "model_version": model_version or "unspecified",
        "status": status,
        "confidence": confidence,
        "result": result or {}
    }
    _AUDIT_LOG_STORE.append(event)
    # Cap stored log at 1000 items in memory
    if len(_AUDIT_LOG_STORE) > 1000:
        _AUDIT_LOG_STORE.pop(0)
    
    logger.info(f"[AUDIT] {action} | model={model_id} | status={status} | conf={confidence}")
    return event

def get_audit_logs(limit: int = 50) -> list:
    """Returns the most recent audit events."""
    return list(reversed(_AUDIT_LOG_STORE[-limit:]))
