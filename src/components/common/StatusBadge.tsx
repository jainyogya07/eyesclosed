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
  const configs: Record<StatusVariant, { text: string; bg: string; color: string; border: string; dot: string }> = {
    live: {
      text: 'LIVE TELEMETRY',
      bg: '#ecfdf5',
      color: '#065f46',
      border: '#a7f3d0',
      dot: '#10b981'
    },
    pilot: {
      text: 'PILOT DATA',
      bg: '#fffbeb',
      color: '#92400e',
      border: '#fde68a',
      dot: '#f59e0b'
    },
    frozen: {
      text: 'FROZEN PILOT (72H)',
      bg: '#f0fdf4',
      color: '#166534',
      border: '#bbf7d0',
      dot: '#22c55e'
    },
    demo: {
      text: 'DEMONSTRATION MODE',
      bg: '#eff6ff',
      color: '#1e40af',
      border: '#bfdbfe',
      dot: '#3b82f6'
    },
    simulation: {
      text: 'SIMULATION',
      bg: '#faf5ff',
      color: '#6b21a8',
      border: '#e9d5ff',
      dot: '#a855f7'
    },
    prototype: {
      text: 'PROTOTYPE ENGINE',
      bg: '#f8fafc',
      color: '#475569',
      border: '#cbd5e1',
      dot: '#64748b'
    },
    unavailable: {
      text: 'NOT AVAILABLE',
      bg: '#f1f5f9',
      color: '#64748b',
      border: '#e2e8f0',
      dot: '#94a3b8'
    },
    offline: {
      text: 'OFFLINE / STANDBY',
      bg: '#fef2f2',
      color: '#991b1b',
      border: '#fecaca',
      dot: '#ef4444'
    },
    critical: {
      text: 'HAZARD THRESHOLD',
      bg: '#fef2f2',
      color: '#991b1b',
      border: '#fca5a5',
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
        padding: size === 'sm' ? '3px 8px' : '5px 12px',
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: '9999px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: size === 'sm' ? '0.7rem' : '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        lineHeight: 1
      }}
    >
      <span
        style={{
          width: size === 'sm' ? 6 : 8,
          height: size === 'sm' ? 6 : 8,
          borderRadius: '50%',
          backgroundColor: cfg.dot,
          animation: pulse ? 'kisanPulse 2s infinite' : 'none',
          display: 'inline-block'
        }}
      />
      {displayLabel}
    </span>
  );
};
