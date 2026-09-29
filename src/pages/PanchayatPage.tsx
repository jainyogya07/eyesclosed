import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { predictionProvider } from '../providers';
import { DigitalTwinState } from '../types/contracts';
import { MapView } from '../components/maps/MapView';
import {
  MapPin,
  Layers,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  Activity,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const PanchayatPage: React.FC = () => {
  const { language, location, selectedCrop } = useApp();
  const hi = language === 'hi';

  const [twin, setTwin] = useState<DigitalTwinState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await predictionProvider.getDigitalTwinState(location.panchayatCode);
      setTwin(data);
      setLoading(false);
    }
    loadData();
  }, [location.panchayatCode]);

  if (loading || !twin) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        {hi ? 'पंचायत डेटा लोड हो रहा है...' : 'Loading Panchayat intelligence data...'}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Panchayat Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">
            {hi ? 'पंचायत प्रशासन' : 'Panchayat Administration'}
          </span>
          <span className="badge badge-pilot">
            {hi ? '1-किमी डाउनस्केल्ड पायलट' : '1-km Downscaled Pilot'}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={28} color="var(--color-atmosphere-blue)" />
              {hi ? `${location.panchayatName} पंचायत` : `${location.panchayatName} Panchayat`}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {hi ? (
                <>ब्लॉक: <strong>{twin.block_name}</strong> • ज़िला: <strong>{twin.district_name}</strong>, {twin.state_name} • कुल कृषि क्षेत्र: <strong>{twin.total_cultivated_area_ha} हेक्टेयर</strong> ({twin.active_farmers_count} पंजीकृत खेत)</>
              ) : (
                <>Block: <strong>{twin.block_name}</strong> • District: <strong>{twin.district_name}</strong>, {twin.state_name} • Cultivated Area: <strong>{twin.total_cultivated_area_ha} Hectares</strong> ({twin.active_farmers_count} registered plots)</>
              )}
            </p>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
            {hi ? 'प्रमुख फसल:' : 'Dominant Crop:'} <strong>{selectedCrop}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 1-km Map, Right Panchayat Multi-Layer Side Panel */}
      <div className="panchayat-main-grid">
        <div>
          <MapView />
        </div>

        {/* Side Panel: Multi-Layer Village Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '20px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Layers size={18} color="var(--color-atmosphere-blue)" />
              {hi ? 'गाँव की लाइव स्थिति' : 'Live Panchayat Conditions'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={16} color="var(--color-atmosphere-blue)" />
                  {hi ? 'हवा का तापमान' : 'Air Temperature'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{twin.weather.prediction.temperature_c}°C</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudRain size={16} color="var(--color-atmosphere-blue)" />
                  {hi ? 'वर्षा अनुमान (24 घंटे)' : 'Rainfall Forecast (24h)'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-atmosphere-blue)' }}>{twin.precipitation.prediction.expected_rainfall_mm} mm (84%)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={16} color="var(--color-earth-emerald)" />
                  {hi ? 'जड़ों के पास नमी (40cm)' : 'Root-Zone Moisture (40cm)'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-earth-emerald)' }}>{twin.soil.prediction.root_zone_sm_vwc_pct}% VWC</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sprout size={16} color="var(--color-earth-emerald)" />
                  {hi ? 'फसल विकास अवस्था' : 'Crop Stage'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{twin.crop.prediction.phenology_stage.replace('_', ' ')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={16} color="var(--color-earth-emerald)" />
                  {hi ? 'जलभराव जोखिम' : 'Waterlogging Risk'}
                </span>
                <span className="badge badge-frozen" style={{ fontSize: '0.72rem' }}>
                  {hi ? (twin.flood.prediction.risk_level === 'LOW' ? 'कम (सुरक्षित)' : twin.flood.prediction.risk_level) : twin.flood.prediction.risk_level}
                </span>
              </div>
            </div>
          </div>

          {/* Panchayat Trends Card */}
          <div className="glass-panel" style={{ padding: '20px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Clock size={18} color="var(--color-solar-amber)" />
              {hi ? 'पंचायत में क्या बदल रहा है?' : 'What is changing in the Panchayat?'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ padding: '10px 12px', background: '#f0f9ff', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #0284c7' }}>
                <strong style={{ color: '#0369a1' }}>{hi ? 'आज शाम:' : 'This Evening:'}</strong>{' '}
                {hi
                  ? 'शाम 4 बजे से रात 10 बजे के बीच 12.4 मिमी बारिश की 84% संभावना। ट्यूबवेल व कीटनाशक छिड़काव स्थगित रखें।'
                  : '84% probability of 12.4 mm rainfall between 4 PM and 10 PM. Hold irrigation pumping and pesticide spraying.'}
              </div>

              <div style={{ padding: '10px 12px', background: '#f0fdf4', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #059669' }}>
                <strong style={{ color: '#047857' }}>{hi ? 'कल सुबह:' : 'Tomorrow Morning:'}</strong>{' '}
                {hi
                  ? 'मिट्टी में पर्याप्त नमी बनी रहेगी, धान की फसल के लिए अनुकूल स्थिति। जल निकासी नाली साफ रखें।'
                  : 'Root-zone moisture remains optimal; soil conditions favorable for crop tillering.'}
              </div>

              <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid #94a3b8' }}>
                <strong style={{ color: '#334155' }}>{hi ? 'अगले 3 दिन:' : 'Next 3 Days:'}</strong>{' '}
                {hi
                  ? 'तापमान 28°C के पास स्थिर रहेगा, बारिश रुकने के बाद यूरिया/डीएपी खाद डालने का सबसे उपयुक्त समय।'
                  : 'Temperatures steady around 28°C. Best window for foliar nutrient application after rains clear.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
