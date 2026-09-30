import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { predictionProvider } from '../providers';
import { DigitalTwinState } from '../types/contracts';
import { MapView } from '../components/maps/MapView';
import { FarmerPinpointHub } from '../components/farmer/FarmerPinpointHub';
import {
  MapPin,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  Activity,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Grid,
  UserCheck
} from 'lucide-react';

export const PanchayatPage: React.FC = () => {
  const { language, location, selectedCrop } = useApp();
  const hi = language === 'hi';

  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'farmer' | 'grid'>('farmer');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await predictionProvider.getDigitalTwinState(location.panchayatCode);
      setTwin(data);
      setLoading(false);
    }
    loadData();
  }, [location.panchayatCode]);

  if (loading || !twin) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        {hi ? 'पंचायत डेटा लोड हो रहा है...' : 'Loading Panchayat intelligence data...'}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      {/* Top Banner & Mode Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#ffffff',
          padding: '14px 20px',
          borderRadius: '18px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#059669' }}>
              {hi ? 'पंचायत इंटेलिजेंस प्लेटफॉर्म' : 'PANCHAYAT INTELLIGENCE PLATFORM'}
            </div>
            <h1 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800, margin: 0 }}>
              {hi ? `${location.panchayatName} पंचायत` : `${location.panchayatName} Panchayat`}
            </h1>
          </div>
        </div>

        {/* View Mode Toggle: Farmer View (Default) vs Sector Grid */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid #cbd5e1'
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('farmer')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '9px',
              fontSize: '0.84rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'farmer' ? '#ffffff' : 'transparent',
              color: viewMode === 'farmer' ? '#059669' : '#64748b',
              boxShadow: viewMode === 'farmer' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <UserCheck size={16} />
            <span>{hi ? 'किसान इनपुट व सीधा फैसला' : 'Farmer Input & Decision (Easy)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '9px',
              fontSize: '0.84rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              background: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? '#0284c7' : '#64748b',
              boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Grid size={16} />
            <span>{hi ? '1-किमी सेक्टर ग्रिड मैप' : '1-km Sector Map Grid'}</span>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. PRIMARY VIEW: FARMER PINPOINT HUB WITH INPUT SYSTEM (Default)     */}
      {/* ===================================================================== */}
      {viewMode === 'farmer' ? (
        <FarmerPinpointHub />
      ) : (
        /* ===================================================================== */
        /* 2. SECONDARY VIEW: 1-KM TECHNICAL SECTOR MAP FOR OFFICERS             */
        /* ===================================================================== */
        <div className="panchayat-main-grid">
          <div>
            <MapView />
          </div>

          {/* Side Panel: Multi-Layer Village Status */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Layers size={18} color="var(--color-atmosphere-blue)" />
                {hi ? 'गाँव की लाइव स्थिति' : 'Live Panchayat Conditions'}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={16} color="var(--color-atmosphere-blue)" />
                    {hi ? 'हवा का तापमान' : 'Air Temperature'}
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{twin.weather.prediction.temperature_c}°C</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CloudRain size={16} color="var(--color-atmosphere-blue)" />
                    {hi ? 'वर्षा पूर्वानुमान (24h)' : 'Rainfall Forecast (24h)'}
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-atmosphere-blue)' }}>
                    {twin.precipitation?.prediction?.expected_rainfall_mm ?? 2.4} mm (84%)
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Droplets size={16} color="var(--color-earth-emerald)" />
                    {hi ? 'जड़ क्षेत्र नमी (40 सेमी)' : 'Root-Zone Moisture (40cm)'}
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-earth-emerald)' }}>
                    {twin.soil?.prediction?.root_zone_sm_vwc_pct ?? 31.4}% VWC
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sprout size={16} color="var(--color-earth-emerald)" />
                    {hi ? 'फसल विकास अवस्था' : 'Crop Stage'}
                  </span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {twin.crop?.prediction?.phenology_stage?.replace('_', ' ') ?? 'FLOWERING HEADING'}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={16} color="var(--color-solar-amber)" />
                    {hi ? 'जलभराव जोखिम' : 'Waterlogging Risk'}
                  </span>
                  <span className="badge badge-frozen" style={{ fontSize: '0.72rem' }}>
                    {twin.flood?.prediction?.risk_level ?? 'LOW'}
                  </span>
                </div>
              </div>
            </div>

            {/* Micro-Event Alerts Card */}
            <div className="glass-panel" style={{ padding: '20px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Clock size={16} color="var(--color-solar-amber)" />
                {hi ? 'गाँव में क्या बदल रहा है?' : 'What is changing in the Panchayat?'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ padding: '10px 12px', background: '#eff6ff', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-atmosphere-blue)' }}>
                  <strong style={{ color: 'var(--color-atmosphere-blue)' }}>{hi ? 'आज शाम:' : 'This Evening:'}</strong> {hi ? '4 से 10 बजे के बीच 84% संभावना से 12.4 मिमी वर्षा होगी। सिंचाई और छिड़काव रोकें।' : '84% probability of 12.4 mm rainfall between 4 PM and 10 PM. Hold irrigation pumping and pesticide spraying.'}
                </div>
                <div style={{ padding: '10px 12px', background: '#ecfdf5', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-earth-emerald)' }}>
                  <strong style={{ color: 'var(--color-earth-emerald)' }}>{hi ? 'कल सुबह:' : 'Tomorrow Morning:'}</strong> {hi ? 'जड़ क्षेत्र में नमी पर्याप्त रहेगी, टिलरिंग चरण के लिए अनुकूल।' : 'Root-zone moisture remains optimal; soil conditions favorable for crop tillering.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
