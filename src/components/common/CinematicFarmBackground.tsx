import React, { useEffect, useRef } from 'react';

interface CinematicFarmBackgroundProps {
  variant?: 'golden_farm' | 'monsoon_clouds' | 'satellite_grid';
  overlayOpacity?: number;
  showParticles?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CinematicFarmBackground: React.FC<CinematicFarmBackgroundProps> = ({
  variant = 'golden_farm',
  overlayOpacity = 0.55,
  showParticles = true,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const imageMap = {
    golden_farm: '/assets/cinematic/farm_golden_hour.jpg',
    monsoon_clouds: '/assets/cinematic/monsoon_clouds.jpg',
    satellite_grid: '/assets/cinematic/satellite_grid.jpg'
  };

  const currentImage = imageMap[variant];

  // Canvas floating particles (golden pollen / atmospheric mist motes)
  useEffect(() => {
    if (!showParticles || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool
    const numParticles = 40;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2, // Gentle upward drift
      alpha: Math.random() * 0.6 + 0.2,
      color: variant === 'golden_farm' ? '251, 191, 36' : '186, 230, 253'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [showParticles, variant]);

  return (
    <div
      aria-hidden="true"
      className={`cinematic-bg-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
    >
      {/* High-Resolution Cinematic Photograph with Ken Burns slow drift */}
      <div
        style={{
          position: 'absolute',
          inset: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: `url(${currentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          animation: 'kenBurnsSlow 40s ease-in-out infinite',
          filter: 'saturate(115%) contrast(105%)'
        }}
      />

      {/* Atmospheric Lighting Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            variant === 'golden_farm'
              ? `linear-gradient(180deg, rgba(250, 248, 245, 0.45) 0%, rgba(245, 244, 240, 0.75) 60%, rgba(245, 244, 240, 0.96) 100%),
                 radial-gradient(ellipse at 50% 25%, rgba(251, 191, 36, 0.25) 0%, rgba(6, 78, 59, 0.35) 70%, rgba(15, 23, 42, 0.6) 100%)`
              : variant === 'monsoon_clouds'
              ? `linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%),
                 radial-gradient(ellipse at 50% 30%, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.7) 100%)`
              : `linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.9) 100%),
                 radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.3) 0%, rgba(15, 23, 42, 0.8) 100%)`
        }}
      />

      {/* Subtle Volumetric God Rays */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '20%',
          width: '60%',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.35) 0%, rgba(251, 191, 36, 0.15) 30%, transparent 70%)',
          animation: 'godRaysMove 12s ease-in-out infinite',
          filter: 'blur(30px)'
        }}
      />

      {/* Floating Canvas Particles */}
      {showParticles && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%'
          }}
        />
      )}
    </div>
  );
};
