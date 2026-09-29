import React, { useRef, useState, useEffect } from 'react';

interface CinematicVideoProps {
  poster?: string;
  srcMp4?: string;
  srcWebm?: string;
  aspectRatio?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const CinematicVideo: React.FC<CinematicVideoProps> = ({
  poster,
  srcMp4,
  srcWebm,
  aspectRatio = '16/9',
  style = {},
  children
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current || prefersReducedMotion) return;
    if (isInView) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser policy without user gesture
      });
    } else {
      videoRef.current.pause();
    }
  }, [isInView, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        background: '#0f172a',
        ...style
      }}
    >
      {prefersReducedMotion || (!srcMp4 && !srcWebm) ? (
        poster ? (
          <img
            src={poster}
            alt="Atmospheric Agricultural Scene"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : null
      ) : (
        <video
          ref={videoRef}
          poster={poster}
          muted
          playsInline
          loop
          preload="none"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        >
          {srcWebm && <source src={srcWebm} type="video/webm" />}
          {srcMp4 && <source src={srcMp4} type="video/mp4" />}
        </video>
      )}

      {children}
    </div>
  );
};
