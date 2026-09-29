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
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { AtmosphericBackground } from '../components/common/AtmosphericBackground';

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
        return { dot: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d' };
      case 'PROHIBITED':
        return { dot: '#dc2626', bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' };
      case 'CONDITIONAL':
        return { dot: '#d97706', bg: '#fffbeb', border: '#fde68a', text: '#b45309' };
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
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2rem 1.5rem 5rem 1.5rem', background: 'var(--bg-primary)' }}>
      <AtmosphericBackground intensity="subtle" showGrid={true} />

      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <StatusBadge status="frozen" label="CERTIFIED ADVISORY ENGINE" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {location.panchayatName} • {selectedCrop}
            </span>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {language === 'hi' ? 'खेत की कार्य योजना (Action Advice)' : 'Farm Action Timeline'}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            {language === 'hi'
              ? 'आज और कल के लिए स्पष्ट कदम। बिना किसी तकनीकी उलझन के।'
              : 'Clear, prioritized actions for today and tomorrow. Zero confusing jargon.'}
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {language === 'hi' ? 'सलाह लोड हो रही है...' : 'Synthesizing action timeline...'}
          </div>
        ) : advisory ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* TIMELINE SECTION: TODAY */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--text-primary)',
                  color: 'white',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '1rem'
                }}
              >
                <Clock size={14} />
                {language === 'hi' ? 'आज के कदम (TODAY)' : "TODAY'S ACTIONS"}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {advisory.actions.map((item) => {
                  const style = getStatusColor(item.status);
                  const isExpanded = expandedId === item.id;

                  const voiceText =
                    language === 'hi'
                      ? `${item.action_title_hi}। ${item.vernacular_message_hi}। ${item.estimated_benefit_inr ? `अनुमानित लाभ: ${item.estimated_benefit_inr} रुपये।` : ''}`
                      : `${item.action_title_en}. ${item.vernacular_message_en}`;

                  return (
                    <div
                      key={item.id}
                      className="glass-panel-elevated"
                      style={{
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-xl)',
                        background: 'white',
                        border: `1.5px solid ${isExpanded ? style.border : 'var(--border-subtle)'}`,
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Top Bar of Action Card */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: 'var(--radius-md)',
                              background: style.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {getIcon(item.category)}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  backgroundColor: style.dot
                                }}
                              />
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: style.text, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                                {item.status}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>• {item.category}</span>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                              {language === 'hi' ? item.action_title_hi : item.action_title_en}
                            </h3>
                          </div>
                        </div>

                        {/* Audio Read-out for this specific card */}
                        <button
                          onClick={() => handlePlayVoice(item.id, voiceText)}
                          style={{
                            background: activeVoiceId === item.id ? style.bg : 'var(--bg-surface-subtle)',
                            border: 'none',
                            borderRadius: 'var(--radius-full)',
                            padding: '8px',
                            cursor: 'pointer',
                            color: activeVoiceId === item.id ? style.text : 'var(--text-secondary)'
                          }}
                          title={language === 'hi' ? 'सुनें' : 'Listen'}
                        >
                          {activeVoiceId === item.id ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                      </div>

                      {/* Main Farmer Message */}
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px', paddingLeft: '54px' }}>
                        {language === 'hi' ? item.vernacular_message_hi : item.vernacular_message_en}
                      </p>

                      {/* Key Indicators Footer */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingLeft: '54px',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span>
                            {language === 'hi' ? 'प्राथमिकता:' : 'Priority:'}{' '}
                            <strong style={{ color: item.priority === 'URGENT' ? 'var(--color-hazard-crimson)' : 'var(--color-earth-emerald)' }}>
                              {item.priority}
                            </strong>
                          </span>
                          {item.estimated_benefit_inr && (
                            <span style={{ color: 'var(--color-earth-emerald)', fontWeight: 600 }}>
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
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            color: 'var(--color-atmosphere-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px'
                          }}
                        >
                          {isExpanded
                            ? language === 'hi'
                              ? 'कम देखें'
                              : 'Hide Details'
                            : language === 'hi'
                            ? 'विस्तार देखें'
                            : 'Why this advice?'}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>

                      {/* Expanded Evidence & Scientific Details */}
                      {isExpanded && (
                        <div
                          style={{
                            marginTop: '14px',
                            padding: '14px 16px',
                            background: 'var(--bg-surface-subtle)',
                            borderRadius: 'var(--radius-md)',
                            borderTop: '1px solid var(--border-subtle)',
                            fontSize: '0.84rem'
                          }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                            {language === 'hi' ? 'वैज्ञानिक साक्ष्य एवं मॉडल:' : 'Scientific Evidence & Model Provenance:'}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.5 }}>
                            {item.scientific_justification}
                          </div>
                          <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
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
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '1rem'
                }}
              >
                <Clock size={14} />
                {language === 'hi' ? 'कल का पूर्वाभास (TOMORROW)' : "TOMORROW'S OUTLOOK"}
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', background: 'white', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#16a34a' }} />
                  <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {language === 'hi' ? 'खाद (यूरिया/डीएपी) छिड़काव के लिए उपयुक्त समय' : 'Fertilizer Application Window Opens'}
                  </strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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
