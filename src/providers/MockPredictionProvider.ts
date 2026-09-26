import { PredictionProvider } from './PredictionProvider';
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
  ScenarioInput,
  ScenarioResult,
  ModelStatus
} from '../types/contracts';
import {
  MOCK_M1_WEATHER,
  MOCK_M3_PRECIPITATION,
  MOCK_M4_SOIL,
  MOCK_M5_CROP,
  MOCK_M6_IRRIGATION,
  MOCK_M7_YIELD,
  MOCK_M8_FLOOD,
  MOCK_M9_HAZARDS,
  MOCK_M10_DECISION,
  MOCK_DIGITAL_TWIN,
  MOCK_SCENARIOS,
  MOCK_MODEL_CATALOG
} from '../mocks/fixtures';

/**
 * MockPredictionProvider
 * Provides high-fidelity, deterministic data matching the exact production contract.
 * Allows UI development to proceed completely in parallel while ML models M3–M10 train.
 */
export class MockPredictionProvider implements PredictionProvider {
  private simulateLatency<T>(data: T, delayMs: number = 200): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(data), delayMs));
  }

  async getWeatherPoint(_lat: number, _lon: number): Promise<StandardModelEnvelope<WeatherPrediction>> {
    return this.simulateLatency(MOCK_M1_WEATHER);
  }

  async getPrecipitationPoint(_lat: number, _lon: number): Promise<StandardModelEnvelope<RainfallPrediction>> {
    return this.simulateLatency(MOCK_M3_PRECIPITATION);
  }

  async getSoilMoisture(_panchayatCode: string): Promise<StandardModelEnvelope<SoilMoisturePrediction>> {
    return this.simulateLatency(MOCK_M4_SOIL);
  }

  async getCropState(_panchayatCode: string): Promise<StandardModelEnvelope<CropState>> {
    return this.simulateLatency(MOCK_M5_CROP);
  }

  async getIrrigationDemand(_panchayatCode: string): Promise<StandardModelEnvelope<ETPrediction>> {
    return this.simulateLatency(MOCK_M6_IRRIGATION);
  }

  async getYieldForecast(_panchayatCode: string): Promise<StandardModelEnvelope<YieldPrediction>> {
    return this.simulateLatency(MOCK_M7_YIELD);
  }

  async getFloodRisk(_panchayatCode: string): Promise<StandardModelEnvelope<FloodRisk>> {
    return this.simulateLatency(MOCK_M8_FLOOD);
  }

  async getHazardIntelligence(_panchayatCode: string): Promise<StandardModelEnvelope<HazardPrediction>> {
    return this.simulateLatency(MOCK_M9_HAZARDS);
  }

  async getDecisionAdvisory(_panchayatCode: string): Promise<MasterDecisionAdvisory> {
    return this.simulateLatency(MOCK_M10_DECISION);
  }

  async getDigitalTwinState(_panchayatCode: string): Promise<DigitalTwinState> {
    return this.simulateLatency(MOCK_DIGITAL_TWIN);
  }

  async simulateScenario(input: ScenarioInput): Promise<ScenarioResult> {
    // Dynamic simulation logic based on inputs
    const isHeavyRain = input.rainfall_override_mm >= 30;
    const isWaterDeficit = input.canal_water_release_hours <= 1 && input.rainfall_override_mm < 5;

    let baseResult: ScenarioResult;
    if (isHeavyRain) {
      baseResult = MOCK_SCENARIOS["storm_50mm"];
    } else if (isWaterDeficit) {
      baseResult = MOCK_SCENARIOS["canal_cut_5d"];
    } else {
      baseResult = {
        scenario_id: `SCEN_CUSTOM_${Date.now()}`,
        panchayat_code: input.panchayat_code,
        timestamp: new Date().toISOString(),
        baseline: MOCK_SCENARIOS["storm_50mm"].baseline,
        simulated: {
          soil_moisture_pct: Math.min(45, 31.4 + input.rainfall_override_mm * 0.15 - input.temperature_override_c * 0.4),
          flood_risk_level: input.rainfall_override_mm > 25 ? "MODERATE" : "LOW",
          water_stress_index: 0.15,
          recommended_irrigation_mm: input.rainfall_override_mm > 10 ? 0.0 : 15.0,
          spraying_allowed: input.rainfall_override_mm < 10
        },
        impact_summary: {
          waterlogged_farms_count: Math.round(input.rainfall_override_mm * 0.6),
          drought_relieved_farms_count: input.rainfall_override_mm > 15 ? 120 : 20,
          economic_risk_delta_inr: Math.round(input.rainfall_override_mm * 4500),
          verdict: input.rainfall_override_mm > 10 
            ? `Rainfall addition of ${input.rainfall_override_mm}mm relieves seasonal moisture deficit across general plots.`
            : `Stable baseline conditions maintained.`
        },
        simulation_confidence: 0.85
      };
    }
    return this.simulateLatency(baseResult, 400);
  }

  async getModelCatalog(): Promise<ModelStatus[]> {
    return this.simulateLatency(MOCK_MODEL_CATALOG);
  }

  getDataMode(): "mock" | "live" {
    return "mock";
  }
}
