import React from 'react';

/** A simple field-and-sun emblem drawn in code, so it remains crisp at any size. */
export const KisaanLogo: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg className="kisaan-logo" width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="44" height="44" rx="13" fill="currentColor" />
    <circle cx="33.5" cy="14.5" r="4" fill="#F7D36A" />
    <path d="M10 31.5C14.2 27.4 18.5 26.1 23 27.5C27.1 28.8 30.8 27.3 38 22" stroke="#F7F7E8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 37C15.5 32.2 20.3 31.9 25.2 33.2C29.2 34.3 33.2 32.6 38 28.4" stroke="#D5F08B" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M15.8 22.9C18.9 18.8 23.1 16.9 28.1 17.1" stroke="#F7F7E8" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);
