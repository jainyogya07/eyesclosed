import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { predictionProvider } from '../../providers';
import { KisanIntelligenceCore } from '../ai/KisanIntelligenceCore';
import {
  Compass,
  Radio,
  ChevronDown,
  Layers,
  Cpu,
  ShieldCheck,
  Database,
  Info,
  SlidersHorizontal,
  MapPin,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, viewMode, setViewMode, location } = useApp();
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}
    >
      {/* Prominent Truthfulness Warning Banner when live backend is requested but offline */}
      {dataMode === 'live' && backendUnavailable && (
        <div
          style={{
            background: '#fee2e2',
            borderBottom: '1.5px solid #ef4444',
            padding: '7px 20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#991b1b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 1px 3px rgba(239, 68, 68, 0.1)'
          }}
        >
          <span>🔴 Backend unavailable — showing demo data</span>
          <span style={{ fontSize: '0.74rem', fontWeight: 500, color: '#7f1d1d' }}>
            (FastAPI /api/v1 offline; mock fallback engaged with full disclosure)
          </span>
        </div>
      )}
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        {/* Brand Logo */}
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
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-earth-emerald)' }}>
                (किसान की यश)
              </span>
            </div>
            <div style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              1-KM CLIMATE & AGRI INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'var(--bg-surface-subtle)',
            padding: '3px 6px',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s'
            })}
          >
            {language === 'hi' ? 'होम' : 'Home'}
          </NavLink>

          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s'
            })}
          >
            {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
          </NavLink>

          <NavLink
            to="/decision-center"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.82rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s'
            })}
          >
            {language === 'hi' ? 'कृषि सलाह' : 'Advice'}
          </NavLink>

          <NavLink
            to="/weather"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s'
            })}
          >
            {language === 'hi' ? '1-किमी मौसम' : 'Weather'}
          </NavLink>

          <NavLink
            to="/panchayat"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s'
            })}
          >
            {language === 'hi' ? 'पंचायत' : 'Panchayat'}
          </NavLink>

          <NavLink
            to="/irrigation"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s'
            })}
          >
            {language === 'hi' ? 'सिंचाई (ET)' : 'Irrigation'}
          </NavLink>

          <NavLink
            to="/digital-twin"
            style={({ isActive }) => ({
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--color-quantum-violet)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.82rem',
              boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.15s'
            })}
          >
            {language === 'hi' ? 'डिजिटल ट्विन' : 'Digital Twin'}
          </NavLink>

          {/* More Menu Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              <span>{language === 'hi' ? 'अधिक' : 'More'}</span>
              <ChevronDown size={14} />
            </button>

            {moreDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  width: '210px',
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-card)',
                  padding: '6px',
                  zIndex: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <Link
                  to="/agriculture"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                  className="dropdown-item"
                >
                  <Layers size={15} color="var(--color-earth-emerald)" />
                  <span>{language === 'hi' ? 'फसल व स्वास्थ्य (M5)' : 'Crop State (M5)'}</span>
                </Link>

                <Link
                  to="/hazards"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                  className="dropdown-item"
                >
                  <ShieldCheck size={15} color="var(--color-solar-amber)" />
                  <span>{language === 'hi' ? 'आपदा व जोखिम (M8/M9)' : 'Hazard Intel (M8/M9)'}</span>
                </Link>

                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                <Link
                  to="/model-lab"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                  className="dropdown-item"
                >
                  <Cpu size={15} color="var(--color-atmosphere-blue)" />
                  <span>{language === 'hi' ? 'मॉडल लैब (M1–M10)' : 'Model Lab (M1–M10)'}</span>
                </Link>

                <Link
                  to="/validation"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                  className="dropdown-item"
                >
                  <ShieldCheck size={15} color="var(--color-earth-emerald)" />
                  <span>{language === 'hi' ? 'वैज्ञानिक सत्यापन (Audit)' : 'Scientific Validation'}</span>
                </Link>

                <Link
                  to="/data-center"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                  className="dropdown-item"
                >
                  <Database size={15} color="var(--text-secondary)" />
                  <span>{language === 'hi' ? 'डेटा कैटलॉग' : 'Data Catalog'}</span>
                </Link>

                <Link
                  to="/about"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    color: 'var(--text-primary)'
                  }}
                  className="dropdown-item"
                >
                  <Info size={15} color="var(--color-atmosphere-blue)" />
                  <span>{language === 'hi' ? 'प्लेटफॉर्म के बारे में' : 'About Platform'}</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Mode Toggle, Language Toggle & Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Simple vs Scientific Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'simple' ? 'scientific' : 'simple')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: 'var(--radius-full)',
              border: viewMode === 'scientific' ? '1.5px solid var(--color-atmosphere-blue)' : '1px solid var(--border-card)',
              background: viewMode === 'scientific' ? 'var(--color-atmosphere-subtle)' : 'white',
              color: viewMode === 'scientific' ? 'var(--color-atmosphere-blue)' : 'var(--text-secondary)',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Switch between Farmer Simple View and Reviewer Scientific View"
          >
            <SlidersHorizontal size={13} />
            <span>{viewMode === 'simple' ? (language === 'hi' ? 'सरल मोड' : 'Simple Mode') : (language === 'hi' ? 'वैज्ञानिक मोड' : 'Scientific Mode')}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            style={{
              padding: '5px 9px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-card)',
              background: 'white',
              color: 'var(--text-primary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Toggle Language / भाषा बदलें"
          >
            {language === 'hi' ? 'English' : 'हिंदी'}
          </button>

          {/* Location Chip */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              background: 'var(--bg-surface-subtle)',
              padding: '5px 9px',
              borderRadius: 'var(--radius-sm)'
            }}
            className="location-chip"
          >
            <MapPin size={12} color="var(--color-atmosphere-blue)" />
            <span>{location.panchayatName.split(' ')[0]}</span>
          </div>

          {/* Data Mode Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              background: dataMode === 'live'
                ? (backendUnavailable ? '#fef2f2' : 'var(--color-earth-subtle)')
                : '#fffbeb',
              border: `1px solid ${
                dataMode === 'live'
                  ? (backendUnavailable ? '#f87171' : 'var(--color-earth-light)')
                  : '#fde68a'
              }`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: dataMode === 'live'
                ? (backendUnavailable ? '#b91c1c' : 'var(--color-earth-emerald)')
                : '#b45309'
            }}
          >
            <Radio
              size={10}
              color={
                dataMode === 'live'
                  ? (backendUnavailable ? '#ef4444' : 'var(--color-earth-emerald)')
                  : '#d97706'
              }
            />
            <span>
              {dataMode === 'live'
                ? (backendUnavailable ? 'DEMO FALLBACK' : 'LIVE API')
                : 'PILOT DEMO'}
            </span>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger"
            style={{
              display: 'none',
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'white',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
            {language === 'hi' ? 'होम' : 'Home'}
          </Link>
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
            {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
          </Link>
          <Link to="/decision-center" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-earth-emerald)', fontWeight: 600 }}>
            {language === 'hi' ? 'कृषि निर्णय केंद्र (Advice)' : 'Decision Center'}
          </Link>
          <Link to="/weather" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
            {language === 'hi' ? '1-किमी मौसम' : 'Weather'}
          </Link>
          <Link to="/panchayat" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
            {language === 'hi' ? 'पंचायत' : 'Panchayat'}
          </Link>
          <Link to="/irrigation" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600 }}>
            {language === 'hi' ? 'सिंचाई (ET Demand)' : 'Irrigation'}
          </Link>
          <Link to="/digital-twin" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--color-quantum-violet)', fontWeight: 600 }}>
            {language === 'hi' ? 'डिजिटल ट्विन' : 'Digital Twin'}
          </Link>
          <Link to="/model-lab" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>
            {language === 'hi' ? 'मॉडल लैब (M1–M10)' : 'Model Lab'}
          </Link>
          <Link to="/validation" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>
            {language === 'hi' ? 'सत्यापन रिपोर्ट (Audit)' : 'Validation'}
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-secondary)' }}>
            {language === 'hi' ? 'के बारे में' : 'About'}
          </Link>
        </div>
      )}
    </header>
  );
};
