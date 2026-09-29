import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Sprout,
  AlertCircle,
  Calendar,
  Activity,
  Layers,
  Sparkles,
  Info,
  TrendingUp
} from 'lucide-react';

export const AgriculturePage: React.FC = () => {
  const { language, selectedCrop, setSelectedCrop } = useApp();
  const [demoActive, setDemoActive] = useState(true);

  const crops = [
    'Paddy (धान - बासमती PB-1509)',
    'Wheat (गेहूं - HD-2967)',
    'Mango (दशहरी आम - मलिहाबाद)',
    'Mustard (सरसों - पूसा बोल्ड)'
  ];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-unavailable">Model 5 & Model 7 (Future Training)</span>
          <span className="badge badge-pilot">SPECIFICATION & SIMULATION ONLY</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sprout size={28} color="var(--color-earth-emerald)" />
              {language === 'hi' ? 'फसल अवस्था व स्वास्थ्य (Crop Intelligence)' : 'Crop State & Phenology Intelligence'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Phenological tracking using Sentinel-2 multispectral vegetation indices and accumulated thermal Growing Degree Days (GDD).
            </p>
          </div>

          {/* Crop Selector */}
          <div style={{ background: 'white', border: '1px solid var(--border-card)', borderRadius: 'var(--radius-md)', padding: '6px 12px' }}>
            <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>
              SELECT CROP / फसल चुनें:
            </span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                background: 'transparent',
                cursor: 'pointer'
              }}
            >
              {crops.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Truth in Science Callout Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          background: 'var(--color-solar-subtle)',
          borderLeft: '4px solid var(--color-solar-amber)',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <AlertCircle size={22} color="var(--color-solar-amber)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
          <strong>Scientific Status Notice:</strong> Model 5 (Phenology) and Model 7 (Yield) are currently in specification stage and awaiting active GPU training queue slots. Below values represent a <strong>pilot simulation</strong> conditioned on Sentinel-2 optical bands and historical DAC&FW crop calendars.
        </div>
      </div>

      {/* Main Crop Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PHENOLOGICAL STAGE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-earth-emerald)', marginTop: '4px' }}>
            FLOWERING & HEADING
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            बाली निकलने की अवस्था (Critical water window)
          </div>
          <div style={{ marginTop: '14px', background: 'var(--bg-surface-subtle)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '74%', height: '100%', background: 'var(--color-earth-emerald)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Sowing (Day 0)</span>
            <span>Maturity (Day 115)</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>THERMAL GDD ACCUMULATION</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)', marginTop: '4px' }}>
            1,380.4 °C-Days
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Target Maturity: 1,850.0 °C-Days (74.6% complete)
          </div>
          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-earth-emerald)', marginTop: '8px' }}>
            Base Temp (Tbase): 10.0°C (Kharif standard)
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CHLOROPHYLL VIGOR (NDRE)</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            0.82 (High Vigor)
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-earth-emerald)', marginTop: '4px', fontWeight: 600 }}>
            +6.8% vs 5-Year Historical Benchmark
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Source: Sentinel-2 Red-Edge Band 5/7
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PROJECTED HARVEST YIELD</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-earth-emerald)', marginTop: '4px' }}>
            4.35 Tons / Ha
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Interval: [3.95 – 4.70 Tons/Ha]
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Estimated Harvest: 25 Oct – 05 Nov 2025
          </div>
        </div>
      </div>

      {/* Agronomic Advisory Guide */}
      <div className="glass-panel" style={{ padding: '24px', background: 'white', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="var(--color-earth-emerald)" />
          {language === 'hi' ? 'वर्तमान अवस्था के लिए कृषि सलाह' : 'Agronomic Guidance for Current Stage'}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          धान की बाली निकलते समय (Heading Stage) खेत में नमी की कमी नहीं होनी चाहिए। हालांकि आज रात 12.4 मिमी बारिश होने के कारण ट्यूबवेल से अतिरिक्त सिंचाई की आवश्यकता नहीं है। बारिश के 24 घंटे बाद हल्की यूरिया खाद का छिड़काव किया जा सकता है।
        </p>
      </div>
    </div>
  );
};
