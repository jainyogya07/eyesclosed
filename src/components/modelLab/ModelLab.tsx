import React, { useState, useEffect } from 'react';
import { predictionProvider } from '../../providers';
import { ModelStatus } from '../../types/contracts';
import {
  Cpu,
  Lock,
  GitBranch,
  ShieldCheck,
  AlertCircle,
  Database,
  Search,
  CheckCircle,
  Clock,
  Layers
} from 'lucide-react';

export const ModelLab: React.FC = () => {
  const [models, setModels] = useState<ModelStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await predictionProvider.getModelCatalog();
      setModels(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FROZEN':
      case 'PILOT':
      case 'FROZEN_PILOT':
        return <span className="badge badge-frozen"><Lock size={11} /> FROZEN PILOT</span>;
      case 'DATA_AUDIT':
        return <span className="badge badge-pilot"><Clock size={11} /> DATA AUDIT IN PROGRESS</span>;
      case 'NOT_AVAILABLE':
      default:
        return <span className="badge badge-unavailable">NOT YET AVAILABLE</span>;
    }
  };

  const filteredModels = models.filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.model_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-frozen">100-Agent Orchestration & MLOps</span>
          <span className="badge badge-frozen">Leave-One-Station-Out Protocol</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={28} color="var(--color-atmosphere-blue)" />
              Model Intelligence Lab (M1–M10)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Transparent cryptographic artifact registry tracking the 10 sequential climate and agronomic decision models.
            </p>
          </div>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'white',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter M1–M10 models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                width: '180px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Single-Active Training Queue Invariant Callout */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          background: 'white',
          borderLeft: '4px solid var(--color-earth-emerald)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldCheck size={24} color="var(--color-earth-emerald)" />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Strict Single-Active Training Invariant: ENFORCED
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Master Orchestrator limits active training slots to exactly 1 model at a time. Zero test set leakage allowed.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ color: 'var(--color-earth-emerald)', fontWeight: 600 }}>Frozen Pilots: M01, M02, M03</span>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <span style={{ color: 'var(--color-solar-amber)', fontWeight: 600 }}>Next Active Slot: M04 Soil Moisture</span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {filteredModels.map((m: ModelStatus) => {
          const isPilotOrFrozen = m.status === 'FROZEN' || m.status === 'PILOT';
          const isValidating = m.status === 'VALIDATING';

          return (
            <div
              key={m.model_id}
              className="glass-panel-elevated"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isPilotOrFrozen
                  ? '1.5px solid var(--color-earth-light)'
                  : isValidating
                  ? '1.5px solid var(--color-atmosphere-light)'
                  : '1px solid var(--border-subtle)',
                opacity: m.status === 'NOT_AVAILABLE' ? 0.75 : 1
              }}
            >
              <div>
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--color-atmosphere-blue)'
                      }}
                    >
                      {m.model_id} • STAGE {m.stage_order}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                      {m.full_name}
                    </h3>
                  </div>
                  {getStatusBadge(m.status)}
                </div>

                {/* Framework & Specs */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  <div><strong>Framework:</strong> {m.framework}</div>
                  <div><strong>Spatial Grid:</strong> {m.spatial_resolution}</div>
                  <div><strong>Temporal Cadence:</strong> {m.temporal_cadence}</div>
                </div>

                {/* Metric or Preview Notice */}
                {m.benchmark_metric ? (
                  <div
                    style={{
                      background: m.benchmark_metric.verified ? 'var(--color-earth-subtle)' : 'var(--color-atmosphere-subtle)',
                      border: `1px solid ${m.benchmark_metric.verified ? 'var(--color-earth-light)' : 'var(--color-atmosphere-light)'}`,
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      marginBottom: '14px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {m.benchmark_metric.name.toUpperCase()}
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {m.benchmark_metric.value}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'var(--bg-surface-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '10px 14px',
                      marginBottom: '14px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic'
                    }}
                  >
                    Architecture specified • Awaiting active training slot
                  </div>
                )}

                {/* Cryptographic SHA-256 Checksum */}
                {m.checksum_sha256 && (
                  <div
                    style={{
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      background: 'var(--bg-surface-subtle)',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-secondary)',
                      wordBreak: 'break-all',
                      marginBottom: '14px'
                    }}
                  >
                    SHA-256: {m.checksum_sha256}
                  </div>
                )}
              </div>

              {/* Dependencies List */}
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)'
                }}
              >
                <span>Inputs:</span>
                {m.dependencies.map((dep, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
