import React from 'react';

interface CinematicFarmBackgroundProps {
  variant?: 'golden_farm' | 'monsoon_clouds' | 'satellite_grid' | 'dark_minimal';
  showParticles?: boolean;
  opacity?: number;
}

export const CinematicFarmBackground: React.FC<CinematicFarmBackgroundProps> = ({
  variant = 'golden_farm',
  showParticles = true,
  opacity = 0.28
}) => {
  const images: Record<string, string> = {
    golden_farm: '/assets/cinematic/farm_golden_hour.jpg',
    monsoon_clouds: '/assets/cinematic/monsoon_clouds.jpg',
    satellite_grid: '/assets/cinematic/satellite_grid.jpg',
    dark_minimal: ''
  };

  const bgImage = images[variant] || images.golden_farm;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        backgroundColor: '#0C0D05'
      }}
    >
      {/* Background Photographic Layer with Ken Burns effect */}
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: '-5%',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity,
            filter: 'contrast(120%) saturate(115%) brightness(0.65)',
            animation: 'kenBurnsSlow 24s ease-in-out infinite alternate',
            transformOrigin: 'center center'
          }}
        />
      )}

      {/* Dark Vignette Overlay for Farmora Obsidian feel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 40%, rgba(12, 13, 5, 0.4) 0%, rgba(12, 13, 5, 0.92) 80%, #0C0D05 100%)'
        }}
      />

      {/* Subtle Chartreuse Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(182, 178, 67, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(182, 178, 67, 0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.8
        }}
      />

      {/* Floating Solar Dust Particles */}
      {showParticles && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${(i * 19) % 100}%`,
                left: `${(i * 27) % 100}%`,
                width: `${(i % 3) + 2}px`,
                height: `${(i % 3) + 2}px`,
                borderRadius: '50%',
                backgroundColor: i % 2 === 0 ? '#B6B243' : '#D7CE93',
                opacity: 0.35 + (i % 5) * 0.1,
                boxShadow: '0 0 8px rgba(182, 178, 67, 0.6)',
                animation: `floatGentle ${4 + (i % 4)}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.4}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
