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
import { StatusBadge } from '../components/common/StatusBadge';

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
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--farmora-platinum)', backgroundColor: 'var(--farmora-dark)', minHeight: '100vh' }}>
        Loading Panchayat intelligence data...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem 6rem 1.5rem', backgroundColor: 'var(--farmora-dark)', minHeight: 'calc(100vh - 120px)' }}>
      {/* Panchayat Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <StatusBadge status="frozen" label="PANCHAYAT ADMINISTRATION" />
          <span className="badge badge-pilot">M1–M3 FROZEN PILOT</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--farmora-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={28} color="var(--farmora-lime)" />
              {twin.panchayat_name}
            </h1>
            <p style={{ color: 'var(--farmora-platinum)', fontSize: '0.95rem' }}>
              Block: {twin.block_name} • District: {twin.district_name}, {twin.state_name} • Cultivated Area: <strong style={{ color: 'var(--farmora-wheat)' }}>{twin.total_cultivated_area_ha} Ha</strong> ({twin.active_farmers_count} registered plots)
            </p>
          </div>

          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)' }}>
            UPDATED: {new Date(twin.last_updated_utc).toLocaleTimeString()} IST
          </div>
        </div>
      </div>

      {/* Panchayat Vitals Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="farmora-glass-elevated" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>MEAN CANOPY TEMP</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--farmora-lime)', marginTop: '4px' }}>
            {twin.weather.prediction.temperature_c}°C
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)' }}>M1 Downscaled Grid</div>
        </div>

        <div className="farmora-glass-elevated" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>MEAN SOIL MOISTURE</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--farmora-lime)', marginTop: '4px' }}>
            {twin.soil.prediction.root_zone_sm_vwc_pct}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)' }}>Root-zone 5–40 cm</div>
        </div>

        <div className="farmora-glass-elevated" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>48h RAIN EXPECTATION</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
            {twin.precipitation.prediction.expected_rainfall_mm} mm
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)' }}>M3 Hurdle Expected Sum</div>
        </div>

        <div className="farmora-glass-elevated" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--farmora-platinum)', fontWeight: 700, textTransform: 'uppercase' }}>FLOOD VULNERABLE AREA</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f87171', marginTop: '4px' }}>
            {twin.flood.prediction.vulnerable_area_ha} Ha
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--farmora-wheat)' }}>Level: {twin.flood.prediction.risk_level}</div>
        </div>
      </div>

      {/* Map Integration */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--farmora-light)', marginBottom: '14px' }}>
          Panchayat 1-km Precision Operational Grid
        </h3>
        <MapView />
      </div>
    </div>
  );
};
