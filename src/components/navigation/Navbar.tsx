import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Globe2, LogIn, LogOut, MapPin, Menu, UserRound, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { KisaanLogo } from '../brand/KisaanLogo';

export const Navbar: React.FC = () => {
  const { language, setLanguage, location, isSignedIn, signOut } = useApp();
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const hi = language === 'hi';
  const referenceHome = pageLocation.pathname === '/home' || pageLocation.pathname === '/';
  const links = [
    ['/home', hi ? 'होम' : 'Home'],
    ['/panchayat', hi ? 'मेरी पंचायत' : 'Panchayat'],
    ['/agriculture', hi ? 'फसल सलाह' : 'Crop Care'],
    ['/weather', hi ? 'मौसम' : 'Weather'],
    ['/digital-twin', hi ? 'खेत मानचित्र' : 'Farm Map'],
    ['/irrigation', hi ? 'सिंचाई व खाद' : 'Water & Nutrients'],
    ['/hazards', hi ? 'जोखिम अलर्ट' : 'Alerts']
  ];
  return <header className={`farmer-nav ${referenceHome ? 'plantiq-nav agripilot-reference-nav' : ''}`}>
    <div className="farmer-nav-inner">
      <Link to="/home" className="brand"><span className="brand-mark"><KisaanLogo size={31} /></span><span><strong>Kisaan Ki Yash</strong><small>{hi ? 'आपके खेत की रोज़ की सलाह' : 'Daily advice for your farm'}</small></span></Link>
      <nav className="farmer-nav-links platform-nav-links">{links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <div className="nav-actions">
        {!referenceHome && <span className="nav-location"><MapPin size={14} />{location.panchayatName.split(' ')[0]}</span>}
        
        {/* Unambiguous Segmented Language Switcher */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: referenceHome ? 'rgba(0,0,0,0.25)' : '#e2e8f0', borderRadius: '999px', padding: '2px', border: '1px solid rgba(255,255,255,0.3)' }}>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              background: !hi ? '#059669' : 'transparent',
              color: !hi ? '#ffffff' : (referenceHome ? '#ffffff' : '#475569'),
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
              color: hi ? '#ffffff' : (referenceHome ? '#ffffff' : '#475569'),
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
        <div className="profile-wrap">
          <button className="profile-button" aria-label="Open user profile" onClick={() => setProfileOpen(!profileOpen)}><UserRound size={16} /><span>{isSignedIn ? (hi ? 'प्रोफ़ाइल' : 'Profile') : (hi ? 'साइन इन' : 'Sign in')}</span><ChevronDown size={14} /></button>
          {profileOpen && <div className="profile-menu">
            <div className="profile-menu-title"><Globe2 size={15} /> {hi ? 'भाषा चुनें' : 'Choose language'}</div>
            <div className="profile-language-actions"><button className={!hi ? 'selected' : ''} onClick={() => setLanguage('en')}>English</button><button className={hi ? 'selected' : ''} onClick={() => setLanguage('hi')}>हिंदी</button></div>
            <div className="profile-menu-divider" />
            {isSignedIn ? <button className="profile-action signout" onClick={() => { signOut(); setProfileOpen(false); navigate('/login'); }}><LogOut size={15} />{hi ? 'साइन आउट' : 'Sign out'}</button> : <button className="profile-action" onClick={() => { setProfileOpen(false); navigate('/login'); }}><LogIn size={15} />{hi ? 'साइन इन' : 'Sign in'}</button>}
          </div>}
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
    {menuOpen && <nav className="mobile-menu">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}<NavLink to="/decision-center" onClick={() => setMenuOpen(false)}>{hi ? 'सलाह केंद्र' : 'Advisory center'}</NavLink></nav>}
  </header>;
};
