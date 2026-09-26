import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicHero } from '../components/cinematic/CinematicHero';
import { FarmerOneScreen } from '../components/farmer/FarmerOneScreen';
import { IntelligencePipeline } from '../components/cinematic/IntelligencePipeline';
import { useApp } from '../contexts/AppContext';
import {
  CloudSun,
  Droplets,
  Sprout,
  Layers,
  Cpu,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useApp();

  return (
    <div>
      {/* 1. Cinematic Hero with Living Kisan Intelligence Core & M3 Rainfall Card */}
      <CinematicHero onNavigateTab={(tab) => navigate(`/${tab === 'overview' ? '' : tab}`)} />

      {/* 2. One Screen for a Farmer Section */}
      <section style={{ maxWidth: '1280px', margin: '3rem auto 0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-frozen" style={{ marginBottom: '6px' }}>
            {language === 'hi' ? 'किसान-प्रथम दृष्टिकोण' : 'FARMER-FIRST DESIGN'}
          </span>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
            {language === 'hi'
              ? 'जटिल विज्ञान, पर किसान के लिए बिल्कुल सरल'
              : 'Complex Science, Crystal-Clear for the Farmer'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {language === 'hi'
              ? 'मौसम ग्राफ या फॉर्मूले समझने की जरूरत नहीं — सीधा फैसला और कारण।'
              : 'No meteorological graphs required — direct decisions, reasons, and audio advice.'}
          </p>
        </div>

        <FarmerOneScreen />
      </section>

      {/* 3. Causal Intelligence Pipeline Narrative (NWP -> Satellite -> AI -> Decision) */}
      <section style={{ maxWidth: '1280px', margin: '4rem auto 0 auto', padding: '0 2rem' }}>
        <IntelligencePipeline />
      </section>

      {/* 4. Quick Module Entry Cards */}
      <section style={{ maxWidth: '1280px', margin: '2rem auto 4rem auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
            {language === 'hi' ? 'प्लेटफॉर्म के मुख्य खंड' : 'Core Platform Modules'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Explore the specialized micro-services composing the Kisaan Ki Yash cascade.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div
            onClick={() => navigate('/decision-center')}
            className="action-card glass-panel"
            style={{ padding: '24px', cursor: 'pointer', border: '1.5px solid var(--border-glow-emerald)' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-earth-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <CheckCircle2 size={24} color="var(--color-earth-emerald)" />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Agricultural Decision Center</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Actionable spray, irrigation, and harvesting advisory cards with vernacular audio synthesis.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-earth-emerald)' }}>
              Open Decision Center <ArrowRight size={14} />
            </div>
          </div>

          <div
            onClick={() => navigate('/weather')}
            className="action-card glass-panel"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-atmosphere-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <CloudSun size={24} color="var(--color-atmosphere-blue)" />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>1-km Weather Grid</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Interactive UTM 44N metric grid with temperature downscaling, rainfall, and conformal bounds.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)' }}>
              Explore Weather Map <ArrowRight size={14} />
            </div>
          </div>

          <div
            onClick={() => navigate('/digital-twin')}
            className="action-card glass-panel"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(124, 58, 237, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Layers size={24} color="var(--color-quantum-violet)" />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Panchayat Digital Twin</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              What-If scenario simulation sandbox testing rainfall shocks, heatwaves, and canal supply.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-quantum-violet)' }}>
              Run Twin Scenarios <ArrowRight size={14} />
            </div>
          </div>

          <div
            onClick={() => navigate('/model-lab')}
            className="action-card glass-panel"
            style={{ padding: '24px', cursor: 'pointer' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Cpu size={24} color="var(--text-secondary)" />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Model Intelligence Lab</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
              Transparent M1–M10 model registry with SHA-256 hashes and single-active training queue status.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Inspect Model Registry <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
