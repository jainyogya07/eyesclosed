"""
Tests for Out-of-Domain (OOD) Gating and Uncertainty Calibration Guardrails.
"""
def test_in_domain_prediction(client):
    req_body = {
        "latitude": 26.76,
        "longitude": 80.88
    }
    response = client.post("/api/v1/weather/predict", json=req_body)
    assert response.status_code == 200
    data = response.json()
    assert data["ood_status"] == "IN_DOMAIN"
    assert data["uncertainty"]["lower"] is not None
    assert data["uncertainty"]["upper"] is not None
    assert data["uncertainty"]["calibration_status"] == "PILOT_CALIBRATED"

def test_out_of_domain_abstention(client):
    # Coordinate far outside Lucknow pilot domain (e.g. Bangalore: 12.97°N, 77.59°E)
    req_body = {
        "latitude": 12.97,
        "longitude": 77.59
    }
    response = client.post("/api/v1/weather/predict", json=req_body)
    assert response.status_code == 200
    data = response.json()
    
    # Must abstain rather than return fake confidence
    assert data["ood_status"] == "ABSTAIN"
    assert data["quality_status"] == "ABSTAIN_UNPHYSICAL"
    # Never fabricate uncertainty intervals when OOD
    assert data["uncertainty"]["lower"] is None
    assert data["uncertainty"]["upper"] is None
    assert data["uncertainty"]["calibration_status"] == "UNAVAILABLE"
    assert "withheld" in data["uncertainty"]["note"].lower() or "outside" in data["uncertainty"]["note"].lower()

def test_m3_precipitation_honest_uncertainty(client):
    # Model 3 has only 8 rainy test hours -> bounds must not be fabricated
    req_body = {
        "latitude": 26.76,
        "longitude": 80.88
    }
    response = client.post("/api/v1/precipitation/predict", json=req_body)
    assert response.status_code == 200
    data = response.json()
    assert data["uncertainty"]["calibration_status"] == "LIMITED_CALIBRATION"
    assert data["uncertainty"]["lower"] is None
    assert data["uncertainty"]["upper"] is None
    assert "withheld" in data["uncertainty"]["note"].lower() or "uncalibrated" in data["uncertainty"]["note"].lower()
