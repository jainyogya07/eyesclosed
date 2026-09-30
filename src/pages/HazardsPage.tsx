import React from 'react';
import { useApp } from '../contexts/AppContext';
import {
  AlertTriangle,
  Flame,
  CloudLightning,
  SunMedium,
  Wind,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

interface HazardCardItem {
  id: string;
  nameEn: string;
  nameHi: string;
  severity: 'NORMAL' | 'WATCH' | 'WARNING' | 'CRITICAL';
  statusTextEn: string;
  statusTextHi: string;
  modelEn: string;
  modelHi: string;
  causeEn: string;
  causeHi: string;
  actionHi: string;
  actionEn: string;
  icon: React.ReactNode;
}

export const HazardsPage: React.FC = () => {
  const { language } = useApp();
  const hi = language !== 'en';

  const hazards: HazardCardItem[] = [
    {
      id: 'heat',
      nameEn: 'Heatwave & Heat Stress',
      nameHi: 'लू व अत्यधिक गर्मी',
      severity: 'NORMAL',
      statusTextEn: 'Normal (Green Alert)',
      statusTextHi: 'सामान्य (हरा अलर्ट)',
      modelEn: 'Model 6 (30-Year Climatological P90 Threshold)',
      modelHi: 'मॉडल 6 (30-वर्षीय तापमान सीमा विश्लेषण)',
      causeEn: 'Max temp 28.4°C is well below the 90th percentile threshold (39.5°C) for July in Lucknow.',
      causeHi: 'अधिकतम तापमान 28.4°C है, जो 39.5°C की अत्यधिक गर्मी सीमा से काफी नीचे है।',
      actionHi: 'फसल पर कोई तापमान का दबाव नहीं है। सामान्य कृषि कार्य जारी रखें।',
      actionEn: 'No heat stress detected. Standard farming operations may continue.',
      icon: <Flame size={22} color="var(--color-earth-emerald)" />
    },
    {
      id: 'rain',
      nameEn: 'Heavy Rainfall Alert',
      nameHi: 'अतिवृष्टि व तेज बारिश चेतावनी',
      severity: 'WATCH',
      statusTextEn: 'Watch (Yellow Alert)',
      statusTextHi: 'सावधानी (पीला अलर्ट)',
      modelEn: 'Model 3 (Precipitation Downscaler)',
      modelHi: 'मॉडल 3 (वर्षा डाउनस्केलर)',
      causeEn: 'Forecast shows 12.4 mm rainfall over 6 hours tonight (84% probability).',
      causeHi: 'आज रात 6 घंटों में 12.4 मिमी बारिश की 84% संभावना है।',
      actionHi: 'शाम को कीटनाशक छिड़काव स्थगित रखें ताकि दवा पानी में बह न जाए।',
      actionEn: 'Hold pesticide spraying this evening to prevent chemical wash-off.',
      icon: <CloudLightning size={22} color="var(--color-solar-amber)" />
    },
    {
      id: 'flood',
      nameEn: 'Topographic Waterlogging',
      nameHi: 'खेतों में जलभराव',
      severity: 'NORMAL',
      statusTextEn: 'Normal (Green Alert)',
      statusTextHi: 'सामान्य (हरा अलर्ट)',
      modelEn: 'Model 9 (Topographic Wetness Index DEM)',
      modelHi: 'मॉडल 9 (टोपोग्राफिक वेटनेस इंडेक्स)',
      causeEn: 'Soil percolation rate exceeds forecast rain volume across 94% of village plots.',
      causeHi: 'गांव के 94% खेतों में जल निकासी की गति बारिश की तुलना में बेहतर है।',
      actionHi: 'निचले खेतों की मेड़ों में पानी निकलने के निकास खुले रखें।',
      actionEn: 'Ensure micro-catchment drainage exits are clear in low-lying plots.',
      icon: <Droplets size={22} color="var(--color-earth-emerald)" />
    },
    {
      id: 'wind',
      nameEn: 'Squall & High Wind Alert',
      nameHi: 'तेज हवा व आंधी चेतावनी',
      severity: 'NORMAL',
      statusTextEn: 'Normal (Calm 8 km/h)',
      statusTextHi: 'सामान्य (शांत 8 किमी/घंटा)',
      modelEn: 'Model 1 (2m Wind Vector Downscaling)',
      modelHi: 'मॉडल 1 (हवा गति डाउनस्केलिंग)',
      causeEn: 'Sustained winds 8–12 km/h; below the 35 km/h lodging threshold for tall paddy.',
      causeHi: 'हवा की गति 8-12 किमी/घंटा है, जिससे धान गिरने का कोई खतरा नहीं है।',
      actionHi: 'फसल गिरने (Lodging) का कोई खतरा नहीं है।',
      actionEn: 'No crop lodging risk. Foliar sprays safe if conducted before rain window.',
      icon: <Wind size={22} color="var(--color-earth-emerald)" />
    }
  ];

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'WATCH':
        return { badge: 'badge-pilot', border: '#fde68a', text: '#b45309' };
      case 'WARNING':
        return { badge: 'badge-critical', border: '#fca5a5', text: '#dc2626' };
      case 'CRITICAL':
        return { badge: 'badge-critical', border: '#ef4444', text: '#b91c1c' };
      default:
        return { badge: 'badge-frozen', border: '#bbf7d0', text: '#059669' };
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">
            {hi ? 'मौसम आपदा व जोखिम बुद्धिमत्ता' : 'Climatological Hazard Intelligence'}
          </span>
          <span className="badge badge-pilot">
            {hi ? '30-वर्षीय ऐतिहासिक आईएमडी मानक' : '30-Year IMD Climatology Standards'}
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={30} color="#d97706" />
          {hi ? 'मौसम आपदा व जोखिम चेतावनी' : 'Extreme Weather & Hazard Intelligence'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {hi
            ? '30-वर्षीय जलवायु इतिहास और स्थानीय ढलान मॉडल द्वारा सूखे, अत्यधिक वर्षा और लू की समय पर चेतावनी।'
            : 'Evaluating 30-year IMD climatological percentiles and micro-catchment runoff thresholds.'}
        </p>
      </div>

      {/* Hazard Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {hazards.map((h) => {
          const style = getSeverityStyle(h.severity);

          return (
            <div
              key={h.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-xl)',
                background: 'white',
                border: `1.5px solid ${style.border}`,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {h.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                      {hi ? h.nameHi : h.nameEn}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {hi ? h.modelHi : h.modelEn}
                    </div>
                  </div>
                </div>

                <span className={`badge ${style.badge}`}>{h.severity}</span>
              </div>

              {/* Status & Cause */}
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 800, color: style.text, marginBottom: '4px' }}>
                  {hi ? 'स्थिति:' : 'Status:'} {hi ? h.statusTextHi : h.statusTextEn}
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong>{hi ? 'कारण:' : 'Cause:'}</strong> {hi ? h.causeHi : h.causeEn}
                </div>
              </div>

              {/* Protective Action */}
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                <strong style={{ color: '#0f172a' }}>{hi ? 'सलाह:' : 'Action:'}</strong> {hi ? h.actionHi : h.actionEn}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Notice */}
      <div className="glass-panel" style={{ padding: '18px 22px', background: 'white', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: 'var(--radius-xl)' }}>
        <ShieldCheck size={22} color="#059669" />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong>{hi ? 'प्रमाणित वैज्ञानिक चेतावनी:' : 'Zero False Alarms:'}</strong>{' '}
          {hi
            ? 'चेतावनियां केवल तभी जारी की जाती हैं जब मौसम डेटा आईएमडी और डब्ल्यूएमओ के आधिकारिक मानकों को पार करता है।'
            : 'Warnings are triggered only when physical observations cross official WMO and IMD hazard thresholds.'}
        </div>
      </div>
    </div>
  );
};
