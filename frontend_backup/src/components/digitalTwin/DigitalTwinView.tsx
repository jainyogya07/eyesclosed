import React, { useState, useEffect } from 'react';
import { predictionProvider } from '../../providers';
import { DigitalTwinState, ScenarioResult } from '../../types/contracts';
import { Landscape3DScene } from './Landscape3DScene';
import { StatusBadge } from '../common/StatusBadge';
import {
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  TrendingUp,
  MapPin,
  Play,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const DigitalTwinView: React.FC = () => {
  const [twinState, setTwinState] = useState<DigitalTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  // 3 Primary Simulation Sliders
  const [rainOverride, setRainOverride] = useState<number>(0); // 0 to 80 mm
  const [tempOverride, setTempOverride] = useState<number>(0); // -2 to +5 °C
  const [canalHours, setCanalHours] = useState<number>(6); // 0 to 12 hours

  const [simResult, setSimResult] = useState<ScenarioResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await predictionProvider.getDigitalTwinState('0924001001');
      setTwinState(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleRunSimulation = async () => {
    setSimulating(true);
    const result = await predictionProvider.simulateScenario({
      panchayat_code: '0924001001',
      simulation_horizon_days: 3,
      rainfall_override_mm: rainOverride,
      temperature_override_c: tempOverride,
      canal_water_release_hours: canalHours
    });
    setSimResult(result);
    setSimulating(false);
  };

  const handleResetSimulation = () => {
    setRainOverride(0);
    setTempOverride(0);
    setCanalHours(6);
    setSimResult(null);
  };

  // Dynamic reaction calculation based on sliders
  const isFloodHazard = rainOverride > 35;
  const isHeatwave = tempOverride > 2.5;

  if (loading || !twinState) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Synthesizing 3D Panchayat Digital Twin environment...
      </div>
    );
  }

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem 1.5rem' }}>
      {/* Header with Prominent SIMULATION Badge */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <StatusBadge status="simulation" label="WHAT-IF PHYSICS SIMULATION" />
          <span className="badge badge-pilot">M1–M9 COMPOSITE TWIN</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={28} color="var(--color-quantum-violet)" />
              {twinState.panchayat_name} 3D Digital Twin
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Block: {twinState.block_name} • District: {twinState.district_name}, {twinState.state_name} • Cultivated Area: {twinState.total_cultivated_area_ha} Ha
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            STATE TIMESTAMP: {new Date(twinState.last_updated_utc).toLocaleTimeString()} UTC
          </div>
        </div>
      </div>

      {/* Main Grid: Left 3D Interactive Landscape, Right 3 Primary Controls & Impact HUD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 0.9fr)',
          gap: '1.75rem',
          alignItems: 'start'
        }}
      >
        {/* Left: Three.js Interactive 3D Canvas */}
        <div
          className="glass-panel-elevated"
          style={{
            position: 'relative',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: isFloodHazard ? '2px solid var(--color-hazard-crimson)' : '1.5px solid var(--border-card)',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Top Canvas Tag */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isFloodHazard ? '#ef4444' : '#10b981' }} />
            <span>3D INTERACTIVE TWIN (DRAG TO ROTATE)</span>
          </div>

          {/* 3D Scene */}
          <Landscape3DScene
            rainfall={rainOverride}
            temperature={tempOverride}
            canalHours={canalHours}
          />

          {/* Dynamic Bottom Status Bar inside Canvas */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              zIndex: 10,
              background: isFloodHazard
                ? 'rgba(220, 38, 38, 0.92)'
                : isHeatwave
                ? 'rgba(217, 119, 6, 0.92)'
                : 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            <div>
              {isFloodHazard ? (
                <span>⚠️ अत्यधिक वर्षा परिदृश्य: निचले पूर्वी खेतों में जलभराव</span>
              ) : isHeatwave ? (
                <span>☀️ उच्च तापमान तनाव: वाष्पीकरण (ET) दर में वृद्धि</span>
              ) : (
                <span>🌱 सामान्य परिदृश्य: जड़ क्षेत्र नमी एवं नहर प्रवाह संतुलित</span>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', opacity: 0.85 }}>
              RAIN: +{rainOverride}mm | TEMP: {tempOverride >= 0 ? `+${tempOverride}` : tempOverride}°C
            </div>
          </div>
        </div>

        {/* Right: Exactly 3 Primary Controls & Reaction Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            className="glass-panel-elevated"
            style={{
              padding: '24px',
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--border-card)'
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              सिमुलेशन नियंत्रण (3 Primary Controls)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              स्लाइडर बदलें — ऊपर 3D वातावरण और नीचे के निर्णय वास्तविक समय में बदलेंगे।
            </p>

            {/* CONTROL 1: RAINFALL OVERRIDE */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudRain size={16} color="var(--color-atmosphere-blue)" />
                  1. अप्रत्याशित वर्षा (Rainfall):
                </span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-atmosphere-blue)' }}>
                  +{rainOverride} mm
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={rainOverride}
                onChange={(e) => setRainOverride(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-atmosphere-blue)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>0 mm (Normal)</span>
                <span>+40 mm (Heavy)</span>
                <span>+80 mm (Extreme)</span>
              </div>
            </div>

            {/* CONTROL 2: TEMPERATURE OVERRIDE */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={16} color="var(--color-solar-amber)" />
                  2. तापमान विचलन (Temperature):
                </span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-solar-amber)' }}>
                  {tempOverride >= 0 ? `+${tempOverride}` : tempOverride}°C
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="5"
                step="0.5"
                value={tempOverride}
                onChange={(e) => setTempOverride(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-solar-amber)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>-2°C (Cooling)</span>
                <span>0°C</span>
                <span>+5°C (Heatwave)</span>
              </div>
            </div>

            {/* CONTROL 3: CANAL WATER RELEASE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={16} color="var(--color-earth-emerald)" />
                  3. नहर जल निकासी (Canal Release):
                </span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-earth-emerald)' }}>
                  {canalHours} घंटे (Hours)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={canalHours}
                onChange={(e) => setCanalHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-earth-emerald)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <span>0h (Closed)</span>
                <span>6h (Normal)</span>
                <span>12h (Full Outflow)</span>
              </div>
            </div>

            {/* Run / Reset Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleRunSimulation}
                disabled={simulating}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--color-quantum-violet)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <Play size={16} />
                {simulating ? 'Calculating Physics...' : 'Run Scenario Physics'}
              </button>

              <button
                onClick={handleResetSimulation}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-card)',
                  background: 'white',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
                title="Reset to baseline"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* SIMULATION RESULT & DECISION UPDATE */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-xl)',
              background: isFloodHazard ? 'var(--color-hazard-subtle)' : '#f8fafc',
              border: isFloodHazard ? '1.5px solid var(--color-hazard-light)' : '1px solid var(--border-card)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              RESULTING SIMULATION ADVISORY
            </div>

            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isFloodHazard ? 'var(--color-hazard-crimson)' : 'var(--text-primary)', marginBottom: '6px' }}>
              {isFloodHazard
                ? '🚨 सिंचाई पूर्णतः निषिद्ध — जल निकासी खोलें'
                : isHeatwave
                ? '⚠️ अतिरिक्त सिंचाई आवश्यक — उच्च वाष्पीकरण'
                : '🟢 मानक कृषि चक्र अनुशंसित'}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {isFloodHazard
                ? `+{rainOverride}mm अप्रत्याशित वर्षा से मिट्टी की नमी 44% पहुंच जाएगी। नहर के गेट तुरंत खोलें ताकि पानी जमा न हो।`
                : isHeatwave
                ? `+${tempOverride}°C से मिट्टी की नमी तेजी से घटेगी। शाम के समय हल्की सिंचाई करें।`
                : `वर्तमान परिदृश्य में फसल स्वस्थ है और किसी आपातकालीन हस्तक्षेप की आवश्यकता नहीं है।`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
