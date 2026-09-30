import React, { useState } from 'react';
import { useFarm, PILOT_PANCHAYATS_CATALOG } from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CloudRain,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Droplets,
  Sprout,
  ArrowRight,
  Sparkles,
  Info,
  RotateCcw,
  Volume2
} from 'lucide-react';

type RainfallScenario = -40 | -20 | 0 | 20 | 40;
type TempScenario = 0 | 1 | 2 | 3;
type MonsoonScenario = 0 | 15 | 30; // days late

export const ScenarioPage: React.FC = () => {
  const { farm, playVoice } = useFarm();
  const { language } = useApp();
  const navigate = useNavigate();
  const en = language === 'en';

  const [rainScenario, setRainScenario] = useState<RainfallScenario>(0);
  const [tempScenario, setTempScenario] = useState<TempScenario>(0);
  const [monsoonScenario, setMonsoonScenario] = useState<MonsoonScenario>(0);

  // Compute impacts based on climate inputs
  const isDeficitRain = rainScenario < 0;
  const isExcessRain = rainScenario > 0;
  const isHighHeat = tempScenario >= 2;
  const isLateMonsoon = monsoonScenario > 0;

  // Paddy dynamics
  let paddyStatusEn = 'Optimal Growth';
  let paddyStatusHi = 'अनुकूल स्थिति';
  let paddyStressPct = 25;
  let paddyIrrigationCostMultiplier = 1.0;

  if (rainScenario === -40) {
    paddyStatusEn = 'Severe Water Deficit';
    paddyStatusHi = 'गंभीर जल संकट';
    paddyStressPct = 85;
    paddyIrrigationCostMultiplier = 1.75;
  } else if (rainScenario === -20) {
    paddyStressPct = 60;
    paddyIrrigationCostMultiplier = 1.35;
    paddyStatusEn = 'Sub-optimal Moisture';
    paddyStatusHi = 'नमी की कमी';
  } else if (rainScenario === 40) {
    paddyStatusEn = 'Root Zone Waterlogging';
    paddyStatusHi = 'जड़ों में जलभराव';
    paddyStressPct = 55;
  }

  if (isHighHeat) {
    paddyStressPct = Math.min(100, paddyStressPct + 20);
  }
  if (isLateMonsoon) {
    paddyStressPct = Math.min(100, paddyStressPct + 15);
  }

  // Bajra dynamics (Millet thrives under deficit)
  let bajraSuitability = 92;
  if (rainScenario < 0) bajraSuitability = 96;
  if (tempScenario >= 3) bajraSuitability = 82;

  // Moong dynamics (Short duration pulse)
  let moongSuitability = 88;
  if (monsoonScenario >= 15) moongSuitability = 94;
  if (rainScenario === 40) moongSuitability = 65;

  const handleReset = () => {
    setRainScenario(0);
    setTempScenario(0);
    setMonsoonScenario(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.25rem 1rem 4rem' }}
    >
      {/* Page Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '20px 24px',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  letterSpacing: '0.04em'
                }}
              >
                SCENARIO SIMULATION LAB
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {en
                  ? 'Interactive climate stress testing for informed planning'
                  : 'Exact future prediction nahi — possible climate scenarios ka impact'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 800, margin: '0 0 4px 0' }}>
              {en ? 'What If Future Climate Scenarios Shift?' : 'कल का मौसम बदले तो फसल का क्या होगा?'}
            </h1>
            <p style={{ color: '#475569', fontSize: '0.86rem', margin: 0, maxWidth: '820px' }}>
              {en
                ? 'Simulate delayed monsoon onsets, 20–40% rainfall deficits, or +2°C heat anomalies to see live impacts on crop stress and evaluate resilient alternatives.'
                : 'यदि मानसून 15-30 दिन देरी से आए, वर्षा 20-40% कम हो या तापमान 2°C बढ़ जाए — तो क्या आपकी मौजूदा फसल बच पाएगी? नीचे स्लाइडर बदलें और लाइव प्रभाव देखें।'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              color: '#334155',
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <RotateCcw size={13} />
            <span>{en ? 'Reset to Baseline' : 'रीसेट करें'}</span>
          </button>
        </div>
      </div>

      {/* CLIMATE SCENARIO INTERACTIVE CONTROLS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        {/* Control 1: Rainfall */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            borderRadius: '14px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <CloudRain size={18} color="#0284c7" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {en ? 'Rainfall Shift' : 'वर्षा परिदृश्य (Rainfall)'}
            </h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '10px' }}>
            {([-40, -20, 0, 20, 40] as RainfallScenario[]).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRainScenario(val)}
                style={{
                  flex: 1,
                  padding: '6px 2px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: rainScenario === val ? '#0284c7' : '#f1f5f9',
                  color: rainScenario === val ? '#ffffff' : '#334155',
                  transition: 'all 0.15s ease'
                }}
              >
                {val === 0 ? 'NORMAL' : val > 0 ? `+${val}%` : `${val}%`}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {rainScenario === 0
              ? (en ? 'Normal seasonal rainfall (~850 mm)' : 'वर्तमान मौसमी वर्षा (~850 मिमी सामान्य)')
              : rainScenario < 0
              ? (en
                  ? `Drought Risk: High tubewell pumping needed (-${Math.abs(rainScenario)}%)`
                  : `सूखा जोखिम: भूजल स्तर पर दबाव (-${Math.abs(rainScenario)}%)`)
              : (en
                  ? `Excess Rain: Low-lying sector drainage needed (+${rainScenario}%)`
                  : `अतिवृष्टि: निचले खेतों में जलभराव (+${rainScenario}%)`)}
          </div>
        </div>

        {/* Control 2: Temperature */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            borderRadius: '14px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Thermometer size={18} color="#ea580c" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {en ? 'Temperature Anomaly' : 'तापमान वृद्धि (Temperature)'}
            </h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '10px' }}>
            {([0, 1, 2, 3] as TempScenario[]).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setTempScenario(val)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: tempScenario === val ? '#ea580c' : '#f1f5f9',
                  color: tempScenario === val ? '#ffffff' : '#334155',
                  transition: 'all 0.15s ease'
                }}
              >
                {val === 0 ? 'NORMAL' : `+${val}°C`}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {tempScenario === 0
              ? (en ? 'Mean ambient baseline (31–33°C)' : 'मौसमी औसत तापमान (31–33°C)')
              : tempScenario === 1
              ? (en ? 'Evapotranspiration increases by 6%' : 'वाष्पीकरण (ET0) 6% बढ़ जाएगा')
              : tempScenario === 2
              ? (en ? 'Moderate flowering heat stress' : 'पुष्पन पर हीट स्ट्रेस; पराग बांझपन का खतरा')
              : (en ? 'Severe terminal heat; 18% yield loss potential' : 'अत्यधिक लू; 18% उपज गिरावट संभव')}
          </div>
        </div>

        {/* Control 3: Monsoon */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(10px)',
            borderRadius: '14px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Calendar size={18} color="#059669" />
            <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {en ? 'Monsoon Onset Timing' : 'मानसून आगमन (Timing)'}
            </h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', marginBottom: '10px' }}>
            {([0, 15, 30] as MonsoonScenario[]).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMonsoonScenario(val)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  background: monsoonScenario === val ? '#059669' : '#f1f5f9',
                  color: monsoonScenario === val ? '#ffffff' : '#334155',
                  transition: 'all 0.15s ease'
                }}
              >
                {val === 0 ? (en ? 'On-Time' : 'समय पर') : `${val} ${en ? 'Days Late' : 'दिन देरी'}`}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {monsoonScenario === 0
              ? (en ? 'Normal June 25 onset' : 'सामान्य 25 जून तक आगमन')
              : monsoonScenario === 15
              ? (en ? 'Transplanting delayed; switch to short-cycle pulses' : 'रोपाई में विलंब, मूंग/बाजरा का चयन उचित')
              : (en ? 'Nursery desiccation risk; emergency contingency pulse' : 'धान नर्सरी सूखने का जोखिम; तत्काल दलहन चुनें')}
          </div>
        </div>
      </div>

      {/* LIVE SIMULATION OUTPUT: IMPACT ON PADDY */}
      <div
        style={{
          background: paddyStressPct > 50 ? 'rgba(255, 251, 235, 0.95)' : 'rgba(240, 253, 244, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: `1.5px solid ${paddyStressPct > 50 ? '#fde68a' : '#bbf7d0'}`,
          padding: '20px 24px',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
          <div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: paddyStressPct > 50 ? '#b45309' : '#047857',
                letterSpacing: '0.04em'
              }}
            >
              SIMULATED CROP IMPACT
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
              {en ? 'Projected Impact on Basmati Paddy' : 'धान (बासमती) पर इस जलवायु परिदृश्य का असर'}
            </h2>
          </div>

          <div
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              background: paddyStressPct > 50 ? '#fee2e2' : '#dcfce7',
              color: paddyStressPct > 50 ? '#b91c1c' : '#15803d',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}
          >
            {en ? `${paddyStatusEn} (${paddyStressPct}% Stress)` : `${paddyStatusHi} (${paddyStressPct}% तनाव)`}
          </div>
        </div>

        {/* Telemetry Progress */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '4px', color: '#334155' }}>
            <span>{en ? 'Crop Moisture Deficit Stress' : 'समग्र फसल तनाव (Crop Stress)'}</span>
            <strong>{paddyStressPct}%</strong>
          </div>
          <div style={{ height: '7px', width: '100%', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${paddyStressPct}%`,
                background: paddyStressPct > 65 ? '#ef4444' : paddyStressPct > 40 ? '#f59e0b' : '#10b981',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '0.8rem' }}>
          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '3px' }}>
              {en ? '💧 Tubewell Pumping Energy' : '💧 नलकूप सिंचाई लागत'}
            </strong>
            <span style={{ color: paddyIrrigationCostMultiplier > 1 ? '#dc2626' : '#059669', fontWeight: 700 }}>
              {paddyIrrigationCostMultiplier > 1
                ? (en ? `+${Math.round((paddyIrrigationCostMultiplier - 1) * 100)}% Surge in Pumping Cost` : `+${Math.round((paddyIrrigationCostMultiplier - 1) * 100)}% बिजली/डीजल खर्च वृद्धि`)
                : (en ? 'Normal pumping cost' : 'सामान्य जल लागत')}
            </span>
          </div>

          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '3px' }}>
              {en ? '🌡 Evaporation Rate' : '🌡 वाष्पीकरण प्रभाव'}
            </strong>
            <span>
              {tempScenario === 0
                ? (en ? 'Normal baseline evaporation' : 'तापमान सामान्य सीमा में')
                : (en ? `At +${tempScenario}°C, root moisture depletes 2.4x faster` : `+${tempScenario}°C में मिट्टी नमी 2.4 गुना तेजी से सूखेगी`)}
            </span>
          </div>

          <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '3px' }}>
              {en ? '🌾 Yield At Risk' : '🌾 उपज जोखिम'}
            </strong>
            <span style={{ color: paddyStressPct > 50 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
              {paddyStressPct > 60
                ? (en ? '15–25% Yield Reduction Hazard' : '15–25% उपज में कमी का अंदेशा')
                : (en ? 'Stable under moderate mitigation' : 'उपज सुरक्षित')}
            </span>
          </div>
        </div>
      </div>

      {/* CLIMATE RESILIENT ALTERNATIVE CROPS */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '20px 24px',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
              {en ? 'Recommended Climate-Resilient Alternatives' : 'इस परिदृश्य में सुरक्षित वैकल्पिक फसलें'}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
              {en
                ? 'Under severe deficit or late arrival, these crops require minimal water and secure farm income.'
                : 'यदि सूखा या मानसून में देरी होती है, तो नुकसान से बचने के लिए ये फसलें सर्वाधिक उपयुक्त हैं।'}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              playVoice(
                en
                  ? `Under a 20 to 40 percent rainfall deficit, tubewell pumping costs jump by 45 percent for Paddy. Switching to Bajra and Moong protects farm income.`
                  : `यदि वर्षा बीस या चालीस प्रतिशत कम होती है, तो धान की सिंचाई लागत पैंतालीस प्रतिशत बढ़ जाएगी। ऐसे में बाजरा और मूंग लगाना सबसे समझदारी भरा निर्णय होगा।`
              )
            }
            style={{
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Volume2 size={14} />
            <span>{en ? 'Listen Audio' : '🔊 विश्लेषण सुनें'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {/* Bajra */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🌾 {en ? 'Bajra (Pearl Millet)' : 'बाजरा (Bajra)'}
              </h4>
              <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
                {bajraSuitability}% {en ? 'Fit' : 'उपयुक्त'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, marginBottom: '8px' }}>
              {en
                ? 'Thrives under low rain (350mm). Tolerates temperatures up to 38°C without yield loss.'
                : 'कम पानी (350 मिमी) में भी सफल। तापमान 38°C तक आसानी से सहन कर सकता है।'}
            </p>
            <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
              ✓ {en ? 'Saves up to 70% tubewell power' : 'नलकूप बिजली खर्च में 70% तक बचत'}
            </div>
          </div>

          {/* Moong */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🌱 {en ? 'Moong (Green Gram)' : 'मूंग (Moong)'}
              </h4>
              <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
                {moongSuitability}% {en ? 'Fit' : 'उपयुक्त'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, marginBottom: '8px' }}>
              {en
                ? 'Matures in just 60–65 days. Fastest recovery crop if monsoon arrival is delayed by 15–30 days.'
                : 'मात्र 60–65 दिन में तैयार। मानसून में 15–30 दिन देरी होने पर सबसे तेज रिकवरी देने वाली फसल।'}
            </p>
            <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
              ✓ {en ? 'Fixes soil nitrogen + high market value' : 'मिट्टी में नाइट्रोजन फिक्सेशन + उच्च बाजार भाव'}
            </div>
          </div>

          {/* Groundnut */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🥜 {en ? 'Groundnut (Peanut)' : 'मूंगफली (Groundnut)'}
              </h4>
              <span style={{ background: '#fffbeb', color: '#92400e', fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px', borderRadius: '999px' }}>
                78% {en ? 'Fit' : 'उपयुक्त'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, marginBottom: '8px' }}>
              {en
                ? 'Moderate water requirement (550mm) in light sandy loam with strong cash crop returns.'
                : 'हल्की दोमट मिट्टी में मध्यम जल मांग (550 मिमी) के साथ अच्छा नकदी विकल्प।'}
            </p>
            <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>
              ⚠ {en ? 'Requires well-drained field' : 'भारी बारिश में जलभराव से बचाव आवश्यक'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <button
            type="button"
            onClick={() => navigate('/crops')}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '9px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>{en ? 'Explore Full Crop Matrix' : 'सभी फसलों की उपयुक्तता देखें'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
