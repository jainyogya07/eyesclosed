import React from 'react';
import { NavLink } from 'react-router-dom';
import { CheckCircle2, CloudSun, Home, MapPinned } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { language } = useApp();
  const items = [
    ['/home', Home, language === 'hi' ? 'होम' : 'Home'],
    ['/weather', CloudSun, language === 'hi' ? 'मौसम' : 'Weather'],
    ['/decision-center', CheckCircle2, language === 'hi' ? 'सलाह' : 'Advice'],
    ['/panchayat', MapPinned, language === 'hi' ? 'पंचायत' : 'Panchayat'],
  ] as const;
  return <nav className="mobile-bottom-nav" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90, background: 'rgba(255,255,255,.98)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-subtle)', boxShadow: '0 -2px 10px rgba(0,0,0,.05)', padding: '7px 14px 10px', justifyContent: 'space-around', alignItems: 'center' }}>
    {items.map(([to, Icon, label]) => <NavLink key={to} to={to} end={to === '/home'} style={({ isActive }) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textDecoration: 'none', color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-muted)', fontSize: '.67rem', fontWeight: isActive ? 800 : 600 })}><Icon size={18} /><span>{label}</span></NavLink>)}
  </nav>;
};
