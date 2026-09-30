/**
 * Mausam Setu — LivePredictionProvider
 * Fetches real-time data from all 10 model backend endpoints.
 * Provides live telemetry to WeatherPage, IrrigationPage, HazardsPage,
 * DecisionCenterPage, DigitalTwinPage, ModelLabPage, and PanchayatPage.
 *
 * Accuracy: MAE 0.4083°C | R² 0.9827 (inherited from PR #1)
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  weatherApi, soilApi, cropApi, irrigationApi, yieldApi, floodApi,
  hazardsApi, decisionsApi, modelsApi, healthApi,
  WeatherEnvelope, PrecipPayload, SoilMoisturePayload, CropStatePayload,
  IrrigationPayload, YieldForecastPayload, FloodRiskPayload,
  HazardsPayload, AdvisoryPayload, ModelStatus,
} from '../api/client';

export type BackendStatus = 'connecting' | 'online' | 'offline' | 'demo';

export interface LiveData {
  weather: WeatherEnvelope | null;
  precipitation: { prediction: PrecipPayload } | null;
  soil: { prediction: SoilMoisturePayload; panchayat_name: string } | null;
  crop: { prediction: CropStatePayload; panchayat_name: string } | null;
  irrigation: { prediction: IrrigationPayload } | null;
  yieldForecast: { prediction: YieldForecastPayload } | null;
  flood: { prediction: FloodRiskPayload } | null;
  hazards: { prediction: HazardsPayload } | null;
  advisory: AdvisoryPayload | null;
  modelCatalog: ModelStatus[];
}

interface LivePredictionContextType {
  data: LiveData;
  backendStatus: BackendStatus;
  lastUpdated: Date | null;
  isLoading: boolean;
  refreshAll: () => void;
  modelCount: { total: number; frozen: number; active: number };
}

const defaultData: LiveData = {
  weather: null,
  precipitation: null,
  soil: null,
  crop: null,
  irrigation: null,
  yieldForecast: null,
  flood: null,
  hazards: null,
  advisory: null,
  modelCatalog: [],
};

const LivePredictionContext = createContext<LivePredictionContextType>({
  data: defaultData,
  backendStatus: 'connecting',
  lastUpdated: null,
  isLoading: true,
  refreshAll: () => {},
  modelCount: { total: 0, frozen: 0, active: 0 },
});

export const useLivePrediction = () => useContext(LivePredictionContext);

const REFRESH_INTERVAL_MS = 60_000; // 1 minute live telemetry cycle

export const LivePredictionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { location } = useApp();
  const [data, setData] = useState<LiveData>(defaultData);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('connecting');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const panchayatCode = location.panchayatCode || 'PC_092805';
  const lat = location.lat;
  const lon = location.lon;

  const fetchAll = useCallback(async () => {
    setIsLoading(true);

    // 1. Health check first
    try {
      await healthApi.ping();
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
      setIsLoading(false);
      return; // Don't call other endpoints if backend is down
    }

    // 2. Parallel fetch all 10 model layers — failures are silenced individually
    const [
      weatherResult,
      precipResult,
      soilResult,
      cropResult,
      irrigationResult,
      yieldResult,
      floodResult,
      hazardsResult,
      advisoryResult,
      catalogResult,
    ] = await Promise.allSettled([
      weatherApi.getPoint(lat, lon),
      weatherApi.getPrecipitation(lat, lon),
      soilApi.getByPanchayat(panchayatCode),
      cropApi.getByPanchayat(panchayatCode),
      irrigationApi.getByPanchayat(panchayatCode),
      yieldApi.getByPanchayat(panchayatCode),
      floodApi.getByPanchayat(panchayatCode),
      hazardsApi.getByPanchayat(panchayatCode),
      decisionsApi.getAdvisory(panchayatCode),
      modelsApi.getCatalog(),
    ]);

    setData({
      weather: weatherResult.status === 'fulfilled' ? weatherResult.value : null,
      precipitation: precipResult.status === 'fulfilled' ? precipResult.value : null,
      soil: soilResult.status === 'fulfilled' ? soilResult.value : null,
      crop: cropResult.status === 'fulfilled' ? cropResult.value : null,
      irrigation: irrigationResult.status === 'fulfilled' ? irrigationResult.value : null,
      yieldForecast: yieldResult.status === 'fulfilled' ? yieldResult.value : null,
      flood: floodResult.status === 'fulfilled' ? floodResult.value : null,
      hazards: hazardsResult.status === 'fulfilled' ? hazardsResult.value : null,
      advisory: advisoryResult.status === 'fulfilled' ? advisoryResult.value : null,
      modelCatalog: catalogResult.status === 'fulfilled' && Array.isArray(catalogResult.value)
        ? catalogResult.value
        : [],
    });

    setLastUpdated(new Date());
    setIsLoading(false);
  }, [lat, lon, panchayatCode]);

  // Initial fetch + auto-refresh
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Refresh when location changes
  useEffect(() => {
    fetchAll();
  }, [panchayatCode]);

  const catalog = Array.isArray(data.modelCatalog) ? data.modelCatalog : [];
  const modelCount = {
    total: catalog.length,
    frozen: catalog.filter((m) => m.status === 'FROZEN').length,
    active: catalog.filter((m) => m.status !== 'NOT_AVAILABLE').length,
  };

  return (
    <LivePredictionContext.Provider
      value={{ data, backendStatus, lastUpdated, isLoading, refreshAll: fetchAll, modelCount }}
    >
      {children}
    </LivePredictionContext.Provider>
  );
};
