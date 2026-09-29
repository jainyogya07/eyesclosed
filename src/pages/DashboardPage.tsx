import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { predictionProvider } from '../providers';
import { DigitalTwinState, MasterDecisionAdvisory } from '../types/contracts';
import { FarmerOneScreen } from '../components/farmer/FarmerOneScreen';
import {
  MapPin,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  Activity,
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { language, viewMode, location, selectedCrop } = useApp();
  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [advisory, setAdvisory] = useState<MasterDecisionAdvisory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [twinData, advData] = await Promise.all([
        predictionProvider.getDigitalTwinState(location.panchayatCode),
        predictionProvider.getDecisionAdvisory(location.panchayatCode)
      ]);
      setTwin(twinData);
      setAdvisory(advData);
      setLoading(false);
    }
    loadData();
  }, [location.panchayatCode]);

  if (loading || !twin || !advisory) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading intelligence dashboard...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Dashboard Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-frozen">Panchayat Intelligence</span>
            <span className="badge badge-pilot">M1–M3 FROZEN PILOT</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={26} color="var(--color-atmosphere-blue)" />
            {twin.panchayat_name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {location.district}, {location.state} • Crop: <strong>{selectedCrop}</strong> • 1-km Metric Grid
          </p>
        </div>

        {/* Mode Indicator Card */}
        <div className="glass-panel" style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--color-earth-emerald)' }} />
          <div style={{ fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>VIEW MODE: </span>
            <strong style={{ color: 'var(--text-primary)' }}>{viewMode.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}
      >
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{language === 'hi' ? 'हवा का तापमान' : 'AIR TEMP'}</span>
            <Thermometer size={16} color="var(--color-atmosphere-blue)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {twin.weather.prediction.temperature_c}°C
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            [{twin.weather.uncertainty.lower_bound}°–{twin.weather.uncertainty.upper_bound}°C]
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{language === 'hi' ? '24 घंटे वर्षा' : '24H RAIN'}</span>
            <CloudRain size={16} color="var(--color-atmosphere-blue)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)' }}>
            {twin.precipitation.prediction.expected_rainfall_mm} mm
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {(twin.precipitation.prediction.rain_probability * 100).toFixed(0)}% {language === 'hi' ? 'संभावना' : 'Probability'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{language === 'hi' ? 'जड़ क्षेत्र नमी (40cm)' : 'ROOT SOIL (40cm)'}</span>
            <Droplets size={16} color="var(--color-earth-emerald)" />
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-earth-emerald)' }}>
            {twin.soil.prediction.root_zone_sm_vwc_pct}% VWC
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {language === 'hi' ? 'पर्याप्त नमी उपलब्ध' : 'Adequate moisture'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{language === 'hi' ? 'फसल अवस्था' : 'CROP STAGE'}</span>
            <Sprout size={16} color="var(--color-earth-emerald)" />
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {twin.crop.prediction.phenology_stage.replace('_', ' ')}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-earth-emerald)', marginTop: '2px' }}>
            GDD: {twin.crop.prediction.accumulated_gdd.toFixed(0)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{language === 'hi' ? 'जोखिम स्थिति' : 'HAZARD RISK'}</span>
            <Activity size={16} color="var(--color-earth-emerald)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-earth-emerald)' }}>
            {language === 'hi' ? 'सुरक्षित (हरा)' : 'STABLE (GREEN)'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {language === 'hi' ? 'बाढ़ जोखिम' : 'Flood'}: {twin.flood.prediction.risk_level}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', borderLeft: '4px solid var(--color-earth-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>{language === 'hi' ? 'आज का फैसला' : 'TODAY ACTION'}</span>
            <CheckCircle2 size={16} color="var(--color-earth-emerald)" />
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-hazard-crimson)' }}>
            {language === 'hi' ? 'सिंचाई रोकें' : 'HOLD IRRIGATION'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-earth-emerald)', fontWeight: 600, marginTop: '2px' }}>
            {language === 'hi' ? '₹1,450 डीजल बचत' : 'Saves ₹1,450 diesel'}
          </div>
        </div>
      </div>

      {/* Climate scenario and explainable crop recommendation */}
      <section className="decision-overview">
        <div className="decision-overview-heading">
          <div>
            <span className="decision-label">AI + agronomy + local data</span>
            <h2>{language === 'hi' ? 'इस पंचायत के लिए उपयुक्त फसलें' : 'Crop suitability for this Panchayat'}</h2>
            <p>
              {language === 'hi'
                ? 'मौसम, 7-दिवसीय पूर्वानुमान, मिट्टी की नमी और प्रकार का एक साथ समन्वित मूल्यांकन।'
                : 'Current weather, 7-day forecast, root-zone moisture and sandy-loam soil are assessed together—not as isolated signals.'}
            </p>
          </div>
          <Link to="/decision-center" className="decision-link">
            {language === 'hi' ? 'विस्तृत सलाह देखें' : 'Open recommendation'} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="decision-overview-grid">
          <article className="scenario-card">
            <span className="scenario-tag">{language === 'hi' ? 'सक्रिय परिदृश्य' : 'ACTIVE SCENARIO'}</span>
            <h3>{language === 'hi' ? 'सामान्य मानसून' : 'Normal monsoon'}</h3>
            <div className="scenario-metrics">
              <span><b>78%</b> {language === 'hi' ? 'वर्षा संभावना' : 'rainfall outlook'}</span>
              <span><b>+0.4°C</b> {language === 'hi' ? 'ट्रेंड' : 'trend'}</span>
              <span><b>{language === 'hi' ? 'मध्यम' : 'Moderate'}</b> {language === 'hi' ? 'पानी' : 'water'}</span>
            </div>
            <p>
              {language === 'hi'
                ? 'फसल बोने से पहले मौसम के तनाव की तुलना करके सुरक्षित फैसला लें।'
                : 'Scenario planning compares weather stress before farmers commit to a crop.'}
            </p>
          </article>
          <article className="crop-rank-card">
            <span>01</span>
            <div>
              <b>{language === 'hi' ? 'बाजरा' : 'Bajra'}</b>
              <small>{language === 'hi' ? 'अत्यधिक उपयुक्त · कम पानी आवश्यकता' : 'High suitability · Low water demand'}</small>
            </div>
            <strong>91%</strong>
          </article>
          <article className="crop-rank-card">
            <span>02</span>
            <div>
              <b>{language === 'hi' ? 'मूंग' : 'Moong'}</b>
              <small>{language === 'hi' ? 'अत्यधिक उपयुक्त · कम अवधि फसल' : 'High suitability · Short duration'}</small>
            </div>
            <strong>87%</strong>
          </article>
          <article className="crop-rank-card caution">
            <span>!</span>
            <div>
              <b>{language === 'hi' ? 'धान' : 'Paddy'}</b>
              <small>{language === 'hi' ? 'इस परिदृश्य में अधिक जल जोखिम' : 'High water risk under this scenario'}</small>
            </div>
            <strong>42%</strong>
          </article>
        </div>
      </section>

      {/* Farmer One-Screen Component */}
      <div style={{ marginBottom: '2.5rem' }}>
        <FarmerOneScreen />
      </div>

      {/* 24-Hour Forecast Timeline */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="var(--color-atmosphere-blue)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              {language === 'hi' ? 'अगले 24 घंटों का सटीक समय चक्र' : 'Next 24-Hour Micro-Climate Timeline'}
            </h3>
          </div>
          <span className="badge badge-frozen">M1/M3 DOWNLINK</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px'
          }}
        >
          {[
            { hour: 'Now', temp: '28.4°C', rain: '0.0 mm', p: '12%', icon: '☀️' },
            { hour: '+3 Hours', temp: '29.1°C', rain: '0.4 mm', p: '24%', icon: '⛅' },
            { hour: '+6 Hours', temp: '27.8°C', rain: '2.1 mm', p: '58%', icon: '🌧️' },
            { hour: '+12 Hours', temp: '25.6°C', rain: '5.8 mm', p: '84%', icon: '⛈️' },
            { hour: '+18 Hours', temp: '24.9°C', rain: '3.2 mm', p: '72%', icon: '🌧️' },
            { hour: '+24 Hours', temp: '26.8°C', rain: '0.9 mm', p: '35%', icon: '⛅' }
          ].map((slot, i) => (
            <div
              key={i}
              style={{
                background: i === 3 ? 'var(--color-atmosphere-subtle)' : 'var(--bg-surface-subtle)',
                border: i === 3 ? '1.5px solid var(--color-atmosphere-blue)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {slot.hour}
              </div>
              <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{slot.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{slot.temp}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-atmosphere-blue)', fontWeight: 600 }}>{slot.rain}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>P(Rain): {slot.p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Progressive Disclosure Section (If Scientific Mode Active) */}
      {viewMode === 'scientific' && (
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            background: '#f8fafc',
            border: '1.5px solid var(--border-card)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Cpu size={20} color="var(--color-atmosphere-blue)" />
            <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
              Scientific Telemetry & Conformal Uncertainty Layer
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            <div style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div><strong>M1 MODEL:</strong> 1.0.0-pilot (Random Forest)</div>
              <div><strong>M1 CHECKSUM:</strong> 30c22d4c...</div>
              <div><strong>CONFORMAL RESIDUAL:</strong> q = ±0.7374°C (90% CQR)</div>
            </div>

            <div style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div><strong>M3 MODEL:</strong> 0.1.0-pilot (Two-Stage Hurdle)</div>
              <div><strong>M3 CHECKSUM:</strong> 94269196...</div>
              <div><strong>LOCKED TEST RMSE:</strong> 0.9725 mm/h (15.0% error reduction)</div>
            </div>

            <div style={{ background: 'white', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div><strong>SPATIAL PROJECTION:</strong> EPSG:32644 (UTM 44N)</div>
              <div><strong>GRID RESOLUTION:</strong> 1000m × 1000m Metric Grid</div>
              <div><strong>OOD STATUS:</strong> IN_DOMAIN (Mahalanobis D &lt; tau)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
