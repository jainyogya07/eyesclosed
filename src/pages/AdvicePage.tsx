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
  DollarSign,
  BellRing,
  AlertTriangle
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { CinematicFarmBackground } from '../components/common/CinematicFarmBackground';
import { ScientificDrawer } from '../components/common/ScientificDrawer';

export const AdvicePage: React.FC = () => {
  const { language, location, selectedCrop, speakText } = useApp();
  const [advisory, setAdvisory] = useState<MasterDecisionAdvisory | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);
  const [fertilizerSubscribed, setFertilizerSubscribed] = useState(false);

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
        return { dot: '#B6B243', bg: 'rgba(182, 178, 67, 0.15)', border: 'rgba(182, 178, 67, 0.4)', text: '#B6B243' };
      case 'PROHIBITED':
        return { dot: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#fca5a5' };
      case 'CONDITIONAL':
        return { dot: '#986924', bg: 'rgba(152, 105, 36, 0.2)', border: 'rgba(152, 105, 36, 0.45)', text: '#D7CE93' };
      default:
        return { dot: '#AEAEAD', bg: 'rgba(251, 251, 251, 0.05)', border: 'rgba(251, 251, 251, 0.2)', text: '#AEAEAD' };
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'IRRIGATION':
        return <Droplet size={22} color="var(--farmora-lime)" />;
      case 'SPRAYING':
        return <SprayCan size={22} color="var(--farmora-wheat)" />;
      case 'FERTILIZATION':
        return <Sprout size={22} color="#38bdf8" />;
      default:
        return <Sparkles size={22} color="var(--farmora-sage)" />;
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 120px)', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)' }}>
      {/* Cinematic Farm Background */}
      <CinematicFarmBackground variant="monsoon_clouds" showParticles={true} opacity={0.25} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <StatusBadge status="frozen" label="CERTIFIED ADVISORY ENGINE" />
            <span style={{ fontSize: '0.8rem', color: 'var(--farmora-wheat)', fontFamily: 'var(--font-mono)' }}>
              {location.panchayatName} • {selectedCrop}
            </span>
          </div>

          <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--farmora-light)', letterSpacing: '-0.025em', marginBottom: '8px' }}>
            {language === 'hi' ? 'खेत की कार्य योजना' : 'Farm Action Timeline'}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--farmora-platinum)' }}>
            {language === 'hi'
              ? 'आज और कल के लिए स्पष्ट कदम। बिना किसी तकनीकी उलझन के।'
              : 'Clear, prioritized actions for today and tomorrow. Zero confusing jargon.'}
          </p>
        </div>

        {/* FERTILIZER ALARMING SYSTEM CARD */}
        <div
          className="farmora-glass-elevated"
          style={{
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem',
            border: '2px solid rgba(182, 178, 67, 0.35)',
            background: 'linear-gradient(135deg, rgba(22, 24, 10, 0.9) 0%, rgba(35, 30, 15, 0.85) 100%)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BellRing size={22} color="var(--farmora-lime)" />
              <span style={{ fontWeight: 800, color: 'var(--farmora-light)', fontSize: '1.1rem' }}>
                {language === 'hi' ? 'खाद सुरक्षा अलार्म सेवा' : 'Fertilizer Early Warning Alert'}
              </span>
            </div>
            <span className="badge badge-pilot">{language === 'hi' ? '₹59 / सीजन सुरक्षा' : '₹59 / SEASON PROTECTION'}</span>
          </div>

          <p style={{ color: 'var(--farmora-platinum)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '14px' }}>
            {language === 'hi'
              ? 'अलर्ट स्थिति: अगले 6 दिनों में मोहनलालगंज/मलिहाबाद में 35mm वर्षा का चक्र बन रहा है। अभी यूरिया या डीएपी न डालें। 7 दिन बाद बारिश थमने पर खाद डालने से पौधों को 100% पोषक तत्व मिलेंगे और ₹800 प्रति बीघा की बचत होगी।'
              : 'Alert status: A rain cycle of 35mm is forming over the cluster in 6 days. Do not apply Urea or DAP now. Waiting prevents nitrogen runoff and saves ₹800/bigha.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => setFertilizerSubscribed(!fertilizerSubscribed)}
              className="farmora-btn-primary"
              style={{
                padding: '8px 20px',
                fontSize: '0.85rem'
              }}
            >
              {fertilizerSubscribed
                ? (language === 'hi' ? '✓ अलर्ट सक्रिय' : '✓ SMS & Voice Alert Active')
                : (language === 'hi' ? '1-हफ्ता पूर्व वर्षा अलर्ट शुरू करें (₹59 / सीजन)' : 'Activate 1-Week Rain Alert (₹59 / Season)')}
            </button>
            <span style={{ fontSize: '0.75rem', color: 'var(--farmora-wheat)', fontFamily: 'var(--font-mono)' }}>
              SMS & WHATSAPP DIRECT PHONE ALARM
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--farmora-platinum)', fontSize: '1.1rem' }}>
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
                  background: 'rgba(12, 13, 5, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--farmora-light)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(182, 178, 67, 0.3)'
                }}
              >
                <Clock size={16} color="var(--farmora-lime)" />
                {language === 'hi' ? 'आज के कदम' : "TODAY'S ACTIONS"}
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
                      className="farmora-glass-elevated"
                      style={{
                        padding: '24px',
                        borderRadius: 'var(--radius-xl)',
                        border: `1.5px solid ${style.border}`,
                        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: 'var(--radius-lg)',
                              background: style.bg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${style.border}`
                            }}
                          >
                            {getIcon(item.category)}
                          </div>
                          <div>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 10px',
                                borderRadius: 'var(--radius-full)',
                                background: style.bg,
                                color: style.text,
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                fontFamily: 'var(--font-mono)',
                                marginBottom: '4px'
                              }}
                            >
                              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: style.dot }} />
                              {item.status}
                            </span>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--farmora-light)' }}>
                              {language === 'hi' ? item.action_title_hi : item.action_title_en}
                            </h3>
                          </div>
                        </div>

                        {item.estimated_benefit_inr && (
                          <div
                            style={{
                              padding: '6px 14px',
                              borderRadius: 'var(--radius-full)',
                              background: 'rgba(182, 178, 67, 0.15)',
                              border: '1px solid rgba(182, 178, 67, 0.4)',
                              color: 'var(--farmora-lime)',
                              fontWeight: 800,
                              fontSize: '0.85rem'
                            }}
                          >
                            {language === 'hi' ? 'बचत' : 'Savings'}: ₹{item.estimated_benefit_inr}
                          </div>
                        )}
                      </div>

                      <p style={{ fontSize: '1.02rem', color: 'var(--farmora-platinum)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                        {language === 'hi' ? item.vernacular_message_hi : item.vernacular_message_en}
                      </p>

                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handlePlayVoice(item.id, voiceText)}
                          className="farmora-btn-primary"
                          style={{
                            padding: '8px 18px',
                            fontSize: '0.84rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isPlayingThis ? '#ef4444' : 'var(--farmora-lime)',
                            color: isPlayingThis ? 'white' : 'var(--farmora-dark)'
                          }}
                        >
                          {isPlayingThis ? <VolumeX size={16} /> : <Volume2 size={16} />}
                          <span>
                            {isPlayingThis
                              ? (language === 'hi' ? 'आवाज़ रोकें' : 'Stop Audio')
                              : (language === 'hi' ? 'सलाह सुनें (Audio)' : 'Listen Voice Advice')}
                          </span>
                        </button>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="farmora-btn-secondary"
                          style={{
                            padding: '8px 16px',
                            fontSize: '0.84rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span>{language === 'hi' ? 'विस्तृत कारण' : 'Details'}</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div
                          style={{
                            marginTop: '1.25rem',
                            padding: '16px',
                            background: 'rgba(12, 13, 5, 0.8)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid rgba(182, 178, 67, 0.25)',
                            fontSize: '0.88rem'
                          }}
                        >
                          <div style={{ fontWeight: 700, color: 'var(--farmora-wheat)', marginBottom: '8px' }}>
                            {language === 'hi' ? 'मॉडल साक्ष्य:' : 'Model Evidence:'}
                          </div>
                          <div style={{ color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
                            {item.scientific_justification}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
