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
  BookOpen,
  Activity,
  RefreshCw,
  Radio
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useFarm } from '../../contexts/FarmContext';
import { useRole } from '../../contexts/RoleContext';
import { KisaanLogo } from '../brand/KisaanLogo';
import { realtimeTelemetry, TelemetryPacket } from '../../services/realtimeTelemetryService';

export const Navbar: React.FC = () => {
  const { language, setLanguage, location, isSignedIn, signOut, platformMode, setPlatformMode } = useApp();
  const { farm } = useFarm();
  const { role, setRole, scope } = useRole();
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryPacket>(realtimeTelemetry.getLastPacket());
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  React.useEffect(() => {
    const unsub = realtimeTelemetry.subscribe((pkt) => {
      setTelemetry(pkt);
    });
    return unsub;
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const pkt = realtimeTelemetry.forceSync();
      setTelemetry(pkt);
      setIsSyncing(false);
      setSyncToast(hi ? 'लाइव टेलीमेट्री सिंक संपन्न!' : 'Live telemetry synchronized!');
      setTimeout(() => setSyncToast(null), 3000);
    }, 400);
  };

  const hi = language === 'hi';
  const referenceHome = pageLocation.pathname === '/home' || pageLocation.pathname === '/';

  const primaryLinks = [
    { to: '/home', label: hi ? 'होम' : 'Home' },
    { to: '/my-farm', label: hi ? 'मेरा खेत' : 'My Farm' },
    { to: '/learn', label: hi ? '🎬 सीखें' : '🎬 Learn' },
    { to: '/panchayat', label: hi ? 'पंचायत' : 'Panchayat' },
    { to: '/crops', label: hi ? 'फसल उपयुक्तता' : 'Crops' },
    { to: '/weather', label: hi ? 'मौसम' : 'Weather' },
    { to: '/advice', label: hi ? 'कार्य सलाह' : 'Advice' }
  ];

  const moreLinks = [
    { to: '/explore', label: hi ? 'एक्सप्लोर केंद्र' : 'Explore Suite', icon: Sparkles },
    { to: '/scenario', label: hi ? 'जलवायु परिदृश्य लैब' : 'Climate Scenario Lab', icon: Layers },
    { to: '/water', label: hi ? 'पानी व मिट्टी नमी' : 'Water & Soil Moisture', icon: Droplets },
    { to: '/risks', label: hi ? 'जोखिम व अलर्ट' : 'Hazards & Risks', icon: ShieldAlert },
    { to: '/digital-twin', label: hi ? 'डिजिटल ट्विन 3D' : 'Digital Twin 3D', icon: Sprout },
    { to: '/agriculture', label: hi ? 'सैटेलाइट फसल निगरानी' : 'Satellite Crop Care', icon: CloudSun },
    { to: '/model-lab', label: hi ? 'AI मॉडल लैब (M1–M10)' : 'AI Model Lab (M1–M10)', icon: Cpu },
    { to: '/validation', label: hi ? 'सत्यापन मेट्रिक्स' : 'Pilot Validation Metrics', icon: ShieldCheck },
    { to: '/data-center', label: hi ? 'डेटा केंद्र व टेलीमेट्री' : 'Data Center & Telemetry', icon: Database }
  ];

  const isGovernance =
    pageLocation.pathname.startsWith('/panchayat-officer') ||
    pageLocation.pathname.startsWith('/agriculture-expert') ||
    pageLocation.pathname.startsWith('/district-officer');

  return (
    <header className={`farmer-nav ${referenceHome ? 'plantiq-nav agripilot-reference-nav' : ''}`}>
      <div className="farmer-nav-inner">
        {/* Brand */}
        <Link
          to="/home"
          className="brand borderless-brand"
          aria-label="Mausam Setu Home"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
            padding: 0
          }}
        >
          <img
            src="/assets/mausam-setu-logo.png"
            alt="MausamSetu - Sahi Samay, Sahi Salah, Har Kisaan Tak"
            style={{
              height: '44px',
              width: 'auto',
              maxWidth: '185px',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </Link>

        {/* Role-Based Governance Architecture Switcher */}
        <div
          className="governance-role-switcher"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: referenceHome ? 'rgba(0, 0, 0, 0.45)' : '#f1f5f9',
            borderRadius: '999px',
            padding: '3px',
            border: referenceHome ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid #cbd5e1',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setRole('panchayat_officer');
              navigate('/panchayat-officer/dashboard');
            }}
            title={hi ? 'पंचायत अधिकारी — स्थानीय परिचालन व ग्राम निगरानी' : 'Panchayat Officer — Local Operations & Village Oversight'}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              border: 'none',
              background: role === 'panchayat_officer' ? '#059669' : 'transparent',
              color: role === 'panchayat_officer' ? '#ffffff' : referenceHome ? '#e2e8f0' : '#475569',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>🏛️</span>
            <span>{hi ? 'पंचायत अधिकारी' : 'Panchayat Officer'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('agriculture_expert');
              navigate('/agriculture-expert/dashboard');
            }}
            title={hi ? 'कृषि विशेषज्ञ — फसल उपयुक्तता, मृदा व वैज्ञानिक परामर्श' : 'Agriculture Expert — Agronomy, Soil & Reviewed Advice'}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              border: 'none',
              background: role === 'agriculture_expert' ? '#059669' : 'transparent',
              color: role === 'agriculture_expert' ? '#ffffff' : referenceHome ? '#e2e8f0' : '#475569',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>👨‍🔬</span>
            <span>{hi ? 'कृषि विशेषज्ञ' : 'Agriculture Expert'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole('district_officer');
              navigate('/district-officer/dashboard');
            }}
            title={hi ? 'जिला अधिकारी — प्राथमिकता निर्धारण, तुलना व रणनीतिक कमान' : 'District Officer — Strategic Command & Resource Planning'}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              border: 'none',
              background: role === 'district_officer' ? '#059669' : 'transparent',
              color: role === 'district_officer' ? '#ffffff' : referenceHome ? '#e2e8f0' : '#475569',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>🧑‍💼</span>
            <span>{hi ? 'जिला अधिकारी' : 'District Officer'}</span>
          </button>
        </div>

        {/* Primary Desktop Nav: ONLY show farmer links when NOT in governance mode */}
        {!isGovernance ? (
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
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/my-farm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: '#ffffff',
                border: '1.5px solid #059669',
                color: '#059669',
                fontSize: '0.76rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.08)'
              }}
            >
              <span>👨‍🌾</span>
              <span>{hi ? 'किसान डैशबोर्ड' : 'Farmer Dashboard'}</span>
            </Link>

            <button
              type="button"
              onClick={() => setShowTelemetryModal(!showTelemetryModal)}
              title={hi ? 'रीयल-टाइम बैकएंड टेलीमेट्री कनेक्शन स्थिति देखें' : 'View real-time backend telemetry connection status'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '999px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#065f46',
                fontSize: '0.72rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981'
                }}
              />
              <span>{hi ? `लाइव सिंक (${telemetry.pingMs}ms)` : `Live 1km Sync (${telemetry.pingMs}ms)`}</span>
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Attached Scope Badge */}
          <span
            className="nav-location"
            onClick={() => {
              if (role === 'panchayat_officer') navigate('/panchayat-officer/dashboard');
              else if (role === 'agriculture_expert') navigate('/agriculture-expert/dashboard');
              else navigate('/district-officer/dashboard');
            }}
            title={hi ? 'सक्रिय कार्यक्षेत्र देखें' : 'View active role scope'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '999px',
              background: referenceHome ? 'rgba(0,0,0,0.3)' : '#ecfdf5',
              border: referenceHome ? '1px solid rgba(255,255,255,0.25)' : '1px solid #a7f3d0',
              color: referenceHome ? '#ffffff' : '#065f46',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer'
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
            <span>{hi ? scope.scopeBadgeHi : scope.scopeBadgeEn}</span>
          </span>

          {/* Real-time sync indicator (Global) */}
          <button
            type="button"
            onClick={() => setShowTelemetryModal(!showTelemetryModal)}
            title={hi ? 'रीयल-टाइम बैकएंड टेलीमेट्री स्थिति' : 'Real-time telemetry stream status'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '999px',
              background: referenceHome ? 'rgba(0,0,0,0.3)' : '#ecfdf5',
              border: referenceHome ? '1px solid rgba(255,255,255,0.25)' : '1px solid #a7f3d0',
              color: referenceHome ? '#ffffff' : '#065f46',
              fontSize: '0.72rem',
              fontWeight: 800,
              cursor: 'pointer'
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
            <Activity size={12} color={referenceHome ? '#6ee7b7' : '#059669'} />
            <span>{telemetry.pingMs}ms</span>
          </button>

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

        {/* Real-time Telemetry Stream Modal Popover */}
        {showTelemetryModal && (
          <div
            style={{
              position: 'absolute',
              top: '64px',
              right: '20px',
              width: '360px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.22)',
              border: '1px solid #cbd5e1',
              zIndex: 1000
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Radio size={18} color="#059669" />
                <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>
                  {hi ? 'रीयल-टाइम बैकएंड टेलीमेट्री' : 'Live Real-Time Telemetry Stream'}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setShowTelemetryModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '14px', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Active Node:</span>
                <strong style={{ color: '#0f172a' }}>{telemetry.nodeId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Assigned Region:</span>
                <strong style={{ color: '#059669' }}>{telemetry.panchayat}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Stream Latency:</span>
                <strong style={{ color: '#0284c7' }}>{telemetry.pingMs} ms (WebSocket Active)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Last Heartbeat:</span>
                <span style={{ color: '#475569' }}>{telemetry.timestamp}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px', fontSize: '0.76rem' }}>
              <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <span style={{ color: '#047857', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>LIVE TEMP</span>
                <strong style={{ fontSize: '1.1rem', color: '#065f46' }}>{telemetry.temperatureC}°C</strong>
              </div>
              <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <span style={{ color: '#1d4ed8', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>RAIN (LAST HR)</span>
                <strong style={{ fontSize: '1.1rem', color: '#1e40af' }}>{telemetry.rainLastHourMm} mm</strong>
              </div>
              <div style={{ background: '#fefce8', padding: '10px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <span style={{ color: '#a16207', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>SOIL MOISTURE</span>
                <strong style={{ fontSize: '1.1rem', color: '#854d0e' }}>{telemetry.soilMoisturePct}%</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569', display: 'block', fontSize: '0.68rem', fontWeight: 800 }}>WIND SPEED</span>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{telemetry.windSpeedKmh} km/h</strong>
              </div>
            </div>

            {syncToast && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
                {syncToast}
              </div>
            )}

            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: isSyncing ? 'wait' : 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={15} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isSyncing ? (hi ? 'सिंक हो रहा है...' : 'Syncing Telemetry...') : (hi ? 'मैन्युअल सिंक करें' : 'Trigger Manual Ingest / Sync')}</span>
            </button>
          </div>
        )}
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
