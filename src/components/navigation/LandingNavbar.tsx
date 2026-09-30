import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Globe2,
  ChevronRight,
  Sprout,
  PlayCircle,
  Layers,
  Sparkles,
  Building2,
  Info
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useFarm } from '../../contexts/FarmContext';
import { HeaderSocialIcons } from '../brand/SocialIcons';

export const LandingNavbar: React.FC = () => {
  const { language, setLanguage } = useApp();
  const { farm } = useFarm();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hi = language === 'hi';

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className="landing-navbar"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'linear-gradient(180deg, rgba(10, 22, 12, 0.88) 0%, rgba(10, 22, 12, 0.45) 80%, transparent 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand / Logo */}
        <Link
          to="/home"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            outline: 'none'
          }}
        >
          <img
            src="/assets/mausam-setu-logo.png"
            alt="MausamSetu - Sahi Samay, Sahi Salah, Har Kisaan Tak"
            style={{
              height: '46px',
              width: 'auto',
              maxWidth: '210px',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
            }}
          />
        </Link>

        {/* Center Navigation Links - Desktop */}
        <nav
          className="landing-nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '22px'
          }}
        >
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '6px 4px',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
          >
            <span>🌾</span>
            <span>{hi ? 'सुविधाएं' : 'Features'}</span>
          </button>

          <Link
            to="/learn"
            style={{
              color: '#e2e8f0',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '6px 4px',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
          >
            <span>🎬</span>
            <span>{hi ? 'सीखें व शॉर्ट्स' : 'Learn (Videos)'}</span>
          </Link>

          <Link
            to="/digital-twin"
            style={{
              color: '#e2e8f0',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '6px 4px',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
          >
            <span>🌐</span>
            <span>{hi ? '3D ट्विन' : 'Digital Twin'}</span>
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection('about-us')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              padding: '6px 4px',
              transition: 'color 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#86efac')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#e2e8f0')}
          >
            <span>👥</span>
            <span>{hi ? 'हमारे बारे में' : 'About Us'}</span>
          </button>

          <Link
            to="/panchayat-officer/dashboard"
            style={{
              color: '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
            title={hi ? 'अधिकारी व वैज्ञानिक डैशबोर्ड' : 'Officer & Scientist Portals'}
          >
            <span>🏛️</span>
            <span>{hi ? 'अधिकारी लॉगिन' : 'Officer Hub'}</span>
          </Link>
        </nav>

        {/* Right Section: Small Social Icons + Language Switcher + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          {/* Small Social Media Icons: YouTube, Twitter/X, Instagram */}
          <div className="landing-header-socials">
            <HeaderSocialIcons light={true} />
          </div>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLanguage(hi ? 'en' : 'hi')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              color: '#ffffff',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
              e.currentTarget.style.borderColor = '#86efac';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.24)';
            }}
            title={hi ? 'Switch to English' : 'हिंदी में बदलें'}
          >
            <Globe2 size={13} color="#86efac" />
            <span>{hi ? 'EN' : 'हि'}</span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => navigate(farm.isConfigured ? '/my-farm' : '/setup')}
            className="landing-primary-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '9px 18px',
              borderRadius: '999px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(16, 185, 129, 0.38)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(16, 185, 129, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(16, 185, 129, 0.38)';
            }}
          >
            <span>🌾</span>
            <span>{farm.isConfigured ? (hi ? 'मेरा खेत खोलें' : 'Open My Farm') : (hi ? 'अपना खेत खोलें' : 'Open Farm')}</span>
            <ChevronRight size={15} />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className="landing-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'rgba(10, 22, 12, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <button
            type="button"
            onClick={() => scrollToSection('features')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.94rem',
              fontWeight: 700,
              textAlign: 'left',
              padding: '8px 0',
              cursor: 'pointer'
            }}
          >
            🌾 {hi ? 'सुविधाएं' : 'Features'}
          </button>

          <Link
            to="/learn"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#ffffff',
              fontSize: '0.94rem',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '8px 0'
            }}
          >
            🎬 {hi ? 'सीखें व शॉर्ट्स' : 'Learn (Videos)'}
          </Link>

          <Link
            to="/digital-twin"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#ffffff',
              fontSize: '0.94rem',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '8px 0'
            }}
          >
            🌐 {hi ? '3D डिजिटल ट्विन' : 'Digital Twin'}
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection('about-us')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.94rem',
              fontWeight: 700,
              textAlign: 'left',
              padding: '8px 0',
              cursor: 'pointer'
            }}
          >
            👥 {hi ? 'हमारे बारे में' : 'About Us'}
          </button>

          <Link
            to="/panchayat-officer/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#86efac',
              fontSize: '0.94rem',
              fontWeight: 700,
              textDecoration: 'none',
              padding: '8px 0'
            }}
          >
            🏛️ {hi ? 'अधिकारी व वैज्ञानिक डैशबोर्ड' : 'Officer & Scientist Portals'}
          </Link>

          {/* Social Links on Mobile */}
          <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
              {hi ? 'सोशल मीडिया व वीडियो' : 'Social Media & Videos'}:
            </span>
            <HeaderSocialIcons light={true} />
          </div>

          {/* Language Switcher & Farm Button on Mobile */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => {
                setLanguage(hi ? 'en' : 'hi');
                setMobileMenuOpen(false);
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.84rem'
              }}
            >
              {hi ? 'Switch to English' : 'हिंदी में बदलें'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate(farm.isConfigured ? '/my-farm' : '/setup');
              }}
              style={{
                flex: 1.5,
                padding: '10px',
                borderRadius: '10px',
                background: '#059669',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.84rem'
              }}
            >
              🌾 {farm.isConfigured ? (hi ? 'मेरा खेत' : 'My Farm') : (hi ? 'खेत जोड़ें' : 'Setup')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
