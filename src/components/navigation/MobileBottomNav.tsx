import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MapPin,
  CloudSun,
  Sparkles,
  Layers,
  Sprout,
  Droplets,
  ShieldAlert,
  Cpu,
  ShieldCheck,
  Database,
  BookOpen,
  X,
  ChevronRight,
  Globe2
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { language, setLanguage, location } = useApp();
  const pageLocation = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const hi = language === 'hi';

  const isExploreActive = [
    '/agriculture',
    '/irrigation',
    '/hazards',
    '/digital-twin',
    '/model-lab',
    '/validation',
    '/data-center',
    '/features',
    '/about'
  ].includes(pageLocation.pathname);

  const mainTabs = [
    {
      to: '/home',
      label: hi ? 'होम' : 'Home',
      icon: Home,
      exact: true
    },
    {
      to: '/panchayat',
      label: hi ? 'पंचायत' : 'Panchayat',
      icon: MapPin,
      exact: false
    },
    {
      to: '/weather',
      label: hi ? 'मौसम' : 'Weather',
      icon: CloudSun,
      exact: false
    },
    {
      to: '/decision-center',
      label: hi ? 'सलाह' : 'Advice',
      icon: Sparkles,
      exact: false
    }
  ];

  const exploreItems = [
    {
      to: '/agriculture',
      label: hi ? 'फसल देखभाल' : 'Crop Care',
      desc: hi ? 'उपग्रह रिमोट सेंसिंग व पोषण' : 'Phenology & health',
      icon: Sprout,
      color: '#059669',
      bg: '#ecfdf5'
    },
    {
      to: '/irrigation',
      label: hi ? 'सिंचाई व खाद' : 'Water & Nutrients',
      desc: hi ? 'मिट्टी नमी व जल बचत' : 'Root zone & ET budget',
      icon: Droplets,
      color: '#0284c7',
      bg: '#f0f9ff'
    },
    {
      to: '/hazards',
      label: hi ? 'जोखिम अलर्ट' : 'Hazard Alerts',
      desc: hi ? 'बाढ़, पाला व लू की चेतावनी' : 'Flood, frost & heat',
      icon: ShieldAlert,
      color: '#dc2626',
      bg: '#fef2f2'
    },
    {
      to: '/digital-twin',
      label: hi ? 'डिजिटल ट्विन 3D' : 'Digital Twin 3D',
      desc: hi ? 'खेत सिमुलेशन मॉडल' : 'Physics-informed twin',
      icon: Layers,
      color: '#7c3aed',
      bg: '#f5f3ff'
    },
    {
      to: '/model-lab',
      label: hi ? 'AI मॉडल लैब' : 'AI Model Lab',
      desc: hi ? 'M1–M10 वैज्ञानिक कैस्केड' : 'Scientific cascade M1–M10',
      icon: Cpu,
      color: '#d97706',
      bg: '#fffbeb'
    },
    {
      to: '/validation',
      label: hi ? 'सत्यापन मेट्रिक्स' : 'Validation',
      desc: hi ? 'पायलट ग्राउंड ट्रुथ मेट्रिक्स' : 'Ground truth & telemetry',
      icon: ShieldCheck,
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      to: '/data-center',
      label: hi ? 'डेटा सेंटर' : 'Data Center',
      desc: hi ? 'कृषि डेटा इंफ्रास्ट्रक्चर' : 'Data streams & telemetry',
      icon: Database,
      color: '#0891b2',
      bg: '#ecfeff'
    },
    {
      to: '/features',
      label: hi ? 'सभी फीचर्स' : 'All Features',
      desc: hi ? 'प्लेटफॉर्म क्षमताएं' : 'Architecture & features',
      icon: BookOpen,
      color: '#4f46e5',
      bg: '#eef2ff'
    }
  ];

  return (
    <>
      {/* Gluestack UI Kitten Inspired Floating / Docked Bottom Navigation */}
      <nav className="gluestack-bottom-bar" aria-label="Mobile Navigation">
        <div className="gluestack-bar-content">
          {mainTabs.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pageLocation.pathname === to || (to === '/home' && pageLocation.pathname === '/')
              : pageLocation.pathname === to;

            return (
              <NavLink
                key={to}
                to={to}
                className={`gluestack-tab-item ${isActive ? 'is-active' : ''}`}
              >
                <div className="gluestack-tab-icon-wrap">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && <span className="gluestack-tab-dot" />}
                </div>
                <span className="gluestack-tab-label">{label}</span>
              </NavLink>
            );
          })}

          {/* Explore / More Action Sheet Trigger */}
          <button
            type="button"
            className={`gluestack-tab-item gluestack-explore-btn ${
              isExploreActive || sheetOpen ? 'is-active' : ''
            }`}
            onClick={() => setSheetOpen(true)}
            aria-label="Open exploration menu"
          >
            <div className="gluestack-tab-icon-wrap">
              <Layers size={20} strokeWidth={isExploreActive || sheetOpen ? 2.5 : 2} />
              {(isExploreActive || sheetOpen) && <span className="gluestack-tab-dot" />}
            </div>
            <span className="gluestack-tab-label">{hi ? 'मेन्यू' : 'Explore'}</span>
          </button>
        </div>
      </nav>

      {/* Gluestack Action Sheet (Bottom Drawer) */}
      {sheetOpen && (
        <div
          className="gluestack-sheet-backdrop"
          onClick={() => setSheetOpen(false)}
          role="presentation"
        >
          <div
            className="gluestack-sheet-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Grab Handle */}
            <div className="gluestack-sheet-handle-wrap">
              <span className="gluestack-sheet-handle" />
            </div>

            {/* Sheet Header */}
            <div className="gluestack-sheet-header">
              <div>
                <span className="gluestack-sheet-kicker">
                  {location.panchayatName} · {hi ? 'अन्वेषण' : 'Navigation Hub'}
                </span>
                <h3 className="gluestack-sheet-title">
                  {hi ? 'कृषि सेवाएं एवं वैज्ञानिक टूल्स' : 'Agricultural Intelligence Suite'}
                </h3>
              </div>
              <button
                type="button"
                className="gluestack-sheet-close"
                onClick={() => setSheetOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Language Switcher in Sheet */}
            <div className="gluestack-sheet-lang-row">
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                <Globe2 size={15} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {hi ? 'भाषा (Language)' : 'Language'}
              </span>
              <div className="gluestack-lang-pill-group">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`gluestack-lang-pill ${!hi ? 'selected' : ''}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('hi')}
                  className={`gluestack-lang-pill ${hi ? 'selected' : ''}`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            {/* Explore Grid */}
            <div className="gluestack-sheet-grid">
              {exploreItems.map(({ to, label, desc, icon: ItemIcon, color, bg }) => {
                const isSelected = pageLocation.pathname === to;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setSheetOpen(false)}
                    className={`gluestack-sheet-card ${isSelected ? 'active-sheet-card' : ''}`}
                  >
                    <div
                      className="gluestack-sheet-card-icon"
                      style={{ color, background: bg }}
                    >
                      <ItemIcon size={20} />
                    </div>
                    <div className="gluestack-sheet-card-info">
                      <strong className="gluestack-sheet-card-title">{label}</strong>
                      <span className="gluestack-sheet-card-desc">{desc}</span>
                    </div>
                    <ChevronRight size={16} className="gluestack-sheet-card-arrow" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
