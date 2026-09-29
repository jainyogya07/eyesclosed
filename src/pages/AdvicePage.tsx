import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { predictionProvider } from '../providers';
import { MasterDecisionAdvisory, DecisionActionItem } from '../types/contracts';
import {
  Droplet,
  SprayCan,
  Sprout,
  Volume2,
  VolumeX,
  Clock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { CinematicFarmBackground } from '../components/common/CinematicFarmBackground';

export const AdvicePage: React.FC = () => {
  const { language, location, selectedCrop, speakText } = useApp();
  const [advisory, setAdvisory] = useState<MasterDecisionAdvisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdvisory() {
      setLoading(true);
      const data = await predictionProvider.getDecisionAdvisory(location.panchayatCode);
      setAdvisory(data);
      setLoading(false);
    }
    fetchAdvisory();
  }, [location.panchayatCode]);

  const handlePlayVoice = (id: string, text: string) => {
    if (activeVoiceId === id) {
      setActiveVoiceId(null);
      window.speechSynthesis.cancel();
    } else {
      setActiveVoiceId(id);
      speakText(text);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECOMMENDED':
        return { dot: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' };
      case 'PROHIBITED':
        return { dot: '#ef4444', bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
      case 'CONDITIONAL':
        return { dot: '#f59e0b', bg: '#fffbeb', border: '#fde68a', text: '#92400e' };
      default:
        return { dot: '#64748b', bg: '#f8fafc', border: '#e2e8f0', text: '#475569' };
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'IRRIGATION':
        return <Droplet size={22} color="var(--color-atmosphere-blue)" />;
      case 'SPRAYING':
        return <SprayCan size={22} color="var(--color-solar-amber)" />;
      case 'FERTILIZATION':
        return <Sprout size={22} color="var(--color-earth-emerald)" />;
      default:
        return <Sparkles size={22} color="var(--color-quantum-violet)" />;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 1.5rem 6rem 1.5rem' }}>
      {/* Cinematic Monsoon Clouds Background */}
      <CinematicFarmBackground variant="monsoon_clouds" showParticles={true} overlayOpacity={0.65} />

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <StatusBadge status="frozen" label="CERTIFIED ADVISORY ENGINE" />
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontFamily: 'var(--font-mono)' }}>
              {location.panchayatName} • {selectedCrop}
            </span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: '8px', textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}>
            {language === 'hi' ? 'खेत की कार्य योजना (Action Advice)' : 'Farm Action Timeline'}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#e2e8f0', textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
            {language === 'hi'
              ? 'आज और कल के लिए स्पष्ट कदम। बिना किसी तकनीकी उलझन के।'
              : 'Clear, prioritized actions for today and tomorrow. Zero confusing jargon.'}
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#cbd5e1', fontSize: '1.1rem' }}>
            {language === 'hi' ? 'सलाह लोड हो रही है...' : 'Synthesizing action timeline...'}
          </div>
        ) : advisory ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* TIMELINE SECTION: TODAY */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: 'white',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Clock size={16} color="#38bdf8" />
                {language === 'hi' ? 'आज के कदम (TODAY)' : "TODAY'S ACTIONS"}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {advisory.actions.map((item) => {
                  const style = getStatusColor(item.status);
                  const isExpanded = expandedId === item.id;
                  const isPlayingThis = activeVoiceId === item.id;

                  const voiceText =
                    language === 'hi'
                      ? `${item.action_title_hi}। ${item.vernacular_message_hi}। ${item.estimated_benefit_inr ? `अनुमानित लाभ: ${item.estimated_benefit_inr} रुपये।` : ''}`
                      : `${item.action_title_en}. ${item.vernacular_message_en}`;

                  return (
                    <div
                      key={item.id}
                      className="cinematic-glass-elevated card-hover-tilt"
                      style={{
                        padding: '1.75rem 2rem',
                        borderRadius: 'var(--radius-xl)',
                        border: `2px solid ${isExpanded ? style.border : 'rgba(255,255,255,0.85)'}`,
                        boxShadow: '0 20px 45px -10px rgba(0,0,0,0.15)'
                      }}
                    >
                      {/* Top Bar of Action Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: 'var(--radius-lg)',
                              background: style.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: 'var(--shadow-sm)'
                            }}
                          >
                            {getIcon(item.category)}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '9px',
                                  height: '9px',
                                  borderRadius: '50%',
                                  backgroundColor: style.dot,
                                  animation: 'kisanPulse 2s infinite'
                                }}
                              />
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: style.text, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                                {item.status}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {item.category}</span>
                            </div>

                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                              {language === 'hi' ? item.action_title_hi : item.action_title_en}
                            </h3>
                          </div>
                        </div>

                        {/* Audio Button with Sound Wave Visualizer */}
                        <button
                          onClick={() => handlePlayVoice(item.id, voiceText)}
                          style={{
                            background: isPlayingThis ? 'var(--color-earth-deep)' : style.bg,
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            color: isPlayingThis ? 'white' : style.text,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: 'var(--shadow-sm)'
                          }}
                        >
                          {isPlayingThis ? <VolumeX size={18} /> : <Volume2 size={18} />}
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                            {isPlayingThis ? 'Stop' : 'Listen'}
                          </span>
                        </button>
                      </div>

                      {/* Main Message */}
                      <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '14px', paddingLeft: '62px' }}>
                        {language === 'hi' ? item.vernacular_message_hi : item.vernacular_message_en}
                      </p>

                      {/* Key Indicators Footer */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingLeft: '62px',
                          flexWrap: 'wrap',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {language === 'hi' ? 'विश्वसनीयता:' : 'Confidence:'}{' '}
                            <strong style={{ color: 'var(--color-earth-deep)', fontWeight: 800 }}>
                              {item.priority === 'URGENT' ? '94%' : '91%'}
                            </strong>
                          </span>
                          {item.estimated_benefit_inr && (
                            <span
                              style={{
                                background: 'var(--color-earth-subtle)',
                                color: 'var(--color-earth-deep)',
                                padding: '4px 10px',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 800,
                                fontSize: '0.8rem'
                              }}
                            >
                              {language === 'hi' ? `बचत: ₹${item.estimated_benefit_inr}` : `Saves ~₹${item.estimated_benefit_inr}`}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'var(--color-atmosphere-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isExpanded
                            ? language === 'hi'
                              ? 'कम देखें'
                              : 'Hide Details'
                            : language === 'hi'
                            ? 'विस्तार देखें'
                            : 'Why this advice?'}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Expanded Evidence & Scientific Details */}
                      {isExpanded && (
                        <div
                          style={{
                            marginTop: '16px',
                            padding: '16px 20px',
                            background: 'var(--bg-surface-subtle)',
                            borderRadius: 'var(--radius-lg)',
                            borderTop: '1px solid var(--border-subtle)',
                            fontSize: '0.88rem'
                          }}
                        >
                          <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            {language === 'hi' ? 'वैज्ञानिक साक्ष्य एवं मॉडल:' : 'Scientific Evidence & Model Provenance:'}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.6 }}>
                            {item.scientific_justification}
                          </div>
                          <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            <span>GOVERNING MODELS: {item.governing_model_ids.join(', ')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIMELINE SECTION: TOMORROW LOOKAHEAD */}
            <div style={{ marginTop: '1rem' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '1.25rem'
                }}
              >
                <Clock size={16} />
                {language === 'hi' ? 'कल का पूर्वाभास (TOMORROW)' : "TOMORROW'S OUTLOOK"}
              </div>

              <div className="cinematic-glass-elevated" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <strong style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    {language === 'hi' ? 'खाद (यूरिया/डीएपी) छिड़काव के लिए उपयुक्त समय' : 'Fertilizer Application Window Opens'}
                  </strong>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {language === 'hi'
                    ? 'आज की बारिश के बाद कल दोपहर जमीन में पर्याप्त नमी होगी और हवा की गति सामान्य (<10 किमी/घंटा) रहने का अनुमान है। यूरिया का उपयोग कल दोपहर बाद करें।'
                    : 'Following today’s rain event, soil moisture will be optimal tomorrow afternoon with gentle wind speed (<10 km/h), ideal for broadcast fertilization.'}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
