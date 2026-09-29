import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Sprout, Compass, Sun, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const AgriculturePage: React.FC = () => {
  const { selectedCrop } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="PHENOLOGY & YIELD SIMULATION" />
          <span className="badge badge-pilot">M5 & M7 BIOPHYSICAL MODELS</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sprout size={32} color="var(--farmora-lime)" />
          Crop Phenology & Agronomic Dynamics
        </h1>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.02rem', maxWidth: '780px' }}>
          Growing Degree Day (GDD) tracking, physiological developmental milestones, and Sentinel-2 red-edge chlorophyll dynamics.
        </p>
      </div>

      <div className="farmora-glass-elevated" style={{ padding: '28px', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
          Active Crop: {selectedCrop}
        </h3>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '18px' }}>
          Thermal time accumulation (GDD) currently stands at <strong>840 degree-days</strong> since sowing. The crop is traversing its critical reproductive phase, where extreme heat (&gt;35°C) or prolonged root inundation can reduce final grain fill by up to 24%.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.25)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)' }}>PHENOLOGICAL STAGE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--farmora-lime)', marginTop: '4px' }}>Flowering / Anthesis</div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.25)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)' }}>WATER STRESS SENSITIVITY</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>High (Ky = 1.15)</div>
          </div>

          <div style={{ padding: '14px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.25)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)' }}>PROJECTED HARVEST</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>42 Days Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
};
