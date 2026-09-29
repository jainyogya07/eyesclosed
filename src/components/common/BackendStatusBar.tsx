/**
 * BackendStatusBar — Live backend connectivity indicator
 * Shows whether M1-M10 models are live or in demo/offline mode.
 */
import React from 'react';
import { useLivePrediction } from '../../providers/LivePredictionProvider';
import { Wifi, WifiOff, RefreshCw, Activity } from 'lucide-react';

export const BackendStatusBar: React.FC = () => {
  const { backendStatus, lastUpdated, isLoading, refreshAll, modelCount } = useLivePrediction();

  const statusConfig = {
    online: { color: '#10b981', label: 'Live Data', icon: <Activity size={13} />, bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
    connecting: { color: '#f59e0b', label: 'Connecting…', icon: <RefreshCw size={13} className="spin" />, bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    offline: { color: '#ef4444', label: 'Backend Offline', icon: <WifiOff size={13} />, bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.3)' },
    demo: { color: '#8b5cf6', label: 'Demo Mode', icon: <Wifi size={13} />, bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.3)' },
  };

  const cfg = statusConfig[backendStatus];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '6px 14px',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: '8px',
      fontSize: '0.72rem',
      fontFamily: 'var(--font-mono)',
      flexWrap: 'wrap',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: cfg.color, fontWeight: 700 }}>
        {cfg.icon} {cfg.label}
      </span>

      {backendStatus === 'online' && (
        <>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            {modelCount.frozen}/{modelCount.total} models active
          </span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-muted)' }}>
            MAE 0.4083°C · R² 0.9827
          </span>
        </>
      )}

      {lastUpdated && (
        <>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--text-muted)' }}>
            Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </>
      )}

      {backendStatus === 'offline' && (
        <span style={{ color: 'var(--text-muted)' }}>
          (Showing static demo data — start backend with <code style={{ background: 'rgba(0,0,0,0.1)', padding: '1px 4px', borderRadius: 3 }}>uvicorn backend.app.main:app</code>)
        </span>
      )}

      <button
        onClick={refreshAll}
        disabled={isLoading}
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px',
          background: 'transparent',
          border: `1px solid ${cfg.border}`,
          borderRadius: '5px',
          color: cfg.color,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '0.68rem',
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        <RefreshCw size={11} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
        Refresh
      </button>
    </div>
  );
};
