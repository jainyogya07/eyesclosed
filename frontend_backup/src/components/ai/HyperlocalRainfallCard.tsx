import React, { useState, useEffect } from 'react';
import { KisanIntelligenceCore } from './KisanIntelligenceCore';
import { AIIntelligenceCoreState } from '../../types/contracts';
import {
  CloudRain,
  ShieldCheck,
  AlertTriangle,
  Database,
  ArrowRight,
  Info,
  Play,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

interface HyperlocalRainfallCardProps {
  className?: string;
  expectedRainfallMm?: number;
  rainProbability?: number;
  conditionalIntensityMm?: number;
}

export const HyperlocalRainfallCard: React.FC<HyperlocalRainfallCardProps> = ({
  className = '',
  expectedRainfallMm = 2.4,
  rainProbability = 0.61,
  conditionalIntensityMm = 3.9
}) => {
  const [pipelineState, setPipelineState] = useState<AIIntelligenceCoreState>('PROCESSING');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(3);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simMode, setSimMode] = useState<'normal' | 'ood'>('normal');

  const steps = [
    { label: 'NWP Grid', sub: 'NCMRWF 12km' },
    { label: 'Copernicus DEM', sub: 'Terrain / Context' },
    { label: 'Occurrence', sub: 'P(Rain|X)' },
    { label: 'Intensity', sub: 'E[R|Rain]' },
    { label: 'Uncertainty', sub: 'OOD Check' },
    { label: 'Intelligence', sub: 'M3 Hurdle' }
  ];

  // Pipeline step sequence simulation
  useEffect(() => {
    if (!isSimulating) return;

    if (simMode === 'normal') {
      const timer1 = setTimeout(() => {
        setPipelineState('PROCESSING');
        setActiveStepIndex(1);
      }, 500);

      const timer2 = setTimeout(() => {
        setPipelineState('FORECASTING');
        setActiveStepIndex(3);
      }, 1400);

      const timer3 = setTimeout(() => {
        setPipelineState('ANALYZING');
        setActiveStepIndex(4);
      }, 2300);

      const timer4 = setTimeout(() => {
        setPipelineState('SUCCESS');
        setActiveStepIndex(5);
        setIsSimulating(false);
      }, 3200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    } else {
      // OOD / Anomaly Simulation
      const timer1 = setTimeout(() => {
        setPipelineState('PROCESSING');
        setActiveStepIndex(1);
      }, 500);

      const timer2 = setTimeout(() => {
        setPipelineState('WARNING');
        setActiveStepIndex(4);
      }, 1400);

      const timer3 = setTimeout(() => {
        setPipelineState('ABSTAINED');
        setActiveStepIndex(4);
        setIsSimulating(false);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isSimulating, simMode]);

  const handleTriggerSim = (mode: 'normal' | 'ood') => {
    setSimMode(mode);
    setIsSimulating(true);
    setActiveStepIndex(0);
    setPipelineState('PROCESSING');
  };

  return (
    <div
      className={`glass-panel-elevated ${className}`}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        background: 'rgba(255, 255, 255, 0.96)',
        border: '1px solid rgba(2, 132, 199, 0.18)',
        boxShadow: '0 20px 35px -10px rgba(2, 132, 199, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header & Pilot Data Badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CloudRain size={20} color="var(--color-atmosphere-blue)" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Hyperlocal Rainfall Intelligence
            </h3>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            1-km Two-Stage Hurdle Precipitation Downscaler
          </div>
        </div>

        {/* Small Scientifically Honest Badge */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(2, 132, 199, 0.1)',
              color: 'var(--color-atmosphere-blue)',
              fontSize: '0.72rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            PILOT DATA
          </span>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--color-solar-amber)',
              fontSize: '0.72rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(245, 158, 11, 0.25)'
            }}
          >
            LIMITED VALIDATION
          </span>
        </div>
      </div>

      {/* Main KPI Hero Metric Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '1.5rem',
          alignItems: 'center',
          background: 'radial-gradient(ellipse at 10% 50%, rgba(224, 242, 254, 0.45) 0%, rgba(248, 250, 252, 0.8) 100%)',
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: simMode === 'ood' && pipelineState === 'ABSTAINED' ? 'var(--text-muted)' : 'var(--color-atmosphere-blue)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px'
            }}
          >
            {simMode === 'ood' && pipelineState === 'ABSTAINED' ? (
              <span style={{ fontSize: '1.6rem', color: 'var(--color-hazard-crimson)' }}>ABSTAINED</span>
            ) : (
              <>
                {expectedRainfallMm.toFixed(1)}
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>mm</span>
              </>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
            Expected rainfall (1-km hourly)
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Mathematical expectation: P(Rain) × E[Rain | Rain]
          </div>
        </div>

        {/* Intelligence Core Orb Display */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <KisanIntelligenceCore size="md" state={pipelineState} />
          <div>
            <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              CORE STATE
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {pipelineState}
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              {pipelineState === 'ABSTAINED' ? 'IMD Fallback Enforced' : 'Hurdle Active'}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Cell Diagnostic Telemetry Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            RAIN PROBABILITY
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {Math.round(rainProbability * 100)}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            Class-calibrated P(Rain ≥ 0.1 mm/h)
          </div>
        </div>

        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            CONDITIONAL INTENSITY
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {conditionalIntensityMm.toFixed(1)} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>mm/h</span>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            E[Rain | Rain ≥ 0.1 mm/h]
          </div>
        </div>

        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            MODEL ARCHITECTURE
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            M3 • Frozen Pilot (Two-Stage)
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-earth-emerald)', fontWeight: 600 }}>
            SHA-256: 94269196...
          </div>
        </div>

        <div
          style={{
            padding: '10px 14px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            UNCERTAINTY STATUS
          </div>
          <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-solar-amber)', marginTop: '4px' }}>
            Limited calibration
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
            No fake 90% bounds shown
          </div>
        </div>
      </div>

      {/* Visual Pipeline Flow Stepper: NWP -> AWS -> Occur -> Int -> Uncertainty -> Output */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          marginTop: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={13} color="var(--color-atmosphere-blue)" />
            AI CORE EXECUTION CASCADE
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleTriggerSim('normal')}
              disabled={isSimulating}
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-card)',
                background: isSimulating && simMode === 'normal' ? 'rgba(2, 132, 199, 0.1)' : 'white',
                color: 'var(--color-atmosphere-blue)',
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Play size={10} />
              Simulate Pipeline
            </button>

            <button
              onClick={() => handleTriggerSim('ood')}
              disabled={isSimulating}
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: isSimulating && simMode === 'ood' ? 'rgba(239, 68, 68, 0.1)' : 'white',
                color: 'var(--color-hazard-crimson)',
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <AlertTriangle size={10} />
              Test OOD Abstention
            </button>
          </div>
        </div>

        {/* Step Nodes Horizontal Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
            gap: '6px',
            alignItems: 'center'
          }}
        >
          {steps.map((st, i) => {
            const isActive = i <= activeStepIndex;
            const isCurrent = i === activeStepIndex;
            const isOodFail = simMode === 'ood' && i === 4 && pipelineState === 'ABSTAINED';

            return (
              <div
                key={st.label}
                style={{
                  padding: '8px 6px',
                  borderRadius: 'var(--radius-sm)',
                  background: isOodFail
                    ? 'rgba(239, 68, 68, 0.12)'
                    : isCurrent
                    ? 'rgba(2, 132, 199, 0.12)'
                    : isActive
                    ? 'rgba(16, 185, 129, 0.08)'
                    : 'var(--bg-surface-subtle)',
                  border: isOodFail
                    ? '1px solid rgba(239, 68, 68, 0.4)'
                    : isCurrent
                    ? '1px solid var(--color-atmosphere-blue)'
                    : '1px solid var(--border-subtle)',
                  textAlign: 'center',
                  transition: 'all 0.25s'
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: isOodFail
                      ? 'var(--color-hazard-crimson)'
                      : isCurrent
                      ? 'var(--color-atmosphere-blue)'
                      : isActive
                      ? 'var(--color-earth-emerald)'
                      : 'var(--text-muted)'
                  }}
                >
                  {st.label}
                </div>
                <div
                  style={{
                    fontSize: '0.62rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {st.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific Transparency Disclaimer Footer */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '10px 14px',
          background: 'rgba(248, 250, 252, 0.9)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.72rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          border: '1px solid var(--border-subtle)',
          lineHeight: 1.45
        }}
      >
        <Info size={15} color="var(--color-atmosphere-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          <strong>Operational Inference Distinction:</strong> Real-time operational inference is fed by coarse NWP + high-resolution Copernicus DEM topography and static priors $\to$ M3 Hurdle. IMD AWS ground observations (tipping-bucket rain gauges) are strictly used for offline training, post-hoc calibration, and LOSO validation — NOT required as an operational real-time input.
        </span>
      </div>
    </div>
  );
};
