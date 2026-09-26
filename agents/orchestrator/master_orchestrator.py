"""
Master Orchestrator coordinating the 100-Agent Platform.
"""
import os
import json
import sys
from typing import Dict, List, Any

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from agents.shared.schemas import AgentDefinition, AgentTaskOrder
from agents.training_queue.queue_manager import TrainingQueueManager
from agents.audit.audit_logger import AuditLogger

class MasterOrchestrator:
    def __init__(self, registry_path: str = "agents/registry_100_agents.json"):
        self.registry_path = registry_path
        self.queue_mgr = TrainingQueueManager()
        self.logger = AuditLogger()
        self.agents: Dict[str, AgentDefinition] = {}
        self.load_agents()

    def load_agents(self):
        if not os.path.exists(self.registry_path):
            raise FileNotFoundError(f"Agent registry not found at {self.registry_path}")

        with open(self.registry_path, "r") as f:
            data = json.load(f)

        for a in data["agents"]:
            agent_def = AgentDefinition(
                agent_id=a["agent_id"],
                team=a["team"],
                name=a["name"],
                role=a["role"],
                allowed_tools=a["allowed_tools"],
                status=a.get("status", "IDLE")
            )
            self.agents[agent_def.agent_id] = agent_def

        print(f"[ORCHESTRATOR INITIALIZED] Loaded {len(self.agents)} agents across {data['teams_count']} teams.")

    def dispatch_task(self, task_id: str, agent_id: str, command: str, parameters: dict = None) -> dict:
        if agent_id not in self.agents:
            raise KeyError(f"Agent {agent_id} not registered in 100-agent catalog.")

        agent = self.agents[agent_id]
        params = parameters or {}

        # SECURITY RULE 1: Locked Test Set Access Control
        if params.get("target_split") == "LOCKED_INDEPENDENT_TEST":
            if not agent.agent_id.startswith("V"): # Only Team 9 (Validation) allowed
                self.logger.log(
                    agent_id=agent_id,
                    team=agent.team,
                    action=f"BLOCKED_TEST_SET_ACCESS_ATTEMPT: {command}",
                    status="FAILED",
                    details={"reason": "Training agents cannot access locked test set. Zero leakage policy violated."}
                )
                raise PermissionError(
                    f"SECURITY VIOLATION: Agent {agent_id} ({agent.team}) attempted to read LOCKED_INDEPENDENT_TEST. "
                    "Only Team 09 (Validation Agents V01-V08) can evaluate on the locked test set."
                )

        # SECURITY RULE 2: Single-Active Training Queue Invariant
        if "TRAIN" in command.upper():
            model_target = params.get("model_id", "model1")
            self.queue_mgr.request_training_slot(model_target, agent_id)

        # Execute Task & Log
        agent.status = "RUNNING"
        self.logger.log(
            agent_id=agent_id,
            team=agent.team,
            action=f"DISPATCH_{command}",
            status="SUCCESS",
            details=params,
            model=params.get("model_id"),
            dataset=params.get("dataset_version")
        )
        agent.status = "IDLE"

        return {
            "task_id": task_id,
            "agent_id": agent_id,
            "team": agent.team,
            "command": command,
            "status": "COMPLETED"
        }

    def print_system_summary(self):
        print("=" * 65)
        print("🤖 KISAAN KI YASH — 100-AGENT SYSTEM STATUS REPORT")
        print("=" * 65)
        print(f"Total Registered Agents: {len(self.agents)}")
        
        # Team breakdown
        teams_count = {}
        for a in self.agents.values():
            teams_count[a.team] = teams_count.get(a.team, 0) + 1

        for team, count in sorted(teams_count.items()):
            print(f" • {team:<35}: {count} Agents")

        print("-" * 65)
        active_slot = self.queue_mgr.get_active_training_model()
        print(f"ACTIVE TRAINING SLOT:  {active_slot.model_id.upper()} ({active_slot.model_name})")
        print(f"ASSIGNED AGENT:        {active_slot.active_agent_id}")
        print(f"DATASET LINAGE:        {active_slot.dataset_version}")
        print(f"LOCKED TEST INTEGRITY: ENFORCED (Zero Leakage)")
        print("=" * 65)

if __name__ == "__main__":
    orch = MasterOrchestrator()
    orch.print_system_summary()

    # Test 1: Legal Task Dispatch to Data Team
    res = orch.dispatch_task(
        task_id="TASK_001",
        agent_id="D04",
        command="QUERY_CDS_ERA5_LAND",
        parameters={"year": "2024", "pilot": "Lucknow"}
    )
    print("Test 1 Result:", res)

    # Test 2: Legal Task Dispatch to Model 1 Baseline Agent
    res2 = orch.dispatch_task(
        task_id="TASK_002",
        agent_id="W01",
        command="TRAIN_MODEL1_BASELINE",
        parameters={"model_id": "model1", "dataset_version": "m1_tiny_v1"}
    )
    print("Test 2 Result:", res2)

    # Test 3: Illegal Training Attempt on Model 2 (Should be blocked by Queue Manager)
    try:
        orch.dispatch_task(
            task_id="TASK_003_ILLEGAL",
            agent_id="W06",
            command="TRAIN_MODEL2_TEMPERATURE",
            parameters={"model_id": "model2"}
        )
    except PermissionError as e:
        print("[EXPECTED TEST PASS] Model 2 Training Blocked Correctly:", e)

    # Test 4: Illegal Attempt by Training Agent to access Locked Test Set (Should be blocked)
    try:
        orch.dispatch_task(
            task_id="TASK_004_ILLEGAL",
            agent_id="W02",
            command="OPTIMIZE_HYPERPARAMETERS",
            parameters={"target_split": "LOCKED_INDEPENDENT_TEST"}
        )
    except PermissionError as e:
        print("[EXPECTED TEST PASS] Test Set Breach Blocked Correctly:", e)
