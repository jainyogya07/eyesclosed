import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Sprout,
  CloudSun,
  SlidersHorizontal,
  Mic,
  AlertTriangle,
  TestTube
} from 'lucide-react';

export type TabId = 'input' | 'sinchai' | 'fasal' | 'mausam' | 'scenario' | 'awaaz' | 'alerts';

export interface VerticalActionTabsProps {
  activeTab: TabId;
  onSelectTab: (tabId: TabId) => void;
  isVoiceActive?: boolean;
}

export const TABS_CONFIG: {
  id: TabId;
  icon: React.ComponentType<any>;
  labelHi: string;
  labelEn: string;
  badge?: string;
  color: string;
}[] = [
  {
    id: 'input',
    icon: TestTube,
    labelHi: 'खेत व मिट्टी इनपुट',
    labelEn: 'Farm & Soil Input',
    badge: 'SETUP',
    color: '#059669' // Emerald
  },
  {
    id: 'sinchai',
    icon: Droplets,
    labelHi: 'सिंचाई फैसला',
    labelEn: 'Irrigation Action',
    badge: 'TODAY',
    color: '#0284c7' // Atmospheric Sky Blue
  },
  {
    id: 'fasal',
    icon: Sprout,
    labelHi: 'फसल सिफारिश',
    labelEn: 'Crop Suitability',
    badge: '88%',
    color: '#16a34a' // Green
  },
  {
    id: 'mausam',
    icon: CloudSun,
    labelHi: '1-किमी मौसम',
    labelEn: 'Hyperlocal Weather',
    color: '#0891b2' // Cyan
  },
  {
    id: 'scenario',
    icon: SlidersHorizontal,
    labelHi: 'जलवायु सिम्युलेटर',
    labelEn: 'Climate Stress Sandbox',
    badge: 'AI',
    color: '#d97706' // Amber
  },
  {
    id: 'awaaz',
    icon: Mic,
    labelHi: 'किसान वाणी (माइक)',
    labelEn: 'Voice Assistant (Speak)',
    badge: 'MIC',
    color: '#db2777' // Rose Pink
  },
  {
    id: 'alerts',
    icon: AlertTriangle,
    labelHi: 'पंचायत चेतावनी',
    labelEn: 'Hazard Alerts',
    badge: '1',
    color: '#dc2626' // Red
  }
];

export const VerticalActionTabs: React.FC<VerticalActionTabsProps> = ({
  activeTab,
  onSelectTab,
  isVoiceActive = false
}) => {
  const [hoveredTab, setHoveredTab] = useState<TabId | null>(null);

  return (
    <aside
      aria-label="Quick Section Navigator"
      className="vertical-action-tabs"
      style={{
        position: 'fixed',
        right: 'clamp(0.75rem, 2vw, 1.5rem)',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 90,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 8px',
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '999px',
        border: '1.5px solid rgba(203, 213, 225, 0.8)',
        boxShadow: '0 12px 30px rgba(15, 23, 42, 0.10), 0 2px 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      {TABS_CONFIG.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isHovered = hoveredTab === tab.id;
        const isMicTab = tab.id === 'awaaz';

        return (
          <div
            key={tab.id}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {/* Left Tooltip Flying Out on Hover or Active */}
            <AnimatePresence>
              {(isHovered || (isActive && hoveredTab === null)) && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 6, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    right: '100%',
                    marginRight: '12px',
                    whiteSpace: 'nowrap',
                    background: '#ffffff',
                    border: `1.5px solid ${isActive ? tab.color : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '6px 14px',
                    color: '#0f172a',
                    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 100
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                    {tab.labelHi}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    ({tab.labelEn})
                  </span>
                  {tab.badge && (
                    <span
                      style={{
                        background: tab.color,
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: '999px',
                        lineHeight: 1.2
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Circular Tab Button */}
            <motion.button
              type="button"
              onClick={() => onSelectTab(tab.id)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.92 }}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                background: isActive
                  ? `${tab.color}15`
                  : 'transparent',
                color: isActive ? tab.color : '#64748b',
                transition: 'all 0.2s ease'
              }}
              title={tab.labelHi}
            >
              {/* Active Selection Glow Ring */}
              {isActive && (
                <motion.div
                  layoutId="verticalTabGlow"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  style={{
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '50%',
                    border: `2px solid ${tab.color}`,
                    boxShadow: `0 0 10px ${tab.color}40`,
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Pulsing Voice Indicator if mic active */}
              {isMicTab && isVoiceActive && (
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    background: '#db2777',
                    pointerEvents: 'none'
                  }}
                />
              )}

              <Icon size={19} />

              {/* Notification badge */}
              {tab.badge && !isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: tab.color
                  }}
                />
              )}
            </motion.button>
          </div>
        );
      })}
    </aside>
  );
};
