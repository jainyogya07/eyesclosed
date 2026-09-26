import {
  StandardModelEnvelope,
  WeatherPrediction,
  RainfallPrediction,
  SoilMoisturePrediction,
  CropState,
  ETPrediction,
  YieldPrediction,
  FloodRisk,
  HazardPrediction,
  MasterDecisionAdvisory,
  DigitalTwinState,
  ScenarioResult,
  ModelStatus
} from '../types/contracts';

const PILOT_TIMESTAMP = new Date().toISOString();
const VALID_UNTIL = new Date(Date.now() + 6 * 3600 * 1000).toISOString();

export const MOCK_M1_WEATHER: StandardModelEnvelope<WeatherPrediction> = {
  model_id: "M01_WEATHER_DOWNSCALING",
  model_name: "1-km Topographic Weather Downscaler",
  model_version: "1.0.0-FROZEN",
  model_readiness: "FROZEN",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    grid_cell_id: "UTM44N_442000_2968000",
    location: {
      latitude: 26.9167,
      longitude: 80.7167,
      elevation_m: 124.0
    },
    panchayat_code: "0924001001",
    panchayat_name: "Malihabad (Mango Belt)",
    district_name: "Lucknow",
    state_name: "Uttar Pradesh"
  },
  prediction: {
    temperature_c: 28.42,
    feels_like_c: 31.5,
    relative_humidity_pct: 78.4,
    surface_pressure_hpa: 998.2,
    wind_speed_ms: 3.8,
    wind_direction_deg: 85,
    solar_radiation_wm2: 640.0,
    diurnal_range_c: 7.8,
    lapse_rate_applied_c_per_km: 6.5
  },
  uncertainty: {
    lower_bound: 27.68,
    upper_bound: 29.16,
    interval_method: "CONFORMAL_RESIDUAL",
    coverage_level: 0.90,
    uncertainty_metric: 0.7374,
    calibration_status: "CALIBRATED_HOLD_OUT",
    ood_status: "IN_DOMAIN",
    quality_status: "VERIFIED",
    abstained: false,
    abstention_reason: null
  },
  confidence_score: 0.92,
  data_provenance: {
    observation_timestamp_utc: "2026-09-26T18:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T12:00:00Z",
    dataset_version: "m1_tiny_v1_lucknow",
    model_artifact_checksum_sha256: "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea",
    feature_pipeline_version: "f_m1_v1.0.2",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: false
  }
};

export const MOCK_M3_PRECIPITATION: StandardModelEnvelope<RainfallPrediction> = {
  model_id: "M03_PRECIPITATION_DOWNSCALING",
  model_name: "Precipitation Downscaler (Two-Stage Hurdle)",
  model_version: "0.1.0-pilot",
  model_readiness: "FROZEN",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    grid_cell_id: "UTM44N_442000_2968000",
    location: {
      latitude: 26.9167,
      longitude: 80.7167
    },
    panchayat_code: "0924001001",
    panchayat_name: "Malihabad (Mango Belt)"
  },
  prediction: {
    rain_probability: 0.61,
    rain_occurrence: 1,
    conditional_rainfall_mm: 3.9,
    expected_rainfall_mm: 2.4,
    intensity_category: "LIGHT",
    hourly_accumulation_forecast_mm: [0.0, 0.2, 0.8, 1.4, 0.0, 0.0]
  },
  uncertainty: {
    lower_bound: null, // Suppressed: small-sample validation (N=9) cannot certify robust 90% coverage
    upper_bound: null,
    interval_method: "UNAVAILABLE",
    coverage_level: 0.0,
    uncertainty_metric: 1.48,
    calibration_status: "LIMITED_CALIBRATION",
    ood_status: "IN_DOMAIN",
    quality_status: "PILOT_VALIDATED",
    abstained: false,
    abstention_reason: null
  },
  confidence_score: 0.65,
  data_provenance: {
    observation_timestamp_utc: "2026-09-26T18:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T12:00:00Z",
    dataset_version: "m1_tiny_v1_lucknow_72h",
    model_artifact_checksum_sha256: "942691966f3c4aad6e1e10ddcf9291d5cf93a18d9b77d750c3e227cfa8205ac3",
    feature_pipeline_version: "f_m3_v0.1.0",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: false
  }
};

export const MOCK_M4_SOIL: StandardModelEnvelope<SoilMoisturePrediction> = {
  model_id: "M04_SOIL_MOISTURE_INTELLIGENCE",
  model_name: "SAR C-Band Optical Soil Moisture Retrieval",
  model_version: "0.0.1-SPEC",
  model_readiness: "NOT_AVAILABLE",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    location: { latitude: 26.9167, longitude: 80.7167 },
    panchayat_name: "Malihabad"
  },
  prediction: {
    surface_sm_vwc_pct: 26.8,
    root_zone_sm_vwc_pct: 31.4,
    field_capacity_pct: 34.0,
    wilting_point_pct: 13.5,
    water_stress_index: 0.18,
    sensor_source: "SIMULATED_PILOT"
  },
  uncertainty: {
    lower_bound: 23.5,
    upper_bound: 34.2,
    interval_method: "UNAVAILABLE",
    coverage_level: 0.90,
    uncertainty_metric: null,
    calibration_status: "UNAVAILABLE",
    ood_status: "OOD_MARGINAL",
    quality_status: "DEGRADED_CONFIDENCE",
    abstained: false,
    abstention_reason: "Model 4 awaiting active training slot in queue"
  },
  confidence_score: 0.74,
  data_provenance: {
    observation_timestamp_utc: "2026-09-26T15:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T12:00:00Z",
    dataset_version: "sentinel1_sar_spec_lucknow",
    model_artifact_checksum_sha256: "pending_training_pipeline",
    feature_pipeline_version: "sar_hydrology_spec_v1",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: true
  }
};

export const MOCK_M5_CROP: StandardModelEnvelope<CropState> = {
  model_id: "M05_CROP_PHENOLOGY",
  model_name: "GDD & Spectral Crop Phenology Tracker",
  model_version: "0.0.1-SPEC",
  model_readiness: "NOT_AVAILABLE",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    location: { latitude: 26.9167, longitude: 80.7167 },
    panchayat_name: "Malihabad"
  },
  prediction: {
    crop_name: "Paddy (Basmati PB-1509)",
    variety: "Semi-Dwarf Early",
    sowing_date: "2025-06-28",
    accumulated_gdd: 1380.4,
    target_maturity_gdd: 1850.0,
    phenology_stage: "FLOWERING_HEADING",
    crop_coefficient_kc: 1.20,
    chlorophyll_vigor_index: 0.82,
    vegetation_health_anomaly_pct: 6.8
  },
  uncertainty: {
    lower_bound: null,
    upper_bound: null,
    interval_method: "UNAVAILABLE",
    coverage_level: 0.90,
    uncertainty_metric: null,
    calibration_status: "UNAVAILABLE",
    ood_status: "IN_DOMAIN",
    quality_status: "PILOT_VALIDATED",
    abstained: false,
    abstention_reason: null
  },
  confidence_score: 0.85,
  data_provenance: {
    observation_timestamp_utc: "2026-09-25T10:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T00:00:00Z",
    dataset_version: "s2_ndvi_phenology_v1",
    model_artifact_checksum_sha256: "pending_m5_queue_slot",
    feature_pipeline_version: "spectral_gdd_v1",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: true
  }
};

export const MOCK_M6_IRRIGATION: StandardModelEnvelope<ETPrediction> = {
  model_id: "M06_ET_IRRIGATION_DEMAND",
  model_name: "FAO-56 Penman-Monteith ET & Irrigation Engine",
  model_version: "0.0.1-SPEC",
  model_readiness: "NOT_AVAILABLE",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    location: { latitude: 26.9167, longitude: 80.7167 },
    panchayat_name: "Malihabad"
  },
  prediction: {
    reference_et0_mm_day: 4.85,
    crop_etc_mm_day: 5.82,
    depletion_fraction_p: 0.32,
    readily_available_water_mm: 22.4,
    total_available_water_mm: 48.0,
    irrigation_recommended: false,
    recommended_volume_mm: 0.0,
    action_urgency: "NONE",
    advisory_rationale: "Expected 12.4mm rainfall within 24h exceeds daily ETc demand (5.8mm). Soil moisture adequate.",
    diesel_cost_savings_inr: 1450
  },
  uncertainty: {
    lower_bound: 4.2,
    upper_bound: 5.5,
    interval_method: "CONFORMAL_RESIDUAL",
    coverage_level: 0.90,
    uncertainty_metric: 0.65,
    calibration_status: "CALIBRATED_HOLD_OUT",
    ood_status: "IN_DOMAIN",
    quality_status: "VERIFIED",
    abstained: false,
    abstention_reason: null
  },
  confidence_score: 0.90,
  data_provenance: {
    observation_timestamp_utc: "2026-09-26T18:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T12:00:00Z",
    dataset_version: "fao56_physical_balance_v1",
    model_artifact_checksum_sha256: "deterministic_physics_engine",
    feature_pipeline_version: "et_physics_v1",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: true
  }
};

export const MOCK_M7_YIELD: StandardModelEnvelope<YieldPrediction> = {
  model_id: "M07_YIELD_FORECAST",
  model_name: "In-Season Biomass Yield Predictor",
  model_version: "0.0.1-SPEC",
  model_readiness: "NOT_AVAILABLE",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    location: { latitude: 26.9167, longitude: 80.7167 },
    panchayat_name: "Malihabad"
  },
  prediction: {
    crop_name: "Paddy (Basmati)",
    expected_yield_ton_per_ha: 4.35,
    yield_lower_bound_90: 3.95,
    yield_upper_bound_90: 4.70,
    historical_benchmark_ton_per_ha: 3.85,
    projected_yield_anomaly_pct: 12.9,
    harvest_window_start: "2025-10-25",
    harvest_window_end: "2025-11-05"
  },
  uncertainty: {
    lower_bound: 3.95,
    upper_bound: 4.70,
    interval_method: "CONFORMAL_RESIDUAL",
    coverage_level: 0.90,
    uncertainty_metric: 0.40,
    calibration_status: "CALIBRATED_HOLD_OUT",
    ood_status: "IN_DOMAIN",
    quality_status: "PILOT_VALIDATED",
    abstained: false,
    abstention_reason: null
  },
  confidence_score: 0.88,
  data_provenance: {
    observation_timestamp_utc: "2026-09-25T00:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T00:00:00Z",
    dataset_version: "cce_benchmark_lucknow_v1",
    model_artifact_checksum_sha256: "pending_m7_queue_slot",
    feature_pipeline_version: "yield_cce_v1",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: true
  }
};

export const MOCK_M8_FLOOD: StandardModelEnvelope<FloodRisk> = {
  model_id: "M08_FLOOD_WATERLOGGING_RISK",
  model_name: "Hydro-Topographic Inundation Estimator",
  model_version: "0.0.1-SPEC",
  model_readiness: "NOT_AVAILABLE",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    location: { latitude: 26.9167, longitude: 80.7167 },
    panchayat_name: "Malihabad"
  },
  prediction: {
    inundation_probability: 0.14,
    risk_level: "LOW",
    vulnerable_area_ha: 3.8,
    waterlogging_drainage_time_hours: 4.2,
    runoff_volume_m3: 1250.0,
    protective_actions: [
      "Keep field outlet channels clear of paddy stubble.",
      "Check bund height at low depression corners."
    ]
  },
  uncertainty: {
    lower_bound: 0.08,
    upper_bound: 0.22,
    interval_method: "CONFORMAL_RESIDUAL",
    coverage_level: 0.90,
    uncertainty_metric: 0.07,
    calibration_status: "CALIBRATED_HOLD_OUT",
    ood_status: "IN_DOMAIN",
    quality_status: "VERIFIED",
    abstained: false,
    abstention_reason: null
  },
  confidence_score: 0.89,
  data_provenance: {
    observation_timestamp_utc: "2026-09-26T18:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T12:00:00Z",
    dataset_version: "srtm_dem_twi_lucknow",
    model_artifact_checksum_sha256: "pending_m8_queue_slot",
    feature_pipeline_version: "hydro_topographic_v1",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: true
  }
};

export const MOCK_M9_HAZARDS: StandardModelEnvelope<HazardPrediction> = {
  model_id: "M09_EXTREME_WEATHER_INTELLIGENCE",
  model_name: "Climatological Hazard & Percentile Engine",
  model_version: "0.0.1-SPEC",
  model_readiness: "NOT_AVAILABLE",
  timestamp_utc: PILOT_TIMESTAMP,
  valid_until_utc: VALID_UNTIL,
  spatial_reference: {
    crs: "EPSG:32644",
    resolution_meters: 1000,
    location: { latitude: 26.9167, longitude: 80.7167 },
    panchayat_name: "Malihabad"
  },
  prediction: {
    hazard_type: "NONE",
    historical_percentile: 68.2,
    severity_alert: "GREEN",
    duration_hours: 0,
    impact_summary: "No anomalous heatwave or gale wind detected. Atmospheric stability within seasonal limits.",
    mitigation_protocol: "Standard monsoon cultivation practices apply."
  },
  uncertainty: {
    lower_bound: 62.0,
    upper_bound: 74.0,
    interval_method: "CONFORMAL_RESIDUAL",
    coverage_level: 0.90,
    uncertainty_metric: 6.0,
    calibration_status: "CALIBRATED_HOLD_OUT",
    ood_status: "IN_DOMAIN",
    quality_status: "VERIFIED",
    abstained: false,
    abstention_reason: null
  },
  confidence_score: 0.94,
  data_provenance: {
    observation_timestamp_utc: "2026-09-26T18:00:00Z",
    forecast_run_timestamp_utc: "2026-09-26T12:00:00Z",
    dataset_version: "imd_30yr_climatology_lucknow",
    model_artifact_checksum_sha256: "pending_m9_queue_slot",
    feature_pipeline_version: "percentile_hazard_v1",
    inference_timestamp_utc: PILOT_TIMESTAMP,
    is_mock: true
  }
};

export const MOCK_M10_DECISION: MasterDecisionAdvisory = {
  panchayat_code: "0924001001",
  panchayat_name: "Malihabad",
  issued_at: PILOT_TIMESTAMP,
  valid_until: VALID_UNTIL,
  governing_uncertainty_level: "LOW",
  abstained_to_official_bulletin: false,
  actions: [
    {
      id: "ACT_IRR_01",
      category: "IRRIGATION",
      status: "PROHIBITED",
      priority: "INFO",
      action_title_hi: "सिंचाई स्थगित रखें (Do Not Irrigate)",
      action_title_en: "Hold Irrigation",
      vernacular_message_hi: "अगले 24 घंटों में 12.4 मिमी बारिश की 84% संभावना है और मिट्टी में 31% नमी पर्याप्त है। आज ट्यूबवेल न चलाएं।",
      vernacular_message_en: "84% probability of 12.4 mm rainfall within 24 hours with 31% root-zone moisture. Tubewell pumping unnecessary.",
      scientific_justification: "Model 3 forecasts 12.4mm precipitation. Model 6 ETc is 5.8mm/day. Net water balance surplus of +6.6mm.",
      estimated_benefit_inr: 1450,
      governing_model_ids: ["M03", "M04", "M06"]
    },
    {
      id: "ACT_SPRAY_02",
      category: "SPRAYING",
      status: "PROHIBITED",
      priority: "WARNING",
      action_title_hi: "कीटनाशक छिड़काव रोकें (Postpone Spraying)",
      action_title_en: "Postpone Spraying",
      vernacular_message_hi: "शाम को बारिश और 78% नमी के कारण दवा बह जाएगी और असर खत्म हो जाएगा। छिड़काव 48 घंटे बाद करें।",
      vernacular_message_en: "Heavy risk of chemical wash-off due to imminent evening shower. Reschedule spray operation after 48 hours.",
      scientific_justification: "Model 3 rain threshold exceedance (>10mm) within 6 hours. Wash-off probability > 80%.",
      estimated_benefit_inr: 2200,
      governing_model_ids: ["M01", "M03"]
    },
    {
      id: "ACT_FERT_03",
      category: "FERTILIZATION",
      status: "CONDITIONAL",
      priority: "INFO",
      action_title_hi: "यूरिया टॉप-ड्रेसिंग बारिश के बाद करें",
      action_title_en: "Apply Urea Post-Rain",
      vernacular_message_hi: "हल्की बारिश के तुरंत बाद यूरिया डालें ताकि पोषक तत्व जड़ों तक पहुंचे, बह न जाएं।",
      vernacular_message_en: "Apply urea top-dressing immediately after rainfall settles to maximize root absorption without surface runoff.",
      scientific_justification: "Phenology stage is FLOWERING_HEADING (Model 5). Nitrogen uptake velocity highest when soil reaches 30% VWC.",
      estimated_benefit_inr: 800,
      governing_model_ids: ["M04", "M05"]
    }
  ]
};

export const MOCK_DIGITAL_TWIN: DigitalTwinState = {
  panchayat_code: "0924001001",
  panchayat_name: "Malihabad (Mango & Rice Cluster)",
  block_name: "Malihabad",
  district_name: "Lucknow",
  state_name: "Uttar Pradesh",
  total_cultivated_area_ha: 1420.5,
  active_farmers_count: 840,
  last_updated_utc: PILOT_TIMESTAMP,
  weather: MOCK_M1_WEATHER,
  precipitation: MOCK_M3_PRECIPITATION,
  soil: MOCK_M4_SOIL,
  crop: MOCK_M5_CROP,
  irrigation: MOCK_M6_IRRIGATION,
  yield: MOCK_M7_YIELD,
  flood: MOCK_M8_FLOOD,
  hazards: MOCK_M9_HAZARDS,
  decision_advisory: MOCK_M10_DECISION
};

export const MOCK_SCENARIOS: Record<string, ScenarioResult> = {
  "storm_50mm": {
    scenario_id: "SCEN_SIM_STORM_50",
    panchayat_code: "0924001001",
    timestamp: PILOT_TIMESTAMP,
    baseline: {
      soil_moisture_pct: 31.4,
      flood_risk_level: "LOW",
      water_stress_index: 0.18,
      recommended_irrigation_mm: 0.0,
      spraying_allowed: false
    },
    simulated: {
      soil_moisture_pct: 38.6,
      flood_risk_level: "HIGH",
      water_stress_index: 0.02,
      recommended_irrigation_mm: 0.0,
      spraying_allowed: false
    },
    impact_summary: {
      waterlogged_farms_count: 34,
      drought_relieved_farms_count: 0,
      economic_risk_delta_inr: 340000,
      verdict: "High waterlogging in low-elevation plots (Block Sectors 3 & 4). Requires clearing 2 field drainage paths 24h prior."
    },
    simulation_confidence: 0.84
  },
  "canal_cut_5d": {
    scenario_id: "SCEN_SIM_CANAL_CUT",
    panchayat_code: "0924001001",
    timestamp: PILOT_TIMESTAMP,
    baseline: {
      soil_moisture_pct: 31.4,
      flood_risk_level: "LOW",
      water_stress_index: 0.18,
      recommended_irrigation_mm: 0.0,
      spraying_allowed: false
    },
    simulated: {
      soil_moisture_pct: 18.2,
      flood_risk_level: "LOW",
      water_stress_index: 0.68,
      recommended_irrigation_mm: 35.0,
      spraying_allowed: true
    },
    impact_summary: {
      waterlogged_farms_count: 0,
      drought_relieved_farms_count: 0,
      economic_risk_delta_inr: 680000,
      verdict: "Root-zone soil approaches wilting point (14%) by Day 4. Basmati heading stage will suffer 15% yield loss without tubewell backup."
    },
    simulation_confidence: 0.87
  }
};

export const MOCK_MODEL_CATALOG: ModelStatus[] = [
  {
    model_id: "M01",
    code_name: "model1_downscaling",
    full_name: "Hyperlocal Weather Downscaling",
    stage_order: 1,
    status: "FROZEN",
    version: "1.0.0-pilot",
    framework: "Scikit-Learn (Topographic Random Forest)",
    spatial_resolution: "1 km x 1 km (EPSG:32644)",
    temporal_cadence: "Hourly (72-hour forecast)",
    artifact_path: "models/model1/model1_random_forest.joblib",
    checksum_sha256: "30c22d4c7f69a48149a7f844cef62398566ddc1ed4acf00d9f536e72a68803ea",
    training_dataset: "m1_tiny_v1_lucknow",
    benchmark_metric: {
      name: "MAE vs Independent AWS_LKO_05",
      value: "0.4083°C (39.89% error reduction)",
      verified: true
    },
    uncertainty_calibrated: true,
    dependencies: ["NCMRWF NWP Coarse Grid", "Copernicus GLO-30 DEM"]
  },
  {
    model_id: "M02",
    code_name: "model2_temperature_refinement",
    full_name: "High-Resolution Temperature Refinement",
    stage_order: 2,
    status: "FROZEN",
    version: "0.1.0-pilot",
    framework: "Ridge Regularized Linear (Solar/Terrain/Canopy)",
    spatial_resolution: "1 km x 1 km (EPSG:32644)",
    temporal_cadence: "Hourly",
    artifact_path: "models/model2/model2_pilot.joblib",
    checksum_sha256: "a471a59a58df354d7c5fb6942604c5b1a5b7a48806fb5d1fa5d5b7237390e3e8",
    training_dataset: "m1_tiny_v1_lucknow",
    benchmark_metric: {
      name: "MAE vs Locked Test AWS",
      value: "0.4113°C (Ablation: Δ = -0.0030°C vs M1)",
      verified: true
    },
    uncertainty_calibrated: true,
    dependencies: ["M01 Downscaled Weather", "Copernicus Aspect/Slope"]
  },
  {
    model_id: "M03",
    code_name: "model3_precipitation_downscaling",
    full_name: "Precipitation Downscaling (Two-Stage Hurdle)",
    stage_order: 3,
    status: "FROZEN",
    version: "0.1.0-pilot",
    framework: "Hurdle Model (Logistic Regression + Ridge on log1p)",
    spatial_resolution: "1 km x 1 km (EPSG:32644)",
    temporal_cadence: "Hourly precipitation",
    artifact_path: "models/model3/model3_pilot.joblib",
    checksum_sha256: "942691966f3c4aad6e1e10ddcf9291d5cf93a18d9b77d750c3e227cfa8205ac3",
    training_dataset: "m1_tiny_v1_lucknow (72h, 5 stations, 0 extreme events)",
    benchmark_metric: {
      name: "Locked Test RMSE vs Raw NWP",
      value: "0.9725 mm/h vs 1.1438 mm/h (15.0% error reduction)",
      verified: true
    },
    uncertainty_calibrated: false,
    dependencies: ["M01 Temperature", "Copernicus DEM & Topography", "IMD AWS (Ground Calibration/LOSO Only)"]
  },
  {
    model_id: "M04",
    code_name: "model4_soil_moisture",
    full_name: "SAR C-Band Optical Soil Moisture Retrieval",
    stage_order: 4,
    status: "NOT_AVAILABLE",
    version: "0.0.1-PLANNED",
    framework: "SAR Backscatter Water Balance Model",
    spatial_resolution: "1 km x 1 km",
    temporal_cadence: "Daily",
    training_dataset: "Sentinel-1 GRD + SoilGrids 250m",
    uncertainty_calibrated: false,
    dependencies: ["M03 Precipitation", "Sentinel-1 SAR", "SoilGrids Clay/Sand"]
  },
  {
    model_id: "M05",
    code_name: "model5_crop_state",
    full_name: "Crop State & Phenology Tracking",
    stage_order: 5,
    status: "NOT_AVAILABLE",
    version: "0.0.1-PLANNED",
    framework: "Harmonic Spectral Curve & GDD Model",
    spatial_resolution: "Field parcel / 1 km",
    temporal_cadence: "5-day Sentinel cadence",
    training_dataset: "Sentinel-2 L2A + DAC&FW Crop Calendars",
    uncertainty_calibrated: false,
    dependencies: ["M01 GDD Accumulation", "Sentinel-2 NDVI/NDRE"]
  },
  {
    model_id: "M06",
    code_name: "model6_irrigation_demand",
    full_name: "FAO-56 Penman-Monteith ET & Irrigation Engine",
    stage_order: 6,
    status: "NOT_AVAILABLE",
    version: "0.0.1-PLANNED",
    framework: "Deterministic Physical Energy Balance",
    spatial_resolution: "1 km x 1 km",
    temporal_cadence: "Daily advisory",
    training_dataset: "Physics-based equation (No black box ML)",
    uncertainty_calibrated: false,
    dependencies: ["M01 Weather", "M04 Soil Moisture", "M05 Crop Kc"]
  },
  {
    model_id: "M07",
    code_name: "model7_yield_forecast",
    full_name: "Crop Yield Forecasting",
    stage_order: 7,
    status: "NOT_AVAILABLE",
    version: "0.0.1-PLANNED",
    framework: "Cumulative Stress Gradient Boosting",
    spatial_resolution: "Panchayat boundary",
    temporal_cadence: "Mid-season to pre-harvest",
    training_dataset: "District CCE Records (DAC&FW)",
    uncertainty_calibrated: false,
    dependencies: ["M04 Soil Water Deficit", "M05 NDRE Time-Series", "M06 ET"]
  },
  {
    model_id: "M08",
    code_name: "model8_flood_risk",
    full_name: "Flood & Waterlogging Risk Inundation",
    stage_order: 8,
    status: "NOT_AVAILABLE",
    version: "0.0.1-PLANNED",
    framework: "Topographic Wetness Index & Catchment Runoff",
    spatial_resolution: "1 km / Micro-catchment",
    temporal_cadence: "Hourly forecast",
    training_dataset: "SRTM Flow Accumulation + Sentinel-1 Flood History",
    uncertainty_calibrated: false,
    dependencies: ["M03 Peak Rainfall Intensity", "M04 Soil Saturation"]
  },
  {
    model_id: "M09",
    code_name: "model9_extreme_weather",
    full_name: "Extreme Weather Hazard Intelligence",
    stage_order: 9,
    status: "NOT_AVAILABLE",
    version: "0.0.1-PLANNED",
    framework: "Empirical Climatological Quantile Exceedance",
    spatial_resolution: "1 km x 1 km",
    temporal_cadence: "6-hourly scan",
    training_dataset: "IMD 30-Year High-Res Gridded Data",
    uncertainty_calibrated: false,
    dependencies: ["M01 Temperature", "M03 Rainfall", "30-Year Climatology"]
  },
  {
    model_id: "M10",
    code_name: "model10_agricultural_decision",
    full_name: "Agricultural Decision Intelligence Engine",
    stage_order: 10,
    status: "NOT_AVAILABLE",
    version: "0.0.1-PLANNED",
    framework: "Multi-Criteria Optimization & Uncertainty Gating",
    spatial_resolution: "Panchayat & Farmer Parcel",
    temporal_cadence: "Continuous real-time",
    training_dataset: "Agronomic SOPs + ICAR Advisory Rules",
    uncertainty_calibrated: true,
    dependencies: ["M01 through M09 Synthesized Cascade"]
  }
];
