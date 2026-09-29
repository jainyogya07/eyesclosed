import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Sprout, CloudSun, CalendarCheck, Layers } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { language } = useApp();

  return (
    <nav
      className="mobile-bottom-nav farmora-glass"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: '12px',
        left: '12px',
        right: '12px',
        zIndex: 100,
        borderRadius: 'var(--radius-full)',
        padding: '8px 16px',
        justifyContent: 'space-around',
        alignItems: 'center',
        border: '1.5px solid rgba(182, 178, 67, 0.35)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8)'
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
          color: isActive ? 'var(--farmora-lime)' : 'var(--farmora-platinum)',
          fontSize: '0.72rem',
          fontWeight: isActive ? 800 : 500
        })}
      >
        <Home size={20} />
        <span>{language === 'hi' ? 'होम' : 'Home'}</span>
      </NavLink>

      <NavLink
        to="/my-farm"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--farmora-lime)' : 'var(--farmora-platinum)',
          fontSize: '0.72rem',
          fontWeight: isActive ? 800 : 500
        })}
      >
        <Sprout size={20} />
        <span>{language === 'hi' ? 'मेरा खेत' : 'My Farm'}</span>
      </NavLink>

      <NavLink
        to="/weather"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--farmora-lime)' : 'var(--farmora-platinum)',
          fontSize: '0.72rem',
          fontWeight: isActive ? 800 : 500
        })}
      >
        <CloudSun size={20} />
        <span>{language === 'hi' ? 'मौसम' : 'Weather'}</span>
      </NavLink>

      <NavLink
        to="/advice"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--farmora-lime)' : 'var(--farmora-platinum)',
          fontSize: '0.72rem',
          fontWeight: isActive ? 800 : 500
        })}
      >
        <CalendarCheck size={20} />
        <span>{language === 'hi' ? 'सलाह' : 'Advice'}</span>
      </NavLink>

      <NavLink
        to="/digital-twin"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: isActive ? 'var(--farmora-lime)' : 'var(--farmora-platinum)',
          fontSize: '0.72rem',
          fontWeight: isActive ? 800 : 500
        })}
      >
        <Layers size={20} />
        <span>3D Twin</span>
      </NavLink>
    </nav>
  );
};
