"""
Tests for System Health and Telemetry.
"""
def test_health_check(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "service" in data
    assert data["total_registered_models"] == 10
    assert data["primary_crs"] == "EPSG:32644"
    assert data["interchange_crs"] == "EPSG:4326"
    assert "telemetry" in data
    assert data["telemetry"]["uptime_seconds"] >= 0
