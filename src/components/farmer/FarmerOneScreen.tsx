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
  AlertTriangle,
  Sprout
} from 'lucide-react';

const CROPS = [
  { id: 'Paddy (धान - बासमती)', nameHi: 'धान (बासमती)', nameEn: 'Paddy (Basmati)', stage: 'Tillering (कल्ले फूटना)', gdd: '1,240 GDD' },
  { id: 'Wheat (गेहूं HD-2967)', nameHi: 'गेहूं (HD-2967)', nameEn: 'Wheat (HD-2967)', stage: 'Crown Root (ताज जड़ें)', gdd: '820 GDD' },
  { id: 'Mango (मलिहाबाद दशहरी आम)', nameHi: 'दशहरी आम (बाग)', nameEn: 'Dasheri Mango', stage: 'Fruit Setting (फल विकास)', gdd: '1,680 GDD' },
  { id: 'Mustard (सरसों Pusa-31)', nameHi: 'सरसों (Pusa-31)', nameEn: 'Mustard (Pusa-31)', stage: 'Pod Filling (दाने भरना)', gdd: '940 GDD' }
];

export const FarmerOneScreen: React.FC = () => {
  const { language, speakText, isSpeaking, selectedCrop, setSelectedCrop, location } = useApp();
  const [whyOpen, setWhyOpen] = useState(false);
  const hi = language === 'hi';

  const speechTextHi =
    `किसान भाई, ${location.panchayatName} में आपकी फसल ${selectedCrop} के लिए आज का मुख्य फैसला: अगले 24 घंटे में 12.4 मिलीमीटर बारिश की 84 प्रतिशत संभावना है, और जमीन के 40 सेंटीमीटर अंदर 31 प्रतिशत पर्याप्त नमी है। आज ट्यूबवेल बिल्कुल न चलाएं। इससे आपके लगभग ₹1,450 का डीजल और बिजली बचेगी।`;

  const speechTextEn =
    `Farmer Advisory for ${location.panchayatName}, crop ${selectedCrop}: 84% probability of 12.4 mm rainfall within 24 hours, with root-zone soil moisture adequate at 31%. Hold irrigation today to save approximately ₹1,450 in fuel and pumping costs.`;

  return (
    <div
      className="glass-panel-elevated"
      style={{
        padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
        borderRadius: 'var(--radius-xl)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        border: '2px solid #86efac',
        boxShadow: '0 20px 35px -10px rgba(5, 150, 105, 0.15)',
        position: 'relative'
      }}
    >
      {/* Top Banner Tag & Crop Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#059669',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em'
            }}
          >
            {hi ? 'आज आपके खेत के लिए मुख्य फैसला' : 'TODAY FIELD DECISION'}
          </span>
          <span className="badge badge-frozen">M1–M3 FROZEN PILOT</span>
        </div>

        {/* Quick Crop Selector Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CROPS.map((crop) => {
            const isSelected = selectedCrop === crop.id;
            return (
              <button
                key={crop.id}
                type="button"
                onClick={() => setSelectedCrop(crop.id)}
                style={{
                  border: isSelected ? '1.5px solid #059669' : '1px solid #cbd5e1',
                  background: isSelected ? '#ecfdf5' : '#ffffff',
                  color: isSelected ? '#047857' : 'var(--text-secondary)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 800 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sprout size={12} color={isSelected ? '#059669' : '#94a3b8'} />
                <span>{hi ? crop.nameHi : crop.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Decision Highlight Box */}
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

        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)', marginBottom: '4px' }}>
            {hi
              ? `अगले 24 घंटे में 12.4 मिमी बारिश की 84% संभावना है (${location.panchayatName})`
              : `84% probability of 12.4 mm rainfall in the next 24 hours (${location.panchayatName})`}
          </div>

          <h3
            style={{
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              color: '#b91c1c',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '8px'
            }}
          >
            {hi
              ? 'सिंचाई स्थगित रखें (ट्यूबवेल न चलाएं)'
              : 'Hold Irrigation (Do Not Pump Groundwater)'}
          </h3>

          <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {hi
              ? `जमीन के 40 सेमी अंदर जड़ों के पास 31.4% पर्याप्त नमी मौजूद है। आज पानी न देने से लगभग ₹1,450 का डीजल और बिजली खर्च बचेगा, तथा 40% भूजल संरक्षित रहेगा।`
              : `Root-zone soil moisture is sufficient at 31.4% VWC. Skipping irrigation today saves approximately ₹1,450 in pumping diesel/power, conserving 40% aquifer water.`}
          </p>
        </div>
      </div>

      {/* Speech Audio Button & Progressive Disclosure */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button
          type="button"
          onClick={() => speakText(hi ? speechTextHi : speechTextEn)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 22px',
            borderRadius: 'var(--radius-full)',
            background: isSpeaking ? '#dc2626' : '#059669',
            color: 'white',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
            transition: 'all 0.2s',
            minHeight: '44px'
          }}
        >
          <Volume2 size={20} />
          <span>{isSpeaking ? (hi ? 'आवाज़ बंद करें' : 'Stop Audio') : (hi ? 'सलाह सुनें (Hindi Voice)' : 'Listen to Advice (Audio)')}</span>
        </button>

        <button
          type="button"
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
          <span>{hi ? 'यह सलाह क्यों दी गई? (वैज्ञानिक कारण)' : 'Why this advice? (Causal Evidence)'}</span>
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
            marginTop: '1rem',
            animation: 'route-enter 0.3s ease'
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {hi ? 'वैज्ञानिक कारण एवं मॉडल साक्ष्य (Causal Telemetry):' : 'Scientific Causal Telemetry:'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.82rem' }}>
            <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #bae6fd' }}>
              <strong style={{ color: '#0369a1' }}>
                {hi ? '1. वर्षा मॉडल (M3):' : '1. Rainfall Model (M3):'}
              </strong>
              <div style={{ marginTop: '4px' }}>
                {hi ? '12.4 मिमी बारिश का 84% विश्वास अंतराल (1-किमी ग्रिड)।' : '12.4 mm rainfall predicted in 24h with 84% probability.'}
              </div>
            </div>
            <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #a7f3d0' }}>
              <strong style={{ color: '#047857' }}>
                {hi ? '2. मिट्टी नमी मॉडल (M2):' : '2. Soil Hydrology (M2):'}
              </strong>
              <div style={{ marginTop: '4px' }}>
                {hi ? 'जड़ क्षेत्र में 31.4% नमी (फील्ड क्षमता 34% के करीब)।' : 'Root-zone moisture is sufficient at 31.4% VWC.'}
              </div>
            </div>
            <div style={{ background: '#fffbeb', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #fde68a' }}>
              <strong style={{ color: '#b45309' }}>
                {hi ? '3. फसल जल मांग (M3 ETc):' : '3. Crop Water Demand (M3 ETc):'}
              </strong>
              <div style={{ marginTop: '4px' }}>
                {hi ? 'दैनिक वाष्पोत्सर्जन 5.8 मिमी/दिन (पर्याप्त मिट्टी नमी)।' : 'Daily evapotranspiration loss is 5.8 mm/day.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
