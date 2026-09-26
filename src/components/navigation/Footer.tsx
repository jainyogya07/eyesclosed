import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Satellite, Radio, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'white',
        padding: '3rem 2rem 5rem 2rem',
        marginTop: 'auto'
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}
      >
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Kisaan Ki Yash (किसान की यश)
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            AI-native 1-km Hyperlocal Climate Risk and Agricultural Decision Platform. Certified Conformal Uncertainty, Leave-One-Station-Out ground truth validation, and vernacular farmer advisories.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-earth-emerald)' }}>
            <ShieldCheck size={14} />
            <span>Zero Data Leakage Protocol Enforced</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Core Modules
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <Link to="/decision-center" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Agricultural Decision Center (M10)</Link>
            <Link to="/weather" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>1-km Downscaled Weather (M1/M2/M3)</Link>
            <Link to="/panchayat" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Panchayat Digital Twin</Link>
            <Link to="/irrigation" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>FAO-56 Irrigation Engine (M6)</Link>
            <Link to="/digital-twin" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>What-If Scenario Sandbox</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Scientific Registry
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <Link to="/model-lab" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Model Lab (M1–M10 Registry)</Link>
            <Link to="/validation" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Leave-One-Station-Out Validation</Link>
            <Link to="/data-center" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>Multi-Modal Data Catalog</Link>
            <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>System Architecture & Methodology</Link>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
            Scientific Audit Specs
          </div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <div>Analysis Grid: EPSG:32644 (UTM 44N)</div>
            <div>Cell Metric: 1000m × 1000m</div>
            <div>M1 Hash: 30c22d4c... (Frozen)</div>
            <div>M2 Hash: a471a59a... (Frozen)</div>
            <div>M3 Hash: 94269196... (Frozen)</div>
            <div style={{ color: 'var(--color-solar-amber)' }}>M4–M9: Simulation / Future Spec</div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}
      >
        <div>
          Smart India Hackathon (SIH 2024–26) • Climate & Agriculture Resilience Track
        </div>
        <div>
          Strictly Non-Hallucinatory AI • Grounded in IMD AWS & Copernicus Telemetry
        </div>
      </div>
    </footer>
  );
};
