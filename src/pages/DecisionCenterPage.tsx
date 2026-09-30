import React, { useState } from 'react';
import { FarmerPinpointHub } from '../components/farmer/FarmerPinpointHub';
import { DecisionCenter } from '../components/decisionCenter/DecisionCenter';
import { useApp } from '../contexts/AppContext';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const DecisionCenterPage: React.FC = () => {
  const { language } = useApp();
  const hi = language === 'hi';
  const [activeMode, setActiveMode] = useState<'farmer' | 'scientific'>('farmer');

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* Top Mode Switcher Bar */}
      <div
        style={{
          borderBottom: '1px solid #e2e8f0',
          background: '#ffffff',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#ecfdf5',
              color: '#059669',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid #a7f3d0'
            }}
          >
            {hi ? 'सलाह केंद्र' : 'ADVICE & DECISION CENTER'}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>
            {hi ? 'हाइपरलोकल कृषि निर्णय मंच' : 'Hyperlocal Farm Decision Platform'}
          </span>
        </div>

        {/* Dual Mode Switcher: Farmer vs Scientific */}
        <div
          style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMode('farmer')}
            style={{
              padding: '6px 16px',
              borderRadius: '9px',
              fontSize: '0.8rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              background: activeMode === 'farmer' ? '#ffffff' : 'transparent',
              color: activeMode === 'farmer' ? '#059669' : '#64748b',
              boxShadow: activeMode === 'farmer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            👨‍🌾 {hi ? 'किसान इनपुट व फैसला' : 'Farmer Decision & Input'}
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('scientific')}
            style={{
              padding: '6px 16px',
              borderRadius: '9px',
              fontSize: '0.8rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              background: activeMode === 'scientific' ? '#ffffff' : 'transparent',
              color: activeMode === 'scientific' ? '#0284c7' : '#64748b',
              boxShadow: activeMode === 'scientific' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🔬 {hi ? 'एम10 वैज्ञानिक टेलीमेट्री' : 'M10 Scientific Telemetry'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeMode === 'farmer' ? (
        <FarmerPinpointHub />
      ) : (
        <DecisionCenter />
      )}
    </div>
  );
};
