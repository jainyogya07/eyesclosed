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

/**
 * Universal Prediction Provider Interface
 * Both MockPredictionProvider and LivePredictionProvider implement this contract.
 */
export interface PredictionProvider {
  /** Model 1 & 2: 1-km Weather Downscaling and Temperature */
  getWeatherPoint(lat: number, lon: number): Promise<StandardModelEnvelope<WeatherPrediction>>;

  /** Model 3: Precipitation Downscaling */
  getPrecipitationPoint(lat: number, lon: number): Promise<StandardModelEnvelope<RainfallPrediction>>;

  /** Model 4: Soil Moisture Intelligence */
  getSoilMoisture(panchayatCode: string): Promise<StandardModelEnvelope<SoilMoisturePrediction>>;

  /** Model 5: Crop State & Phenology */
  getCropState(panchayatCode: string): Promise<StandardModelEnvelope<CropState>>;

  /** Model 6: ET & Irrigation Demand */
  getIrrigationDemand(panchayatCode: string): Promise<StandardModelEnvelope<ETPrediction>>;

  /** Model 7: In-Season Yield Forecast */
  getYieldForecast(panchayatCode: string): Promise<StandardModelEnvelope<YieldPrediction>>;

  /** Model 8: Topographic Flood Risk */
  getFloodRisk(panchayatCode: string): Promise<StandardModelEnvelope<FloodRisk>>;

  /** Model 9: Extreme Climatological Hazards */
  getHazardIntelligence(panchayatCode: string): Promise<StandardModelEnvelope<HazardPrediction>>;

  /** Model 10: Agricultural Decision Intelligence Advisory */
  getDecisionAdvisory(panchayatCode: string): Promise<MasterDecisionAdvisory>;

  /** Panchayat Digital Twin Composite State */
  getDigitalTwinState(panchayatCode: string): Promise<DigitalTwinState>;

  /** What-If Digital Twin Scenario Simulator */
  simulateScenario(input: ScenarioInput): Promise<ScenarioResult>;

  /** Model Lab Catalog & Orchestration Status */
  getModelCatalog(): Promise<ModelStatus[]>;

  /** Simulated or Real Mode Indicator */
  getDataMode(): "mock" | "live";

  /** Backend connectivity status check */
  isBackendUnavailable?(): boolean;

  /** Subscribe to live backend availability changes */
  subscribeAvailability?(listener: (unavailable: boolean) => void): () => void;
}
