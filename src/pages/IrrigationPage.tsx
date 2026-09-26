import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import {
  Droplet,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sliders,
  Info
} from 'lucide-react';

export const IrrigationPage: React.FC = () => {
  const { language } = useApp();
  const [faoDrawerOpen, setFaoDrawerOpen] = useState(false);

  // Physical FAO-56 Penman-Monteith values
  const et0 = 4.85; // mm/day
  const kc = 1.20;  // Flowering heading stage
  const etc = +(et0 * kc).toFixed(2); // 5.82 mm/day
  const rainForecast24h = 12.4; // mm
  const netWaterBalance = +(rainForecast24h - etc).toFixed(2); // +6.58 mm surplus
  const rootZoneMoisture = 31.4; // % VWC
  const fieldCapacity = 34.0; // % VWC
  const wiltingPoint = 13.5; // % VWC

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">Model 6 — Deterministic Physics Engine</span>
          <span className="badge badge-pilot">FAO-56 Penman-Monteith Energy Balance</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Droplet size={32} color="var(--color-atmosphere-blue)" />
          {language === 'hi' ? 'सिंचाई सलाह व जल संतुलन (Irrigation Engine)' : 'Irrigation Demand & Soil Water Balance'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Physics-based daily evapotranspiration (ETc) calculation balancing plant water uptake against forecasted rainfall.
        </p>
      </div>

      {/* Main Large Answer Box: "आज पानी देना है?" */}
      <div
        className="glass-panel-elevated"
        style={{
          padding: '2.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
          borderRadius: 'var(--radius-xl)',
          border: '2px solid var(--color-earth-light)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-earth-emerald)', textTransform: 'uppercase', marginBottom: '6px' }}>
              {language === 'hi' ? 'आज का फैसला (Today\'s Decision)' : 'Today\'s Irrigation Verdict'}
            </div>

            <h2
              style={{
                fontSize: '2.4rem',
                color: 'var(--color-hazard-crimson)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '10px'
              }}
            >
              {language === 'hi' ? 'सिंचाई स्थगित रखें (Do Not Irrigate)' : 'Hold Irrigation (No Pumping Required)'}
            </h2>

            <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '14px' }}>
              {language === 'hi'
                ? 'अगले 24 घंटों में 12.4 मिमी बारिश की 84% संभावना है, जो फसल की दैनिक पानी की खपत (5.8 मिमी) से दोगुनी है। मिट्टी में पहले से 31% नमी मौजूद है।'
                : 'Expected 12.4 mm rainfall easily exceeds the daily crop water demand (5.8 mm). Root-zone soil is already well-hydrated at 31% VWC.'}
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glow-emerald)', boxShadow: 'var(--shadow-sm)' }}>
              <DollarSign size={18} color="var(--color-earth-emerald)" />
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-earth-emerald)' }}>
                {language === 'hi' ? 'बचत: लगभग ₹1,450 / एकड़ (डीजल व बिजली)' : 'Estimated Savings: ₹1,450 / acre (Pumping costs)'}
              </span>
            </div>
          </div>

          {/* Visual Soil Water Tank Graphic */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-card)',
              padding: '20px',
              width: '260px',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>
              ROOT ZONE SOIL TANK (40CM)
            </div>

            {/* Tank Graphic */}
            <div
              style={{
                width: '100%',
                height: '140px',
                background: '#f1f5f9',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
                overflow: 'hidden',
                border: '2px solid #cbd5e1',
                marginBottom: '10px'
              }}
            >
              {/* Water Level */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '82%',
                  background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                  transition: 'height 0.5s ease'
                }}
              />
              <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Field Capacity: 34%
              </div>
              <div style={{ position: 'absolute', bottom: '35%', left: 0, right: 0, fontSize: '0.75rem', fontWeight: 800, color: 'white' }}>
                Current: 31.4% VWC
              </div>
              <div style={{ position: 'absolute', bottom: '6px', left: 0, right: 0, fontSize: '0.68rem', color: 'rgba(255,255,255,0.8)' }}>
                Wilting Point: 13.5%
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-earth-emerald)', fontWeight: 700 }}>
              Status: OPTIMAL / SATISFIED
            </div>
          </div>
        </div>
      </div>

      {/* 4 Energy & Water Balance Component Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>REFERENCE ET0</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {et0} mm / day
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Atmospheric evaporative demand based on temperature, wind, humidity, and solar radiation.
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CROP COEFFICIENT (KC)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-earth-emerald)', marginTop: '4px' }}>
            {kc} (Flowering)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Paddy Basmati heading stage scales standard grass ET0 to actual crop transpiration.
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>CROP ET (ETC = KC × ET0)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-atmosphere-blue)', marginTop: '4px' }}>
            {etc} mm / day
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Total volumetric water transpired by the crop canopy in 24 hours.
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>NET WATER BALANCE</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-earth-emerald)', marginTop: '4px' }}>
            +{netWaterBalance} mm Surplus
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Rainfall (+12.4mm) minus daily ETc (-5.8mm) leaves a positive moisture surplus.
          </div>
        </div>
      </div>

      {/* FAO-56 Penman-Monteith Scientific Equation Drawer */}
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
          onClick={() => setFaoDrawerOpen(!faoDrawerOpen)}
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
              Scientific Explanation: Why Model 6 is a Physical Equation, Not ML
            </h3>
          </div>
          {faoDrawerOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        {faoDrawerOpen && (
          <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: '10px' }}>
              Unlike statistical machine learning models that can hallucinate unphysical predictions, <strong>Model 6 uses the deterministic FAO-56 Penman-Monteith thermodynamic energy balance equation</strong>:
            </p>
            <div style={{ background: 'var(--bg-surface-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
              ET₀ = [ 0.408 Δ (Rₙ - G) + γ (900 / (T + 273)) u₂ (eₛ - eₐ) ] / [ Δ + γ (1 + 0.34 u₂) ]
            </div>
            <p>
              Where: <strong>Rₙ</strong> is net solar radiation at crop surface, <strong>G</strong> is soil heat flux density, <strong>T</strong> is mean daily air temperature at 2m (from Model 1/2), <strong>u₂</strong> is wind speed at 2m, and <strong>(eₛ - eₐ)</strong> represents the vapor pressure deficit derived from downscaled relative humidity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
