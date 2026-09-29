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

  const isFloodHazard = rainOverride > 35;
  const isHeatwave = tempOverride > 2.5;

  if (loading || !twinState) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--farmora-platinum)' }}>
        Synthesizing 3D Panchayat Digital Twin environment...
      </div>
    );
  }

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 5rem 1.5rem' }}>
      {/* Header with Farmora Badge */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="simulation" label="WHAT-IF PHYSICS SIMULATION" />
          <span className="badge badge-pilot">M1–M9 COMPOSITE TWIN</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={28} color="var(--farmora-lime)" />
              {twinState.panchayat_name} 3D Digital Twin
            </h1>
            <p style={{ color: 'var(--farmora-platinum)', fontSize: '0.95rem' }}>
              Block: {twinState.block_name} • District: {twinState.district_name}, {twinState.state_name} • Cultivated Area: {twinState.total_cultivated_area_ha} Ha
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
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
          className="farmora-glass-elevated"
          style={{
            position: 'relative',
            background: '#0C0D05',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: isFloodHazard ? '2px solid #ef4444' : '1.5px solid rgba(182, 178, 67, 0.35)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Top Canvas Tag */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              zIndex: 10,
              background: 'rgba(12, 13, 5, 0.85)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.74rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--farmora-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(182, 178, 67, 0.3)'
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isFloodHazard ? '#ef4444' : '#B6B243', boxShadow: `0 0 6px ${isFloodHazard ? '#ef4444' : '#B6B243'}` }} />
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
                ? 'rgba(220, 38, 38, 0.9)'
                : isHeatwave
                ? 'rgba(152, 105, 36, 0.9)'
                : 'rgba(22, 24, 10, 0.9)',
              backdropFilter: 'blur(10px)',
              color: 'var(--farmora-light)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: '1px solid rgba(182, 178, 67, 0.25)'
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
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
              RAIN: +{rainOverride}mm | TEMP: {tempOverride >= 0 ? `+${tempOverride}` : tempOverride}°C
            </div>
          </div>
        </div>

        {/* Right: Exactly 3 Primary Controls & Reaction Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            className="farmora-glass-elevated"
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-xl)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '4px' }}>
              सिमुलेशन नियंत्रण (3 Primary Controls)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--farmora-platinum)', marginBottom: '1.25rem' }}>
              स्लाइडर बदलें — ऊपर 3D वातावरण और नीचे के निर्णय वास्तविक समय में बदलेंगे।
            </p>

            {/* CONTROL 1: RAINFALL OVERRIDE */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudRain size={16} color="var(--farmora-lime)" />
                  1. अप्रत्याशित वर्षा (Rainfall):
                </span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--farmora-lime)' }}>
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
                style={{ width: '100%', accentColor: 'var(--farmora-lime)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--farmora-platinum)' }}>
                <span>0 mm (Normal)</span>
                <span>+40 mm (Heavy)</span>
                <span>+80 mm (Extreme)</span>
              </div>
            </div>

            {/* CONTROL 2: TEMPERATURE OVERRIDE */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={16} color="var(--farmora-wheat)" />
                  2. तापमान विचलन (Temperature):
                </span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--farmora-wheat)' }}>
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
                style={{ width: '100%', accentColor: 'var(--farmora-wheat)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--farmora-platinum)' }}>
                <span>-2°C (Cooling)</span>
                <span>0°C</span>
                <span>+5°C (Extreme Heat)</span>
              </div>
            </div>

            {/* CONTROL 3: CANAL WATER RELEASE */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={16} color="#38bdf8" />
                  3. नहर जल आपूर्ति (Canal Hours):
                </span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                  {canalHours} hrs / day
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={canalHours}
                onChange={(e) => setCanalHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--farmora-platinum)' }}>
                <span>0 hrs (No release)</span>
                <span>6 hrs (Normal)</span>
                <span>12 hrs (Maximum)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleRunSimulation}
                disabled={simulating}
                className="farmora-btn-primary"
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Play size={16} />
                <span>{simulating ? 'Calculating...' : 'Run What-If Simulation'}</span>
              </button>

              <button
                onClick={handleResetSimulation}
                className="farmora-btn-secondary"
                style={{
                  padding: '12px 16px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <RotateCcw size={16} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Impact Reaction Card */}
          {simResult && (
            <div
              className="farmora-glass-elevated"
              style={{
                padding: '20px',
                borderRadius: 'var(--radius-xl)',
                border: '1.5px solid rgba(182, 178, 67, 0.45)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-frozen">SIMULATION OUTCOME</span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '8px' }}>
                {simResult.impact_summary.verdict}
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem', marginTop: '10px' }}>
                <div style={{ background: 'rgba(12, 13, 5, 0.7)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
                  <div style={{ color: 'var(--farmora-platinum)', fontSize: '0.7rem' }}>ESTIMATED WATER BALANCE</div>
                  <div style={{ color: 'var(--farmora-lime)', fontWeight: 800, fontSize: '1.1rem' }}>
                    {simResult.simulated.recommended_irrigation_mm - simResult.baseline.recommended_irrigation_mm >= 0 ? `+${simResult.simulated.recommended_irrigation_mm - simResult.baseline.recommended_irrigation_mm}` : simResult.simulated.recommended_irrigation_mm - simResult.baseline.recommended_irrigation_mm} mm
                  </div>
                </div>

                <div style={{ background: 'rgba(12, 13, 5, 0.7)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(182, 178, 67, 0.2)' }}>
                  <div style={{ color: 'var(--farmora-platinum)', fontSize: '0.7rem' }}>ECONOMIC RISK DELTA</div>
                  <div style={{ color: simResult.impact_summary.economic_risk_delta_inr <= 0 ? '#10b981' : '#f87171', fontWeight: 800, fontSize: '1.1rem' }}>
                    ₹{simResult.impact_summary.economic_risk_delta_inr}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
