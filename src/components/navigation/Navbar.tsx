import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Globe2,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  UserRound,
  X,
  Layers,
  Sprout,
  CloudSun,
  Droplets,
  ShieldAlert,
  Sparkles,
  Cpu,
  Database,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { KisaanLogo } from '../brand/KisaanLogo';

export const Navbar: React.FC = () => {
  const { language, setLanguage, location, isSignedIn, signOut } = useApp();
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const hi = language === 'hi';
  const referenceHome = pageLocation.pathname === '/home' || pageLocation.pathname === '/';

  const primaryLinks = [
    { to: '/home', label: hi ? 'होम' : 'Home' },
    { to: '/panchayat', label: hi ? 'पंचायत' : 'Panchayat' },
    { to: '/digital-twin', label: hi ? 'डिजिटल ट्विन 3D' : 'Digital Twin 3D' },
    { to: '/agriculture', label: hi ? 'फसल सलाह' : 'Crop Care' },
    { to: '/weather', label: hi ? 'मौसम' : 'Weather' },
    { to: '/irrigation', label: hi ? 'सिंचाई व खाद' : 'Water & Soil' },
    { to: '/hazards', label: hi ? 'जोखिम अलर्ट' : 'Alerts' },
    { to: '/decision-center', label: hi ? 'सलाह केंद्र' : 'Advice' }
  ];

  const moreLinks = [
    { to: '/model-lab', label: hi ? 'AI मॉडल लैब (M1–M10)' : 'AI Model Lab (M1–M10)', icon: Cpu },
    { to: '/validation', label: hi ? 'सत्यापन मेट्रिक्स' : 'Pilot Validation Metrics', icon: ShieldCheck },
    { to: '/data-center', label: hi ? 'डेटा सेंटर व टेलीमेट्री' : 'Data Center & Telemetry', icon: Database },
    { to: '/features', label: hi ? 'सभी 32 फीचर्स' : 'All Platform Features', icon: BookOpen },
    { to: '/about', label: hi ? 'मौसम सेतु के बारे में' : 'About Mausam Setu', icon: Sparkles }
  ];

  return (
    <header className={`farmer-nav ${referenceHome ? 'plantiq-nav agripilot-reference-nav' : ''}`}>
      <div className="farmer-nav-inner">
        {/* Brand */}
        <Link to="/home" className="brand" aria-label="Mausam Setu Home">
          <span className="brand-mark">
            <KisaanLogo size={31} />
          </span>
          <span>
            <strong>Mausam Setu</strong>
            <small>{hi ? 'हाइपरलोकल कृषि व मौसम सेतु' : 'Hyperlocal Farm Climate Bridge'}</small>
          </span>
        </Link>

        {/* Primary Desktop Nav */}
        <nav className="farmer-nav-links platform-nav-links" aria-label="Main Navigation">
          {primaryLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}

          {/* More Dropdown */}
          <div className="profile-wrap" style={{ display: 'inline-block' }}>
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="more-nav-button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: referenceHome ? '#d7dfd6' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '6px 8px'
              }}
            >
              <span>{hi ? 'वैज्ञानिक लैब' : 'More Tools'}</span>
              <ChevronDown size={13} />
            </button>

            {moreOpen && (
              <div
                className="profile-menu"
                style={{ width: '230px', top: 'calc(100% + 6px)' }}
                onMouseLeave={() => setMoreOpen(false)}
              >
                <div className="profile-menu-title">
                  <Cpu size={14} /> {hi ? 'वैज्ञानिक इंफ्रास्ट्रक्चर' : 'Scientific Models'}
                </div>
                {moreLinks.map(({ to, label, icon: SubIcon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#1e293b',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}
                  >
                    <SubIcon size={15} color="#059669" />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Location Badge */}
          <span
            className="nav-location"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '999px',
              background: referenceHome ? 'rgba(0,0,0,0.25)' : '#ecfdf5',
              border: referenceHome ? '1px solid rgba(255,255,255,0.25)' : '1px solid #a7f3d0',
              color: referenceHome ? '#ffffff' : '#065f46',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }}
            />
            <MapPin size={13} />
            <span>{location.panchayatName}</span>
          </span>

          {/* Segmented Language Switcher */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: referenceHome ? 'rgba(0,0,0,0.3)' : '#e2e8f0',
              borderRadius: '999px',
              padding: '2px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              style={{
                background: !hi ? '#059669' : 'transparent',
                color: !hi ? '#ffffff' : referenceHome ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '999px',
                padding: '4px 10px',
                fontWeight: 800,
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              style={{
                background: hi ? '#059669' : 'transparent',
                color: hi ? '#ffffff' : referenceHome ? '#ffffff' : '#475569',
                border: 'none',
                borderRadius: '999px',
                padding: '4px 10px',
                fontWeight: 800,
                fontSize: '0.72rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              हिं
            </button>
          </div>

          {/* User Profile */}
          <div className="profile-wrap">
            <button
              className="profile-button"
              aria-label="Open user profile"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <UserRound size={16} />
              <span>{isSignedIn ? (hi ? 'प्रोफ़ाइल' : 'Profile') : hi ? 'साइन इन' : 'Sign in'}</span>
              <ChevronDown size={14} />
            </button>
            {profileOpen && (
              <div className="profile-menu">
                <div className="profile-menu-title">
                  <Globe2 size={15} /> {hi ? 'भाषा चुनें' : 'Choose language'}
                </div>
                <div className="profile-language-actions">
                  <button className={!hi ? 'selected' : ''} onClick={() => setLanguage('en')}>
                    English
                  </button>
                  <button className={hi ? 'selected' : ''} onClick={() => setLanguage('hi')}>
                    हिंदी
                  </button>
                </div>
                <div className="profile-menu-divider" />
                {isSignedIn ? (
                  <button
                    className="profile-action signout"
                    onClick={() => {
                      signOut();
                      setProfileOpen(false);
                      navigate('/login');
                    }}
                  >
                    <LogOut size={15} />
                    {hi ? 'साइन आउट' : 'Sign out'}
                  </button>
                ) : (
                  <button
                    className="profile-action"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/login');
                    }}
                  >
                    <LogIn size={15} />
                    {hi ? 'साइन इन' : 'Sign in'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Expanded Mobile Menu */}
      {menuOpen && (
        <nav className="mobile-menu" aria-label="Mobile Navigation Drawer">
          <div style={{ padding: '6px 12px 10px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {hi ? 'मुख्य सेवाएं' : 'Core Features'}
          </div>
          {primaryLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '8px 12px' }} />
          <div style={{ padding: '4px 12px 8px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {hi ? 'वैज्ञानिक इंफ्रास्ट्रक्चर' : 'Scientific Models'}
          </div>
          {moreLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};
