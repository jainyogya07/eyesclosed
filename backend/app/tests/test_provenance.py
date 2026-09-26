"""
Tests for Data/Model Provenance Tracking and Audit Logging.
"""
def test_prediction_provenance_integrity(client):
    req_body = {
        "latitude": 26.76,
        "longitude": 80.88
    }
    response = client.post("/api/v1/weather/predict", json=req_body)
    assert response.status_code == 200
    data = response.json()

    provenance = data["provenance"]
    assert "dataset_version" in provenance
    assert "model_version" in provenance
    assert "artifact_hash" in provenance
    assert provenance["artifact_hash"] == "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea"
    assert "source" in provenance
    assert "timestamp" in provenance
    assert isinstance(provenance["feature_set"], list)
    assert len(provenance["feature_set"]) > 0
    assert provenance["baseline_reference"] is not None

def test_audit_logs_recorded(client):
    # Trigger an inference
    client.post("/api/v1/weather/predict", json={"latitude": 26.76, "longitude": 80.88})
    
    # Query audit logs
    response = client.get("/api/v1/audit/logs?limit=10")
    assert response.status_code == 200
    logs = response.json()["logs"]
    assert len(logs) > 0

    latest_event = logs[0]
    expected_keys = [
        "timestamp",
        "action",
        "agent_id",
        "task_id",
        "model_id",
        "dataset_version",
        "model_version",
        "status"
    ]
    for key in expected_keys:
        assert key in latest_event, f"Missing key in audit log: {key}"
