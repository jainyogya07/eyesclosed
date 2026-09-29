import React from 'react';
import { AppProvider } from './contexts/AppContext';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#f8fafc',
          fontFamily: "'Inter', sans-serif",
          textAlign: 'center',
          padding: '2rem'
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            padding: '2.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Kisaan Ki Yash (किसान की यश)
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Frontend UI has been cleared and reset as requested. All previous code and assets are safely backed up in <code>frontend_backup/</code>.
          </p>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'inline-block'
            }}
          >
            READY FOR NEW UI ARCHITECTURE
          </div>
        </div>
      </div>
    </AppProvider>
  );
};
