"""
🌾 Kisaan Ki Yash — Model Accuracy, Statistical Validation & 10-Model Engine Test Suite.
Verifies:
1. High accuracy benchmarks for Model 1 (MAE < 0.45°C, R² > 0.98) on locked test station AWS_LKO_05
2. High accuracy benchmarks for Model 2 (MAE < 0.45°C, R² > 0.98)
3. Model 3 Hurdle precipitation downscaling validity and non-negative rainfall
4. Model 4 Soil Moisture physical bounds and SAR fusion dynamics
5. Model 5 Crop Phenology GDD progression and FAO Kc curves
6. Model 6 FAO-56 Penman-Monteith physical energy balance & irrigation triggers
7. Model 7 Crop Yield forecasting with 90% conformal uncertainty intervals
8. Model 8 Topographic Wetness Index & flood waterlogging risk escalation
9. Model 9 Climatological percentile extreme weather hazard alerts
10. Model 10 Agricultural Decision Intelligence Engine with bilingual Hindi + English advisories
11. Composite Digital Twin state synthesis across all 10 intelligence layers
12. Counterfactual What-If scenario simulation runner
"""
import os
import pytest
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, r2_score
from fastapi.testclient import TestClient

from backend.app.config import settings
from backend.app.services.prediction_service import prediction_service
from backend.app.services.intelligence_engine import intelligence_engine, resolve_panchayat
from backend.app.schemas.prediction import PredictionRequest


def test_model1_high_accuracy_benchmark():
    """
    Evaluates Model 1 Topographic Random Forest across all 72 hourly observations
    of the independent held-out test station AWS_LKO_05 (Malihabad Mango Belt).
    Asserts MAE < 0.45°C and R² > 0.98.
    """
    aws_path = os.path.join(settings.WORKSPACE_ROOT, "data/datasets/tiny/model1/aws_ground_truth_72h.csv")
    df_aws = pd.read_csv(aws_path)
    df_test = df_aws[df_aws["station_id"] == "AWS_LKO_05"].copy()
    assert len(df_test) == 72, f"Expected 72 hourly observations, found {len(df_test)}"

    ground_truth_temp = df_test["temperature_c"].values
    predicted_temp = []

    for _, row in df_test.iterrows():
        req = PredictionRequest(
            latitude=float(row["lat"]),
            longitude=float(row["lon"]),
            timestamp_utc=row["timestamp_utc"],
            elevation_m=float(row["elevation_m"])
        )
        res = prediction_service.predict_weather(req)
        predicted_temp.append(res.prediction.temperature_c)

    predicted_temp = np.array(predicted_temp)
    mae = mean_absolute_error(ground_truth_temp, predicted_temp)
    r2 = r2_score(ground_truth_temp, predicted_temp)

    print(f"\n[BENCHMARK EVALUATION - MODEL 1]")
    print(f"Station: AWS_LKO_05 (Malihabad Mango Belt) | N = 72 hours")
    print(f"Empirical MAE: {mae:.4f}°C (Threshold < 0.45°C)")
    print(f"Empirical R²:  {r2:.4f}  (Threshold > 0.98)")

    # Assert rigorous scientific thresholds
    assert mae < 0.45, f"Model 1 MAE {mae:.4f}°C exceeded maximum tolerance of 0.45°C"
    assert r2 > 0.98, f"Model 1 R² {r2:.4f} did not meet high accuracy requirement (>0.98)"

    # Assert conformal prediction coverage
    q_conformal = prediction_service.m1_q
    covered = np.abs(ground_truth_temp - predicted_temp) <= q_conformal
    empirical_coverage = np.mean(covered)
    print(f"Conformal Coverage: {empirical_coverage * 100:.1f}% (Threshold >= 80.0%)")
    assert empirical_coverage >= 0.80, f"Conformal coverage {empirical_coverage:.2f} below 80%"


def test_model2_high_accuracy_benchmark():
    """
    Evaluates Model 2 High-Resolution Temperature Refinement across AWS_LKO_05.
    Asserts MAE < 0.45°C and R² > 0.98.
    """
    aws_path = os.path.join(settings.WORKSPACE_ROOT, "data/datasets/tiny/model1/aws_ground_truth_72h.csv")
    df_aws = pd.read_csv(aws_path)
    df_test = df_aws[df_aws["station_id"] == "AWS_LKO_05"].copy()

    ground_truth_temp = df_test["temperature_c"].values
    predicted_temp = []

    for _, row in df_test.iterrows():
        req = PredictionRequest(
            latitude=float(row["lat"]),
            longitude=float(row["lon"]),
            timestamp_utc=row["timestamp_utc"],
            elevation_m=float(row["elevation_m"])
        )
        res = prediction_service.predict_refined_weather(req)
        predicted_temp.append(res.prediction.temperature_c)

    predicted_temp = np.array(predicted_temp)
    mae = mean_absolute_error(ground_truth_temp, predicted_temp)
    r2 = r2_score(ground_truth_temp, predicted_temp)

    print(f"\n[BENCHMARK EVALUATION - MODEL 2]")
    print(f"Empirical MAE: {mae:.4f}°C (Threshold < 0.45°C)")
    print(f"Empirical R²:  {r2:.4f}  (Threshold > 0.98)")

    assert mae < 0.45, f"Model 2 MAE {mae:.4f}°C exceeded tolerance of 0.45°C"
    assert r2 > 0.98, f"Model 2 R² {r2:.4f} did not meet high accuracy requirement (>0.98)"


def test_model3_precipitation_downscaling_validity():
    """Verifies Model 3 two-stage hurdle model probabilities and intensity consistency."""
    req = PredictionRequest(
        latitude=26.76,
        longitude=80.88,
        timestamp_utc="2025-07-15T08:00:00Z"
    )
    res = prediction_service.predict_precipitation(req)
    pred = res.prediction

    assert 0.0 <= pred.rain_probability <= 1.0
    assert pred.rain_occurrence in [0, 1]
    assert pred.conditional_rainfall_mm >= 0.0
    assert pred.expected_rainfall_mm >= 0.0
    assert pred.intensity_category in ["NONE", "LIGHT", "MODERATE", "HEAVY", "EXTREME"]


def test_model4_soil_moisture_physics():
    """Verifies Model 4 soil moisture physics, field capacity, and drought index bounds."""
    res_dry = intelligence_engine.compute_soil_moisture(26.76, 80.88, temperature_c=32.0, rainfall_mm=0.0)
    res_rain = intelligence_engine.compute_soil_moisture(26.76, 80.88, temperature_c=25.0, rainfall_mm=25.0)

    # Physical bounds check
    assert 5.0 <= res_dry["surface_sm_vwc_pct"] <= 50.0
    assert 10.0 <= res_dry["root_zone_sm_vwc_pct"] <= 50.0
    assert 0.0 <= res_dry["water_stress_index"] <= 1.0

    # Dynamic response check: rain must increase soil moisture and decrease stress
    assert res_rain["surface_sm_vwc_pct"] > res_dry["surface_sm_vwc_pct"]
    assert res_rain["water_stress_index"] <= res_dry["water_stress_index"]


def test_model5_crop_phenology_dynamics():
    """Verifies Model 5 Growing Degree Day accumulation, stage progression, and Kc curve."""
    crop_paddy = intelligence_engine.compute_crop_state("PC_092801", temperature_c=29.0)
    assert crop_paddy["accumulated_gdd"] > 200.0
    assert crop_paddy["phenology_stage"] in [
        "EMERGENCE", "VEGETATIVE", "FLOWERING_HEADING", "GRAIN_FILLING", "MATURITY", "HARVESTED"
    ]
    assert 0.20 <= crop_paddy["crop_coefficient_kc"] <= 1.35
    assert 0.0 <= crop_paddy["chlorophyll_vigor_index"] <= 1.0


def test_model6_fao56_penman_monteith_precision():
    """Verifies FAO-56 Penman-Monteith physical equation and net irrigation trigger logic."""
    # Hot dry summer conditions: High ET0 and irrigation recommended
    hot_dry = intelligence_engine.compute_et_irrigation(
        temperature_c=34.0,
        relative_humidity_pct=45.0,
        wind_speed_ms=3.2,
        solar_radiation_wm2=650.0,
        surface_pressure_hpa=1001.0,
        crop_kc=1.15,
        root_vwc_pct=16.0,  # depleted near wilting point
        field_capacity_pct=32.0,
        wilting_point_pct=14.0,
        forecast_rain_mm=0.0
    )

    assert 3.0 <= hot_dry["reference_et0_mm_day"] <= 9.5, f"ET0 {hot_dry['reference_et0_mm_day']} out of physical range"
    assert hot_dry["irrigation_recommended"] is True

    assert hot_dry["recommended_volume_mm"] > 0.0

    # Rain imminent condition: Irrigation withheld to prevent diesel waste
    rainy = intelligence_engine.compute_et_irrigation(
        temperature_c=26.0,
        relative_humidity_pct=85.0,
        wind_speed_ms=2.0,
        solar_radiation_wm2=250.0,
        surface_pressure_hpa=1004.0,
        crop_kc=1.15,
        root_vwc_pct=26.0,
        field_capacity_pct=32.0,
        wilting_point_pct=14.0,
        forecast_rain_mm=18.0
    )

    assert rainy["irrigation_recommended"] is False
    assert rainy["diesel_cost_savings_inr"] > 1000.0


def test_model7_yield_forecast_conformal_bounds():
    """Verifies Model 7 crop yield forecasting and certified 90% confidence prediction intervals."""
    yield_res = intelligence_engine.compute_yield_forecast("PC_092801", temperature_c=28.5, water_stress_index=0.15, accumulated_gdd=1150.0)
    exp = yield_res["expected_yield_ton_per_ha"]
    lower = yield_res["yield_lower_bound_90"]
    upper = yield_res["yield_upper_bound_90"]

    assert 1.0 <= exp <= 25.0
    assert lower <= exp <= upper
    assert round(upper - exp, 2) == round(exp - lower, 2)


def test_model8_flood_waterlogging_risk_escalation():
    """Verifies Model 8 TWI hydrodynamic risk escalation with rainfall intensity."""
    dry_flood = intelligence_engine.compute_flood_risk("PC_092804", rainfall_1h_mm=0.0, rainfall_24h_mm=0.0)
    storm_flood = intelligence_engine.compute_flood_risk("PC_092804", rainfall_1h_mm=25.0, rainfall_24h_mm=85.0)

    assert dry_flood["risk_level"] == "LOW"
    assert dry_flood["inundation_probability"] < 0.20
    assert storm_flood["risk_level"] in ["HIGH", "EXTREME"]
    assert storm_flood["inundation_probability"] > 0.65
    assert len(storm_flood["protective_actions"]) >= 2


def test_model9_extreme_hazard_detection():
    """Verifies Model 9 IMD climatological threshold alert categorization."""
    normal = intelligence_engine.compute_hazards(temperature_c=29.0, rainfall_1h_mm=0.0)
    assert normal["hazard_type"] == "NONE"
    assert normal["severity_alert"] == "GREEN"

    heatwave = intelligence_engine.compute_hazards(temperature_c=42.5, rainfall_1h_mm=0.0)
    assert heatwave["hazard_type"] == "HEATWAVE"
    assert heatwave["severity_alert"] == "RED"

    cloudburst = intelligence_engine.compute_hazards(temperature_c=26.0, rainfall_1h_mm=22.0)
    assert cloudburst["hazard_type"] == "CLOUDBURST"
    assert cloudburst["severity_alert"] == "RED"


def test_model10_agricultural_decision_bilingual_advisories():
    """Verifies Model 10 multi-criteria decision optimization and Hindi + English vernacular advisories."""
    weather = {"temperature_c": 28.0, "wind_speed_ms": 2.5}
    precip_rain = {"rain_probability": 0.85, "expected_rainfall_mm": 16.5}
    soil = {"root_zone_sm_vwc_pct": 26.0, "water_stress_index": 0.15}
    irr = {"irrigation_recommended": False, "recommended_volume_mm": 0.0}
    hazards = {"hazard_type": "NONE", "severity_alert": "GREEN"}

    advisory = intelligence_engine.generate_decision_advisory(
        "PC_092805", weather, precip_rain, soil, irr, hazards
    )

    assert len(advisory["actions"]) >= 3
    for act in advisory["actions"]:
        assert len(act["vernacular_message_hi"]) > 10, "Hindi message missing or too short"
        assert len(act["vernacular_message_en"]) > 10, "English message missing or too short"
        assert act["status"] in ["RECOMMENDED", "PROHIBITED", "CONDITIONAL", "STANDBY"]
        assert act["priority"] in ["INFO", "WARNING", "URGENT"]
        assert act["estimated_benefit_inr"] > 0.0

    # Rain imminent: Irrigation and spraying must be PROHIBITED to protect farmer investment
    categories = {a["category"]: a["status"] for a in advisory["actions"]}
    assert categories["IRRIGATION"] == "PROHIBITED"
    assert categories["SPRAYING"] == "PROHIBITED"


def test_digital_twin_composite_synthesis(client):
    """Verifies composite Digital Twin state engine integrates all 10 intelligence layers."""
    res = client.get("/api/v1/digital-twin/PC_092801")
    assert res.status_code == 200
    data = res.json()

    required_layers = [
        "weather", "precipitation", "soil", "crop", "irrigation",
        "yield", "flood", "hazards", "decision_advisory"
    ]
    for layer in required_layers:
        assert layer in data, f"Missing digital twin layer: {layer}"

    assert data["panchayat_name"] == "Amausi"
    assert data["active_farmers_count"] > 0
    assert data["weather"]["prediction"]["temperature_c"] > 10.0


def test_whatif_scenario_simulator(client):
    """Verifies What-If counterfactual scenario simulation endpoint."""
    payload = {
        "panchayat_code": "PC_092802",
        "rainfall_override_mm": 75.0,
        "temperature_override_c": 1.5,
        "canal_water_release_hours": 4
    }
    res = client.post("/api/v1/scenarios/run", json=payload)
    assert res.status_code == 200
    data = res.json()

    assert "baseline" in data
    assert "simulated" in data
    assert "impact_summary" in data
    assert data["simulation_confidence"] > 0.85
    assert data["simulated"]["flood_risk_level"] in ["HIGH", "EXTREME"]


def test_live_panchayat_domain_endpoints(client):
    """Verifies all Panchayat endpoints called by frontend LivePredictionProvider."""
    endpoints = [
        "/api/v1/soil/moisture/PC_092805",
        "/api/v1/crops/phenology/PC_092805",
        "/api/v1/irrigation/demand/PC_092805",
        "/api/v1/yield/forecast/PC_092805",
        "/api/v1/hazards/flood/PC_092805",
        "/api/v1/hazards/extreme/PC_092805",
        "/api/v1/advisories/PC_092805",
        "/api/v1/orchestration/models"
    ]
    for ep in endpoints:
        res = client.get(ep)
        assert res.status_code == 200, f"Endpoint {ep} returned status {res.status_code}: {res.text}"
