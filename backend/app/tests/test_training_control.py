"""
Tests for Training Orchestration and Single-Active-Job Concurrency Lock.
"""
def test_reject_retraining_frozen_pilot(client):
    # Retraining M1 must be rejected
    payload = {
        "model_id": "M1",
        "agent_id": "test_agent"
    }
    response = client.post("/api/v1/training/start", json=payload)
    assert response.status_code == 400
    assert "FROZEN_PILOT" in response.json()["detail"] or "frozen" in response.json()["detail"].lower()

def test_single_active_training_job_lock(client):
    # Clean check: ensure training is idle first
    status_resp = client.get("/api/v1/training/status").json()
    if status_resp["is_training_active"]:
        client.post("/api/v1/training/cancel", json={"task_id": status_resp["active_task_id"]})

    # 1. Start training job for M4
    payload_m4 = {
        "model_id": "M4",
        "dataset_version": "sentinel_soil_v1",
        "agent_id": "researcher_agent"
    }
    resp1 = client.post("/api/v1/training/start", json=payload_m4)
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["status"] == "ACCEPTED"
    task_id = data1["task_id"]

    # 2. Check status shows active job
    status_resp = client.get("/api/v1/training/status").json()
    assert status_resp["is_training_active"] is True
    assert status_resp["active_model_id"] == "M4"
    assert status_resp["active_task_id"] == task_id

    # 3. Attempt to start a second training job concurrently (M5) -> MUST FAIL WITH 409 CONFLICT
    payload_m5 = {
        "model_id": "M5",
        "dataset_version": "phenology_v1",
        "agent_id": "researcher_agent_2"
    }
    resp2 = client.post("/api/v1/training/start", json=payload_m5)
    assert resp2.status_code == 409
    assert "active training job" in resp2.json()["detail"].lower()

    # 4. Cancel the active training job
    cancel_resp = client.post("/api/v1/training/cancel", json={"task_id": task_id, "reason": "Test teardown"})
    assert cancel_resp.status_code == 200
    assert cancel_resp.json()["status"] == "CANCELLED"

    # 5. Status should now be idle
    status_resp2 = client.get("/api/v1/training/status").json()
    assert status_resp2["is_training_active"] is False
