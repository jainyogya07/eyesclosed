"""
System telemetry and inference metrics.
"""
import time
from typing import Dict, Any

_SYSTEM_METRICS = {
    "total_inferences": 0,
    "active_training_jobs": 0,
    "failed_inferences": 0,
    "ood_detections": 0,
    "abstained_predictions": 0,
    "start_time": time.time()
}

def increment_metric(name: str, count: int = 1):
    if name in _SYSTEM_METRICS:
        _SYSTEM_METRICS[name] += count

def get_telemetry_snapshot() -> Dict[str, Any]:
    uptime_sec = time.time() - _SYSTEM_METRICS["start_time"]
    return {
        **_SYSTEM_METRICS,
        "uptime_seconds": round(uptime_sec, 1)
    }
