import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import {
  Sliders,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Droplets,
  Thermometer,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DigitalTwinSandbox: React.FC = () => {
  const { language, location, selectedCrop } = useApp();
  const hi = language !== 'en';

  const [rainOverride, setRainOverride] = useState<number>(12);
  const [tempOverride, setTempOverride] = useState<number>(0);
  const [canalHours, setCanalHours] = useState<number>(6);

  // Dynamic simulation feedback based on sliders
  const simulatedMoisture = Math.min(42, Math.max(18, +(31.4 + (rainOverride * 0.45) - (tempOverride * 0.8) + (canalHours * 0.25)).toFixed(1)));
  const recommendedIrrigation = simulatedMoisture >= 30 ? 0 : +(30 - simulatedMoisture).toFixed(1);
  const fuelSavingsInr = recommendedIrrigation === 0 ? Math.round(1450 + (rainOverride * 15)) : 0;
  const pondingRisk = rainOverride > 25 ? (hi ? 'उच्च जोखिम (जलभराव संभावना)' : 'High Risk') : rainOverride > 15 ? (hi ? 'मध्यम जोखिम' : 'Moderate Risk') : (hi ? 'सामान्य (कम जोखिम)' : 'Low Risk');

  const handleReset = () => {
    setRainOverride(12);
    setTempOverride(0);
    setCanalHours(6);
  };

  return (
    <section className="digital-twin-sandbox-section" style={{ margin: '3.5rem 0' }}>
      <div className="plantiq-container">
        <div
          className="glass-panel-elevated"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#f8fafc',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(1.5rem, 3.5vw, 3rem)',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle grid background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
              pointerEvents: 'none'
            }}
          />

          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: '#7c3aed',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sliders size={13} /> {hi ? 'डिजिटल ट्विन सैंडबॉक्स' : 'Interactive Digital Twin Sandbox'}
                </span>
                <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  REAL-TIME SIMULATION
                </span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#ffffff', margin: '4px 0 6px' }}>
                {hi ? <>कृषि परिदृश्य <em>सिम्युलेटर</em></> : <>What-If <em>Agricultural Scenario Simulator</em></>}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '650px', lineHeight: 1.5 }}>
                {hi
                  ? 'मौसम और नहर के पानी में बदलाव करके देखें कि आपकी मिट्टी की नमी, सिंचाई आवश्यकता और किसान के खर्च पर क्या प्रभाव पड़ता है।'
                  : 'Adjust rainfall anomalies, temperature perturbations, and canal releases to test soil resilience and compute real-time economic savings.'}
              </p>
            </div>

            <Link
              to="/digital-twin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)'
              }}
            >
              <span>{hi ? 'पूरा GIS मानचित्र देखें' : 'Launch Full GIS Twin'}</span>
              <ExternalLink size={15} />
            </Link>
          </div>

          {/* Sandbox Main 2-Column Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              position: 'relative',
              zIndex: 1
            }}
          >
            {/* Left: Interactive Controls */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
                  {hi ? 'परिदृश्य नियंत्रण' : 'Scenario Control Inputs'}
                </span>
                <button
                  onClick={handleReset}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RotateCcw size={13} /> {hi ? 'रीसेट' : 'Reset'}
                </button>
              </div>

              {/* Slider 1: Rain Override */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: '#93c5fd' }}>🌧️ {hi ? 'वर्षा बदलाव' : 'Rainfall Override'}</span>
                  <span style={{ fontWeight: 800, color: '#38bdf8' }}>{rainOverride} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={rainOverride}
                  onChange={(e) => setRainOverride(+e.target.value)}
                  style={{ width: '100%', accentColor: '#38bdf8' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>{hi ? '0 मिमी (सूखा)' : '0 mm (Dry)'}</span>
                  <span>25 mm</span>
                  <span>{hi ? '50 मिमी (भारी वर्षा)' : '50 mm (Heavy)'}</span>
                </div>
              </div>

              {/* Slider 2: Temperature Override */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: '#fde047' }}>🌡️ {hi ? 'तापमान बदलाव' : 'Temperature Delta'}</span>
                  <span style={{ fontWeight: 800, color: '#facc15' }}>{tempOverride > 0 ? `+${tempOverride}` : tempOverride}°C</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={tempOverride}
                  onChange={(e) => setTempOverride(+e.target.value)}
                  style={{ width: '100%', accentColor: '#facc15' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>{hi ? '-5°C (शीतलहर)' : '-5°C (Cold snap)'}</span>
                  <span>{hi ? '0°C (सामान्य)' : '0°C (Normal)'}</span>
                  <span>{hi ? '+5°C (लू)' : '+5°C (Heatwave)'}</span>
                </div>
              </div>

              {/* Slider 3: Canal Water Hours */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <span style={{ color: '#6ee7b7' }}>💧 {hi ? 'नहर जल आपूर्ति' : 'Canal Water Release'}</span>
                  <span style={{ fontWeight: 800, color: '#34d399' }}>{canalHours} {hi ? 'घंटे' : 'hrs'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="1"
                  value={canalHours}
                  onChange={(e) => setCanalHours(+e.target.value)}
                  style={{ width: '100%', accentColor: '#34d399' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>{hi ? '0 घंटे (बंद)' : '0 hrs (Closed)'}</span>
                  <span>{hi ? '12 घंटे' : '12 hrs'}</span>
                  <span>{hi ? '24 घंटे (पूर्ण प्रवाह)' : '24 hrs (Full flow)'}</span>
                </div>
              </div>
            </div>

            {/* Right: Instant Simulation Impact */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '1rem' }}>
                  {hi ? 'सिम्युलेटेड प्रभाव एवं वैज्ञानिक परिणाम' : 'Simulated Impact & Scientific Response'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  {/* Root Zone Moisture Metric */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      {hi ? 'जड़ क्षेत्र नमी' : 'Root-Zone Moisture'}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: simulatedMoisture >= 30 ? '#34d399' : '#f87171', margin: '2px 0' }}>
                      {simulatedMoisture}%
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {hi ? 'संतृप्ति सीमा: 34%' : 'Field Capacity: 34%'}
                    </div>
                  </div>

                  {/* Recommended Irrigation mm */}
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                      {hi ? 'अनुशंसित सिंचाई' : 'Recommended Irrigation'}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: recommendedIrrigation === 0 ? '#38bdf8' : '#fbbf24', margin: '2px 0' }}>
                      {recommendedIrrigation} mm
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {recommendedIrrigation === 0 ? (hi ? 'ट्यूबवेल बंद रखें' : 'Pumps Off') : (hi ? 'सिंचाई आवश्यक' : 'Irrigate')}
                    </div>
                  </div>
                </div>

                {/* Verdict Banner */}
                <div
                  style={{
                    background: recommendedIrrigation === 0 ? 'rgba(5, 150, 105, 0.2)' : 'rgba(217, 119, 6, 0.2)',
                    border: recommendedIrrigation === 0 ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: recommendedIrrigation === 0 ? '#34d399' : '#fcd34d' }}>
                    <CheckCircle size={18} />
                    <span>
                      {recommendedIrrigation === 0
                        ? (hi ? 'निर्णय: ट्यूबवेल न चलाएं — 100% जल संरक्षण' : 'Verdict: Hold Pumping — 100% Water Conserved')
                        : (hi ? 'निर्णय: सीमित सिंचाई (टपक या स्प्रिंकलर से)' : 'Verdict: Controlled Micro-Irrigation Advised')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
                    {hi
                      ? `जलभराव जोखिम: ${pondingRisk} • फसल: ${selectedCrop}`
                      : `Inundation risk: ${pondingRisk} • Crop: ${selectedCrop}`}
                  </div>
                </div>
              </div>

              {/* Economic Savings Bar */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {hi ? 'अनुमानित बचत (डीजल व बिजली):' : 'Estimated Energy/Fuel Savings:'}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>
                  +₹{fuelSavingsInr} / {hi ? 'एकड़' : 'acre'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
