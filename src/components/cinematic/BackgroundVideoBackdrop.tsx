import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Video, Eye, EyeOff, SlidersHorizontal, Check, Sparkles } from 'lucide-react';

export interface BackgroundVideoOption {
  id: string;
  titleHi: string;
  titleEn: string;
  subtitleHi: string;
  subtitleEn: string;
  src: string;
  icon: string;
  tag: string;
}

export const BACKGROUND_VIDEOS: BackgroundVideoOption[] = [
  {
    id: 'rice_field',
    titleHi: 'लहलहाता धान का खेत',
    titleEn: 'Lush Paddy Field',
    subtitleHi: '1-किमी फसल कैनोपी एवं सूक्ष्म-जलवायु',
    subtitleEn: '1-km crop canopy & micro-climate boundary',
    src: '/assets/videos/rice_field.mp4',
    icon: '🌾',
    tag: 'M5 Phenology'
  },
  {
    id: 'clouds_loop',
    titleHi: 'मानसून वर्षा बादल',
    titleEn: 'Monsoon Clouds Loop',
    subtitleHi: 'M3 दो-चरणीय वर्षा डाउनस्केलिंग',
    subtitleEn: 'M3 Hurdle precipitation downscaling',
    src: '/assets/videos/clouds_loop_720p.mp4',
    icon: '🌧️',
    tag: 'M3 Rain'
  },
  {
    id: 'earth_rotation',
    titleHi: 'अंतरिक्ष से घूमती पृथ्वी',
    titleEn: 'Rotating Earth Telemetry',
    subtitleHi: 'INSAT-3DR व सिनॉप्टिक अवलोकन',
    subtitleEn: 'INSAT-3DR synoptic space observation',
    src: '/assets/videos/earth_rotation.mp4',
    icon: '🛰️',
    tag: 'M1 Synoptic'
  },
  {
    id: 'field_irrigation',
    titleHi: 'सटीक खेत सिंचाई',
    titleEn: 'Field Irrigation Flow',
    subtitleHi: 'M6 वाष्पोत्सर्जन एवं जल संरक्षण',
    subtitleEn: 'M6 ET & crop water saving advisory',
    src: '/assets/videos/field_irrigation.mp4',
    icon: '💧',
    tag: 'M6 Irrigation'
  }
];

interface BackgroundVideoBackdropProps {
  initialVideoId?: string;
  defaultOpacity?: number; // 0.0 to 1.0
  showControls?: boolean;
  blendOverlay?: string;
  className?: string;
}

export const BackgroundVideoBackdrop: React.FC<BackgroundVideoBackdropProps> = ({
  initialVideoId = 'rice_field',
  defaultOpacity = 0.22,
  showControls = true,
  blendOverlay,
  className = ''
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialVideoId);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<number>(defaultOpacity);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeVideo = BACKGROUND_VIDEOS.find((v) => v.id === selectedId) || BACKGROUND_VIDEOS[0];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Autoplay blocked fallback
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, selectedId]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleSelectVideo = (id: string) => {
    setSelectedId(id);
    setIsPlaying(true);
    if (opacity === 0) {
      setOpacity(0.22);
    }
  };

  return (
    <div
      className={`ambient-video-backdrop-root ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
    >
      {/* HTML5 Local Video Loop */}
      <video
        key={activeVideo.src}
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          opacity: opacity,
          transition: 'opacity 0.6s ease-in-out',
          filter: 'saturate(1.25) contrast(1.08) brightness(0.95)'
        }}
      >
        <source src={activeVideo.src} type="video/mp4" />
      </video>

      {/* Light Theme Preservation Gradient Masks */}
      {/* 1. Base radial wash to keep center-left content ultra-legible */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            blendOverlay ||
            'radial-gradient(ellipse at 75% 35%, rgba(224, 242, 254, 0.45) 0%, rgba(248, 250, 252, 0.88) 60%, rgba(248, 250, 252, 0.98) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* 2. Top-to-bottom edge vignette fade */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(248, 250, 252, 0.4) 0%, transparent 20%, transparent 80%, rgba(248, 250, 252, 0.95) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Interactive Ambient Control Pill */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            bottom: '18px',
            right: '24px',
            pointerEvents: 'auto',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Expanded Video Picker Flyout */}
          {panelOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '46px',
                right: 0,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid var(--border-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
                padding: '12px',
                width: '320px',
                animation: 'farmoraFadeIn 0.25s ease-out'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#059669" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Cinematic Atmosphere
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-primary-green)',
                    fontWeight: 700
                  }}
                >
                  LOCAL 100% OFFLINE
                </span>
              </div>

              {/* Video List Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                {BACKGROUND_VIDEOS.map((item) => {
                  const isActive = item.id === selectedId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectVideo(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        border: isActive ? '1.5px solid #059669' : '1px solid var(--border-subtle)',
                        background: isActive ? '#ecfdf5' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {item.titleHi}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                            {item.titleEn}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-mono)',
                            background: isActive ? 'rgba(5, 150, 105, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                            color: isActive ? '#047857' : 'var(--text-secondary)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}
                        >
                          {item.tag}
                        </span>
                        {isActive && <Check size={14} color="#059669" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Opacity Adjustment Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)'
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Intensiy / घनत्व:
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { label: 'Off', val: 0 },
                    { label: '15%', val: 0.15 },
                    { label: '25%', val: 0.25 },
                    { label: '40%', val: 0.40 }
                  ].map((level) => {
                    const isCur = Math.abs(opacity - level.val) < 0.05;
                    return (
                      <button
                        key={level.label}
                        type="button"
                        onClick={() => setOpacity(level.val)}
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: isCur ? '1px solid #059669' : '1px solid var(--border-subtle)',
                          background: isCur ? '#059669' : '#f8fafc',
                          color: isCur ? '#ffffff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        {level.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Floating Pill Trigger */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.1)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              fontWeight: 600
            }}
          >
            <span style={{ fontSize: '1rem' }}>{activeVideo.icon}</span>
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeVideo.titleHi}
            </span>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pause ambient video' : 'Play ambient video'}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                color: isPlaying ? '#059669' : 'var(--text-muted)'
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>

            {/* Panel Toggle Button */}
            <button
              type="button"
              onClick={() => setPanelOpen(!panelOpen)}
              title="Change atmospheric video background"
              style={{
                border: 'none',
                background: panelOpen ? '#e2e8f0' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-primary)'
              }}
            >
              <SlidersHorizontal size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
