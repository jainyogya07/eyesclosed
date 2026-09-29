import React from 'react';
import {
  Info,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  AlertTriangle,
  HeartHandshake,
  Layers
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="ARCHITECTURE SPECIFICATION" />
          <span className="badge badge-pilot">SIH 2024–26</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Info size={32} color="var(--farmora-lime)" />
          About Kisaan Ki Yash (किसान की यश)
        </h1>
        <p style={{ color: 'var(--farmora-platinum)', fontSize: '1.02rem', maxWidth: '780px' }}>
          An AI-native climate intelligence and agricultural decision cascade designed for smallholder Indian farming resilience.
        </p>
      </div>

      {/* 3 Audience Tiers */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--farmora-light)' }}>
          Who We Serve (Three Operating Perspectives)
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(182, 178, 67, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', border: '1px solid var(--farmora-lime)' }}>
              <HeartHandshake size={24} color="var(--farmora-lime)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--farmora-lime)' }}>
              1. For Farmers (किसान भाई)
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
              Direct, unequivocal action advisories delivered in simple Hindi via audio notes. Clear DO / DO NOT guidance for irrigation pumping, fertilizer timing, and chemical spraying, saving hundreds of rupees in wasted diesel and chemical wash-off.
            </p>
          </div>

          <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', border: '1px solid #38bdf8' }}>
              <Users size={24} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#38bdf8' }}>
              2. For Panchayats & Officers
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
              A cyber-physical Panchayat Digital Twin and What-If simulator. Extension officers can monitor soil moisture stress and flood waterlogging across 50 villages simultaneously and route canal irrigation proactively.
            </p>
          </div>

          <div className="farmora-glass-elevated" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(215, 206, 147, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', border: '1px solid var(--farmora-wheat)' }}>
              <ShieldCheck size={24} color="var(--farmora-wheat)" />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--farmora-wheat)' }}>
              3. For Scientists & Reviewers
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
              Complete transparency: metric projected CRS (EPSG:32644), Conformal Quantile Regression (CQR) certified 90% bounds, SHA-256 cryptographic model hashes, and Leave-One-Station-Out independent ground station benchmarks.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible AI Principles & Abstention Protocol */}
      <div className="farmora-glass-elevated" style={{ padding: '28px', borderRadius: 'var(--radius-xl)', marginBottom: '3rem', borderLeft: '5px solid var(--farmora-lime)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={26} color="var(--farmora-lime)" />
          Responsible AI & The "Honest AI" Abstention Gate
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--farmora-platinum)', lineHeight: 1.6, marginBottom: '14px' }}>
          Conventional generative AI and uncalibrated neural networks frequently hallucinate high confidence even under severe domain shift. In agricultural decision-making, a wrong prediction can bankrupt a smallholder farmer.
        </p>
        <p style={{ fontSize: '0.92rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--farmora-wheat)' }}>Kisaan Ki Yash enforces a strict Abstention Gate:</strong> If atmospheric chaos causes conformal prediction interval width to exceed safe operating bounds or input features violate physical constraints, the AI explicitly states: <em>"Prediction Withheld — High Atmospheric Volatility"</em> and seamlessly defers to official IMD district advisories.
        </p>
      </div>

      {/* Limitations Disclaimer */}
      <div className="farmora-glass" style={{ padding: '24px', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--farmora-wheat)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--farmora-wheat)" />
          Known Operational Limitations
        </h3>
        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--farmora-platinum)', lineHeight: 1.7 }}>
          <li>Currently benchmarked on a 72-hour pilot dataset across 5 AWS stations in Lucknow district.</li>
          <li>Not calibrated for complex mountainous terrain (Himalayas / Western Ghats) without regional retraining.</li>
          <li>Models 4, 5, 7, 8, 9, 10 are currently simulated against physical specifications while active training queue slots progress.</li>
        </ul>
      </div>
    </div>
  );
};
