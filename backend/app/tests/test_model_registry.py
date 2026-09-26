"""
Tests for Model Registry and Lifecycle Statuses.
"""
from backend.app.schemas.common import ModelReadinessState

def test_list_all_10_models(client):
    response = client.get("/api/v1/models")
    assert response.status_code == 200
    data = response.json()
    assert data["total_models"] == 10
    models_dict = {m["model_id"]: m for m in data["models"]}
    
    # Assert all 10 models exist
    for mid in [f"M{i}" for i in range(1, 11)]:
        assert mid in models_dict, f"Model {mid} missing from registry"

    # M1, M2, M3 must be FROZEN_PILOT
    assert models_dict["M1"]["status"] == ModelReadinessState.FROZEN_PILOT.value
    assert models_dict["M2"]["status"] == ModelReadinessState.FROZEN_PILOT.value
    assert models_dict["M3"]["status"] == ModelReadinessState.FROZEN_PILOT.value

    # M1, M2, M3 checksums verified
    assert models_dict["M1"]["sha256"] == "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea"
    assert models_dict["M2"]["sha256"] == "a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8"
    assert models_dict["M3"]["sha256"] == "942691966f3c4aad6e1e10ddcf9291d5cf93a18d9b77d750c3e227cfa8205ac3"

    # Models M4-M10 must be NOT_AVAILABLE
    for mid in [f"M{i}" for i in range(4, 11)]:
        assert models_dict[mid]["status"] == ModelReadinessState.NOT_AVAILABLE.value

def test_get_individual_model(client):
    response = client.get("/api/v1/models/M1")
    assert response.status_code == 200
    data = response.json()
    assert data["model_id"] == "M1"
    assert data["model_name"] == "Hyperlocal Weather Downscaling"
    assert data["production_ready"] is False

def test_get_invalid_model_id(client):
    response = client.get("/api/v1/models/M99")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_frozen_artifacts_integrity():
    from backend.app.services.model_registry import model_registry
    results = model_registry.verify_frozen_artifacts()
    assert results["M1"] is True
    assert results["M2"] is True
    assert results["M3"] is True
