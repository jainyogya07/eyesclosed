/**
 * Real-Time Telemetry & Backend Connection Service for Mausam Setu
 * Simulates high-frequency WebSocket / SSE telemetry streaming from 1-km IMD grid nodes,
 * Automatic Weather Stations (AWS), and satellite soil moisture passes.
 */

export interface TelemetryPacket {
  timestamp: string;
  nodeId: string;
  panchayat: string;
  temperatureC: number;
  humidityPct: number;
  rainLastHourMm: number;
  soilMoisturePct: number;
  windSpeedKmh: number;
  pingMs: number;
  status: 'ONLINE' | 'STREAMING' | 'SYNCED';
}

export type TelemetryListener = (packet: TelemetryPacket) => void;

class RealtimeTelemetryService {
  private listeners: Set<TelemetryListener> = new Set();
  private timer: any = null;
  private isConnected: boolean = true;
  private lastPacket: TelemetryPacket = {
    timestamp: new Date().toLocaleTimeString(),
    nodeId: 'AWS_LKO_02_GHARAUNDA',
    panchayat: 'Gharaunda',
    temperatureC: 27.8,
    humidityPct: 84,
    rainLastHourMm: 3.2,
    soilMoisturePct: 32.4,
    windSpeedKmh: 16.2,
    pingMs: 24,
    status: 'STREAMING'
  };

  constructor() {
    this.startStreaming();
  }

  private startStreaming() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.isConnected) return;
      this.generateTick();
    }, 6000); // Live tick every 6 seconds
  }

  private generateTick() {
    const tempDelta = (Math.random() - 0.5) * 0.2;
    const humDelta = (Math.random() - 0.5) * 0.8;
    const rainDelta = Math.random() > 0.7 ? 0.1 : 0.0;

    this.lastPacket = {
      timestamp: new Date().toLocaleTimeString(),
      nodeId: 'AWS_LKO_02_GHARAUNDA',
      panchayat: 'Gharaunda',
      temperatureC: parseFloat((this.lastPacket.temperatureC + tempDelta).toFixed(1)),
      humidityPct: Math.min(100, Math.max(40, Math.round(this.lastPacket.humidityPct + humDelta))),
      rainLastHourMm: parseFloat((this.lastPacket.rainLastHourMm + rainDelta).toFixed(1)),
      soilMoisturePct: parseFloat((this.lastPacket.soilMoisturePct + (Math.random() - 0.5) * 0.1).toFixed(1)),
      windSpeedKmh: parseFloat((14 + Math.random() * 4).toFixed(1)),
      pingMs: Math.floor(18 + Math.random() * 15),
      status: 'STREAMING'
    };

    this.notify();
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    listener(this.lastPacket);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.lastPacket);
      } catch (err) {
        console.error('Error in telemetry listener:', err);
      }
    });
  }

  public getLastPacket(): TelemetryPacket {
    return this.lastPacket;
  }

  public isLive(): boolean {
    return this.isConnected;
  }

  public forceSync(): TelemetryPacket {
    this.generateTick();
    return this.lastPacket;
  }
}

export const realtimeTelemetry = new RealtimeTelemetryService();
