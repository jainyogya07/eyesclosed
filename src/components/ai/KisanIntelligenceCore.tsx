import React, { useMemo } from 'react';
import { AIIntelligenceCoreState } from '../../types/contracts';

interface KisanIntelligenceCoreProps {
  state?: AIIntelligenceCoreState;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
}

export const KisanIntelligenceCore: React.FC<KisanIntelligenceCoreProps> = ({
  state = 'IDLE',
  size = 'md',
  showLabel = false,
  className = '',
  onClick
}) => {
  // Dimension tokens
  const dimensions = useMemo(() => {
    switch (size) {
      case 'sm':
        return { px: 32, ringR1: 12, ringR2: 9, coreR: 5 };
      case 'md':
        return { px: 48, ringR1: 18, ringR2: 13, coreR: 7 };
      case 'lg':
        return { px: 84, ringR1: 34, ringR2: 24, coreR: 12 };
      case 'hero':
        return { px: 180, ringR1: 76, ringR2: 54, coreR: 28 };
    }
  }, [size]);

  // Color & Energy Config per State
  const theme = useMemo(() => {
    switch (state) {
      case 'IDLE':
        return {
          coreGradient: ['#10b981', '#06b6d4'],
          ringStroke: 'rgba(16, 185, 129, 0.45)',
          outerGlow: 'rgba(6, 182, 212, 0.25)',
          speedSec: '4s',
          statusText: 'Core Idle'
        };
      case 'THINKING':
        return {
          coreGradient: ['#06b6d4', '#3b82f6'],
          ringStroke: 'rgba(59, 130, 246, 0.65)',
          outerGlow: 'rgba(59, 130, 246, 0.4)',
          speedSec: '2.5s',
          statusText: 'Inferring Parameters'
        };
      case 'PROCESSING':
        return {
          coreGradient: ['#10b981', '#14b8a6'],
          ringStroke: 'rgba(20, 184, 166, 0.7)',
          outerGlow: 'rgba(16, 185, 129, 0.5)',
          speedSec: '1.8s',
          statusText: 'Processing NWP Grid'
        };
      case 'FORECASTING':
        return {
          coreGradient: ['#3b82f6', '#6366f1'],
          ringStroke: 'rgba(99, 102, 241, 0.75)',
          outerGlow: 'rgba(99, 102, 241, 0.45)',
          speedSec: '1.2s',
          statusText: 'Downscaling 1-km Weather'
        };
      case 'ANALYZING':
        return {
          coreGradient: ['#8b5cf6', '#06b6d4'],
          ringStroke: 'rgba(139, 92, 246, 0.7)',
          outerGlow: 'rgba(139, 92, 246, 0.4)',
          speedSec: '2s',
          statusText: 'Agronomic Evaluation'
        };
      case 'WARNING':
        return {
          coreGradient: ['#f59e0b', '#d97706'],
          ringStroke: 'rgba(245, 158, 11, 0.8)',
          outerGlow: 'rgba(245, 158, 11, 0.5)',
          speedSec: '1.5s',
          statusText: 'Atmospheric Risk Detected'
        };
      case 'CRITICAL':
        return {
          coreGradient: ['#ef4444', '#b91c1c'],
          ringStroke: 'rgba(239, 68, 68, 0.85)',
          outerGlow: 'rgba(239, 68, 68, 0.55)',
          speedSec: '0.9s',
          statusText: 'Severe Hazard Alert'
        };
      case 'SUCCESS':
        return {
          coreGradient: ['#10b981', '#059669'],
          ringStroke: 'rgba(16, 185, 129, 0.8)',
          outerGlow: 'rgba(16, 185, 129, 0.45)',
          speedSec: '3s',
          statusText: 'Certified Decision Ready'
        };
      case 'ABSTAINED':
        return {
          coreGradient: ['#94a3b8', '#64748b'],
          ringStroke: 'rgba(148, 163, 184, 0.5)',
          outerGlow: 'rgba(148, 163, 184, 0.2)',
          speedSec: '6s',
          statusText: 'Abstained (IMD Fallback)'
        };
      case 'OFFLINE':
        return {
          coreGradient: ['#64748b', '#334155'],
          ringStroke: 'rgba(100, 116, 139, 0.3)',
          outerGlow: 'transparent',
          speedSec: '0s',
          statusText: 'System Standby'
        };
    }
  }, [state]);

  const { px, ringR1, ringR2, coreR } = dimensions;
  const center = px / 2;

  return (
    <div
      className={`kisan-core-wrapper ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default'
      }}
    >
      <div
        className="kisan-core-canvas-container"
        style={{
          width: px,
          height: px,
          position: 'relative',
          filter: `drop-shadow(0 0 ${px * 0.15}px ${theme.outerGlow})`
        }}
      >
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`coreGlow-${state}-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={theme.coreGradient[0]} stopOpacity="1" />
              <stop offset="70%" stopColor={theme.coreGradient[1]} stopOpacity="0.8" />
              <stop offset="100%" stopColor={theme.coreGradient[1]} stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`ringGrad-${state}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.coreGradient[0]} stopOpacity="0.9" />
              <stop offset="50%" stopColor="transparent" stopOpacity="0.1" />
              <stop offset="100%" stopColor={theme.coreGradient[1]} stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Outer Orbital Ring with Dotted Scientific Markings */}
          <circle
            cx={center}
            cy={center}
            r={ringR1}
            stroke={`url(#ringGrad-${state}-${size})`}
            strokeWidth={size === 'hero' ? 2 : 1.2}
            strokeDasharray={size === 'hero' ? '8 6 2 6' : '4 3'}
            className="kisan-orbit-outer"
            style={{
              transformOrigin: 'center',
              animation: state !== 'OFFLINE' ? `kisanSpinClockwise ${theme.speedSec} linear infinite` : 'none'
            }}
          />

          {/* Inner Orbital Counter-Rotating Ring */}
          <circle
            cx={center}
            cy={center}
            r={ringR2}
            stroke={theme.ringStroke}
            strokeWidth={size === 'hero' ? 1.5 : 1}
            strokeDasharray={size === 'hero' ? '4 8' : '2 4'}
            className="kisan-orbit-inner"
            style={{
              transformOrigin: 'center',
              animation: state !== 'OFFLINE' ? `kisanSpinCounter ${parseFloat(theme.speedSec) * 1.5}s linear infinite` : 'none'
            }}
          />

          {/* Quantum Orbital Node 1 */}
          {state !== 'OFFLINE' && (
            <circle
              cx={center + ringR1 * Math.cos(Math.PI / 4)}
              cy={center + ringR1 * Math.sin(Math.PI / 4)}
              r={size === 'hero' ? 3.5 : 2}
              fill={theme.coreGradient[0]}
              style={{
                transformOrigin: 'center',
                animation: `kisanSpinClockwise ${theme.speedSec} linear infinite`
              }}
            />
          )}

          {/* Quantum Orbital Node 2 */}
          {state !== 'OFFLINE' && (
            <circle
              cx={center + ringR2 * Math.cos((3 * Math.PI) / 4)}
              cy={center + ringR2 * Math.sin((3 * Math.PI) / 4)}
              r={size === 'hero' ? 2.5 : 1.5}
              fill={theme.coreGradient[1]}
              style={{
                transformOrigin: 'center',
                animation: `kisanSpinCounter ${parseFloat(theme.speedSec) * 1.5}s linear infinite`
              }}
            />
          )}

          {/* Glowing Aura Ring */}
          <circle
            cx={center}
            cy={center}
            r={coreR * 1.6}
            fill={`url(#coreGlow-${state}-${size})`}
            className="kisan-core-halo"
            style={{
              transformOrigin: 'center',
              animation: state !== 'OFFLINE' ? `kisanBreathe 3s ease-in-out infinite` : 'none'
            }}
          />

          {/* Central Luminous Nucleus */}
          <circle
            cx={center}
            cy={center}
            r={coreR}
            fill={theme.coreGradient[0]}
            style={{
              boxShadow: `0 0 10px ${theme.coreGradient[0]}`
            }}
          />
          {/* Inner Light Glint */}
          <circle
            cx={center - coreR * 0.3}
            cy={center - coreR * 0.3}
            r={coreR * 0.35}
            fill="#ffffff"
            opacity="0.85"
          />
        </svg>
      </div>

      {showLabel && (
        <div
          className="kisan-core-label"
          style={{
            marginTop: '6px',
            fontSize: size === 'hero' ? '0.85rem' : '0.72rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 500,
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: theme.coreGradient[0],
              display: 'inline-block'
            }}
          />
          {theme.statusText}
        </div>
      )}
    </div>
  );
};
