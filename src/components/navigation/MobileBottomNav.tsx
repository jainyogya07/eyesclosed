import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  Home,
  CloudSun,
  Sprout,
  CheckCircle2,
  Compass,
  Layers,
  Cpu,
  ShieldCheck,
  Database,
  X
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { language } = useApp();
  const [exploreModalOpen, setExploreModalOpen] = useState(false);

  return (
    <>
      <nav
        className="mobile-bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid var(--border-subtle)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          zIndex: 99,
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 8px'
        }}
      >
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-secondary)',
            fontSize: '0.7rem',
            fontWeight: isActive ? 700 : 500
          })}
        >
          <Home size={20} />
          <span>{language === 'hi' ? 'होम' : 'Home'}</span>
        </NavLink>

        <NavLink
          to="/my-farm"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-secondary)',
            fontSize: '0.7rem',
            fontWeight: isActive ? 700 : 500
          })}
        >
          <Sprout size={20} />
          <span>{language === 'hi' ? 'मेरा खेत' : 'My Farm'}</span>
        </NavLink>

        <NavLink
          to="/weather"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-atmosphere-blue)' : 'var(--text-secondary)',
            fontSize: '0.7rem',
            fontWeight: isActive ? 700 : 500
          })}
        >
          <CloudSun size={20} />
          <span>{language === 'hi' ? 'मौसम' : 'Weather'}</span>
        </NavLink>

        <NavLink
          to="/advice"
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-solar-amber)' : 'var(--text-secondary)',
            fontSize: '0.7rem',
            fontWeight: isActive ? 700 : 500
          })}
        >
          <CheckCircle2 size={20} />
          <span>{language === 'hi' ? 'सलाह' : 'Advice'}</span>
        </NavLink>

        <button
          onClick={() => setExploreModalOpen(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'none',
            border: 'none',
            color: exploreModalOpen ? 'var(--color-quantum-violet)' : 'var(--text-secondary)',
            fontSize: '0.7rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          <Compass size={20} />
          <span>{language === 'hi' ? 'अन्वेषण' : 'Explore'}</span>
        </button>
      </nav>

      {/* Explore Bottom Sheet / Modal */}
      {exploreModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}
          onClick={() => setExploreModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px 20px 40px 20px',
              boxShadow: 'var(--shadow-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {language === 'hi' ? 'वैज्ञानिक प्रणाली एवं इन्फ्रास्ट्रक्चर' : 'Scientific Exploration'}
              </div>
              <button
                onClick={() => setExploreModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <NavLink
                to="/digital-twin"
                onClick={() => setExploreModalOpen(false)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <Layers size={22} color="var(--color-quantum-violet)" />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Digital Twin</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>3D Simulation</div>
              </NavLink>

              <NavLink
                to="/model-lab"
                onClick={() => setExploreModalOpen(false)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <Cpu size={22} color="var(--color-atmosphere-blue)" />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Model Lab</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>M1–M10 Registry</div>
              </NavLink>

              <NavLink
                to="/validation"
                onClick={() => setExploreModalOpen(false)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={22} color="var(--color-earth-emerald)" />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Validation</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pilot Metrics</div>
              </NavLink>

              <NavLink
                to="/data-center"
                onClick={() => setExploreModalOpen(false)}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-subtle)',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <Database size={22} color="var(--color-solar-amber)" />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Data Center</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ecosystem</div>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
