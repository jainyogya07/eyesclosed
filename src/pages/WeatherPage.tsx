import React, { useState } from 'react';
import { MapView } from '../components/maps/MapView';
import { useApp } from '../contexts/AppContext';
import { useLivePrediction } from '../providers/LivePredictionProvider';
import { BackendStatusBar } from '../components/common/BackendStatusBar';
import {
  CloudSun,
  ShieldCheck,
  Thermometer,
  Clock,
  Compass,
  Layers,
  Info,
  ChevronDown,
  ChevronUp,
  CloudRain,
  Wind,
  Sun,
  AlertTriangle
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { language, location } = useApp();
  const { data, backendStatus } = useLivePrediction();
  const hi = language === 'hi';

  const [selectedHorizon, setSelectedHorizon] = useState<string>('Now');
  const [techDrawerOpen, setTechDrawerOpen] = useState(false);

  // Live model data (falls back to static demo when backend offline)
  const liveTemp = data.weather?.prediction?.temperature_c;
  const liveTempLower = data.weather?.prediction?.temperature_lower;
  const liveTempUpper = data.weather?.prediction?.temperature_upper;
  const liveHumidity = data.weather?.prediction?.humidity_pct;
  const liveWind = data.weather?.prediction?.wind_speed_ms;
  const liveRainProb = data.precipitation?.prediction?.rain_probability;
  const liveRainMm = data.precipitation?.prediction?.expected_rainfall_mm;
  const liveRainCat = data.precipitation?.prediction?.intensity_category;

  const horizons = ['Now', '+6h', '+12h', '+24h', '+48h', '+72h'];



  const hourlyForecast = [
    { time: '12:00 PM', temp: '33°C', rainMm: 0.0, icon: '☀️', adviceEn: 'Safe for spraying', adviceHi: 'छिड़काव के लिए सुरक्षित' },
    { time: '02:00 PM', temp: '34°C', rainMm: 0.0, icon: '⛅', adviceEn: 'Light cloud cover', adviceHi: 'हल्के बादल' },
    { time: '04:00 PM', temp: '31°C', rainMm: 1.2, icon: '🌦️', adviceEn: 'Wind picking up', adviceHi: 'हवा की गति बढ़ेगी' },
    { time: '06:00 PM', temp: '28°C', rainMm: 6.8, icon: '🌧️', adviceEn: 'Rain starts • Hold pump', adviceHi: 'बारिश शुरू • पंप न चलाएं' },
    { time: '08:00 PM', temp: '26°C', rainMm: 4.4, icon: '🌧️', adviceEn: 'Continuous showers', adviceHi: 'वर्षा जारी' },
    { time: '10:00 PM', temp: '25°C', rainMm: 0.0, icon: '☁️', adviceEn: 'Overcast & cool', adviceHi: 'मौसम ठंडा' }
  ];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">
            {hi ? '1-किमी स्थानीय मौसम' : '1-km Hyperlocal Weather'}
          </span>
          <span className="badge badge-pilot">
            {hi ? 'पायलट सेंसर डेटा' : 'In-situ AWS Station Data'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CloudSun size={28} color="var(--color-atmosphere-blue)" />
              {hi ? `${location.panchayatName} स्थानीय मौसम ग्रिड` : `${location.panchayatName} 1-km Hyperlocal Weather`}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {hi
                ? 'स्थानीय स्थलाकृति, ढलान और आईएमडी सेंसर पर आधारित 1-किमी गांव स्तर का सटीक मौसम पूर्वानुमान।'
                : 'High-resolution topographical downscaling conditioned on terrain elevation, aspect, and in-situ AWS telemetry.'}
            </p>
          </div>

          {/* Forecast Horizon Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: '0 6px', fontWeight: 700 }}>
              {hi ? 'समय सीमा:' : 'HORIZON:'}
            </span>
            {horizons.map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: selectedHorizon === h ? 'white' : 'transparent',
                  color: selectedHorizon === h ? 'var(--color-atmosphere-blue)' : 'var(--text-secondary)',
                  fontWeight: selectedHorizon === h ? 800 : 500,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  boxShadow: selectedHorizon === h ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Backend Status + Live Model Accuracy Strip */}
      <div style={{ marginBottom: '1.5rem' }}>
        <BackendStatusBar />
      </div>

      {/* Live M1/M2/M3 Data Cards */}
      {(liveTemp !== undefined || backendStatus === 'offline') && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '1.5rem',
        }}>
          <div className="glass-panel" style={{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'white', border: '1.5px solid var(--border-card)' }}>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              {hi ? 'तापमान (M1)' : 'Temperature (M1)'}
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              {liveTemp !== undefined ? `${liveTemp.toFixed(1)}°C` : '33.2°C'}
            </div>
            {liveTempLower !== undefined && liveTempUpper !== undefined && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                [{liveTempLower.toFixed(1)}, {liveTempUpper.toFixed(1)}]°C
              </div>
            )}
          </div>

          <div className="glass-panel" style={{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'white', border: '1.5px solid var(--border-card)' }}>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              {hi ? 'वर्षा संभावना (M3)' : 'Rain Probability (M3)'}
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: liveRainProb && liveRainProb > 0.5 ? '#0284c7' : 'var(--text-primary)', lineHeight: 1 }}>
              {liveRainProb !== undefined ? `${(liveRainProb * 100).toFixed(0)}%` : '12%'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              {liveRainMm !== undefined ? `${liveRainMm.toFixed(1)} mm expected` : '~0 mm expected'}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'white', border: '1.5px solid var(--border-card)' }}>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              {hi ? 'हवा की गति' : 'Wind Speed'}
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              {liveWind !== undefined ? `${liveWind.toFixed(1)}` : '2.8'} <span style={{ fontSize: '1rem', fontWeight: 400 }}>m/s</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'white', border: '1.5px solid var(--border-card)' }}>
            <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
              {hi ? 'नमी' : 'Humidity'}
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              {liveHumidity !== undefined ? `${liveHumidity.toFixed(0)}%` : '72%'}
            </div>
          </div>

          {liveRainCat && (
            <div className="glass-panel" style={{ padding: '14px 18px', borderRadius: 'var(--radius-lg)', background: 'white', border: '1.5px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                {hi ? 'वर्षा श्रेणी' : 'Rain Category'}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: liveRainCat === 'NONE' ? '#10b981' : liveRainCat === 'LIGHT' ? '#0284c7' : '#f59e0b', lineHeight: 1.2 }}>
                {liveRainCat}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hourly Action Strip */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} color="#0284c7" />
          <span>{hi ? 'आज का प्रति घंटा मौसम व कृषि सलाह' : 'Today\'s Hourly Weather & Farm Action Window'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {hourlyForecast.map((hour) => (
            <div
              key={hour.time}
              style={{
                background: hour.rainMm > 0 ? '#f0f9ff' : '#f8fafc',
                border: hour.rainMm > 0 ? '1.5px solid #bae6fd' : '1px solid var(--border-card)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 10px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{hour.time}</div>
              <div style={{ fontSize: '1.8rem', margin: '4px 0' }}>{hour.icon}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{hour.temp}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: hour.rainMm > 0 ? '#0284c7' : '#64748b' }}>
                {hour.rainMm > 0 ? `${hour.rainMm} mm rain` : (hi ? 'शुष्क' : 'Dry')}
              </div>
              <div style={{ fontSize: '0.72rem', color: hour.rainMm > 0 ? '#0369a1' : '#15803d', marginTop: '4px', fontWeight: 600 }}>
                {hi ? hour.adviceHi : hour.adviceEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main 1-km Geospatial Analysis Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <MapView />
      </div>

      {/* Technical Scientific Drawer (Progressive Disclosure) */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          background: 'white',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--border-card)'
        }}
      >
        <div
          onClick={() => setTechDrawerOpen(!techDrawerOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="var(--color-earth-emerald)" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {hi
                ? 'वैज्ञानिक कार्यप्रणाली एवं अंशांकन रिपोर्ट (M1 और M3)'
                : 'Scientific Methodology, Baselines & Conformal Calibration (M1 & M3)'}
            </h3>
          </div>
          {techDrawerOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {techDrawerOpen && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {hi ? 'मॉडल 1 (तापमान डाउनस्केलिंग):' : 'Model 1 (Weather Downscaling):'}
                </strong>
                <p>
                  {hi
                    ? 'स्थलाकृतिक रैंडम फॉरेस्ट मॉडल जो ऊंचाई और सौर विकिरण ज्यामिति के आधार पर 1-किमी डाउनस्केलिंग करता है। मलिहाबाद स्टेशन AWS_LKO_05 पर परीक्षित।'
                    : 'Topographic Random Forest regressor with sinusoidal cyclical diurnal harmonics. Evaluated on independent test station AWS_LKO_05 in Malihabad mango belt.'}
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: 'var(--color-earth-emerald)', fontWeight: 700 }}>
                  MAE: 0.4083°C vs Raw NWP 0.6793°C (39.89% error reduction)
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {hi ? 'मॉडल 3 (वर्षा डाउनस्केलिंग):' : 'Model 3 (Precipitation Downscaling):'}
                </strong>
                <p>
                  {hi
                    ? 'दो-चरणीय हर्डल मॉडल: चरण 1 वर्षा संभावना वर्गीकरण करता है और चरण 2 वर्षा की सटीक मात्रा का अनुमान लगाता है।'
                    : 'Two-stage hurdle formulation addressing the spatial drizzle problem. Stage 1: Logistic classifier for P(Rain > 0.1mm). Stage 2: Ridge regressor on log1p rainfall volume.'}
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: 'var(--color-atmosphere-blue)', fontWeight: 700 }}>
                  Locked Test RMSE: 0.9725 mm/h vs Raw NWP 1.1438 mm/h (15.0% error reduction)
                </div>
              </div>

              <div>
                <strong style={{ color: 'var(--text-primary)' }}>
                  {hi ? 'कन्फॉर्मल अनिश्चितता अंतराल:' : 'Nominal 90% Prediction Interval & Conformal Uncertainty:'}
                </strong>
                <p>
                  {hi
                    ? 'कन्फॉर्मल क्वांटाइल रिग्रेशन (CQR) द्वारा कैलिब्रेटेड प्रेडिक्शन इंटरवल ताकि किसान को आत्मविश्वास के साथ सही निर्णय मिले।'
                    : 'Prediction intervals [Lower, Upper] calibrated via Conformalized Quantile Regression (CQR). If atmospheric non-conformity exceeds safe bounds, abstention gate triggers.'}
                </p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', marginTop: '4px', color: 'var(--color-earth-emerald)', fontWeight: 700 }}>
                  Nominal Target: 90.0% • Empirical Coverage: M1 Val: 91.7% | M1 Test: 80.6%
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-surface-subtle)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
              NOTICE: All gridded cells operate in UTM Zone 44N (EPSG:32644) metric analysis coordinates. Re-projected to EPSG:4326 for web interchange.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
