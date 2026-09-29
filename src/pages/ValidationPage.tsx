import React from 'react';
import {
  ShieldCheck,
  TrendingDown,
  Lock,
  Compass,
  AlertCircle,
  Database,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const ValidationPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Zero-Leakage Benchmark</span>
          <span className="badge badge-pilot">Leave-One-Station-Out Protocol</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={32} color="var(--color-earth-emerald)" />
          Scientific Validation & Benchmark Audit Report
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Strictly verified against independent in-situ IMD Automatic Weather Station (AWS) telemetry. Zero evaluation against coarse input NWP.
        </p>
      </div>

      {/* Honest Scope & Geolocation Disclaimer */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          background: 'var(--color-solar-subtle)',
          borderLeft: '4px solid var(--color-solar-amber)',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <AlertCircle size={24} color="var(--color-solar-amber)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          <strong>Scientific Integrity Disclaimer:</strong> Below validation benchmarks are certified on the <strong>72-Hour July 2025 Lucknow Pilot Dataset (AWS_LKO_01 to AWS_LKO_05)</strong>. They represent proven local feasibility and <strong>must NOT be claimed as pan-India agro-climatic validation</strong> without retraining on regional clusters.
        </div>
      </div>

      {/* Dataset & Spatial Split Table */}
      <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} color="var(--color-atmosphere-blue)" />
          1. Spatial Leave-One-Station-Out Partitioning (Station Isolation)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-subtle)', borderBottom: '1.5px solid var(--border-card)' }}>
                <th style={{ padding: '12px 14px' }}>SPLIT</th>
                <th style={{ padding: '12px 14px' }}>STATION ID</th>
                <th style={{ padding: '12px 14px' }}>LOCATION / ELEVATION</th>
                <th style={{ padding: '12px 14px' }}>PURPOSE</th>
                <th style={{ padding: '12px 14px' }}>ACCESS SECURITY</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-earth-emerald)' }}>TRAIN</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>AWS_LKO_01, 02, 03</td>
                <td style={{ padding: '12px 14px' }}>Amausi, Bakshi Ka Talab, Mohanlalganj</td>
                <td style={{ padding: '12px 14px' }}>Feature fitting and tree optimization</td>
                <td style={{ padding: '12px 14px' }}><span className="badge badge-frozen">TRAINING AGENTS</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-atmosphere-blue)' }}>CALIBRATION / VAL</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>AWS_LKO_04</td>
                <td style={{ padding: '12px 14px' }}>Gosainganj (121m)</td>
                <td style={{ padding: '12px 14px' }}>Conformal residual quantile calculation</td>
                <td style={{ padding: '12px 14px' }}><span className="badge badge-validating">CALIBRATION HOLD</span></td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-hazard-crimson)' }}>LOCKED TEST</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>AWS_LKO_05</td>
                <td style={{ padding: '12px 14px' }}>Malihabad Mango Belt (124m)</td>
                <td style={{ padding: '12px 14px' }}>Untouched independent benchmark evaluation</td>
                <td style={{ padding: '12px 14px' }}><span className="badge badge-critical"><Lock size={10} /> ZERO LEAKAGE LOCK</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Model 1 & Model 2 & Model 3 Benchmark Comparisons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Model 1 Benchmark Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="badge badge-frozen">M1 — Weather Downscaling</span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Station: AWS_LKO_05</span>
          </div>

          <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            2-Meter Air Temperature Comparison
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Raw Coarse NWP (Baseline):</span>
              <strong>MAE: 0.6793°C (RMSE 0.8385°C)</strong>
            </div>

            <div style={{ padding: '12px', background: 'var(--color-earth-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--color-earth-light)' }}>
              <span style={{ color: 'var(--color-earth-emerald)', fontWeight: 700 }}>Model 1 Downscaler:</span>
              <strong style={{ color: 'var(--color-earth-emerald)' }}>MAE: 0.4083°C (RMSE 0.5233°C)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-earth-emerald)', marginBottom: '8px' }}>
            <TrendingDown size={18} />
            39.89% Error Reduction over Numerical Weather Prediction
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            $R^2$ Score: <strong>0.9827</strong> • Nominal 90% Interval Residual: <strong>±0.7374°C</strong> • Empirical Coverage: <strong>Val: 91.7% | Locked Test: 80.6%</strong>
          </div>
        </div>

        {/* Model 2 Benchmark Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="badge badge-frozen">M2 — Temperature Refinement</span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Station: AWS_LKO_05</span>
          </div>

          <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Microclimate Surface Refinement
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Raw Coarse NWP:</span>
              <strong>MAE: 0.6793°C</strong>
            </div>

            <div style={{ padding: '12px', background: 'var(--color-earth-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--color-earth-light)' }}>
              <span style={{ color: 'var(--color-earth-emerald)', fontWeight: 700 }}>Model 2 Refined:</span>
              <strong style={{ color: 'var(--color-earth-emerald)' }}>MAE: 0.4113°C (RMSE 0.5276°C)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-earth-emerald)', marginBottom: '8px' }}>
            <TrendingDown size={18} />
            39.45% Error Reduction vs Raw NWP
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Ablation Delta vs M1: <strong>-0.0030°C</strong> (Within parity limit) • Nominal 90% Interval: <strong>±0.7854°C</strong> • Empirical Coverage: <strong>Locked Test: 86.1%</strong>
          </div>
        </div>

        {/* Model 3 Benchmark Card */}
        <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="badge badge-frozen">M3 — Precipitation Downscaler</span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>Station: AWS_LKO_05</span>
          </div>

          <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
            Two-Stage Hurdle Precipitation Model
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between' }}>
              <span>Raw Coarse NWP Rain:</span>
              <strong>RMSE: 1.1438 mm/h</strong>
            </div>

            <div style={{ padding: '12px', background: 'var(--color-atmosphere-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--color-atmosphere-light)' }}>
              <span style={{ color: 'var(--color-atmosphere-blue)', fontWeight: 700 }}>Model 3 Hurdle Regressor:</span>
              <strong style={{ color: 'var(--color-atmosphere-blue)' }}>RMSE: 0.9725 mm/h</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)', marginBottom: '8px' }}>
            <TrendingDown size={18} />
            15.0% RMSE Reduction on Locked Test Set
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Hurdle Stage 1: Logistic Classifier P(Rain &gt; 0.1mm) • Stage 2: Ridge on log1p(Rainfall)
          </div>
        </div>
      </div>
    </div>
  );
};
