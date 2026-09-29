import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Droplet,
  Volume2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const FarmerOneScreen: React.FC = () => {
  const { language, speakText, isSpeaking, selectedCrop } = useApp();
  const [whyOpen, setWhyOpen] = useState(false);

  const speechTextHi =
    'किसान भाई, आज आपके खेत के लिए विशेष सलाह: अगले चौबीस घंटे में बारह दशमलव चार मिलीमीटर बारिश की चौरासी प्रतिशत संभावना है, और जमीन के अंदर इकतीस प्रतिशत नमी मौजूद है। आज ट्यूबवेल न चलाएं, इससे आपका डीजल और बिजली का खर्च बचेगा।';

  const speechTextEn =
    'Farmer Advisory for Today: 84% probability of 12.4 mm rainfall within 24 hours, and root-zone soil moisture is adequate at 31%. Hold irrigation today to save diesel and electricity costs.';

  return (
    <div
      className="farmora-glass-elevated"
      style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-xl)',
        position: 'relative'
      }}
    >
      {/* Top Banner Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: 'var(--farmora-lime)',
              color: 'var(--farmora-dark)',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {language === 'hi' ? 'आज आपके खेत के लिए' : 'FOR YOUR FARM TODAY'}
          </span>
          <span className="badge badge-pilot">M1–M3 FROZEN PILOT</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--farmora-wheat)', fontFamily: 'var(--font-mono)' }}>
          {selectedCrop}
        </div>
      </div>

      {/* Main Large Answer Box */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        <div
          style={{
            fontSize: '3rem',
            lineHeight: 1,
            background: 'rgba(12, 13, 5, 0.8)',
            border: '1.5px solid rgba(182, 178, 67, 0.4)',
            width: '80px',
            height: '80px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            flexShrink: 0
          }}
        >
          🌧️
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--farmora-wheat)', marginBottom: '6px' }}>
            {language === 'hi'
              ? 'अगले 24 घंटे में 12.4 मिमी बारिश की 84% संभावना है।'
              : '84% probability of 12.4 mm rainfall in the next 24 hours.'}
          </div>

          <h3
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
              color: 'var(--farmora-lime)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '10px'
            }}
          >
            {language === 'hi'
              ? 'सिंचाई स्थगित रखें (ट्यूबवेल न चलाएं)'
              : 'Hold Irrigation (Do Not Pump Groundwater)'}
          </h3>

          <p style={{ fontSize: '1rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
            {language === 'hi'
              ? 'जमीन के 40 सेमी अंदर जड़ों के पास 31% पर्याप्त नमी है। आज पानी न देने से लगभग ₹1,450 का डीजल और बिजली बचेगी।'
              : 'Root-zone moisture is sufficient at 31% VWC. Skipping irrigation today saves approximately ₹1,450 in fuel/electricity.'}
          </p>
        </div>
      </div>

      {/* Audio Button & Reason Trigger */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => speakText(language === 'hi' ? speechTextHi : speechTextEn)}
          className="farmora-btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 24px',
            fontSize: '0.95rem',
            background: isSpeaking ? '#ef4444' : 'var(--farmora-lime)',
            color: isSpeaking ? 'white' : 'var(--farmora-dark)',
            minHeight: '46px'
          }}
        >
          <Volume2 size={20} />
          <span>
            {isSpeaking
              ? language === 'hi' ? 'आवाज़ बंद करें' : 'Stop Audio'
              : language === 'hi' ? 'सलाह सुनें (Hindi Audio)' : 'Listen to Advice (Audio)'}
          </span>
          {isSpeaking && (
            <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
              <span style={{ width: 3, height: 16, background: 'currentColor', animation: 'audioWaveBar 0.8s infinite ease-in-out' }} />
              <span style={{ width: 3, height: 22, background: 'currentColor', animation: 'audioWaveBar 0.6s infinite ease-in-out' }} />
              <span style={{ width: 3, height: 12, background: 'currentColor', animation: 'audioWaveBar 0.9s infinite ease-in-out' }} />
            </div>
          )}
        </button>

        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="farmora-btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            fontSize: '0.9rem',
            minHeight: '46px'
          }}
        >
          <span>{language === 'hi' ? 'यह सलाह क्यों दी गई?' : 'Why this advice?'}</span>
          {whyOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* "Why?" Progressive Disclosure Accordion */}
      {whyOpen && (
        <div
          style={{
            background: 'rgba(12, 13, 5, 0.85)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(182, 178, 67, 0.25)',
            padding: '18px 22px',
            marginTop: '1.25rem'
          }}
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--farmora-wheat)', marginBottom: '10px' }}>
            {language === 'hi' ? 'वैज्ञानिक कारण (Causal Evidence):' : 'Scientific Causal Evidence:'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.84rem' }}>
            <div style={{ background: 'rgba(22, 24, 10, 0.9)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
              <strong style={{ color: 'var(--farmora-lime)' }}>1. Model 3 (Rain):</strong>
              <div style={{ color: 'var(--farmora-platinum)', marginTop: '4px' }}>12.4mm rainfall predicted in 24h with 84% probability.</div>
            </div>
            <div style={{ background: 'rgba(22, 24, 10, 0.9)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
              <strong style={{ color: 'var(--farmora-wheat)' }}>2. Model 4 (Soil):</strong>
              <div style={{ color: 'var(--farmora-platinum)', marginTop: '4px' }}>31.4% VWC root-zone moisture (Field capacity is 34%).</div>
            </div>
            <div style={{ background: 'rgba(22, 24, 10, 0.9)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
              <strong style={{ color: '#38bdf8' }}>3. Model 6 (ETc Demand):</strong>
              <div style={{ color: 'var(--farmora-platinum)', marginTop: '4px' }}>Daily crop water loss is 5.8mm/day.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
