"""
Pydantic schemas for the 100-Agent Orchestration System.
"""
from datetime import datetime
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

class AgentDefinition(BaseModel):
    agent_id: str
    team: str
    name: str
    role: str
    allowed_tools: List[str]
    status: Literal["IDLE", "RUNNING", "BLOCKED", "ERROR"] = "IDLE"

class AgentTaskOrder(BaseModel):
    task_id: str
    target_agent_id: str
    target_team: str
    command: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    created_at_utc: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["PENDING", "EXECUTING", "COMPLETED", "FAILED"] = "PENDING"

class AuditLogEntry(BaseModel):
    audit_id: str
    timestamp_utc: datetime = Field(default_factory=datetime.utcnow)
    agent_id: str
    team: str
    action_executed: str
    dataset_version: Optional[str] = None
    model_target: Optional[str] = None
    status: Literal["SUCCESS", "WARNING", "FAILED"]
    details: Dict[str, Any] = Field(default_factory=dict)
    confidence_score: Optional[float] = None

class TrainingQueueSlot(BaseModel):
    model_id: str
    model_name: str
    priority_order: int
    status: Literal["RUNNING", "WAITING", "BLOCKED_PENDING_UPSTREAM", "REGISTERED_FROZEN"]
    active_agent_id: Optional[str] = None
    dataset_version: Optional[str] = None
    validation_status: Optional[str] = None
