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
import { CinematicFarmBackground } from '../components/common/CinematicFarmBackground';

export const WeatherPage: React.FC = () => {
  const { language, location } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<string>('Now');
  const [activeMetric, setActiveMetric] = useState<MapMetricMode>('temp');

  const horizons = ['Now', '+6h', '+12h', '+24h', '+48h', '+72h'];

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
      {/* Satellite Earth Grid Background */}
      <CinematicFarmBackground variant="satellite_grid" showParticles={true} overlayOpacity={0.7} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Top Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <StatusBadge status="frozen" label="1-KM WEATHER DOWNSCALING (M1 & M3)" />
              <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
                {location.panchayatName}
              </span>
            </div>

            <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '12px', textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}>
              <CloudSun size={32} color="#38bdf8" />
              {language === 'hi' ? '1-किमी मौसम ग्रिड (Hyperlocal Weather Map)' : '1-km Hyperlocal Weather Map'}
            </h1>
            <p style={{ color: '#e2e8f0', fontSize: '1.05rem', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
              {language === 'hi'
                ? 'नक्शे पर किसी भी 1-किमी ग्रिड सेल पर क्लिक करके स्थानीय पूर्वानुमान देखें।'
                : 'Click any 1-km grid cell to inspect localized downscaled forecasts.'}
            </p>
          </div>

          {/* Minimal Floating Horizon Timeline Selector */}
          <div
            className="cinematic-glass"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 8px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Clock size={14} color="#0284c7" />
              HORIZON:
            </span>
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: selectedHorizon === h ? 'var(--color-atmosphere-blue)' : 'transparent',
                  color: selectedHorizon === h ? 'white' : 'var(--text-secondary)',
                  fontWeight: selectedHorizon === h ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* High-Impact Viewport Map Experience */}
        <MapView
          activeMetric={activeMetric}
          onSelectMetric={setActiveMetric}
          selectedHorizon={selectedHorizon}
        />
      </div>
    </div>
  );
};
