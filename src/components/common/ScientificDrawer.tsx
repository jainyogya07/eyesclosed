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
        border: '1px solid rgba(182, 178, 67, 0.25)',
        background: 'rgba(22, 24, 10, 0.82)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
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
          color: 'var(--farmora-light)',
          fontSize: '0.95rem',
          fontWeight: 700
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--farmora-lime)', fontSize: '1.1rem' }}>🌱</span>
          <span style={{ color: 'var(--farmora-wheat)' }}>{title}</span>
        </span>
        {level2Open ? (
          <ChevronUp size={18} color="var(--farmora-lime)" />
        ) : (
          <ChevronDown size={18} color="var(--farmora-platinum)" />
        )}
      </button>

      {/* LEVEL 2 & 3 CONTENT */}
      {level2Open && (
        <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid rgba(182, 178, 67, 0.15)' }}>
          <div style={{ paddingTop: '12px', fontSize: '0.92rem', color: 'var(--farmora-platinum)', lineHeight: 1.6 }}>
            {whyExplanation}
          </div>

          {evidenceContent && (
            <div
              style={{
                marginTop: '14px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(12, 13, 5, 0.7)',
                border: '1px solid rgba(182, 178, 67, 0.2)',
                fontSize: '0.85rem'
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: 'var(--farmora-light)',
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Database size={14} color="var(--farmora-lime)" />
                <span style={{ color: 'var(--farmora-lime)' }}>प्राप्त साक्ष्य (Telemetry Evidence):</span>
              </div>
              <div style={{ color: 'var(--farmora-platinum)' }}>
                {evidenceContent}
              </div>
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
                  background: 'rgba(182, 178, 67, 0.08)',
                  border: '1px dashed rgba(182, 178, 67, 0.35)',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--farmora-wheat)',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Cpu size={14} color="var(--farmora-lime)" />
                {level4Open ? 'Hide Scientific Validation & Model Metrics' : 'Expand Scientific Provenance & Error Bounds (Jury / Expert)'}
              </button>

              {level4Open && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '14px',
                    background: 'rgba(12, 13, 5, 0.9)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(182, 178, 67, 0.25)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem'
                  }}
                >
                  {scientificDetails.modelProvenance && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--farmora-platinum)' }}>PROVENANCE: </span>
                      <span style={{ color: 'var(--farmora-wheat)', fontWeight: 600 }}>{scientificDetails.modelProvenance}</span>
                    </div>
                  )}

                  {scientificDetails.uncertainty && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--farmora-platinum)' }}>CONFORMAL UNCERTAINTY: </span>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>{scientificDetails.uncertainty}</span>
                    </div>
                  )}

                  {scientificDetails.stationValidation && (
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'var(--farmora-platinum)' }}>VALIDATION BASE: </span>
                      <span style={{ color: 'var(--farmora-light)' }}>{scientificDetails.stationValidation}</span>
                    </div>
                  )}

                  {scientificDetails.metrics && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', marginTop: '10px' }}>
                      {Object.entries(scientificDetails.metrics).map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            padding: '8px 10px',
                            background: 'rgba(22, 24, 10, 0.95)',
                            borderRadius: '6px',
                            border: '1px solid rgba(182, 178, 67, 0.3)'
                          }}
                        >
                          <div style={{ color: 'var(--farmora-platinum)', fontSize: '0.68rem' }}>{k}</div>
                          <div style={{ color: 'var(--farmora-lime)', fontWeight: 800, fontSize: '0.9rem', marginTop: '2px' }}>{v}</div>
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
