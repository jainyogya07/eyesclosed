import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { predictionProvider } from '../../providers';
import { KisanIntelligenceCore } from '../ai/KisanIntelligenceCore';
import {
  ChevronDown,
  Layers,
  Cpu,
  ShieldCheck,
  Database,
  Info,
  SlidersHorizontal,
  X,
  Menu,
  Activity,
  Droplets,
  CloudSun
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, viewMode, setViewMode } = useApp();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const navigate = useNavigate();

  const dataMode = (import.meta.env.VITE_DATA_MODE as string) || 'mock';

  useEffect(() => {
    if (predictionProvider.subscribeAvailability) {
      const unsub = predictionProvider.subscribeAvailability((unavail) => {
        setBackendUnavailable(unavail);
      });
      return unsub;
    }
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(252, 251, 249, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
      }}
    >
      {/* Truthfulness Warning Banner when live backend is requested but offline */}
      {dataMode === 'live' && backendUnavailable && (
        <div
          style={{
            background: '#fee2e2',
            borderBottom: '1px solid #ef4444',
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>🔴 Live service unavailable — showing verified demonstration data</span>
        </div>
      )}

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        {/* Left: Kisaan Ki Yash Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <KisanIntelligenceCore size="sm" state="PROCESSING" />
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Kisaan Ki Yash
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-earth-emerald)' }}>
                (किसान की यश)
              </span>
            </div>
            <div style={{ fontSize: '0.64rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              CLIMATE INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Center: ONLY Home, Weather, My Farm, Advice */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-surface-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            })}
          >
            {language === 'hi' ? 'होम' : 'Home'}
          </NavLink>

          <NavLink
            to="/my-farm"
            style={({ isActive }) => ({
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            })}
          >
            {language === 'hi' ? 'मेरा खेत' : 'My Farm'}
          </NavLink>

          <NavLink
            to="/weather"
            style={({ isActive }) => ({
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            })}
          >
            {language === 'hi' ? 'मौसम' : 'Weather'}
          </NavLink>

          <NavLink
            to="/advice"
            style={({ isActive }) => ({
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--color-atmosphere-blue)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s ease'
            })}
          >
            {language === 'hi' ? 'सलाह' : 'Advice'}
          </NavLink>
        </nav>

        {/* Right: Controls & Explore Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-card)',
              background: 'white',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            {language === 'hi' ? 'English' : 'हिंदी'}
          </button>

          {/* Simple vs Scientific View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'simple' ? 'scientific' : 'simple')}
            style={{
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              border: viewMode === 'scientific' ? '1.5px solid var(--color-quantum-violet)' : '1px solid var(--border-card)',
              background: viewMode === 'scientific' ? 'rgba(109, 40, 217, 0.08)' : 'white',
              color: viewMode === 'scientific' ? 'var(--color-quantum-violet)' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ShieldCheck size={14} />
            {viewMode === 'scientific' ? 'Scientific' : 'Farmer'}
          </button>

          {/* Explore Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              onBlur={() => setTimeout(() => setExploreOpen(false), 250)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-card)',
                background: 'white',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <span>{language === 'hi' ? 'अन्वेषण' : 'Explore'}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {exploreOpen && (
              <div
                className="glass-panel-elevated"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '8px',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {language === 'hi' ? 'वैज्ञानिक इन्फ्रास्ट्रक्चर' : 'SCIENTIFIC INFRASTRUCTURE'}
                </div>

                <Link
                  to="/digital-twin"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Layers size={16} color="var(--color-quantum-violet)" />
                  <div>
                    <div>Digital Twin</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>3D What-If Sandbox</div>
                  </div>
                </Link>

                <Link
                  to="/model-lab"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Cpu size={16} color="var(--color-atmosphere-blue)" />
                  <div>
                    <div>Model Lab</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>M1–M10 Registry</div>
                  </div>
                </Link>

                <Link
                  to="/validation"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <ShieldCheck size={16} color="var(--color-earth-emerald)" />
                  <div>
                    <div>Validation & Metrics</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>Locked Pilot Verification</div>
                  </div>
                </Link>

                <Link
                  to="/data-center"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  <Database size={16} color="var(--color-solar-amber)" />
                  <div>
                    <div>Data Center</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>Ecosystem & Ingestion</div>
                  </div>
                </Link>

                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

                <Link
                  to="/about"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.85rem'
                  }}
                >
                  <Info size={16} />
                  <div>About & Principles</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
