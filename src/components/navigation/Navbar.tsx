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
  CloudSun,
  Sparkles
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
        top: '10px',
        zIndex: 100,
        maxWidth: '1320px',
        margin: '0 auto',
        padding: '0 1rem'
      }}
    >
      {/* Live backend offline warning banner if applicable */}
      {dataMode === 'live' && backendUnavailable && (
        <div
          style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '8px',
            boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)'
          }}
        >
          <span>🔴 Live service unavailable — showing verified demonstration data</span>
        </div>
      )}

      {/* Floating Frosted Glass Capsule Bar */}
      <div
        className="cinematic-glass-elevated"
        style={{
          borderRadius: 'var(--radius-full)',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          border: '1.5px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.08)'
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
          <div style={{ filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.35))' }}>
            <KisanIntelligenceCore size="sm" state="PROCESSING" />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Kisaan Ki Yash
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-earth-deep)' }}>
                (किसान की यश)
              </span>
            </div>
            <div style={{ fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              CLIMATE INTELLIGENCE CASCADE
            </div>
          </div>
        </Link>

        {/* Center: ONLY 4 Links (Home, My Farm, Weather, Advice) */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(241, 245, 243, 0.85)',
            padding: '4px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            })}
          >
            {language === 'hi' ? 'होम' : 'Home'}
          </NavLink>

          <NavLink
            to="/my-farm"
            style={({ isActive }) => ({
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'var(--color-earth-deep)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-secondary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 4px 12px rgba(6, 78, 59, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            })}
          >
            {language === 'hi' ? 'मेरा खेत' : 'My Farm'}
          </NavLink>

          <NavLink
            to="/weather"
            style={({ isActive }) => ({
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'var(--color-atmosphere-blue)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-secondary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
              transition: 'all 0.15s ease'
            })}
          >
            {language === 'hi' ? 'मौसम' : 'Weather'}
          </NavLink>

          <NavLink
            to="/advice"
            style={({ isActive }) => ({
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              background: isActive ? 'var(--color-solar-amber)' : 'transparent',
              color: isActive ? 'white' : 'var(--text-secondary)',
              fontWeight: isActive ? 800 : 600,
              fontSize: '0.85rem',
              boxShadow: isActive ? '0 4px 12px rgba(217, 119, 6, 0.3)' : 'none',
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
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(203, 213, 225, 0.8)',
              background: 'white',
              fontSize: '0.8rem',
              fontWeight: 800,
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
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: viewMode === 'scientific' ? '1.5px solid var(--color-quantum-violet)' : '1px solid rgba(203, 213, 225, 0.8)',
              background: viewMode === 'scientific' ? 'rgba(124, 58, 237, 0.12)' : 'white',
              color: viewMode === 'scientific' ? 'var(--color-quantum-violet)' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
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
                border: '1px solid rgba(203, 213, 225, 0.8)',
                background: 'white',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <span>{language === 'hi' ? 'अन्वेषण' : 'Explore'}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </button>

            {exploreOpen && (
              <div
                className="cinematic-glass-elevated"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '260px',
                  borderRadius: 'var(--radius-xl)',
                  padding: '10px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ padding: '6px 12px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  {language === 'hi' ? 'वैज्ञानिक इन्फ्रास्ट्रक्चर' : 'SCIENTIFIC INFRASTRUCTURE'}
                </div>

                <Link
                  to="/digital-twin"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}
                >
                  <Layers size={18} color="var(--color-quantum-violet)" />
                  <div>
                    <div>3D Digital Twin</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>What-If Simulation Sandbox</div>
                  </div>
                </Link>

                <Link
                  to="/model-lab"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}
                >
                  <Cpu size={18} color="var(--color-atmosphere-blue)" />
                  <div>
                    <div>Model Lab</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>M1–M10 Cryptographic Registry</div>
                  </div>
                </Link>

                <Link
                  to="/validation"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}
                >
                  <ShieldCheck size={18} color="var(--color-earth-deep)" />
                  <div>
                    <div>Validation & Metrics</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>Locked Pilot AWS Telemetry</div>
                  </div>
                </Link>

                <Link
                  to="/data-center"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.88rem',
                    fontWeight: 700
                  }}
                >
                  <Database size={18} color="var(--color-solar-amber)" />
                  <div>
                    <div>Data Center</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 400 }}>Multimodal Satellite Ecosystem</div>
                  </div>
                </Link>

                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

                <Link
                  to="/about"
                  className="dropdown-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem'
                  }}
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
