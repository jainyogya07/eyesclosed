import React, { useState } from 'react';
import { MapView, MapMetricMode } from '../components/maps/MapView';
import { useApp } from '../contexts/AppContext';
import {
  CloudSun,
  ShieldCheck,
  Clock,
  Navigation
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';

export const WeatherPage: React.FC = () => {
  const { language, location } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<string>('Now');
  const [activeMetric, setActiveMetric] = useState<MapMetricMode>('temp');

  const horizons = ['Now', '+6h', '+12h', '+24h', '+48h', '+72h'];

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2rem 1.5rem 5rem 1.5rem', background: 'var(--bg-primary)' }}>
      <AtmosphericBackground intensity="subtle" showGrid={false} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <StatusBadge status="frozen" label="1-KM WEATHER DOWNSCALING (M1 & M3)" />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {location.panchayatName}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CloudSun size={28} color="var(--color-atmosphere-blue)" />
              {language === 'hi' ? '1-किमी मौसम ग्रिड (Interactive Weather Map)' : '1-km Hyperlocal Weather Map'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {language === 'hi'
                ? 'नक्शे पर किसी भी 1-किमी ग्रिड सेल पर क्लिक करके स्थानीय पूर्वानुमान देखें।'
                : 'Click any 1-km grid cell to inspect localized downscaled forecasts.'}
            </p>
          </div>

          {/* Minimal Floating Horizon Timeline Selector */}
          <div
            className="glass-panel"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'white',
              padding: '4px 6px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              HORIZON:
            </span>
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: selectedHorizon === h ? 'var(--color-atmosphere-blue)' : 'transparent',
                  color: selectedHorizon === h ? 'white' : 'var(--text-secondary)',
                  fontWeight: selectedHorizon === h ? 700 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* ~70% Viewport Map Experience */}
        <MapView
          activeMetric={activeMetric}
          onSelectMetric={setActiveMetric}
          selectedHorizon={selectedHorizon}
        />
      </div>
    </div>
  );
};
