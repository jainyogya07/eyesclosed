import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Layers,
  CloudSun,
  Wheat,
  Droplets,
  AlertTriangle,
  MapPin,
  Send,
  FileText,
  Activity,
  TrendingUp,
  Sliders,
  FileCheck,
  Building2,
  Truck,
  Compass,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Film
} from 'lucide-react';
import { useRole } from '../../contexts/RoleContext';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { role, scope, activePanchayat } = useRole();
  const { language } = useApp();
  const pageLocation = useLocation();

  const en = language === 'en';
  const isHome = pageLocation.pathname === '/home' || pageLocation.pathname === '/';
  const isLogin = pageLocation.pathname === '/login';

  if (isLogin || isHome) return null;

  // Role-specific navigation links
  const roleNavItems = (() => {
    switch (role) {
      case 'panchayat_officer':
        return [
          { to: '/panchayat-officer/dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: Layers },
          { to: '/panchayat-officer/weather', labelEn: 'Weather (1km)', labelHi: 'मौसम (1 किमी)', icon: CloudSun },
          { to: '/panchayat-officer/crops', labelEn: 'Crops & Farms', labelHi: 'फसल व खेत', icon: Wheat },
          { to: '/panchayat-officer/water', labelEn: 'Water Situation', labelHi: 'जल स्थिति', icon: Droplets },
          { to: '/panchayat-officer/risk', labelEn: 'Risk & Alerts', labelHi: 'जोखिम व अलर्ट', icon: AlertTriangle },
          { to: '/panchayat-officer/gis', labelEn: 'GIS Map', labelHi: 'मानचित्र', icon: MapPin },
          { to: '/panchayat-officer/advisories', labelEn: 'Local Advisories', labelHi: 'स्थानीय सलाह', icon: Send },
          { to: '/panchayat-officer/reports', labelEn: 'Reports & Export', labelHi: 'रिपोर्ट्स', icon: FileText }
        ];

      case 'agriculture_expert':
        return [
          { to: '/agriculture-expert/dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: Layers },
          { to: '/agriculture-expert/crop-intelligence', labelEn: 'Crop Intelligence', labelHi: 'फसल विश्लेषण', icon: Wheat },
          { to: '/agriculture-expert/soil', labelEn: 'Soil Intelligence', labelHi: 'मृदा विश्लेषण', icon: Activity },
          { to: '/agriculture-expert/weather-impact', labelEn: 'Weather Impact', labelHi: 'मौसम प्रभाव', icon: CloudSun },
          { to: '/agriculture-expert/crop-suitability', labelEn: 'Suitability Matrix', labelHi: 'उपयुक्तता मैट्रिक्स', icon: TrendingUp },
          { to: '/agriculture-expert/irrigation', labelEn: 'Irrigation & ETc', labelHi: 'सिंचाई (ETc)', icon: Droplets },
          { to: '/agriculture-expert/climate-scenarios', labelEn: 'Climate Scenarios', labelHi: 'सिनेरियो सिमुलेटर', icon: Sliders },
          { to: '/agriculture-expert/advisory-studio', labelEn: 'Advisory Studio', labelHi: 'परामर्श केंद्र', icon: FileCheck }
        ];

      case 'district_officer':
      default:
        return [
          { to: '/district-officer/dashboard', labelEn: 'District Overview', labelHi: 'जिला अवलोकन', icon: Layers },
          { to: '/district-officer/panchayats', labelEn: 'Panchayat Comparison', labelHi: 'पंचायत तुलना', icon: Building2 },
          { to: '/district-officer/weather', labelEn: 'Weather Intelligence', labelHi: 'मौसम कमान', icon: CloudSun },
          { to: '/district-officer/risk-command', labelEn: 'Risk Command', labelHi: 'आपदा केंद्र', icon: ShieldAlert },
          { to: '/district-officer/water', labelEn: 'Water Resources', labelHi: 'जल संसाधन', icon: Droplets },
          { to: '/district-officer/resource-planning', labelEn: 'Resource Planning', labelHi: 'संसाधन नियोजन', icon: Truck },
          { to: '/district-officer/scenarios', labelEn: 'District Scenarios', labelHi: 'परिदृश्य योजना', icon: Compass },
          { to: '/district-officer/reports', labelEn: 'District Reports', labelHi: 'जिला रिपोर्ट्स', icon: FileText }
        ];
    }
  })();

  const farmerTools = [
    { to: '/my-farm', labelEn: 'My Farm Center', labelHi: 'मेरा खेत केंद्र', icon: Sprout },
    { to: '/learn', labelEn: 'Kisan Shorts / Reels', labelHi: '🎬 सीखें (रील्स)', icon: Film }
  ];

  return (
    <aside
      className="modern-sidebar"
      style={{
        position: 'fixed',
        left: 0,
        top: '64px',
        bottom: 0,
        width: collapsed ? '68px' : '230px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderRight: '1.5px solid rgba(226, 232, 240, 0.95)',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow: '2px 0 16px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden'
      }}
      aria-label="Role Navigation Sidebar"
    >
      {/* Top Header & Collapse Toggle */}
      <div
        style={{
          padding: collapsed ? '12px 0' : '14px 16px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between'
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#059669',
                boxShadow: '0 0 8px #059669'
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              {en ? scope.titleEn : scope.titleHi}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? (en ? 'Expand Sidebar' : 'साइडबार खोलें') : (en ? 'Collapse Sidebar' : 'साइडबार छोटा करें')}
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Link Items */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: collapsed ? '10px 8px' : '10px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Role Section */}
        <div>
          {!collapsed && (
            <div
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: '#94a3b8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 10px 6px'
              }}
            >
              {en ? 'Role Intelligence' : 'दायित्व कार्यप्रणाली'}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {roleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pageLocation.pathname === item.to;
              const label = en ? item.labelEn : item.labelHi;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0' : '10px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '9px 0' : '8px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: isActive ? 800 : 600,
                    background: isActive ? '#ecfdf5' : 'transparent',
                    color: isActive ? '#059669' : '#334155',
                    border: isActive ? '1px solid #a7f3d0' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#059669' : '#64748b'} />
                  {!collapsed && (
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Farmer Tools Section */}
        <div>
          {!collapsed && (
            <div
              style={{
                fontSize: '0.66rem',
                fontWeight: 800,
                color: '#94a3b8',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '4px 10px 6px'
              }}
            >
              {en ? 'Farmer Action Hub' : 'किसान सेवाएं'}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {farmerTools.map((item) => {
              const Icon = item.icon;
              const isActive = pageLocation.pathname === item.to;
              const label = en ? item.labelEn : item.labelHi;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: collapsed ? '0' : '10px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '8px 0' : '7px 12px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 800 : 500,
                    background: isActive ? '#f0fdf4' : 'transparent',
                    color: isActive ? '#059669' : '#475569',
                    border: isActive ? '1px solid #bbf7d0' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={17} color={isActive ? '#059669' : '#94a3b8'} />
                  {!collapsed && (
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Section: Location Pill & GPS Auto-Detect */}
      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          padding: collapsed ? '10px 6px' : '12px 14px',
          background: 'rgba(248, 250, 252, 0.8)'
        }}
      >
        {!collapsed ? (
          <div>
            <span style={{ fontSize: '0.64rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {en ? 'Active Region Scope' : 'सक्रिय कार्यक्षेत्र'}
            </span>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
              {scope.scopeBadgeEn}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '4px 8px', borderRadius: '6px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#047857' }}>
                {en ? 'Live 1km Telemetry' : 'लाइव टेलीमेट्री'}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }} title={scope.scopeBadgeEn}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          </div>
        )}
      </div>
    </aside>
  );
};
