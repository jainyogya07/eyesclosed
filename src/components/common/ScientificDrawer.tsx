import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, Database, Cpu } from 'lucide-react';

interface ScientificDrawerProps {
  title?: string;
  whyExplanation: React.ReactNode;
  evidenceContent?: React.ReactNode;
  scientificDetails?: {
    modelProvenance?: string;
    metrics?: Record<string, string | number>;
    uncertainty?: string;
    stationValidation?: string;
  };
  defaultOpenLevel?: 0 | 1 | 2; // 0 = collapsed, 1 = why open, 2 = scientific open
}

export const ScientificDrawer: React.FC<ScientificDrawerProps> = ({
  title = 'यह सलाह क्यों? (Why this advisory?)',
  whyExplanation,
  evidenceContent,
  scientificDetails
}) => {
  const [level2Open, setLevel2Open] = useState(false);
  const [level4Open, setLevel4Open] = useState(false);

  return (
    <div
      style={{
        marginTop: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'rgba(255, 255, 255, 0.75)',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
    >
      {/* LEVEL 2 TRIGGER: "यह सलाह क्यों?" */}
      <button
        onClick={() => setLevel2Open(!level2Open)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 18px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          fontWeight: 600
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--color-earth-emerald)', fontSize: '1.1rem' }}>🌱</span>
          {title}
        </span>
        {level2Open ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
      </button>

      {/* LEVEL 2 & 3 CONTENT */}
      {level2Open && (
        <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ paddingTop: '12px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {whyExplanation}
          </div>

          {evidenceContent && (
            <div
              style={{
                marginTop: '14px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-subtle)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={14} color="var(--color-atmosphere-blue)" />
                प्राप्त साक्ष्य (Telemetry Evidence):
              </div>
              {evidenceContent}
            </div>
          )}

          {/* LEVEL 4 TRIGGER: Scientific details */}
          {scientificDetails && (
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => setLevel4Open(!level4Open)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: '1px dashed var(--border-card)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <Cpu size={14} color="var(--color-quantum-violet)" />
                {level4Open ? 'Hide Scientific Validation & Model Metrics' : 'Expand Scientific Provenance & Error Bounds (Jury / Expert)'}
              </button>

              {level4Open && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '14px',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem'
                  }}
                >
                  {scientificDetails.modelProvenance && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>PROVENANCE: </span>
                      <span style={{ color: 'var(--text-primary)' }}>{scientificDetails.modelProvenance}</span>
                    </div>
                  )}

                  {scientificDetails.uncertainty && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>CONFORMAL UNCERTAINTY: </span>
                      <span style={{ color: 'var(--color-atmosphere-blue)', fontWeight: 600 }}>{scientificDetails.uncertainty}</span>
                    </div>
                  )}

                  {scientificDetails.stationValidation && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>VALIDATION BASE: </span>
                      <span style={{ color: 'var(--text-primary)' }}>{scientificDetails.stationValidation}</span>
                    </div>
                  )}

                  {scientificDetails.metrics && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '10px' }}>
                      {Object.entries(scientificDetails.metrics).map(([k, v]) => (
                        <div key={k} style={{ padding: '6px 8px', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{k}</div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
