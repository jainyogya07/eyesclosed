import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { FarmProvider } from './contexts/FarmContext';
import { RoleProvider } from './contexts/RoleContext';
import { LivePredictionProvider } from './providers/LivePredictionProvider';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { FarmContextBar } from './components/navigation/FarmContextBar';
import { IntelligenceRail } from './components/navigation/IntelligenceRail';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { Footer } from './components/navigation/Footer';
import { LoadingScreen } from './components/common/LoadingScreen';
import { useFarm } from './contexts/FarmContext';
import { useApp } from './contexts/AppContext';

// Primary Farmer-First Pages
import { LandingPage } from './pages/LandingPage';
import { FarmSetupPage } from './pages/FarmSetupPage';
import { MyFarmPage } from './pages/MyFarmPage';
import { LearnPage } from './pages/LearnPage';
import { PanchayatPage } from './pages/PanchayatPage';
import { CropsPage } from './pages/CropsPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { WeatherPage } from './pages/WeatherPage';
import { AdvicePage } from './pages/AdvicePage';
import { ExplorePage } from './pages/ExplorePage';

// 3 Dedicated Role-Based Governance Hubs
import { PanchayatOfficerHub } from './pages/governance/PanchayatOfficerHub';
import { AgricultureExpertHub } from './pages/governance/AgricultureExpertHub';
import { DistrictOfficerHub } from './pages/governance/DistrictOfficerHub';

// Scientific / Research Explore Pages
import { AgriculturePage } from './pages/AgriculturePage';
import { IrrigationPage } from './pages/IrrigationPage';
import { HazardsPage } from './pages/HazardsPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ModelLabPage } from './pages/ModelLabPage';
import { ValidationPage } from './pages/ValidationPage';
import { DataCenterPage } from './pages/DataCenterPage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { LoginPage } from './pages/LoginPage';

const AppShell: React.FC = () => {
  const location = useLocation();
  const { farm } = useFarm();
  const { setLocation } = useApp();

  const isLogin = location.pathname === '/login';
  const isHome = location.pathname === '/home' || location.pathname === '/';

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      localStorage.setItem('sidebar_collapsed', String(next));
    } catch {}
  };

  // Synchronize location between FarmContext and AppContext
  React.useEffect(() => {
    if (farm.isConfigured && farm.panchayat) {
      setLocation({
        panchayatCode: farm.panchayat.code,
        panchayatName: farm.panchayat.name,
        district: farm.panchayat.district,
        state: farm.panchayat.state,
        lat: farm.panchayat.lat,
        lon: farm.panchayat.lon
      });
    }
  }, [farm.isConfigured, farm.panchayat?.code]);

  const isGovernance =
    location.pathname.startsWith('/panchayat-officer') ||
    location.pathname.startsWith('/agriculture-expert') ||
    location.pathname.startsWith('/district-officer');

  return (
    <div
      className={`platform-shell ${isHome ? 'home-shell' : ''} ${isLogin ? 'login-shell' : ''} ${isGovernance ? 'governance-shell' : ''}`}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isHome || isLogin
          ? 'var(--bg-primary)'
          : 'linear-gradient(180deg, rgba(248, 250, 252, 0.88) 0%, rgba(241, 245, 249, 0.94) 100%), url("/assets/farm-landscape-bg.jpg") center top / cover fixed no-repeat'
      }}
    >
      {!isLogin && <Navbar />}
      {!isLogin && !isHome && !isGovernance && <FarmContextBar />}

      {/* Spacious Left Sidebar with responsive offset */}
      {!isLogin && !isHome && (
        <Sidebar collapsed={sidebarCollapsed} onToggle={handleToggleSidebar} />
      )}

      {/* Main Content Area with dynamic margin to prevent ANY card overlap */}
      <main
        className="app-main"
        style={{
          flex: 1,
          paddingBottom: isLogin ? 0 : '3rem',
          marginLeft: !isLogin && !isHome ? (sidebarCollapsed ? '68px' : '230px') : 0,
          transition: 'margin-left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <Routes>
          {/* Core Farmer-First Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/setup" element={<FarmSetupPage />} />
          <Route path="/my-farm" element={<MyFarmPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/farmer/learn" element={<LearnPage />} />
          <Route path="/panchayat" element={<PanchayatPage />} />
          <Route path="/crops" element={<CropsPage />} />
          <Route path="/scenario" element={<ScenarioPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/advice" element={<AdvicePage />} />

          {/* Role 1: Panchayat Officer Dedicated Architecture */}
          <Route path="/panchayat-officer" element={<Navigate to="/panchayat-officer/dashboard" replace />} />
          <Route path="/panchayat-officer/dashboard" element={<PanchayatOfficerHub initialTab="dashboard" />} />
          <Route path="/panchayat-officer/weather" element={<PanchayatOfficerHub initialTab="weather" />} />
          <Route path="/panchayat-officer/crops" element={<PanchayatOfficerHub initialTab="crops" />} />
          <Route path="/panchayat-officer/water" element={<PanchayatOfficerHub initialTab="water" />} />
          <Route path="/panchayat-officer/risk" element={<PanchayatOfficerHub initialTab="risk" />} />
          <Route path="/panchayat-officer/gis" element={<PanchayatOfficerHub initialTab="gis" />} />
          <Route path="/panchayat-officer/advisories" element={<PanchayatOfficerHub initialTab="advisories" />} />
          <Route path="/panchayat-officer/reports" element={<PanchayatOfficerHub initialTab="reports" />} />

          {/* Role 2: Agriculture Expert Dedicated Architecture */}
          <Route path="/agriculture-expert" element={<Navigate to="/agriculture-expert/dashboard" replace />} />
          <Route path="/agriculture-expert/dashboard" element={<AgricultureExpertHub initialTab="dashboard" />} />
          <Route path="/agriculture-expert/crop-intelligence" element={<AgricultureExpertHub initialTab="crop-intelligence" />} />
          <Route path="/agriculture-expert/soil" element={<AgricultureExpertHub initialTab="soil" />} />
          <Route path="/agriculture-expert/crop-suitability" element={<AgricultureExpertHub initialTab="crop-suitability" />} />
          <Route path="/agriculture-expert/irrigation" element={<AgricultureExpertHub initialTab="irrigation" />} />
          <Route path="/agriculture-expert/weather-impact" element={<AgricultureExpertHub initialTab="weather-impact" />} />
          <Route path="/agriculture-expert/climate-scenarios" element={<AgricultureExpertHub initialTab="climate-scenarios" />} />
          <Route path="/agriculture-expert/advisory-studio" element={<AgricultureExpertHub initialTab="advisory-studio" />} />

          {/* Role 3: District Officer Dedicated Architecture */}
          <Route path="/district-officer" element={<Navigate to="/district-officer/dashboard" replace />} />
          <Route path="/district-officer/dashboard" element={<DistrictOfficerHub initialTab="dashboard" />} />
          <Route path="/district-officer/panchayats" element={<DistrictOfficerHub initialTab="panchayats" />} />
          <Route path="/district-officer/weather" element={<DistrictOfficerHub initialTab="weather" />} />
          <Route path="/district-officer/risk-command" element={<DistrictOfficerHub initialTab="risk-command" />} />
          <Route path="/district-officer/water" element={<DistrictOfficerHub initialTab="water" />} />
          <Route path="/district-officer/resource-planning" element={<DistrictOfficerHub initialTab="resource-planning" />} />
          <Route path="/district-officer/scenarios" element={<DistrictOfficerHub initialTab="scenarios" />} />
          <Route path="/district-officer/reports" element={<DistrictOfficerHub initialTab="reports" />} />

          {/* Research & Explore Hub */}
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/water-soil" element={<IrrigationPage />} />
          <Route path="/explore/crop-health" element={<AgriculturePage />} />
          <Route path="/explore/risks" element={<HazardsPage />} />
          <Route path="/explore/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/explore/scenario" element={<ScenarioPage />} />
          <Route path="/explore/science" element={<ExplorePage />} />
          <Route path="/explore/model-lab" element={<ModelLabPage />} />
          <Route path="/explore/validation" element={<ValidationPage />} />
          <Route path="/explore/data" element={<DataCenterPage />} />

          {/* Backward-Compatible Direct Routes */}
          <Route path="/water" element={<IrrigationPage />} />
          <Route path="/irrigation" element={<IrrigationPage />} />
          <Route path="/crop-health" element={<AgriculturePage />} />
          <Route path="/agriculture" element={<AgriculturePage />} />
          <Route path="/risks" element={<HazardsPage />} />
          <Route path="/hazards" element={<HazardsPage />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/decision-center" element={<AdvicePage />} />
          <Route path="/farmer" element={<Navigate to="/my-farm" replace />} />
          <Route path="/dashboard" element={<Navigate to="/my-farm" replace />} />
          <Route path="/model-lab" element={<ModelLabPage />} />
          <Route path="/validation" element={<ValidationPage />} />
          <Route path="/data-center" element={<DataCenterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* Floating Right-Side Intelligence Rail (Farmer Mode Only, Never on Governance) */}
      {!isLogin && !isHome && !isGovernance && <IntelligenceRail />}

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
      <RoleProvider>
        <FarmProvider>
          <LivePredictionProvider>
            {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
            <BrowserRouter>
              <AppShell />
            </BrowserRouter>
          </LivePredictionProvider>
        </FarmProvider>
      </RoleProvider>
    </AppProvider>
  );
};
