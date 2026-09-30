/**
 * Mausam Setu — Unified API Client
 * Connects the React frontend to the FastAPI 10-model intelligence backend.
 * MAE 0.4083°C | R² 0.9827 | 34/34 tests passing (PR #1 YashvardhanDubey)
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw { status: res.status, detail: err?.detail ?? err };
  }
  return res.json() as Promise<T>;
}

export interface WeatherPayload {
  temperature_c: number;
  temperature_lower: number;
  temperature_upper: number;
  humidity_pct: number;
  wind_speed_ms: number;
  solar_radiation_wm2: number;
  dew_point_c?: number;
  ood_status: 'IN_DOMAIN' | 'OOD';
}

export interface WeatherEnvelope {
  model_id: string;
  model_version: string;
  prediction: WeatherPayload;
  uncertainty: { lower: number; upper: number; confidence_score: number };
  spatial: { lat: number; lon: number; elevation_m?: number };
  timestamp_utc: string;
}

export interface PrecipPayload {
  rain_probability: number;
  rain_occurrence: 0 | 1;
  conditional_rainfall_mm: number;
  expected_rainfall_mm: number;
  intensity_category: 'NONE' | 'LIGHT' | 'MODERATE' | 'HEAVY' | 'EXTREME';
}

export interface SoilMoisturePayload {
  surface_sm_vwc_pct: number;
  root_zone_sm_vwc_pct: number;
  field_capacity_pct: number;
  wilting_point_pct: number;
  water_stress_index: number;
  sensor_source: string;
}

export interface CropStatePayload {
  accumulated_gdd: number;
  phenology_stage: string;
  crop_coefficient_kc: number;
  chlorophyll_vigor_index: number;
  days_to_harvest: number;
  crop_name: string;
}

export interface IrrigationPayload {
  et0_mm_day: number;
  etc_mm_day: number;
  net_irrigation_demand_mm: number;
  irrigate_today: boolean;
  urgency_level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  advisory_en: string;
  advisory_hi: string;
}

export interface YieldForecastPayload {
  predicted_yield_ton_per_ha: number;
  lower_yield_ton_per_ha: number;
  upper_yield_ton_per_ha: number;
  stress_penalty_pct: number;
  harvest_readiness_pct: number;
}

export interface FloodRiskPayload {
  twi_index: number;
  flood_risk_level: 'NONE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  waterlogging_probability: number;
  runoff_depth_mm: number;
  advisory_en: string;
  advisory_hi: string;
}

export interface HazardsPayload {
  heatwave_risk: string;
  coldwave_risk: string;
  active_alerts: string[];
  advisory_en: string;
  advisory_hi: string;
}

export interface AdvisoryPayload {
  panchayat_code: string;
  panchayat_name: string;
  overall_risk_level: 'SAFE' | 'WATCH' | 'WARNING' | 'CRITICAL';
  priority_action_en: string;
  priority_action_hi: string;
  decisions: Array<{ domain: string; action_en: string; action_hi: string; urgency: string }>;
  confidence_score: number;
}

export interface PanchayatDetails {
  panchayat_code: string;
  panchayat_name: string;
  block_name: string;
  district_name: string;
  state_name: string;
  latitude: number;
  longitude: number;
  primary_grid_cell_id: string;
  area_sq_km: number;
  major_crops: string[];
}

export interface ModelStatus {
  model_id: string;
  code_name: string;
  full_name: string;
  stage_order: number;
  status: 'FROZEN' | 'NOT_AVAILABLE' | 'TRAINING' | 'PLANNED';
  version: string;
  framework: string;
  benchmark_metric?: { name: string; value: string; verified: boolean };
  uncertainty_calibrated: boolean;
}

// M1/M2: Weather
export const weatherApi = {
  getPoint: (lat: number, lon: number, timestamp?: string) =>
    apiFetch<WeatherEnvelope>(
      `/weather/point?lat=${lat}&lon=${lon}${timestamp ? `&timestamp=${timestamp}` : ''}`
    ),
  getRefined: (lat: number, lon: number) =>
    apiFetch<WeatherEnvelope>(`/weather/refined?lat=${lat}&lon=${lon}`),
  getPrecipitation: (lat: number, lon: number) =>
    apiFetch<{ prediction: PrecipPayload }>(`/weather/precipitation?lat=${lat}&lon=${lon}`),
};

// M4: Soil Moisture
export const soilApi = {
  getByPanchayat: (code: string) =>
    apiFetch<{ prediction: SoilMoisturePayload; panchayat_name: string }>(`/soil/moisture/${code}`),
};

// M5: Crop State
export const cropApi = {
  getByPanchayat: (code: string) =>
    apiFetch<{ prediction: CropStatePayload; panchayat_name: string }>(`/crop/state/${code}`),
};

// M6: Irrigation
export const irrigationApi = {
  getByPanchayat: (code: string) =>
    apiFetch<{ prediction: IrrigationPayload }>(`/irrigation/demand/${code}`),
};

// M7: Yield
export const yieldApi = {
  getByPanchayat: (code: string) =>
    apiFetch<{ prediction: YieldForecastPayload }>(`/yield/${code}`),
};

// M8: Flood
export const floodApi = {
  getByPanchayat: (code: string) =>
    apiFetch<{ prediction: FloodRiskPayload }>(`/flood/risk/${code}`),
};

// M9: Hazards
export const hazardsApi = {
  getByPanchayat: (code: string) =>
    apiFetch<{ prediction: HazardsPayload }>(`/hazards/${code}`),
};

// M10: Decisions
export const bundleApi = {
  get: (code: string) => apiFetch<Record<string, unknown>>(`/bundle/${code}`),
};

export const decisionsApi = {
  getAdvisory: (code: string) => apiFetch<AdvisoryPayload>(`/advisories/${code}`),
  runScenario: (params: {
    panchayat_code: string;
    rainfall_override_mm?: number;
    temperature_override_c?: number;
    canal_water_release_hours?: number;
  }) =>
    apiFetch<{ scenario_result: Record<string, unknown> }>('/scenarios/run', {
      method: 'POST',
      body: JSON.stringify(params),
    }),
};

// Panchayat metadata
export const panchayatApi = {
  list: () => apiFetch<PanchayatDetails[]>('/panchayat'),
  get: (id: string) => apiFetch<PanchayatDetails>(`/panchayat/${id}`),
};

// Model catalog
export const modelsApi = {
  getCatalog: () => apiFetch<ModelStatus[]>('/orchestration/models'),
};

// Health
export const healthApi = {
  ping: () => apiFetch<{ status: string; version: string }>('/health'),
};
