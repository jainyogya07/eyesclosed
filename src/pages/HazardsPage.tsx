import React from 'react';
import { useApp } from '../contexts/AppContext';
import { AlertTriangle, ShieldCheck, Flame, CloudLightning, Waves } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const HazardsPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="EXTREME VALUE HAZARD ENGINE" />
          <span className="badge badge-pilot">M8 & M9 EARLY WARNING</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={32} color="#f87171" />
          Agricultural Hazard Early Warning
        </h1>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.02rem', maxWidth: '780px' }}>
          Extreme weather anomaly detection powered by Generalized Pareto Distributions and 2D pluvial hydrodynamic routing.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Waves size={24} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--farmora-light)' }}>
              Inundation & Flood Risk (M8)
            </h3>
          </div>
          <div style={{ padding: '12px', background: 'rgba(182, 178, 67, 0.15)', borderRadius: '8px', border: '1px solid var(--farmora-lime)', marginBottom: '12px' }}>
            <span style={{ color: 'var(--farmora-lime)', fontWeight: 800 }}>LOW HAZARD (0.4/10)</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
            Topographic wetness index and elevation (124m MSL) ensure natural overland drainage towards western canal outfalls.
          </p>
        </div>

        <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <Flame size={24} color="var(--farmora-wheat)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--farmora-light)' }}>
              Thermal Stress & Heatwave (M9)
            </h3>
          </div>
          <div style={{ padding: '12px', background: 'rgba(182, 178, 67, 0.15)', borderRadius: '8px', border: '1px solid var(--farmora-lime)', marginBottom: '12px' }}>
            <span style={{ color: 'var(--farmora-lime)', fontWeight: 800 }}>NORMAL CLIMATE BOUND</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
            Current surface canopy temperature of 27.8°C remains within optimal photosynthetic threshold (24°C–32°C).
          </p>
        </div>
      </div>
    </div>
  );
};
