"""
Tests for Standard Prediction Envelope and Unavailable Model Behavior.
"""
def test_weather_prediction_envelope(client):
    req_body = {
        "latitude": 26.76,
        "longitude": 80.88,
        "grid_cell_id": "CELL_LKO_X02_Y03"
    }
    response = client.post("/api/v1/weather/predict", json=req_body)
    assert response.status_code == 200
    data = response.json()

    # Verify standard prediction envelope fields
    expected_fields = [
        "model_id",
        "model_version",
        "status",
        "timestamp_utc",
        "spatial_reference",
        "prediction",
        "uncertainty",
        "ood_status",
        "provenance",
        "quality_status"
    ]
    for field in expected_fields:
        assert field in data, f"Missing envelope field: {field}"

    assert data["model_id"] == "M1"
    assert data["status"] == "FROZEN_PILOT"
    assert data["ood_status"] == "IN_DOMAIN"
    assert "temperature_c" in data["prediction"]
    assert data["spatial_reference"]["crs"] == "EPSG:32644"

def test_generic_dispatcher_unavailable_model(client):
    req_body = {
        "latitude": 26.76,
        "longitude": 80.88
    }
    # M4 is NOT_AVAILABLE in Prompt 0
    response = client.post("/api/v1/predictions/M4", json=req_body)
    assert response.status_code == 503
    assert "NOT_AVAILABLE" in response.json()["detail"]

def test_generic_dispatcher_invalid_model(client):
    req_body = {
        "latitude": 26.76,
        "longitude": 80.88
    }
    response = client.post("/api/v1/predictions/M99", json=req_body)
    assert response.status_code == 404
    assert "not exist" in response.json()["detail"].lower()

def test_domain_routes_unavailable_behavior(client):
    # Soil moisture endpoint (M4)
    resp_soil = client.get("/api/v1/soil/moisture?lat=26.76&lon=80.88")
    assert resp_soil.status_code == 503

    # Crop phenology endpoint (M5)
    resp_crop = client.get("/api/v1/crop/phenology?lat=26.76&lon=80.88")
    assert resp_crop.status_code == 503

    # Decisions endpoint (M10)
    resp_dec = client.get("/api/v1/decisions/PC_092801")
    assert resp_dec.status_code == 503
