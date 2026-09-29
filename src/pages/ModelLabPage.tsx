import React, { useState } from 'react';
import { useLivePrediction } from '../providers/LivePredictionProvider';
import { BackendStatusBar } from '../components/common/BackendStatusBar';
import { useApp } from '../contexts/AppContext';
import { ShieldCheck, Zap, Lock, AlertCircle, ChevronDown, ChevronUp, Activity } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  FROZEN: '#10b981',
  NOT_AVAILABLE: '#94a3b8',
  TRAINING: '#f59e0b',
  PLANNED: '#8b5cf6',
};

export const ModelLabPage: React.FC = () => {
  const { language } = useApp();
  const { data, isLoading } = useLivePrediction();
  const hi = language === 'hi';
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const models = data.modelCatalog;

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-frozen">{hi ? '10-मॉडल AI कैस्केड' : '10-Model AI Cascade'}</span>
          <span className="badge badge-pilot">MAE 0.4083°C · R² 0.9827</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={28} color="var(--color-earth-emerald)" />
          {hi ? 'मॉडल इंटेलिजेंस लैब' : 'AI Model Intelligence Lab'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {hi
            ? 'M1–M10 वैज्ञानिक मशीन लर्निंग कैस्केड की स्थिति और सटीकता।'
            : 'Live status, accuracy benchmarks, and technical architecture of the M1–M10 scientific ML cascade.'}
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <BackendStatusBar />
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[['FROZEN', '✅ Verified & Deployed'], ['NOT_AVAILABLE', '⏳ Not Yet Available'], ['TRAINING', '🔄 Training'], ['PLANNED', '📋 Planned']].map(([status, label]) => (
          <span key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLOR[status], display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>

      {/* Model Cards */}
      {isLoading && models.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          Loading model registry from backend…
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {models.map((model) => {
            const isExpanded = expandedModel === model.model_id;
            const statusColor = STATUS_COLOR[model.status] || '#94a3b8';
            const isFrozen = model.status === 'FROZEN';

            return (
              <div
                key={model.model_id}
                className="glass-panel"
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  border: `1.5px solid ${isFrozen ? 'rgba(16,185,129,0.3)' : 'var(--border-card)'}`,
                  overflow: 'hidden',
                  boxShadow: isFrozen ? '0 0 0 1px rgba(16,185,129,0.1)' : 'var(--shadow-sm)',
                }}
              >
                <div
                  onClick={() => setExpandedModel(isExpanded ? null : model.model_id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {/* Stage badge */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '10px',
                    background: isFrozen ? 'rgba(16,185,129,0.12)' : 'var(--bg-surface-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: statusColor }}>
                      M{model.stage_order}
                    </span>
                  </div>

                  {/* Name and framework */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {model.full_name}
                      </span>
                      <span style={{
                        fontSize: '0.65rem', fontFamily: 'var(--font-mono)', padding: '2px 7px',
                        borderRadius: '4px', background: `${statusColor}18`, color: statusColor, fontWeight: 700
                      }}>
                        {model.status === 'FROZEN' ? '🔒 FROZEN PILOT' : model.status}
                      </span>
                      {model.uncertainty_calibrated && (
                        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', padding: '2px 7px', borderRadius: '4px', background: 'rgba(2,132,199,0.1)', color: '#0284c7', fontWeight: 700 }}>
                          CONFORMAL ✓
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {model.framework}
                    </div>
                  </div>

                  {/* Benchmark */}
                  {model.benchmark_metric && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {model.benchmark_metric.name}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)' }}>
                        {model.benchmark_metric.value}
                        {model.benchmark_metric.verified && <span style={{ marginLeft: 4 }}>✓</span>}
                      </div>
                    </div>
                  )}

                  {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                </div>

                {isExpanded && (
                  <div style={{
                    padding: '0 20px 18px',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '12px',
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Code Name</span>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{model.code_name}</code>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Version</span>
                      <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{model.version}</code>
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 4 }}>Uncertainty Calibration</span>
                      <span style={{ color: model.uncertainty_calibrated ? '#10b981' : '#94a3b8' }}>
                        {model.uncertainty_calibrated ? '✅ Conformal Prediction Intervals' : '⏳ Not calibrated'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Accuracy Summary */}
      <div className="glass-panel" style={{
        marginTop: '2.5rem', padding: '20px 24px', background: 'linear-gradient(135deg, #f0fdf4, #f8fafc)',
        borderRadius: 'var(--radius-xl)', border: '1.5px solid rgba(16,185,129,0.25)',
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#10b981" />
          {hi ? 'सत्यापित सटीकता मेट्रिक्स — AWS_LKO_05' : 'Verified Accuracy Metrics — Test Station AWS_LKO_05'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
          {[
            { label: 'M1 MAE (Temperature)', value: '0.4083°C', delta: '−39.89% vs NWP', color: '#10b981' },
            { label: 'M1 R² Score', value: '0.9827', delta: 'vs Raw NWP R² 0.9124', color: '#10b981' },
            { label: 'M3 Precip RMSE', value: '0.9725 mm/h', delta: '−15.0% vs NWP', color: '#0284c7' },
            { label: 'Conformal Coverage', value: '86.1%', delta: 'Target: ≥80%', color: '#7c3aed' },
            { label: 'Tests Passing', value: '34/34', delta: '100% pass rate', color: '#10b981' },
          ].map(({ label, value, delta, color }) => (
            <div key={label} style={{ padding: '12px 16px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color, fontFamily: 'var(--font-mono)' }}>{value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{delta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
