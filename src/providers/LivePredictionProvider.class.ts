import { PredictionProvider } from './PredictionProvider';
import { MockPredictionProvider } from './MockPredictionProvider';
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
 * LivePredictionProvider
 * Calls the real backend REST endpoints when available.
 * Transparently falls back to MockPredictionProvider if backend is unreachable or under development.
 */
export class LivePredictionProvider implements PredictionProvider {
  private baseUrl: string;
  private fallbackMock: MockPredictionProvider;
  private backendUnavailable: boolean = false;
  private listeners: Set<(unavailable: boolean) => void> = new Set();

  constructor(baseUrl: string = import.meta.env.VITE_API_URL || '/api/v1') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.fallbackMock = new MockPredictionProvider();
    this.probeHealth();
  }

  public async probeHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      if (!res.ok) throw new Error('Health check error');
      this.setBackendUnavailable(false);
      return true;
    } catch {
      this.setBackendUnavailable(true);
      return false;
    }
  }

  public isBackendUnavailable(): boolean {
    return this.backendUnavailable;
  }

  public subscribeAvailability(listener: (unavailable: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.backendUnavailable);
    return () => this.listeners.delete(listener);
  }

  private setBackendUnavailable(state: boolean) {
    if (this.backendUnavailable !== state) {
      this.backendUnavailable = state;
      this.listeners.forEach((l) => l(state));
    }
  }

  private async fetchWithFallback<T>(url: string, fallbackGetter: () => Promise<T>): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`);
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      const data = await response.json();
      this.setBackendUnavailable(false);
      return data;
    } catch {
      // Backend unavailable: Mark state explicitly so UI exposes prominent warning banner
      this.setBackendUnavailable(true);
      return fallbackGetter();
    }
  }

  async getWeatherPoint(lat: number, lon: number): Promise<StandardModelEnvelope<WeatherPrediction>> {
    return this.fetchWithFallback(`/weather/point?lat=${lat}&lon=${lon}`, () =>
      this.fallbackMock.getWeatherPoint(lat, lon)
    );
  }

  async getPrecipitationPoint(lat: number, lon: number): Promise<StandardModelEnvelope<RainfallPrediction>> {
    return this.fetchWithFallback(`/weather/precipitation?lat=${lat}&lon=${lon}`, () =>
      this.fallbackMock.getPrecipitationPoint(lat, lon)
    );
  }

  async getSoilMoisture(panchayatCode: string): Promise<StandardModelEnvelope<SoilMoisturePrediction>> {
    return this.fetchWithFallback(`/soil/moisture/${panchayatCode}`, () =>
      this.fallbackMock.getSoilMoisture(panchayatCode)
    );
  }

  async getCropState(panchayatCode: string): Promise<StandardModelEnvelope<CropState>> {
    return this.fetchWithFallback(`/crops/phenology/${panchayatCode}`, () =>
      this.fallbackMock.getCropState(panchayatCode)
    );
  }

  async getIrrigationDemand(panchayatCode: string): Promise<StandardModelEnvelope<ETPrediction>> {
    return this.fetchWithFallback(`/irrigation/demand/${panchayatCode}`, () =>
      this.fallbackMock.getIrrigationDemand(panchayatCode)
    );
  }

  async getYieldForecast(panchayatCode: string): Promise<StandardModelEnvelope<YieldPrediction>> {
    return this.fetchWithFallback(`/yield/forecast/${panchayatCode}`, () =>
      this.fallbackMock.getYieldForecast(panchayatCode)
    );
  }

  async getFloodRisk(panchayatCode: string): Promise<StandardModelEnvelope<FloodRisk>> {
    return this.fetchWithFallback(`/hazards/flood/${panchayatCode}`, () =>
      this.fallbackMock.getFloodRisk(panchayatCode)
    );
  }

  async getHazardIntelligence(panchayatCode: string): Promise<StandardModelEnvelope<HazardPrediction>> {
    return this.fetchWithFallback(`/hazards/extreme/${panchayatCode}`, () =>
      this.fallbackMock.getHazardIntelligence(panchayatCode)
    );
  }

  async getDecisionAdvisory(panchayatCode: string): Promise<MasterDecisionAdvisory> {
    return this.fetchWithFallback(`/advisories/${panchayatCode}`, () =>
      this.fallbackMock.getDecisionAdvisory(panchayatCode)
    );
  }

  async getDigitalTwinState(panchayatCode: string): Promise<DigitalTwinState> {
    return this.fetchWithFallback(`/digital-twin/${panchayatCode}`, () =>
      this.fallbackMock.getDigitalTwinState(panchayatCode)
    );
  }

  async simulateScenario(input: ScenarioInput): Promise<ScenarioResult> {
    try {
      const response = await fetch(`${this.baseUrl}/scenarios/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!response.ok) throw new Error('Scenario API failed');
      return await response.json();
    } catch {
      return this.fallbackMock.simulateScenario(input);
    }
  }

  async getModelCatalog(): Promise<ModelStatus[]> {
    return this.fetchWithFallback('/orchestration/models', () =>
      this.fallbackMock.getModelCatalog()
    );
  }

  getDataMode(): "mock" | "live" {
    return "live";
  }
}
