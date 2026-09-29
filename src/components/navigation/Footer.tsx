import React from 'react';
import { Link } from 'react-router-dom';
import { KisanIntelligenceCore } from '../ai/KisanIntelligenceCore';
import { ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '5rem',
        borderTop: '1px solid rgba(182, 178, 67, 0.2)',
        background: 'linear-gradient(180deg, #0C0D05 0%, #060702 100%)',
        padding: '3.5rem 1.5rem 6rem 1.5rem',
        color: 'var(--farmora-platinum)'
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Col 1: Brand & Core Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <KisanIntelligenceCore size="sm" state="PROCESSING" />
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--farmora-light)' }}>
                Kisaan Ki Yash
              </div>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--farmora-platinum)', marginBottom: '16px' }}>
              Next-generation agricultural climate-intelligence cascade. Translating 25-km synoptic atmospheric physics down to 1-km farm plot decisions.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
              <ShieldCheck size={14} color="var(--farmora-lime)" />
              <span>PILOT STATION: AWS_LKO_05 LOCKED</span>
            </div>
          </div>

          {/* Col 2: Farmer Cockpit */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--farmora-wheat)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
              Farmer Cockpit
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <Link to="/my-farm" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                My Farm Today (मेरा खेत)
              </Link>
              <Link to="/weather" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                1-km Precision Grid Map
              </Link>
              <Link to="/advice" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Action Timeline & Fertilizer Alerts
              </Link>
              <Link to="/digital-twin" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                What-If 3D Simulator
              </Link>
            </div>
          </div>

          {/* Col 3: Scientific Infrastructure */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--farmora-wheat)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
              Scientific Pipeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <Link to="/model-lab" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Model Lab (M1–M10 Registry)
              </Link>
              <Link to="/validation" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Validation & Error Bounds
              </Link>
              <Link to="/data-center" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Multimodal Data Center
              </Link>
              <Link to="/about" style={{ color: 'var(--farmora-platinum)', textDecoration: 'none', transition: 'color 0.2s' }}>
                Scientific Principles & Ethics
              </Link>
            </div>
          </div>

          {/* Col 4: Design & Intelligence */}
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--farmora-wheat)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>
              Agritech Architecture
            </div>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--farmora-platinum)', marginBottom: '12px' }}>
              Built with Farmora Design System (#0C0D05 obsidian & #B6B243 electric lime) and high-performance WebGL 3D cursor interaction.
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-frozen" style={{ fontSize: '0.65rem' }}>39.89% NWP Error Reduction</span>
              <span className="badge badge-pilot" style={{ fontSize: '0.65rem' }}>M3 RMSE 0.9725</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(182, 178, 67, 0.15)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem' }}>
          <div>
            © {new Date().getFullYear()} Kisaan Ki Yash (किसान की यश). Dedicated to India’s Farming Community.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--farmora-wheat)' }}>
            <span>Rooted in Agricultural Physics</span>
            <span>•</span>
            <span style={{ color: 'var(--farmora-lime)' }}>Farmora Precision Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
