import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Sprout, Droplets, Ruler, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { useFarm } from '../../contexts/FarmContext';
import { useApp } from '../../contexts/AppContext';

export const FarmContextBar: React.FC = () => {
  const { farm, resetFarm, loadDemoFarm } = useFarm();
  const { language } = useApp();
  const navigate = useNavigate();
  const en = language === 'en';

  if (!farm.isConfigured) {
    return (
      <div
        style={{
          background: 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '6px 16px',
          fontSize: '0.78rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
          <MapPin size={14} color="#059669" />
          <span>{en ? 'No Farm Configured' : 'कोई खेत सेट नहीं है'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={loadDemoFarm}
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '3px 12px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={12} color="#059669" />
            <span>{en ? 'Try Demo Farm' : 'डेमो खेत देखें'}</span>
          </button>

          <Link
            to="/setup"
            style={{
              background: '#059669',
              color: '#ffffff',
              padding: '3px 12px',
              borderRadius: '999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{en ? 'Configure Farm' : 'अपना खेत सेट करें'}</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: farm.isDemo ? 'rgba(255, 251, 235, 0.95)' : 'rgba(240, 253, 244, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${farm.isDemo ? '#fde68a' : '#bbf7d0'}`,
        padding: '5px 18px',
        fontSize: '0.76rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
        {farm.isDemo && (
          <span
            style={{
              background: '#d97706',
              color: '#ffffff',
              fontSize: '0.62rem',
              fontWeight: 900,
              padding: '1px 6px',
              borderRadius: '999px',
              letterSpacing: '0.04em'
            }}
          >
            DEMO DATA
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0f172a', fontWeight: 700 }}>
          <MapPin size={13} color="#059669" />
          <span>{en ? farm.panchayat.name : `${farm.panchayat.hi} (${farm.panchayat.name})`}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155' }}>
          <Sprout size={13} color="#16a34a" />
          <span>
            {en ? (farm.crop.nameEn || farm.crop.nameHi) : (farm.crop.nameHi || farm.crop.nameEn)}{' '}
            <span style={{ color: '#059669', fontWeight: 600 }}>({farm.crop.stage || 'Vegetative'})</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155' }}>
          <Ruler size={13} color="#d97706" />
          <span>{farm.landArea} {farm.landUnit === 'bigha' ? (en ? 'Bigha' : 'बीघा') : (en ? 'Acre' : 'एकड़')}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155' }}>
          <Droplets size={13} color="#0284c7" />
          <span>
            {farm.waterSource === 'tubewell'
              ? (en ? 'Tubewell' : 'नलकूप')
              : farm.waterSource === 'canal'
              ? (en ? 'Canal' : 'नहर')
              : (en ? 'Rainfed' : 'बारिश')}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => navigate('/setup')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#059669',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {en ? '[ Change Farm ]' : '[ बदलें ]'}
        </button>

        <button
          type="button"
          onClick={resetFarm}
          title="Reset Farm"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <RotateCcw size={11} />
          <span>{en ? 'Reset' : 'रीसेट'}</span>
        </button>
      </div>
    </div>
  );
};
