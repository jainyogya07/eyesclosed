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
  ArrowRight
} from 'lucide-react';

export const PanchayatPage: React.FC = () => {
  const { language, location, selectedCrop } = useApp();
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
        Loading Panchayat intelligence data...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Panchayat Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Panchayat Administration</span>
          <span className="badge badge-pilot">M1–M3 FROZEN PILOT</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={28} color="var(--color-atmosphere-blue)" />
              {twin.panchayat_name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Block: {twin.block_name} • District: {twin.district_name}, {twin.state_name} • Cultivated Area: <strong>{twin.total_cultivated_area_ha} Hectares</strong> ({twin.active_farmers_count} registered plots)
            </p>
          </div>

          <div style={{ background: 'var(--bg-surface-subtle)', padding: '8px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            DOMINANT CROP: <strong>{selectedCrop}</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 1-km Map, Right Panchayat Multi-Layer Side Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <MapView />
        </div>

        {/* Side Panel: Multi-Layer Village Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--color-atmosphere-blue)" />
              {language === 'hi' ? 'गाँव की लाइव स्थिति (Multi-Layer)' : 'Live Panchayat Condition'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Thermometer size={16} color="var(--color-atmosphere-blue)" />
                  {language === 'hi' ? 'तापमान (M1/M2)' : 'Air Temperature'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{twin.weather.prediction.temperature_c}°C</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CloudRain size={16} color="var(--color-atmosphere-blue)" />
                  {language === 'hi' ? 'वर्षा अनुमान (M3)' : 'Rainfall Forecast'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-atmosphere-blue)' }}>{twin.precipitation.prediction.expected_rainfall_mm} mm (84%)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Droplets size={16} color="var(--color-earth-emerald)" />
                  {language === 'hi' ? 'जमीन में नमी (40cm)' : 'Root-Zone Moisture'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-earth-emerald)' }}>{twin.soil.prediction.root_zone_sm_vwc_pct}% VWC</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sprout size={16} color="var(--color-earth-emerald)" />
                  {language === 'hi' ? 'फसल की अवस्था' : 'Crop Stage'}
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{twin.crop.prediction.phenology_stage.replace('_', ' ')}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={16} color="var(--color-earth-emerald)" />
                  {language === 'hi' ? 'जलभराव जोखिम' : 'Inundation Risk'}
                </span>
                <span className="badge badge-frozen" style={{ fontSize: '0.72rem' }}>{twin.flood.prediction.risk_level}</span>
              </div>
            </div>
          </div>

          {/* "क्या बदल रहा है?" Timeline */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--color-solar-amber)" />
              {language === 'hi' ? 'क्या बदल रहा है? (Panchayat Trends)' : 'What is changing in the Panchayat?'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <div style={{ padding: '8px 12px', background: 'var(--color-atmosphere-subtle)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-atmosphere-blue)' }}>
                <strong>आज शाम:</strong> पश्चिमी विक्षोभ के चलते शाम 4 बजे से रात 10 बजे के बीच 12.4 मिमी बारिश की प्रबल संभावना।
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--color-earth-subtle)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-earth-emerald)' }}>
                <strong>कल सुबह:</strong> मिट्टी में पर्याप्त नमी रहने से धान के खेतों में पानी का स्तर अनुकूल रहेगा।
              </div>
              <div style={{ padding: '8px 12px', background: 'var(--bg-surface-subtle)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--border-card)' }}>
                <strong>अगले 3 दिन:</strong> तापमान सामान्य से 1°C कम रहेगा, कीटनाशक छिड़काव के लिए परसों का दिन सबसे उपयुक्त होगा।
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
