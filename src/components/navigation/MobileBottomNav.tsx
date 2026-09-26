import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  Home,
  LayoutDashboard,
  CheckCircle2,
  CloudSun,
  Layers
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { language } = useApp();

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        display: 'none', // Shown via CSS media query
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
        padding: '6px 12px 10px 12px',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}
    >
      <NavLink
        to="/"
        end
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: isActive ? 700 : 500
        })}
      >
        <Home size={18} />
        <span>{language === 'hi' ? 'होम' : 'Home'}</span>
      </NavLink>

      <NavLink
        to="/dashboard"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: isActive ? 700 : 500
        })}
      >
        <LayoutDashboard size={18} />
        <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
      </NavLink>

      <NavLink
        to="/decision-center"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--color-earth-emerald)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: isActive ? 700 : 600
        })}
      >
        <CheckCircle2 size={18} />
        <span>{language === 'hi' ? 'सलाह' : 'Advice'}</span>
      </NavLink>

      <NavLink
        to="/weather"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--color-atmosphere-blue)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: isActive ? 700 : 500
        })}
      >
        <CloudSun size={18} />
        <span>{language === 'hi' ? 'मौसम' : 'Weather'}</span>
      </NavLink>

      <NavLink
        to="/digital-twin"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--color-quantum-violet)' : 'var(--text-muted)',
          fontSize: '0.68rem',
          fontWeight: isActive ? 700 : 500
        })}
      >
        <Layers size={18} />
        <span>{language === 'hi' ? 'ट्विन' : 'Twin'}</span>
      </NavLink>
    </nav>
  );
};
