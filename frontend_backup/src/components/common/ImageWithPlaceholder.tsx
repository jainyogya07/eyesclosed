import React, { useState } from 'react';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
  fallbackIcon?: React.ReactNode;
}

export const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  style = {},
  fallbackIcon
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio,
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      {!loaded && !error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'kisanPulse 1.5s infinite ease-in-out'
          }}
        />
      )}

      {error ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            padding: '1rem',
            textAlign: 'center'
          }}
        >
          {fallbackIcon}
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
            display: 'block'
          }}
        />
      )}
    </div>
  );
};
