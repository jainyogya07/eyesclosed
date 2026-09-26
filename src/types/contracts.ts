/**
 * Kisaan Ki Yash — Unified Frontend / Backend Type Contracts
 * Synchronized with MASTER_SYSTEM_ARCHITECTURE.md & ML Cascade M1–M10
 */

export type ModelReadinessState =
  | "NOT_AVAILABLE"
  | "DATA_AUDIT"
  | "TRAINING"
  | "VALIDATING"
  | "PILOT"
  | "FROZEN"
  | "PRODUCTION"
  | "FAILED_VALIDATION";

export type OODStatus = "IN_DOMAIN" | "OOD_MARGINAL" | "OUT_OF_DISTRIBUTION" | "ABSTAIN";
export type QualityStatus = "VERIFIED" | "PILOT_VALIDATED" | "DEGRADED_CONFIDENCE" | "ABSTAIN_UNPHYSICAL";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "EXTREME";
export type AlertSeverity = "GREEN" | "YELLOW" | "ORANGE" | "RED";
export type AdvisoryAction = "RECOMMENDED" | "PROHIBITED" | "CONDITIONAL" | "STANDBY";
export type ActionUrgency = "NONE" | "LOW" | "MODERATE" | "CRITICAL";

export type AIIntelligenceCoreState =
  | "IDLE"
  | "THINKING"
  | "PROCESSING"
  | "FORECASTING"
  | "ANALYZING"
  | "WARNING"
  | "CRITICAL"
  | "SUCCESS"
  | "ABSTAINED"
  | "OFFLINE";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  elevation_m?: number;
}

export interface SpatialReference {
  crs: string; // e.g. "EPSG:32644" (UTM Zone 44N) or "EPSG:4326"
  resolution_meters: number;
  grid_cell_id?: string;
  location: GeoLocation;
  panchayat_code?: string;
  panchayat_name?: string;
  district_name?: string;
  state_name?: string;
}

export interface UncertaintyBounds {
  lower_bound: number | null;
  upper_bound: number | null;
  interval_method: "CONFORMAL_RESIDUAL" | "TEMPERATURE_SCALING" | "UNAVAILABLE";
  coverage_level: number; // e.g. 0.90 for 90%
  uncertainty_metric: number | null;
  calibration_status: "CALIBRATED_HOLD_OUT" | "LIMITED_CALIBRATION" | "UNAVAILABLE";
  ood_status: OODStatus;
  quality_status: QualityStatus;
  abstained: boolean;
  abstention_reason: string | null;
}

export interface DataProvenance {
  observation_timestamp_utc: string;
  forecast_run_timestamp_utc: string;
  dataset_version: string;
  model_artifact_checksum_sha256: string;
  feature_pipeline_version: string;
  inference_timestamp_utc: string;
  is_mock?: boolean;
}

/** Standard Envelope for all ML Model Outputs */
export interface StandardModelEnvelope<T> {
  model_id: string;
  model_name: string;
  model_version: string;
  model_readiness: ModelReadinessState;
  timestamp_utc: string;
  valid_until_utc: string;
  spatial_reference: SpatialReference;
  prediction: T;
  uncertainty: UncertaintyBounds;
  confidence_score: number;
  data_provenance: DataProvenance;
}

// ----------------------------------------------------
// Specific Model Prediction Payloads
// ----------------------------------------------------

/** M1 & M2: Hyperlocal Weather & Temp Refinement */
export interface WeatherPrediction {
  temperature_c: number;
  feels_like_c?: number;
  relative_humidity_pct: number;
  surface_pressure_hpa: number;
  wind_speed_ms: number;
  wind_direction_deg?: number;
  solar_radiation_wm2?: number;
  diurnal_range_c?: number;
  lapse_rate_applied_c_per_km?: number;
}

/** M3: Precipitation Downscaling */
export interface RainfallPrediction {
  rain_probability: number; // 0.0 to 1.0
  rain_occurrence: 0 | 1;
  conditional_rainfall_mm: number;
  expected_rainfall_mm: number;
  intensity_category: "NONE" | "LIGHT" | "MODERATE" | "HEAVY" | "EXTREME";
  hourly_accumulation_forecast_mm?: number[];
}

/** M4: Soil Moisture Intelligence (SAR-Optical Fusion) */
export interface SoilMoisturePrediction {
  surface_sm_vwc_pct: number; // 0-5cm depth
  root_zone_sm_vwc_pct: number; // 5-40cm depth
  field_capacity_pct: number;
  wilting_point_pct: number;
  water_stress_index: number; // 0.0 saturated, 1.0 extreme stress
  sensor_source: "SAR_OPTICAL_FUSION" | "WATER_BALANCE_MODEL_FALLBACK" | "SIMULATED_PILOT";
}

/** M5: Crop State & Phenology Tracking */
export interface CropState {
  crop_name: string;
  variety?: string;
  sowing_date: string;
  accumulated_gdd: number;
  target_maturity_gdd: number;
  phenology_stage:
    | "EMERGENCE"
    | "VEGETATIVE"
    | "FLOWERING_HEADING"
    | "GRAIN_FILLING"
    | "MATURITY"
    | "HARVESTED";
  crop_coefficient_kc: number;
  chlorophyll_vigor_index: number; // 0.0 to 1.0
  vegetation_health_anomaly_pct: number; // vs 5-yr avg
}

/** M6: FAO-56 Penman-Monteith ET & Irrigation Demand */
export interface ETPrediction {
  reference_et0_mm_day: number;
  crop_etc_mm_day: number;
  depletion_fraction_p: number;
  readily_available_water_mm: number;
  total_available_water_mm: number;
  irrigation_recommended: boolean;
  recommended_volume_mm: number;
  action_urgency: ActionUrgency;
  advisory_rationale: string;
  diesel_cost_savings_inr?: number;
}

/** M7: Crop Yield Forecast */
export interface YieldPrediction {
  crop_name: string;
  expected_yield_ton_per_ha: number;
  yield_lower_bound_90: number;
  yield_upper_bound_90: number;
  historical_benchmark_ton_per_ha: number;
  projected_yield_anomaly_pct: number;
  harvest_window_start: string;
  harvest_window_end: string;
}

/** M8: Topographic Flood & Waterlogging Risk */
export interface FloodRisk {
  inundation_probability: number;
  risk_level: RiskLevel;
  vulnerable_area_ha: number;
  waterlogging_drainage_time_hours: number;
  runoff_volume_m3?: number;
  protective_actions: string[];
}

/** M9: Extreme Weather & Climatological Hazards */
export interface HazardPrediction {
  hazard_type: "NONE" | "HEATWAVE" | "COLD_WAVE" | "CLOUDBURST" | "GALE_WIND" | "DRY_SPELL";
  historical_percentile: number;
  severity_alert: AlertSeverity;
  duration_hours: number;
  impact_summary: string;
  mitigation_protocol: string;
}

/** M10: Agricultural Decision Intelligence */
export interface DecisionActionItem {
  id: string;
  category: "IRRIGATION" | "SPRAYING" | "FERTILIZATION" | "SOWING" | "HARVESTING" | "HAZARD_DEFENSE";
  status: AdvisoryAction;
  priority: "INFO" | "WARNING" | "URGENT";
  action_title_hi: string;
  action_title_en: string;
  vernacular_message_hi: string;
  vernacular_message_en: string;
  scientific_justification: string;
  estimated_benefit_inr?: number;
  governing_model_ids: string[];
}

export interface MasterDecisionAdvisory {
  panchayat_code: string;
  panchayat_name: string;
  issued_at: string;
  valid_until: string;
  governing_uncertainty_level: "LOW" | "ACCEPTABLE" | "HIGH_PROCEED_WITH_CAUTION" | "ABSTAIN_TO_IMD";
  abstained_to_official_bulletin: boolean;
  official_bulletin_text?: string;
  actions: DecisionActionItem[];
}

/** Composite Digital Twin State */
export interface DigitalTwinState {
  panchayat_code: string;
  panchayat_name: string;
  block_name: string;
  district_name: string;
  state_name: string;
  total_cultivated_area_ha: number;
  active_farmers_count: number;
  last_updated_utc: string;
  weather: StandardModelEnvelope<WeatherPrediction>;
  precipitation: StandardModelEnvelope<RainfallPrediction>;
  soil: StandardModelEnvelope<SoilMoisturePrediction>;
  crop: StandardModelEnvelope<CropState>;
  irrigation: StandardModelEnvelope<ETPrediction>;
  yield: StandardModelEnvelope<YieldPrediction>;
  flood: StandardModelEnvelope<FloodRisk>;
  hazards: StandardModelEnvelope<HazardPrediction>;
  decision_advisory: MasterDecisionAdvisory;
}

/** What-If Digital Twin Scenario Simulator */
export interface ScenarioInput {
  panchayat_code: string;
  simulation_horizon_days: number;
  rainfall_override_mm: number;
  temperature_override_c: number;
  canal_water_release_hours: number;
}

export interface ScenarioResult {
  scenario_id: string;
  panchayat_code: string;
  timestamp: string;
  baseline: {
    soil_moisture_pct: number;
    flood_risk_level: RiskLevel;
    water_stress_index: number;
    recommended_irrigation_mm: number;
    spraying_allowed: boolean;
  };
  simulated: {
    soil_moisture_pct: number;
    flood_risk_level: RiskLevel;
    water_stress_index: number;
    recommended_irrigation_mm: number;
    spraying_allowed: boolean;
  };
  impact_summary: {
    waterlogged_farms_count: number;
    drought_relieved_farms_count: number;
    economic_risk_delta_inr: number;
    verdict: string;
  };
  simulation_confidence: number;
}

/** Model Lab Catalog Item */
export interface ModelStatus {
  model_id: string;
  code_name: string;
  full_name: string;
  stage_order: number;
  status: ModelReadinessState;
  version: string;
  framework: string;
  spatial_resolution: string;
  temporal_cadence: string;
  artifact_path?: string;
  checksum_sha256?: string;
  training_dataset?: string;
  benchmark_metric?: {
    name: string;
    value: string;
    verified: boolean;
  };
  uncertainty_calibrated: boolean;
  dependencies: string[];
}
