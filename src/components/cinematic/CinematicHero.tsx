import React, { useState } from 'react';
import { KisanIntelligenceCore } from '../ai/KisanIntelligenceCore';
import { HyperlocalRainfallCard } from '../ai/HyperlocalRainfallCard';
import { BackgroundVideoBackdrop } from './BackgroundVideoBackdrop';
import { AIIntelligenceCoreState } from '../../types/contracts';
import {
  ShieldCheck,
  Compass,
  Satellite,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Info,
  CloudRain,
  Thermometer
} from 'lucide-react';

interface CinematicHeroProps {
  onNavigateTab: (tab: string) => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onNavigateTab }) => {
  const [coreState, setCoreState] = useState<AIIntelligenceCoreState>('FORECASTING');
  const [telemetryView, setTelemetryView] = useState<'m1_weather' | 'm3_rain'>('m3_rain');

  const stateCycle: AIIntelligenceCoreState[] = [
    'IDLE',
    'PROCESSING',
    'FORECASTING',
    'WARNING',
    'CRITICAL',
    'SUCCESS',
    'ABSTAINED'
  ];

  const handleNextState = () => {
    const nextIdx = (stateCycle.indexOf(coreState) + 1) % stateCycle.length;
    setCoreState(stateCycle[nextIdx]);
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '85vh',
        padding: '5rem 2rem 3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 80% 30%, rgba(224, 242, 254, 0.7) 0%, rgba(248, 250, 252, 0.95) 70%)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      {/* Cinematic Ambient Background Video Layer */}
      <BackgroundVideoBackdrop
        initialVideoId="rice_field"
        defaultOpacity={0.20}
        showControls={true}
      />

      {/* Background Subtle Coordinate Grid Lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(rgba(2, 132, 199, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(2, 132, 199, 0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '2.5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Left Column: Hero Narrative & Value Proposition */}
        <div>
          {/* Institutional Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'white',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '1.5rem'
            }}
          >
            <Satellite size={15} color="var(--color-atmosphere-blue)" />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
            >
              SIH 2024–26 • CLIMATE & AGRICULTURE INTELLIGENCE PLATFORM
            </span>
            <span className="badge badge-frozen">M1 Frozen</span>
            <span className="badge badge-frozen">M2 Frozen</span>
            <span className="badge badge-pilot">M3 Pilot</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.08,
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}
          >
            Kisaan Ki Yash <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              1-km Hyperlocal Decision Intelligence
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxWidth: '580px',
              marginBottom: '2rem'
            }}
          >
            Replacing coarse 25-km district forecasts with mathematically calibrated <strong>1 km × 1 km</strong> micro-climate predictions, space-radar soil moisture, and certified crop action advisories in vernacular Hindi.
          </p>

          {/* Quick CTA Actions */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={() => onNavigateTab('decisionCenter')}
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                transition: 'all 0.2s'
              }}
            >
              Open Farmer Decision Center
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onNavigateTab('digitalTwin')}
              style={{
                background: 'white',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-card)',
                padding: '12px 22px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Layers size={16} color="var(--color-atmosphere-blue)" />
              Panchayat Digital Twin
            </button>

            <button
              onClick={() => onNavigateTab('modelLab')}
              style={{
                background: 'rgba(2, 132, 199, 0.08)',
                color: 'var(--color-atmosphere-blue)',
                border: '1px solid rgba(2, 132, 199, 0.2)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={16} />
              Model Lab (M1–M10)
            </button>
          </div>

          {/* Real Scientific Metric Badges (from Model 1 & 2 Audits) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              maxWidth: '540px'
            }}
          >
            <div className="glass-panel" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                GRID RESOLUTION
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-atmosphere-blue)' }}>
                1000m × 1000m
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                UTM 44N Metric CRS
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                BENCHMARK ERROR
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-earth-emerald)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingDown size={18} />
                39.9%
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                MAE 0.41°C vs AWS
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                CONFORMAL SAFETY
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                90% CQR
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Certified Hold-out
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Telemetry Selector (M1 vs M3) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* Switcher Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              background: 'white',
              padding: '4px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-card)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '1rem',
              zIndex: 2
            }}
          >
            <button
              onClick={() => setTelemetryView('m3_rain')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: telemetryView === 'm3_rain' ? 'var(--color-atmosphere-blue)' : 'transparent',
                color: telemetryView === 'm3_rain' ? 'white' : 'var(--text-secondary)',
                fontWeight: telemetryView === 'm3_rain' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <CloudRain size={13} />
              M3 Rainfall Hurdle
            </button>

            <button
              onClick={() => setTelemetryView('m1_weather')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: telemetryView === 'm1_weather' ? 'var(--color-earth-emerald)' : 'transparent',
                color: telemetryView === 'm1_weather' ? 'white' : 'var(--text-secondary)',
                fontWeight: telemetryView === 'm1_weather' ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              <Thermometer size={13} />
              M1/M2 Micro-Climate
            </button>
          </div>

          {/* Conditional View: M3 Dedicated Card vs M1 Weather Orb */}
          {telemetryView === 'm3_rain' ? (
            <div style={{ width: '100%', maxWidth: '480px' }}>
              <HyperlocalRainfallCard />
            </div>
          ) : (
            /* Glass Card Container for M1 Intelligence Core */
            <div
              className="glass-panel-elevated"
              style={{
                padding: '2.5rem 2rem',
                width: '100%',
                maxWidth: '440px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 40px rgba(16, 185, 129, 0.12)'
              }}
            >
              {/* Top HUD Telemetry Header */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Compass size={14} color="var(--color-atmosphere-blue)" />
                  <span>PILOT: LUCKNOW 44N</span>
                </div>
                <div style={{ color: 'var(--color-earth-emerald)', fontWeight: 600 }}>
                  CASCADE ACTIVE
                </div>
              </div>

              {/* The Original Custom AI Intelligence Core (Interactive Orb) */}
              <div
                style={{ margin: '1rem 0', cursor: 'pointer' }}
                onClick={handleNextState}
                title="Click to cycle AI Core states"
              >
                <KisanIntelligenceCore size="hero" state={coreState} showLabel={true} />
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Sparkles size={12} color="var(--color-solar-amber)" />
                Click orb to cycle state: <strong>{coreState}</strong>
              </div>

              {/* Live Model Stream Simulation Inside Hero HUD */}
              <div
                style={{
                  width: '100%',
                  background: 'var(--bg-surface-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>UPSTREAM NWP:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>NCMRWF 12km (00Z)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>DOWNSCALED T2M:</span>
                  <span style={{ color: 'var(--color-earth-emerald)', fontWeight: 600 }}>28.42°C [±0.74°C]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>OOD DETECTION:</span>
                  <span style={{ color: 'var(--color-atmosphere-blue)', fontWeight: 600 }}>IN_DOMAIN (q=0.92)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Visual Narrative Flow Banner: Earth -> Region -> Panchayat -> Field -> Decision */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '3rem auto 0 auto',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 20px',
          background: 'white',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
          overflowX: 'auto',
          gap: '12px'
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} color="var(--color-atmosphere-blue)" />
          SPATIAL CASCADE:
        </span>
        <span>SATELLITE & NWP (25km)</span>
        <span>➔</span>
        <span>TERRAIN HARMONIZATION</span>
        <span>➔</span>
        <span style={{ color: 'var(--color-atmosphere-blue)', fontWeight: 600 }}>M1/M2 1-KM GRID</span>
        <span>➔</span>
        <span>M3 HURDLE RAIN</span>
        <span>➔</span>
        <span>M4 SAR SOIL (40cm)</span>
        <span>➔</span>
        <span style={{ color: 'var(--color-earth-emerald)', fontWeight: 600 }}>M10 DECISION ACTION</span>
      </div>
    </section>
  );
};
