import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudSun, Sprout, Satellite, Radio } from 'lucide-react';
import { KisaanLogo } from '../brand/KisaanLogo';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusIndex, setStatusIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const statusMessages = [
    { hi: 'स्थानीय मौसम व उपग्रह सेंसर कनेक्ट हो रहे हैं...', en: 'Syncing Hyperlocal AWS & Satellite Telemetry...' },
    { hi: 'सेंटिनल-2 मिट्टी की नमी व वनस्पति सूचकांक लोड हो रहे हैं...', en: 'Loading Sentinel-2 Soil Moisture & NDVI...' },
    { hi: '1-किमी फसल निर्णय मॉडल सक्रिय...', en: 'Activating 1-km Crop Intelligence Cascade...' },
    { hi: 'मौसम सेतु तैयार है!', en: 'Mausam Setu Ready!' }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(48);
      setStatusIndex(1);
    }, 320);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusIndex(2);
    }, 650);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusIndex(3);
    }, 950);

    const timerEnd = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerEnd);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mausam-setu-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#07150a',
            backgroundImage:
              'radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.12) 0%, rgba(7, 21, 10, 0.98) 75%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            overflow: 'hidden',
            pointerEvents: 'all'
          }}
        >
          {/* Concentric Radar Pulse Rings */}
          <div
            style={{
              position: 'relative',
              width: '140px',
              height: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '28px'
            }}
          >
            {/* Animated Expanding Rings */}
            <motion.div
              animate={{
                scale: [1, 2.2],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1.5px solid rgba(168, 224, 99, 0.4)',
                pointerEvents: 'none'
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.7],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: 0.6,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                pointerEvents: 'none'
              }}
            />

            {/* Glowing Center Brand Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'relative',
                zIndex: 2,
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                boxShadow: '0 0 35px rgba(16, 185, 129, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <KisaanLogo size={42} />
            </motion.div>
          </div>

          {/* Brand Name & Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            style={{ textAlign: 'center', marginBottom: '24px', padding: '0 20px' }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(168, 224, 99, 0.14)',
                border: '1px solid rgba(168, 224, 99, 0.3)',
                color: '#a8e063',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}
            >
              <Radio size={13} className="radar-pulse-icon" />
              <span>मौसम सेतु · Mausam Setu</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.75rem, 4.5vw, 2.4rem)',
                fontWeight: 800,
                color: '#ffffff',
                margin: '0 0 6px 0',
                letterSpacing: '-0.02em'
              }}
            >
              मौसम सेतु
            </h1>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'rgba(215, 228, 214, 0.85)',
                margin: 0,
                fontWeight: 500
              }}
            >
              हाइपरलोकल मौसम, मिट्टी व AI कृषि निर्णय प्रणाली
            </p>
          </motion.div>

          {/* Progress Bar Container */}
          <div
            style={{
              width: 'min(280px, 80vw)',
              height: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '16px',
              position: 'relative'
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #a8e063)',
                borderRadius: '999px',
                boxShadow: '0 0 10px rgba(168, 224, 99, 0.8)'
              }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>

          {/* Dynamic Status Text */}
          <motion.div
            key={statusIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{
              fontSize: '0.78rem',
              color: '#a6b8a5',
              fontWeight: 600,
              textAlign: 'center',
              maxWidth: '340px',
              padding: '0 16px',
              minHeight: '22px'
            }}
          >
            {statusMessages[statusIndex].hi}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
