import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
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
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, viewMode, setViewMode } = useApp();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

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
        top: '12px',
        zIndex: 100,
        maxWidth: '1340px',
        margin: '0 auto',
        padding: '0 1rem'
      }}
    >
      {/* Live backend offline warning banner if applicable */}
      {dataMode === 'live' && backendUnavailable && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid #ef4444',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fca5a5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
          }}
        >
          <span>🔴 Live service unavailable — showing verified demonstration data</span>
        </div>
      )}

      {/* Floating Farmora Glass Capsule Bar */}
      <div
        className="farmora-glass"
        style={{
          borderRadius: 'var(--radius-full)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
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
          <div style={{ filter: 'drop-shadow(0 0 10px rgba(182, 178, 67, 0.6))' }}>
            <KisanIntelligenceCore size="sm" state="PROCESSING" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--farmora-light)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Kisaan Ki Yash
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--farmora-lime)' }}>
                (किसान की यश)
              </span>
            </div>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--farmora-wheat)', letterSpacing: '0.06em' }}>
              FARMORA AGRITECH CASCADE
            </div>
          </div>
        </Link>

        {/* Center: 4 Core Navigation Links */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(251, 251, 251, 0.05)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(182, 178, 67, 0.15)'
          }}
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'var(--farmora-lime)' : 'transparent',
              color: isActive ? 'var(--farmora-dark)' : 'var(--farmora-platinum)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 4px 14px var(--farmora-lime-glow)' : 'none',
              transition: 'all 0.2s ease'
            })}
          >
            {language === 'hi' ? 'होम' : 'Home'}
          </NavLink>

          <NavLink
            to="/my-farm"
            style={({ isActive }) => ({
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'var(--farmora-lime)' : 'transparent',
              color: isActive ? 'var(--farmora-dark)' : 'var(--farmora-platinum)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 4px 14px var(--farmora-lime-glow)' : 'none',
              transition: 'all 0.2s ease'
            })}
          >
            {language === 'hi' ? 'मेरा खेत' : 'My Farm'}
          </NavLink>

          <NavLink
            to="/weather"
            style={({ isActive }) => ({
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'var(--farmora-lime)' : 'transparent',
              color: isActive ? 'var(--farmora-dark)' : 'var(--farmora-platinum)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 4px 14px var(--farmora-lime-glow)' : 'none',
              transition: 'all 0.2s ease'
            })}
          >
            {language === 'hi' ? 'मौसम' : 'Weather'}
          </NavLink>

          <NavLink
            to="/advice"
            style={({ isActive }) => ({
              padding: '7px 18px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'var(--farmora-lime)' : 'transparent',
              color: isActive ? 'var(--farmora-dark)' : 'var(--farmora-platinum)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 4px 14px var(--farmora-lime-glow)' : 'none',
              transition: 'all 0.2s ease'
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
            className="farmora-btn-secondary"
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 800
            }}
          >
            {language === 'hi' ? 'English' : 'हिंदी'}
          </button>

          {/* Simple vs Scientific View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'simple' ? 'scientific' : 'simple')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: viewMode === 'scientific' ? '1.5px solid var(--farmora-lime)' : '1px solid rgba(182, 178, 67, 0.3)',
              background: viewMode === 'scientific' ? 'rgba(182, 178, 67, 0.15)' : 'rgba(251, 251, 251, 0.05)',
              color: viewMode === 'scientific' ? 'var(--farmora-lime)' : 'var(--farmora-platinum)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={15} />
            <span>{viewMode === 'scientific' ? 'Scientific' : 'Farmer'}</span>
          </button>

          {/* Explore Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              onBlur={() => setTimeout(() => setExploreOpen(false), 250)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(182, 178, 67, 0.3)',
                background: 'rgba(251, 251, 251, 0.08)',
                color: 'var(--farmora-light)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{language === 'hi' ? 'अन्वेषण' : 'Explore'}</span>
              <ChevronDown size={14} color="var(--farmora-wheat)" />
            </button>

            {exploreOpen && (
              <div
                className="farmora-glass-elevated"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '270px',
                  borderRadius: 'var(--radius-xl)',
                  padding: '12px',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '6px 12px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--farmora-wheat)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {language === 'hi' ? 'वैज्ञानिक इन्फ्रास्ट्रक्चर' : 'SCIENTIFIC INFRASTRUCTURE'}
                </div>

                <Link
                  to="/digital-twin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--farmora-light)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(182, 178, 67, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Layers size={18} color="var(--farmora-lime)" />
                  <div>
                    <div>3D Digital Twin</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--farmora-platinum)', fontWeight: 400 }}>What-If Simulation Sandbox</div>
                  </div>
                </Link>

                <Link
                  to="/model-lab"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--farmora-light)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(182, 178, 67, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Cpu size={18} color="#38bdf8" />
                  <div>
                    <div>Model Lab</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--farmora-platinum)', fontWeight: 400 }}>M1–M10 Registry</div>
                  </div>
                </Link>

                <Link
                  to="/validation"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--farmora-light)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(182, 178, 67, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <ShieldCheck size={18} color="var(--farmora-wheat)" />
                  <div>
                    <div>Validation & Metrics</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--farmora-platinum)', fontWeight: 400 }}>Locked Pilot AWS Telemetry</div>
                  </div>
                </Link>

                <Link
                  to="/data-center"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--farmora-light)',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(182, 178, 67, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Database size={18} color="var(--farmora-sage)" />
                  <div>
                    <div>Data Center</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--farmora-platinum)', fontWeight: 400 }}>Multimodal Satellite Ecosystem</div>
                  </div>
                </Link>

                <div style={{ height: 1, background: 'rgba(182, 178, 67, 0.2)', margin: '4px 0' }} />

                <Link
                  to="/about"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--farmora-platinum)',
                    fontSize: '0.88rem',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(182, 178, 67, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Info size={18} />
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
