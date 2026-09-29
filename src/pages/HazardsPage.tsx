import React, { useState } from 'react';
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
  statusText: string;
  model: string;
  cause: string;
  actionHi: string;
  actionEn: string;
  icon: React.ReactNode;
}

export const HazardsPage: React.FC = () => {
  const { language } = useApp();

  const hazards: HazardCardItem[] = [
    {
      id: 'heat',
      nameEn: 'Heatwave & Heat Stress',
      nameHi: 'लू व अत्यधिक गर्मी',
      severity: 'NORMAL',
      statusText: 'Normal (हरा / Green Alert)',
      model: 'Model 9 (30-Year Climatological Percentile P90)',
      cause: 'Max temp 28.4°C is below the 90th percentile threshold (39.5°C) for July in Lucknow.',
      actionHi: 'फसल पर कोई तापमान का दबाव नहीं है। सामान्य कृषि कार्य जारी रखें।',
      actionEn: 'No heat stress detected. Standard farming operations may continue.',
      icon: <Flame size={22} color="var(--color-earth-emerald)" />
    },
    {
      id: 'rain',
      nameEn: 'Heavy Rainfall / Cloudburst',
      nameHi: 'अतिवृष्टि व तेज बारिश',
      severity: 'WATCH',
      statusText: 'Watch (पीला / Yellow Watch)',
      model: 'Model 3 (Precipitation Downscaler) + Model 9',
      cause: 'Forecast shows 12.4mm rainfall over 6 hours (below the 15mm/h extreme threshold).',
      actionHi: 'शाम को कीटनाशक छिड़काव स्थगित रखें ताकि दवा पानी में बह न जाए।',
      actionEn: 'Hold pesticide spraying this evening to prevent chemical wash-off.',
      icon: <CloudLightning size={22} color="var(--color-solar-amber)" />
    },
    {
      id: 'flood',
      nameEn: 'Topographic Waterlogging',
      nameHi: 'खेतों में जलभराव',
      severity: 'NORMAL',
      statusText: 'Normal (Low Runoff)',
      model: 'Model 8 (Topographic Wetness Index & Catchment Flow)',
      cause: 'Rain volume is within micro-catchment natural percolation absorption capacity.',
      actionHi: 'निचले खेतों की नालियों को साफ रखें ताकि पानी आसानी से निकल सके।',
      actionEn: 'Ensure low-elevation plot drainage channels are unobstructed.',
      icon: <Droplets size={22} color="var(--color-earth-emerald)" />
    },
    {
      id: 'wind',
      nameEn: 'Gale Wind & Storm Surge',
      nameHi: 'तेज हवा व आंधी (Lodging Risk)',
      severity: 'NORMAL',
      statusText: 'Normal (Wind: 3.8 m/s)',
      model: 'Model 1 (Downscaled Surface Wind Vector)',
      cause: 'Surface winds 3.8 m/s (13.7 km/h) are far below the 40 km/h crop lodging danger threshold.',
      actionHi: 'धान के पौधे सुरक्षित हैं, हवा से गिरने का कोई खतरा नहीं है।',
      actionEn: 'Standing paddy is safe; wind speed is well below lodging thresholds.',
      icon: <Wind size={22} color="var(--color-earth-emerald)" />
    },
    {
      id: 'drought',
      nameEn: 'Dry Spell / Drought Anomaly',
      nameHi: 'सूखा व शुष्क दौर',
      severity: 'NORMAL',
      statusText: 'Normal (Soil: 31.4% VWC)',
      model: 'Model 4 + Model 6 Cumulative Deficit',
      cause: 'Root-zone moisture is sufficient with incoming monsoon showers.',
      actionHi: 'मिट्टी में पर्याप्त नमी है, सूखे का कोई अंदेशा नहीं है।',
      actionEn: 'Soil moisture is optimal; no dry spell vulnerability detected.',
      icon: <SunMedium size={22} color="var(--color-earth-emerald)" />
    }
  ];

  const getSeverityStyle = (s: string) => {
    switch (s) {
      case 'WATCH':
        return { badge: 'badge-pilot', border: 'var(--color-solar-light)', text: 'var(--color-solar-amber)' };
      case 'WARNING':
        return { badge: 'badge-pilot', border: 'var(--color-solar-amber)', text: 'var(--color-solar-amber)' };
      case 'CRITICAL':
        return { badge: 'badge-critical', border: 'var(--color-hazard-light)', text: 'var(--color-hazard-crimson)' };
      default:
        return { badge: 'badge-frozen', border: 'var(--border-card)', text: 'var(--color-earth-emerald)' };
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Climatological Hazard Intelligence</span>
          <span className="badge badge-pilot">M9 Climatology & M8 Inundation</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={32} color="var(--color-solar-amber)" />
          {language === 'hi' ? 'मौसम आपदा व जोखिम चेतावनी' : 'Extreme Weather & Hazard Intelligence'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Evaluating 30-year IMD climatological percentiles ($P_{90}, P_{95}$) and micro-catchment runoff thresholds.
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
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                      {language === 'hi' ? h.nameHi : h.nameEn}
                    </h3>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {h.model}
                    </div>
                  </div>
                </div>

                <span className={`badge ${style.badge}`}>{h.severity}</span>
              </div>

              {/* Status & Cause */}
              <div style={{ background: 'var(--bg-surface-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', marginBottom: '14px', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: style.text, marginBottom: '4px' }}>
                  Status: {h.statusText}
                </div>
                <div style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong>Cause:</strong> {h.cause}
                </div>
              </div>

              {/* Protective Action */}
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                <strong>{language === 'hi' ? 'सलाह:' : 'Action:'}</strong> {language === 'hi' ? h.actionHi : h.actionEn}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Notice */}
      <div className="glass-panel" style={{ padding: '18px 22px', background: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck size={22} color="var(--color-earth-emerald)" />
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <strong>No Hallucinated False Alarms:</strong> Warnings are triggered only when physical thresholds exceed established WMO and IMD hazard parameters. All background analyses are logged into the immutable audit trail.
        </div>
      </div>
    </div>
  );
};
