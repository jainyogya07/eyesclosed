"""
Immutable Audit Logger for 100-Agent Orchestration System.
"""
import os
import json
from datetime import datetime
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from agents.shared.schemas import AuditLogEntry

class AuditLogger:
    def __init__(self, log_path: str = "agents/audit/audit_trail.jsonl"):
        self.log_path = log_path
        os.makedirs(os.path.dirname(log_path), exist_ok=True)

    def log(self, agent_id: str, team: str, action: str, status: str = "SUCCESS", details: dict = None, confidence: float = None, model: str = None, dataset: str = None) -> AuditLogEntry:
        entry = AuditLogEntry(
            audit_id=f"audit_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}",
            agent_id=agent_id,
            team=team,
            action_executed=action,
            dataset_version=dataset,
            model_target=model,
            status=status,
            details=details or {},
            confidence_score=confidence
        )

        with open(self.log_path, "a") as f:
            f.write(entry.json() + "\n")

        print(f"[AUDIT] [{entry.team}] {entry.agent_id} -> {entry.action_executed} [{entry.status}]")
        return entry
