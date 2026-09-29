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
import { StatusBadge } from '../components/common/StatusBadge';

export const ValidationPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="ZERO-LEAKAGE BENCHMARK AUDIT" />
          <span className="badge badge-pilot">LEAVE-ONE-STATION-OUT PROTOCOL</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={32} color="var(--farmora-lime)" />
          Scientific Validation & Benchmark Audit Report
        </h1>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.02rem', maxWidth: '780px' }}>
          Strictly verified against independent in-situ IMD Automatic Weather Station (AWS) telemetry. Zero evaluation against coarse input NWP.
        </p>
      </div>

      {/* Honest Scope & Geolocation Disclaimer */}
      <div
        className="farmora-glass"
        style={{
          padding: '18px 22px',
          borderLeft: '4px solid var(--farmora-wheat)',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          borderRadius: 'var(--radius-md)'
        }}
      >
        <AlertCircle size={24} color="var(--farmora-wheat)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.88rem', color: 'var(--farmora-light)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--farmora-wheat)' }}>Scientific Integrity Disclaimer:</strong> Below validation benchmarks are certified on the <strong>72-Hour July 2025 Lucknow Pilot Dataset (AWS_LKO_01 to AWS_LKO_05)</strong>. They represent proven local feasibility and <strong>must NOT be claimed as pan-India agro-climatic validation</strong> without retraining on regional clusters.
        </div>
      </div>

      {/* Dataset & Spatial Split Table */}
      <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} color="var(--farmora-lime)" />
          1. Spatial Leave-One-Station-Out Partitioning (Station Isolation)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(251, 251, 251, 0.05)', borderBottom: '1.5px solid rgba(182, 178, 67, 0.25)' }}>
                <th style={{ padding: '12px 14px', color: 'var(--farmora-wheat)' }}>SPLIT</th>
                <th style={{ padding: '12px 14px', color: 'var(--farmora-wheat)' }}>STATION ID</th>
                <th style={{ padding: '12px 14px', color: 'var(--farmora-wheat)' }}>LOCATION / ELEVATION</th>
                <th style={{ padding: '12px 14px', color: 'var(--farmora-wheat)' }}>PURPOSE</th>
                <th style={{ padding: '12px 14px', color: 'var(--farmora-wheat)' }}>ACCESS SECURITY</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(182, 178, 67, 0.15)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--farmora-lime)' }}>TRAIN</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--farmora-light)' }}>AWS_LKO_01, 02, 03</td>
                <td style={{ padding: '12px 14px', color: 'var(--farmora-platinum)' }}>Amausi, Bakshi Ka Talab, Mohanlalganj</td>
                <td style={{ padding: '12px 14px', color: 'var(--farmora-platinum)' }}>Feature fitting and tree optimization</td>
                <td style={{ padding: '12px 14px' }}><span className="badge badge-frozen">TRAINING AGENTS</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(182, 178, 67, 0.15)' }}>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#38bdf8' }}>CALIBRATION / VAL</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--farmora-light)' }}>AWS_LKO_04</td>
                <td style={{ padding: '12px 14px', color: 'var(--farmora-platinum)' }}>Gosainganj (121m)</td>
                <td style={{ padding: '12px 14px', color: 'var(--farmora-platinum)' }}>Conformal residual quantile calculation</td>
                <td style={{ padding: '12px 14px' }}><span className="badge badge-pilot">CALIBRATION HOLD</span></td>
              </tr>
              <tr>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#f87171' }}>LOCKED TEST</td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--farmora-light)' }}>AWS_LKO_05</td>
                <td style={{ padding: '12px 14px', color: 'var(--farmora-platinum)' }}>Malihabad Mango Belt (124m)</td>
                <td style={{ padding: '12px 14px', color: 'var(--farmora-platinum)' }}>Untouched independent benchmark evaluation</td>
                <td style={{ padding: '12px 14px' }}><span className="badge badge-critical"><Lock size={10} /> ZERO LEAKAGE LOCK</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Model 1 & Model 2 & Model 3 Benchmark Comparisons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Model 1 Benchmark Card */}
        <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="badge badge-frozen">M1 — Weather Downscaling</span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>Station: AWS_LKO_05</span>
          </div>

          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
            2-Meter Air Temperature Comparison
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--farmora-platinum)' }}>Raw Coarse NWP (Baseline):</span>
              <strong style={{ color: 'var(--farmora-light)' }}>MAE: 0.6793°C (RMSE 0.8385°C)</strong>
            </div>

            <div style={{ padding: '12px', background: 'rgba(182, 178, 67, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid var(--farmora-lime)' }}>
              <span style={{ color: 'var(--farmora-lime)', fontWeight: 800 }}>Model 1 Downscaler:</span>
              <strong style={{ color: 'var(--farmora-lime)' }}>MAE: 0.4083°C (RMSE 0.5233°C)</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--farmora-lime)', marginBottom: '8px' }}>
            <TrendingDown size={18} />
            39.89% Error Reduction over Numerical Weather Prediction
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)' }}>
            $R^2$ Score: <strong style={{ color: 'var(--farmora-wheat)' }}>0.9827</strong> • Conformal 90% Bound: <strong style={{ color: 'var(--farmora-wheat)' }}>±0.7374°C</strong> • Test Coverage: <strong style={{ color: 'var(--farmora-lime)' }}>80.6%</strong>
          </div>
        </div>

        {/* Model 2 Benchmark Card */}
        <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="badge badge-pilot">M2 — Temperature Refinement</span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>Station: AWS_LKO_05</span>
          </div>

          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
            Microclimate Surface Refinement
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--farmora-platinum)' }}>M1 Baseline:</span>
              <strong style={{ color: 'var(--farmora-lime)' }}>MAE: 0.4083°C</strong>
            </div>

            <div style={{ padding: '12px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--farmora-platinum)' }}>M2 Refinement:</span>
              <strong style={{ color: 'var(--farmora-wheat)' }}>MAE: 0.4113°C</strong>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--farmora-wheat)', fontWeight: 700, marginBottom: '8px' }}>
            Honest Scientific Outcome: M2 did not beat M1 (+0.0030°C difference). M1 retained as operational baseline.
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)' }}>
            We strictly do not manipulate or cherry-pick seeds. Retained as frozen artifact demonstrating honest zero-leakage reporting.
          </div>
        </div>

        {/* Model 3 Benchmark Card */}
        <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="badge badge-frozen">M3 — Precipitation Hurdle</span>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>Station: AWS_LKO_05</span>
          </div>

          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
            Hyperlocal Hourly Precipitation
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(12, 13, 5, 0.75)', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--farmora-platinum)' }}>Raw NWP Rainfall:</span>
              <strong style={{ color: 'var(--farmora-light)' }}>RMSE: 1.1438 mm/h</strong>
            </div>

            <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #38bdf8' }}>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>Model 3 Two-Stage Hurdle:</span>
              <strong style={{ color: '#38bdf8' }}>RMSE: 0.9725 mm/h</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 800, color: '#38bdf8', marginBottom: '8px' }}>
            <TrendingDown size={18} />
            15.0% RMSE Reduction vs Raw Coarse Numerical Forecast
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--farmora-platinum)' }}>
            Occurrence AUC: <strong style={{ color: 'var(--farmora-wheat)' }}>0.884</strong> • Intensity MAE: <strong style={{ color: 'var(--farmora-wheat)' }}>0.7535 mm/h</strong> • Brier Score: <strong style={{ color: 'var(--farmora-lime)' }}>0.082</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
