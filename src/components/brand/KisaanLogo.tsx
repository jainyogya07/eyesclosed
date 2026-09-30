import React from 'react';

interface KisaanLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

/**
 * MausamSetu Official Emblem & Brand Logo
 * Features: Sun, sheltering hands over green sprout, rainfall clouds,
 * and official tagline: "Sahi Samay, Sahi Salah, Har Kisaan Tak"
 */
export const KisaanLogo: React.FC<KisaanLogoProps> = ({ size = 36, className = '', showText = false }) => {
  return (
    <div
      className={`mausam-setu-brand-lockup ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none'
      }}
    >
      <img
        src="/assets/mausam-setu-logo.png"
        alt="MausamSetu - Sahi Samay, Sahi Salah, Har Kisaan Tak"
        style={{
          height: `${size}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))',
          borderRadius: '4px'
        }}
        onError={(e) => {
          // Graceful fallback to SVG emblem if image fails to load
          const target = e.currentTarget;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.fallback-svg')) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'fallback-svg');
            svg.setAttribute('width', String(size));
            svg.setAttribute('height', String(size));
            svg.setAttribute('viewBox', '0 0 48 48');
            svg.innerHTML = `
              <rect x="2" y="2" width="44" height="44" rx="12" fill="#059669" />
              <circle cx="33" cy="14" r="4" fill="#F7D36A" />
              <path d="M10 32C14 28 18 27 23 28C27 29 31 28 38 23" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
              <path d="M10 38C15 33 20 33 25 34C29 35 33 33 38 29" stroke="#A7F3D0" stroke-width="2.5" stroke-linecap="round" />
            `;
            parent.appendChild(svg);
          }
        }}
      />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Mausam<span style={{ color: '#059669' }}>Setu</span>
          </span>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.01em' }}>
            सही समय, सही सलाह, हर किसान तक
          </span>
        </div>
      )}
    </div>
  );
};
