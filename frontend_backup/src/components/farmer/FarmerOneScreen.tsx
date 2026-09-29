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
      className="glass-panel-elevated"
      style={{
        padding: '2rem',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: '2px solid var(--color-earth-light)',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative'
      }}
    >
      {/* Top Banner Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: 'var(--color-earth-emerald)',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            {language === 'hi' ? 'आज आपके खेत के लिए' : 'FOR YOUR FARM TODAY'}
          </span>
          <span className="badge badge-pilot">M1–M3 FROZEN PILOT</span>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {selectedCrop}
        </div>
      </div>

      {/* Main Large Answer Box */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div
          style={{
            fontSize: '3rem',
            lineHeight: 1,
            background: 'white',
            width: '74px',
            height: '74px',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-card)',
            flexShrink: 0
          }}
        >
          🌧️
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-atmosphere-blue)', marginBottom: '4px' }}>
            {language === 'hi'
              ? 'अगले 24 घंटे में 12.4 मिमी बारिश की 84% संभावना है।'
              : '84% probability of 12.4 mm rainfall in the next 24 hours.'}
          </div>

          <h3
            style={{
              fontSize: '1.75rem',
              color: 'var(--color-hazard-crimson)',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '8px'
            }}
          >
            {language === 'hi'
              ? 'सिंचाई स्थगित रखें (ट्यूबवेल न चलाएं)'
              : 'Hold Irrigation (Do Not Pump Groundwater)'}
          </h3>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {language === 'hi'
              ? 'जमीन के 40 सेमी अंदर जड़ों के पास 31% पर्याप्त नमी है। आज पानी न देने से लगभग ₹1,450 का डीजल और बिजली बचेगी।'
              : 'Root-zone moisture is sufficient at 31% VWC. Skipping irrigation today saves approximately ₹1,450 in fuel/electricity.'}
          </p>
        </div>
      </div>

      {/* Speech Audio Button */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={() => speakText(language === 'hi' ? speechTextHi : speechTextEn)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            background: isSpeaking ? 'var(--color-hazard-crimson)' : 'var(--color-earth-emerald)',
            color: 'white',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
            transition: 'all 0.2s',
            minHeight: '44px'
          }}
        >
          <Volume2 size={20} />
          <span>{isSpeaking ? (language === 'hi' ? 'आवाज़ बंद करें' : 'Stop Audio') : (language === 'hi' ? 'सलाह सुनें (Hindi Audio)' : 'Listen to Advice (Audio)')}</span>
        </button>

        <button
          onClick={() => setWhyOpen(!whyOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            background: 'white',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-card)',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            minHeight: '44px'
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
            background: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-card)',
            padding: '16px 20px',
            marginTop: '1rem'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {language === 'hi' ? 'वैज्ञानिक कारण (Causal Evidence):' : 'Scientific Causal Evidence:'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.82rem' }}>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <strong>1. Model 3 (Rain):</strong> 12.4mm rainfall predicted in 24h with 84% probability.
            </div>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <strong>2. Model 4 (Soil):</strong> 31.4% VWC root-zone moisture (Field capacity is 34%).
            </div>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <strong>3. Model 6 (ETc Demand):</strong> Daily crop water loss is 5.8mm/day.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
