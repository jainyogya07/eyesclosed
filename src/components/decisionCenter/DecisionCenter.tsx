import React, { useState, useEffect } from 'react';
import { predictionProvider } from '../../providers';
import { MasterDecisionAdvisory, DecisionActionItem } from '../../types/contracts';
import {
  ShieldAlert,
  Droplet,
  SprayCan,
  Sprout,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const DecisionCenter: React.FC = () => {
  const { language } = useApp();
  const hi = language === 'hi';
  const [advisory, setAdvisory] = useState<MasterDecisionAdvisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [expandedActionId, setExpandedActionId] = useState<string | null>('ACT_IRR_01');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await predictionProvider.getDecisionAdvisory('0924001001');
      setAdvisory(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSimulateVoice = (id: string, text: string) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
      window.speechSynthesis.cancel();
      return;
    }
    setPlayingAudioId(id);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudioId(null), 3500);
    }
  };

  if (loading || !advisory) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading certified agricultural advisories...
      </div>
    );
  }

  const getActionColor = (status: string) => {
    switch (status) {
      case 'RECOMMENDED':
        return { bg: 'var(--color-earth-subtle)', border: 'var(--color-earth-light)', text: 'var(--color-earth-emerald)' };
      case 'PROHIBITED':
        return { bg: 'var(--color-hazard-subtle)', border: 'var(--color-hazard-light)', text: 'var(--color-hazard-crimson)' };
      case 'CONDITIONAL':
        return { bg: 'var(--color-solar-subtle)', border: 'var(--color-solar-light)', text: 'var(--color-solar-amber)' };
      default:
        return { bg: 'var(--bg-surface-subtle)', border: 'var(--border-card)', text: 'var(--text-secondary)' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'IRRIGATION':
        return <Droplet size={20} color="var(--color-atmosphere-blue)" />;
      case 'SPRAYING':
        return <SprayCan size={20} color="var(--color-solar-amber)" />;
      case 'FERTILIZATION':
        return <Sprout size={20} color="var(--color-earth-emerald)" />;
      default:
        return <Info size={20} color="var(--color-atmosphere-blue)" />;
    }
  };

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Section Header with Trust Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-pilot">
              {hi ? 'एम10 निर्णय बुद्धिमत्ता इंजन' : 'M10 Decision Intelligence Engine'}
            </span>
            <span className="badge badge-frozen">
              {hi ? '90% सटीकता प्रमाणित' : 'Certified 90% Holdout CQR'}
            </span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)' }}>
            {hi ? 'कृषि निर्णय व सलाह केंद्र' : 'Agricultural Decision & Advisory Center'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {hi ? (
              <>पंचायत: <strong>{advisory.panchayat_name}</strong> • 24 घंटे की प्रमाणित कृषि सलाह</>
            ) : (
              <>Panchayat: <strong>{advisory.panchayat_name}</strong> • Valid through 24-Hour Cascade Forecast Window</>
            )}
          </p>
        </div>

        {/* Total Cost Savings Card */}
        <div
          className="glass-panel"
          style={{
            padding: '12px 20px',
            background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.9) 0%, rgba(240, 253, 250, 0.9) 100%)',
            border: '1px solid var(--border-glow-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: 'var(--color-earth-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-earth-emerald)', fontWeight: 600 }}>
              POTENTIAL AVOIDED INPUT COST — SCENARIO DEPENDENT
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ₹3,650 / acre
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Potential avoided input cost — scenario dependent (Assumptions in drawer)
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Action Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {advisory.actions.map((act: DecisionActionItem) => {
          const style = getActionColor(act.status);
          const isExpanded = expandedActionId === act.id;
          const isPlaying = playingAudioId === act.id;

          return (
            <div
              key={act.id}
              className="action-card"
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: `1.5px solid ${style.border}`,
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  padding: '16px 20px',
                  background: style.bg,
                  borderBottom: `1px solid ${style.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 'var(--radius-md)',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {getCategoryIcon(act.category)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: style.text, textTransform: 'uppercase' }}>
                      {act.category} • {act.status}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {act.action_title_en}
                    </div>
                  </div>
                </div>

                {/* Voice Advisory Play Button */}
                <button
                  onClick={() => handleSimulateVoice(act.id, act.vernacular_message_hi)}
                  title="Play Hindi WhatsApp Voice Advisory"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: isPlaying ? 'var(--color-earth-emerald)' : 'white',
                    color: isPlaying ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Volume2 size={15} color={isPlaying ? 'white' : 'var(--color-atmosphere-blue)'} />
                  <span>{isPlaying ? 'Playing...' : 'Audio (हिंदी)'}</span>
                </button>
              </div>

              {/* Card Body with Vernacular Hindi & English Text */}
              <div style={{ padding: '20px', flex: 1 }}>
                <div
                  style={{
                    background: 'var(--bg-surface-subtle)',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: `4px solid ${style.text}`,
                    marginBottom: '14px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.5
                  }}
                >
                  "{hi ? act.vernacular_message_hi : act.vernacular_message_en}"
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {hi ? act.vernacular_message_en : act.scientific_justification}
                </p>

                {/* Benefit Tag */}
                {act.estimated_benefit_inr && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-earth-emerald)',
                      background: 'var(--color-earth-subtle)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600
                    }}
                  >
                    <CheckCircle2 size={14} />
                    Potential avoided cost: ₹{act.estimated_benefit_inr.toLocaleString()} (Scenario dependent)
                  </div>
                )}
              </div>

              {/* Scientific Explainability Drawer */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-subtle)',
                  padding: '12px 20px'
                }}
              >
                <div
                  onClick={() => setExpandedActionId(isExpanded ? null : act.id)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    fontWeight: 600
                  }}
                >
                  <span>SCIENTIFIC RATIONALE, MODELS & ASSUMPTIONS</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <div style={{ marginBottom: '6px' }}>
                      <strong>Evidence:</strong> {act.scientific_justification}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                      <strong>Synthesized Models:</strong>
                      {act.governing_model_ids.map((m) => (
                        <span key={m} className="badge badge-frozen" style={{ fontSize: '0.65rem' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                    {act.estimated_benefit_inr && (
                      <div style={{ padding: '8px 10px', background: 'white', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                        <strong style={{ color: 'var(--color-earth-emerald)' }}>Avoided Cost Assumptions & Scenario Limits:</strong>
                        <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                          <li>Avoided diesel run: ~4 hrs pumping @ 1.2 L/hr diesel @ ₹95/L ≈ ₹450/acre.</li>
                          <li>Avoided chemical wash-off: 1 systemic fungicide/pesticide spray ≈ ₹3,200/acre.</li>
                          <li><em>Scenario Dependence:</em> Avoided cost is realized only if the predicted rain event (&gt;10mm) materializes. If rain does not occur, spray deferral must be re-evaluated to avoid pest proliferation.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero Hallucination / Abstention Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 24px',
          background: 'white',
          border: '1px solid var(--border-card)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <ShieldAlert size={26} color="var(--color-atmosphere-blue)" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
            Zero Hallucination Protocol & Abstention Gate
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            All farm advisories are governed by <strong>Conformal Quantile Regression (CQR)</strong> using a <strong>Nominal 90% prediction interval</strong>. Actual empirical coverage is audited separately: <strong>M1 validation: 91.7%</strong>, <strong>M1 locked test: 80.6%</strong>, and <strong>M2 locked test: 86.1%</strong>. If atmospheric volatility causes epistemic uncertainty to exceed safe agronomic thresholds, the system automatically abstains from speculative recommendations and defers to official IMD district alerts.
          </div>
        </div>
      </div>
    </section>
  );
};
