import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { Footer } from './components/navigation/Footer';
import { SmoothScroll } from './components/common/SmoothScroll';

// Primary Pages
import { LandingPage } from './pages/LandingPage';
import { MyFarmPage } from './pages/MyFarmPage';
import { AdvicePage } from './pages/AdvicePage';
import { WeatherPage } from './pages/WeatherPage';

// Lazy-loaded Advanced & Scientific Pages
const DigitalTwinPage = lazy(() =>
  import('./pages/DigitalTwinPage').then((m) => ({ default: m.DigitalTwinPage }))
);
const ModelLabPage = lazy(() =>
  import('./pages/ModelLabPage').then((m) => ({ default: m.ModelLabPage }))
);
const ValidationPage = lazy(() =>
  import('./pages/ValidationPage').then((m) => ({ default: m.ValidationPage }))
);
const DataCenterPage = lazy(() =>
  import('./pages/DataCenterPage').then((m) => ({ default: m.DataCenterPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const PanchayatPage = lazy(() =>
  import('./pages/PanchayatPage').then((m) => ({ default: m.PanchayatPage }))
);
const IrrigationPage = lazy(() =>
  import('./pages/IrrigationPage').then((m) => ({ default: m.IrrigationPage }))
);
const HazardsPage = lazy(() =>
  import('./pages/HazardsPage').then((m) => ({ default: m.HazardsPage }))
);
const AgriculturePage = lazy(() =>
  import('./pages/AgriculturePage').then((m) => ({ default: m.AgriculturePage }))
);

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <SmoothScroll>
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--farmora-dark)',
              color: 'var(--farmora-light)'
            }}
          >
            <Navbar />

            <main style={{ flex: 1 }}>
              <Suspense
                fallback={
                  <div
                    style={{
                      padding: '6rem',
                      textAlign: 'center',
                      color: 'var(--farmora-platinum)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem'
                    }}
                  >
                    Synthesizing Farmora climate intelligence module...
                  </div>
                }
              >
                <Routes>
                  {/* Primary Human / Farmer Journey */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/my-farm" element={<MyFarmPage />} />
                  <Route path="/dashboard" element={<MyFarmPage />} />
                  <Route path="/advice" element={<AdvicePage />} />
                  <Route path="/decision-center" element={<AdvicePage />} />
                  <Route path="/weather" element={<WeatherPage />} />

                  {/* Progressive Scientific & Advanced Exploration */}
                  <Route path="/digital-twin" element={<DigitalTwinPage />} />
                  <Route path="/model-lab" element={<ModelLabPage />} />
                  <Route path="/validation" element={<ValidationPage />} />
                  <Route path="/data-center" element={<DataCenterPage />} />
                  <Route path="/about" element={<AboutPage />} />

                  {/* Supporting Regional Deep Dives */}
                  <Route path="/panchayat" element={<PanchayatPage />} />
                  <Route path="/irrigation" element={<IrrigationPage />} />
                  <Route path="/hazards" element={<HazardsPage />} />
                  <Route path="/agriculture" element={<AgriculturePage />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
            <MobileBottomNav />
          </div>
        </SmoothScroll>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
