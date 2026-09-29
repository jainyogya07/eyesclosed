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
    ['/panchayat', hi ? 'पंचायत' : 'Panchayat'],
    ['/agriculture', hi ? 'फसल' : 'Crop Intelligence'],
    ['/weather', hi ? 'मौसम' : 'Weather'],
    ['/digital-twin', hi ? 'GIS मानचित्र' : 'GIS Map'],
    ['/irrigation', hi ? 'जल और मिट्टी' : 'Water & Soil'],
    ['/hazards', hi ? 'अलर्ट' : 'Alerts']
  ];
  return <header className={`farmer-nav ${referenceHome ? 'plantiq-nav agripilot-reference-nav' : ''}`}>
    <div className="farmer-nav-inner">
      <Link to="/home" className="brand"><span className="brand-mark"><KisaanLogo size={31} /></span><span><strong>Kisaan Ki Yash</strong><small>{hi ? 'आपके खेत की रोज़ की सलाह' : 'Daily advice for your farm'}</small></span></Link>
      <nav className="farmer-nav-links platform-nav-links">{links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      <div className="nav-actions">
        {!referenceHome && <span className="nav-location"><MapPin size={14} />{location.panchayatName.split(' ')[0]}</span>}
        <button className="language-button" aria-label="Change language" onClick={() => setLanguage(hi ? 'en' : 'hi')}>{hi ? 'EN' : 'हिं'}</button>
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
