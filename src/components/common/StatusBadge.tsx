import React from 'react';

export type StatusVariant =
  | 'live'
  | 'pilot'
  | 'frozen'
  | 'demo'
  | 'offline'
  | 'simulation'
  | 'prototype'
  | 'unavailable'
  | 'critical';

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'sm',
  pulse = false
}) => {
  // Farmora Agritech Luxury Palette Configurations
  const configs: Record<StatusVariant, { text: string; bg: string; color: string; border: string; dot: string }> = {
    live: {
      text: 'LIVE TELEMETRY',
      bg: 'rgba(182, 178, 67, 0.15)', // Farmora Electric Lime
      color: '#B6B243',
      border: 'rgba(182, 178, 67, 0.4)',
      dot: '#B6B243'
    },
    pilot: {
      text: 'PILOT DATA',
      bg: 'rgba(152, 105, 36, 0.2)', // Farmora Harvest Bronze
      color: '#D7CE93',
      border: 'rgba(152, 105, 36, 0.45)',
      dot: '#986924'
    },
    frozen: {
      text: 'FROZEN PILOT (72H)',
      bg: 'rgba(101, 134, 101, 0.2)', // Farmora Sage
      color: '#a3e635',
      border: 'rgba(101, 134, 101, 0.45)',
      dot: '#658665'
    },
    demo: {
      text: 'DEMONSTRATION MODE',
      bg: 'rgba(56, 189, 248, 0.15)',
      color: '#7dd3fc',
      border: 'rgba(56, 189, 248, 0.35)',
      dot: '#38bdf8'
    },
    simulation: {
      text: '3D SIMULATION',
      bg: 'rgba(139, 92, 246, 0.18)',
      color: '#c4b5fd',
      border: 'rgba(139, 92, 246, 0.4)',
      dot: '#a855f7'
    },
    prototype: {
      text: 'PROTOTYPE ENGINE',
      bg: 'rgba(251, 251, 251, 0.08)',
      color: '#AEAEAD',
      border: 'rgba(251, 251, 251, 0.2)',
      dot: '#AEAEAD'
    },
    unavailable: {
      text: 'NOT AVAILABLE',
      bg: 'rgba(120, 113, 108, 0.15)',
      color: '#a8a29e',
      border: 'rgba(120, 113, 108, 0.3)',
      dot: '#78716c'
    },
    offline: {
      text: 'OFFLINE / STANDBY',
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#fca5a5',
      border: 'rgba(239, 68, 68, 0.35)',
      dot: '#ef4444'
    },
    critical: {
      text: 'HAZARD THRESHOLD',
      bg: 'rgba(239, 68, 68, 0.22)',
      color: '#f87171',
      border: 'rgba(239, 68, 68, 0.55)',
      dot: '#dc2626'
    }
  };

  const cfg = configs[status] || configs.pilot;
  const displayLabel = label || cfg.text;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: size === 'sm' ? '3px 9px' : '5px 14px',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: '9999px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size === 'sm' ? '0.7rem' : '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        lineHeight: 1,
        backdropFilter: 'blur(8px)',
        boxShadow: pulse ? `0 0 12px ${cfg.bg}` : 'none'
      }}
    >
      <span
        style={{
          width: size === 'sm' ? 6 : 8,
          height: size === 'sm' ? 6 : 8,
          borderRadius: '50%',
          backgroundColor: cfg.dot,
          animation: pulse ? 'kisanPulse 2s infinite' : 'none',
          display: 'inline-block',
          boxShadow: `0 0 6px ${cfg.dot}`
        }}
      />
      {displayLabel}
    </span>
  );
};
