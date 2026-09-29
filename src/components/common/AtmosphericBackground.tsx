import React from 'react';

interface AtmosphericBackgroundProps {
  intensity?: 'subtle' | 'medium' | 'cinematic';
  showGrid?: boolean;
}

export const AtmosphericBackground: React.FC<AtmosphericBackgroundProps> = ({
  intensity = 'subtle',
  showGrid = true
}) => {
  return (
    <div
      aria-hidden="true"
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
      {/* Radial soft atmospheric sun & cloud light */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '5%',
          width: '70vw',
          height: '70vw',
          maxHeight: '800px',
          background:
            intensity === 'cinematic'
              ? 'radial-gradient(circle, rgba(224, 242, 254, 0.7) 0%, rgba(240, 253, 244, 0.4) 45%, rgba(252, 251, 249, 0) 75%)'
              : 'radial-gradient(circle, rgba(224, 242, 254, 0.45) 0%, rgba(240, 253, 244, 0.25) 50%, rgba(252, 251, 249, 0) 75%)',
          filter: 'blur(40px)',
          borderRadius: '50%'
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(240, 253, 244, 0.5) 0%, rgba(252, 251, 249, 0) 70%)',
          filter: 'blur(50px)',
          borderRadius: '50%'
        }}
      />

      {/* 1-km Hyperlocal Coordinate Grid Lines (very faint & elegant) */}
      {showGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(2, 132, 199, 0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(2, 132, 199, 0.035) 1px, transparent 1px)
            `,
            backgroundSize: '64px 64px'
          }}
        />
      )}
    </div>
  );
};
