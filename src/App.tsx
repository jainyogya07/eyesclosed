import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { Footer } from './components/navigation/Footer';
import { LoadingScreen } from './components/common/LoadingScreen';

// Pages
import { LandingPage } from './pages/LandingPage';
import { WeatherPage } from './pages/WeatherPage';
import { PanchayatPage } from './pages/PanchayatPage';
import { AgriculturePage } from './pages/AgriculturePage';
import { IrrigationPage } from './pages/IrrigationPage';
import { HazardsPage } from './pages/HazardsPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { DecisionCenterPage } from './pages/DecisionCenterPage';
import { ModelLabPage } from './pages/ModelLabPage';
import { ValidationPage } from './pages/ValidationPage';
import { DataCenterPage } from './pages/DataCenterPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { LoginPage } from './pages/LoginPage';

const AppShell: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const isHome = location.pathname === '/home' || location.pathname === '/';

  return (
    <div
      className={`platform-shell ${isHome ? 'home-shell' : ''} ${isLogin ? 'login-shell' : ''}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)'
      }}
    >
      {!isLogin && <Navbar />}
      <main className="app-main" style={{ flex: 1, paddingBottom: isLogin ? 0 : '3rem' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/dashboard" element={<Navigate to="/home" replace />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/panchayat" element={<PanchayatPage />} />
          <Route path="/agriculture" element={<AgriculturePage />} />
          <Route path="/irrigation" element={<IrrigationPage />} />
          <Route path="/hazards" element={<HazardsPage />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/decision-center" element={<DecisionCenterPage />} />
          <Route path="/model-lab" element={<ModelLabPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/data-center" element={<DataCenterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      {!isLogin && (
        <>
          <Footer />
          <MobileBottomNav />
        </>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <AppProvider>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
};
