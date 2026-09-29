import React, { useState, useEffect } from 'react';
import { predictionProvider } from '../../providers';
import { DigitalTwinState, ScenarioResult } from '../../types/contracts';
import {
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  Activity,
  Sliders,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const DigitalTwinView: React.FC = () => {
  const { language } = useApp();
  const hi = language === 'hi';
  const [twinState, setTwinState] = useState<DigitalTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  // Scenario Simulator Inputs
  const [rainOverride, setRainOverride] = useState<number>(0);
  const [tempOverride, setTempOverride] = useState<number>(0);
  const [canalHours, setCanalHours] = useState<number>(6);
  const [simResult, setSimResult] = useState<ScenarioResult | null>(null);
  const [simulating, setSimulating] = useState(false);

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

  if (loading || !twinState) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Synthesizing Panchayat Digital Twin state...
      </div>
    );
  }

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Title & Panchayat Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Panchayat Digital Twin</span>
          <span className="badge" style={{ background: 'rgba(217, 119, 6, 0.1)', color: '#b45309', border: '1px solid rgba(217, 119, 6, 0.3)', fontWeight: 700 }}>
            PILOT DATA + SIMULATED SCENARIO
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={28} color="var(--color-atmosphere-blue)" />
              {twinState.panchayat_name}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Block: {twinState.block_name} • District: {twinState.district_name}, {twinState.state_name} • Cultivated Area: {twinState.total_cultivated_area_ha} Ha ({twinState.active_farmers_count} registered plots)
            </p>
          </div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            STATE TIMESTAMP: {new Date(twinState.last_updated_utc).toLocaleTimeString()} UTC
          </div>
        </div>
      </div>

      {/* Layer State Cards Grid (M1 to M9 Synthesized State) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem'
        }}
      >
        {/* Layer 1: Weather (M1 & M2) */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {hi ? 'मौसम (M1/M2)' : 'WEATHER (M1/M2)'}
            </span>
            <span className="badge badge-frozen" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>FROZEN PILOT</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {twinState.weather.prediction.temperature_c}°C
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hi ? 'अनुमानित 90% सीमा' : 'Nominal 90% Interval'}: [{twinState.weather.uncertainty.lower_bound}°–{twinState.weather.uncertainty.upper_bound}°C]
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-earth-emerald)', fontWeight: 600, marginTop: '2px' }}>
            {hi ? 'नमी' : 'RH'}: {twinState.weather.prediction.relative_humidity_pct}% • {hi ? 'हवा' : 'Wind'}: {twinState.weather.prediction.wind_speed_ms} m/s
          </div>
        </div>

        {/* Layer 2: Precipitation (M3) */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {hi ? 'वर्षा (M3)' : 'PRECIPITATION (M3)'}
            </span>
            <span className="badge badge-frozen" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>FROZEN PILOT</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
            {twinState.precipitation.prediction.expected_rainfall_mm} mm
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hi ? 'वर्षा संभावना' : 'Rain Probability'}: <strong>{(twinState.precipitation.prediction.rain_probability * 100).toFixed(0)}%</strong>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-solar-amber)', fontWeight: 600, marginTop: '2px' }}>
            {hi ? 'तीव्रता' : 'Intensity'}: {twinState.precipitation.prediction.intensity_category}
          </div>
        </div>

        {/* Layer 3: Soil Moisture (M4) */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {hi ? 'मिट्टी नमी (M4)' : 'SOIL MOISTURE (M4)'}
            </span>
            <span className="badge" style={{ fontSize: '0.62rem', padding: '2px 6px', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
              Simulation / Prototype
            </span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-earth-emerald)' }}>
            {twinState.soil.prediction.root_zone_sm_vwc_pct}% VWC
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hi ? 'जड़ क्षेत्र (40 सेमी गहराई)' : 'Root Zone (40cm depth)'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {hi ? 'सतह 5 सेमी' : 'Surface 5cm'}: {twinState.soil.prediction.surface_sm_vwc_pct}% VWC
          </div>
        </div>

        {/* Layer 4: Crop Phenology (M5) */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {hi ? 'फसल अवस्था (M5)' : 'CROP STAGE (M5)'}
            </span>
            <span className="badge" style={{ fontSize: '0.62rem', padding: '2px 6px', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
              Simulation / Prototype
            </span>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {twinState.crop.prediction.phenology_stage.replace('_', ' ')}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {twinState.crop.prediction.crop_name}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-earth-emerald)', fontWeight: 600, marginTop: '2px' }}>
            GDD: {twinState.crop.prediction.accumulated_gdd.toFixed(0)} / {twinState.crop.prediction.target_maturity_gdd}
          </div>
        </div>

        {/* Layer 5: Hazard State (M8/M9) */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {hi ? 'जोखिम स्थिति (M8/M9)' : 'HAZARD STATUS (M8/M9)'}
            </span>
            <span className="badge" style={{ fontSize: '0.62rem', padding: '2px 6px', background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
              Simulation / Prototype
            </span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-earth-emerald)' }}>
            {hi ? 'सुरक्षित (हरा)' : 'STABLE (GREEN)'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {hi ? 'बाढ़ जोखिम' : 'Flood Risk'}: <strong>{twinState.flood.prediction.risk_level}</strong> ({(twinState.flood.prediction.inundation_probability * 100).toFixed(0)}%)
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {hi ? 'निकासी समय' : 'Drainage time'}: {twinState.flood.prediction.waterlogging_drainage_time_hours}h
          </div>
        </div>
      </div>

      {/* Interactive What-If Scenario Sandbox */}
      <div
        className="glass-panel-elevated"
        style={{
          padding: '2rem',
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(248, 250, 252, 0.8) 100%)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-quantum-violet)', fontWeight: 700, fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              <Sliders size={16} />
              {hi ? 'डिजिटल ट्विन परिदृश्य सिम्युलेटर' : 'WHAT-IF DIGITAL TWIN SCENARIO SIMULATOR'}
            </div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
              {hi ? 'पर्यावरणीय बदलावों का तनाव परीक्षण' : 'Stress-Test Environmental Perturbations'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {hi
                ? 'भारी वर्षा, लू अथवा नहर में पानी की कमी होने से पहले ही सिम्युलेट करके खेत की तैयारी परखें।'
                : 'Simulate localized heavy rainfall, heatwaves, or canal cutoff before they occur to evaluate waterlogging and crop stress.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setRainOverride(50);
                setTempOverride(0);
                setCanalHours(0);
              }}
              className="badge"
              style={{ padding: '6px 12px', background: 'var(--bg-surface-subtle)', cursor: 'pointer', border: '1px solid var(--border-card)' }}
            >
              {hi ? 'प्रारूप: 50 मिमी भारी बारिश' : 'Preset: 50mm Torrential Rain'}
            </button>
            <button
              onClick={() => {
                setRainOverride(0);
                setTempOverride(3);
                setCanalHours(0);
              }}
              className="badge"
              style={{ padding: '6px 12px', background: 'var(--bg-surface-subtle)', cursor: 'pointer', border: '1px solid var(--border-card)' }}
            >
              {hi ? 'प्रारूप: 5-दिवसीय नहर बंदी' : 'Preset: 5-Day Canal Cutoff'}
            </button>
          </div>
        </div>

        {/* 3 Interactive Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          {/* Slider 1: Rainfall Override */}
          <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{hi ? 'वर्षा बदलाव' : 'Rainfall Perturbation'}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>{hi ? '0 मिमी (शुष्क)' : '0mm (Dry)'}</span>
              <span>{hi ? '40 मिमी (भारी)' : '40mm (Heavy)'}</span>
              <span>{hi ? '80 मिमी (मूसलाधार)' : '80mm (Cloudburst)'}</span>
            </div>
          </div>

          {/* Slider 2: Temperature Override */}
          <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{hi ? 'तापमान बदलाव' : 'Temperature Anomaly'}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: tempOverride > 0 ? 'var(--color-hazard-crimson)' : 'var(--color-atmosphere-blue)' }}>
                {tempOverride > 0 ? `+${tempOverride}°C` : `${tempOverride}°C`}
              </span>
            </div>
            <input
              type="range"
              min="-3"
              max="6"
              step="1"
              value={tempOverride}
              onChange={(e) => setTempOverride(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--color-solar-amber)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>{hi ? '-3°C (शीतलहर)' : '-3°C (Cool spell)'}</span>
              <span>{hi ? '0°C (सामान्य)' : '0°C (Normal)'}</span>
              <span>{hi ? '+6°C (लू)' : '+6°C (Heatwave)'}</span>
            </div>
          </div>

          {/* Slider 3: Canal Supply */}
          <div style={{ background: 'white', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{hi ? 'नहर जल आपूर्ति' : 'Canal Water Release'}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-earth-emerald)' }}>
                {canalHours} {hi ? 'घंटे/दिन' : 'hours/day'}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>{hi ? '0 घंटे (बंद)' : '0h (Shut)'}</span>
              <span>{hi ? '6 घंटे (सामान्य)' : '6h (Normal)'}</span>
              <span>{hi ? '12 घंटे (पूर्ण प्रवाह)' : '12h (Full canal flow)'}</span>
            </div>
          </div>
        </div>

        {/* Action Trigger Buttons */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: simResult ? '2rem' : '0' }}>
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            style={{
              background: 'linear-gradient(135deg, var(--color-quantum-violet) 0%, #6366f1 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: simulating ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
            }}
          >
            <Play size={16} />
            {simulating
              ? (hi ? 'भौतिकी सिम्युलेशन चल रहा है...' : 'Running Physical Simulation...')
              : (hi ? 'परिदृश्य सिम्युलेशन चलाएं' : 'Execute What-If Simulation')}
          </button>

          {simResult && (
            <button
              onClick={handleResetSimulation}
              style={{
                background: 'white',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-card)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={15} />
              {hi ? 'प्रारंभिक स्थिति' : 'Reset Baseline'}
            </button>
          )}
        </div>

        {/* Simulation Output Comparison Panel */}
        {simResult && (
          <div
            style={{
              marginTop: '1.5rem',
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-focus)',
              padding: '24px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={18} color="var(--color-quantum-violet)" />
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                  Simulation Outcome • ID: {simResult.scenario_id}
                </h4>
              </div>
              <span className="badge badge-pilot">Confidence: {(simResult.simulation_confidence * 100).toFixed(0)}%</span>
            </div>

            {/* Comparison Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  SOIL MOISTURE CHANGE
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px' }}>
                  {simResult.baseline.soil_moisture_pct}% ➔ <span style={{ color: 'var(--color-atmosphere-blue)' }}>{simResult.simulated.soil_moisture_pct.toFixed(1)}%</span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  WATERLOGGING RISK
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px', color: simResult.simulated.flood_risk_level === 'HIGH' ? 'var(--color-hazard-crimson)' : 'var(--color-earth-emerald)' }}>
                  {simResult.baseline.flood_risk_level} ➔ {simResult.simulated.flood_risk_level}
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface-subtle)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  AFFECTED FARMS
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-solar-amber)' }}>
                  {simResult.impact_summary.waterlogged_farms_count} Plots At Risk
                </div>
              </div>
            </div>

            {/* Verdict Box */}
            <div
              style={{
                background: 'var(--color-atmosphere-subtle)',
                borderLeft: '4px solid var(--color-atmosphere-blue)',
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}
            >
              <strong>Hydrological Advisory Verdict:</strong> {simResult.impact_summary.verdict}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
