import React, { useState } from 'react';
import { MapView } from '../components/maps/MapView';
import { useApp } from '../contexts/AppContext';
import {
  CloudSun,
  ShieldCheck,
  Thermometer,
  Clock,
  Compass,
  Layers,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { language, viewMode } = useApp();
  const [selectedHorizon, setSelectedHorizon] = useState<string>('Now');
  const [techDrawerOpen, setTechDrawerOpen] = useState(false);

  const horizons = ['Now', '+6h', '+12h', '+24h', '+48h', '+72h'];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Model 1 & Model 3 Frozen Pilots</span>
          <span className="badge badge-pilot">DEMO PILOT DATA</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CloudSun size={28} color="var(--color-atmosphere-blue)" />
              {language === 'hi' ? '1-किमी स्थानीय मौसम ग्रिड' : '1-km Hyperlocal Weather Intelligence'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              High-resolution topographical downscaling conditioned on terrain elevation, aspect, and in-situ AWS telemetry.
            </p>
          </div>

          {/* Forecast Horizon Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '0 6px' }}>
              HORIZON:
            </span>
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                style={{
                  padding: '5px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: selectedHorizon === h ? 'white' : 'transparent',
                  color: selectedHorizon === h ? 'var(--color-atmosphere-blue)' : 'var(--text-secondary)',
                  fontWeight: selectedHorizon === h ? 700 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: selectedHorizon === h ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 1-km Geospatial Analysis Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <MapView />
      </div>

      {/* Technical Scientific Drawer (Progressive Disclosure) */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-card)'
        }}
      >
        <div
          onClick={() => setTechDrawerOpen(!techDrawerOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--color-earth-emerald)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Scientific Methodology, Baselines & Conformal Calibration (M1 & M3)
            </h3>
          </div>
          {techDrawerOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {techDrawerOpen && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Model 1 (Weather Downscaling):</strong>
                <p>Topographic Random Forest regressor with sinusoidal cyclical diurnal harmonics. Evaluated on independent test station AWS_LKO_05 in Malihabad mango belt.</p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: 'var(--color-earth-emerald)' }}>
                  MAE: 0.4083°C vs Raw NWP 0.6793°C (39.89% error reduction)
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Model 3 (Precipitation Downscaling):</strong>
                <p>Two-stage hurdle formulation addressing the spatial drizzle problem. Stage 1: Logistic classifier for P(Rain &gt; 0.1mm). Stage 2: Ridge regressor on log1p rainfall volume.</p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: 'var(--color-atmosphere-blue)' }}>
                  Locked Test RMSE: 0.9725 mm/h vs Raw NWP 1.1438 mm/h (15.0% error reduction)
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Nominal 90% Prediction Interval & Conformal Uncertainty:</strong>
                <p>Prediction intervals [Lower, Upper] calibrated via Conformalized Quantile Regression (CQR). If atmospheric non-conformity exceeds safe bounds, abstention gate triggers.</p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: 'var(--color-earth-emerald)', fontWeight: 600 }}>
                  Nominal Target: 90.0% • Empirical Coverage: M1 Val: 91.7% | M1 Test: 80.6% | M2 Test: 86.1%
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-surface-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              NOTICE: All gridded cells operate in UTM Zone 44N (EPSG:32644) metric analysis coordinates. Re-projected to EPSG:4326 for web interchange.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
