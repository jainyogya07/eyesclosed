import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Sprout,
  CloudSun,
  SlidersHorizontal,
  Mic,
  AlertTriangle,
  Volume2
} from 'lucide-react';

export type TabId = 'sinchai' | 'fasal' | 'mausam' | 'scenario' | 'awaaz' | 'alerts';

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
    id: 'sinchai',
    icon: Droplets,
    labelHi: 'सिंचाई फैसला',
    labelEn: 'Irrigation Action',
    badge: 'आज',
    color: '#06b6d4' // Cyan
  },
  {
    id: 'fasal',
    icon: Sprout,
    labelHi: 'फसल सिफारिश',
    labelEn: 'Top Crop Suitability',
    badge: '88%',
    color: '#10b981' // Emerald
  },
  {
    id: 'mausam',
    icon: CloudSun,
    labelHi: '1-किमी मौसम',
    labelEn: 'Hyperlocal Weather',
    color: '#38bdf8' // Sky
  },
  {
    id: 'scenario',
    icon: SlidersHorizontal,
    labelHi: 'जलवायु सिम्युलेटर',
    labelEn: 'Climate Stress Sandbox',
    badge: 'AI',
    color: '#f59e0b' // Amber
  },
  {
    id: 'awaaz',
    icon: Mic,
    labelHi: 'किसान वाणी (माइक)',
    labelEn: 'Voice Assistant (Speak)',
    badge: 'LIVE',
    color: '#ec4899' // Pink / Voice
  },
  {
    id: 'alerts',
    icon: AlertTriangle,
    labelHi: 'पंचायत चेतावनी',
    labelEn: 'Disaster & Hazard Alerts',
    badge: '1',
    color: '#ef4444' // Red
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
      aria-label="Quick Navigator"
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
        gap: '10px',
        padding: '10px 8px',
        background: 'rgba(5, 15, 10, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '999px',
        border: '1px solid rgba(74, 222, 128, 0.25)',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6), 0 0 20px rgba(5, 150, 105, 0.15)'
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
                  initial={{ opacity: 0, x: 12, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    right: '100%',
                    marginRight: '12px',
                    whiteSpace: 'nowrap',
                    background: 'rgba(10, 22, 15, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isActive ? tab.color : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: '12px',
                    padding: '6px 14px',
                    color: '#f8fafc',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 100
                  }}
                >
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.01em' }}>
                    {tab.labelHi}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    ({tab.labelEn})
                  </span>
                  {tab.badge && (
                    <span
                      style={{
                        background: tab.color,
                        color: '#051b11',
                        fontSize: '0.65rem',
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
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                background: isActive
                  ? `radial-gradient(circle, ${tab.color}33 0%, rgba(255,255,255,0.05) 80%)`
                  : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? tab.color : '#94a3b8',
                transition: 'all 0.25s ease'
              }}
              title={tab.labelHi}
            >
              {/* Active Selection Glow Ring */}
              {isActive && (
                <motion.div
                  layoutId="verticalTabGlow"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  style={{
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '50%',
                    border: `2px solid ${tab.color}`,
                    boxShadow: `0 0 16px ${tab.color}88`,
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
                    background: '#ec4899',
                    pointerEvents: 'none'
                  }}
                />
              )}

              <Icon size={20} />

              {/* Small notification badge */}
              {tab.badge && !isActive && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: tab.color,
                    boxShadow: `0 0 8px ${tab.color}`
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
