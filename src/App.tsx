import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { Footer } from './components/navigation/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
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

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
          <Navbar />

          <main style={{ flex: 1, paddingBottom: '3rem' }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
          <MobileBottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};
