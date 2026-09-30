import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  CloudSun,
  Wheat,
  Droplets,
  AlertTriangle,
  MapPin,
  Send,
  FileText,
  Activity,
  TrendingUp,
  Sliders,
  FileCheck,
  Building2,
  Truck,
  Compass,
  ShieldAlert,
  X,
  ExternalLink,
  Volume2
} from 'lucide-react';
import { useRole } from '../../contexts/RoleContext';
import { useApp } from '../../contexts/AppContext';
import { useFarm } from '../../contexts/FarmContext';

export const IntelligenceRail: React.FC = () => {
  const { role, scope, activePanchayat } = useRole();
  const { language } = useApp();
  const { playVoice } = useFarm();
  const navigate = useNavigate();
  const pageLocation = useLocation();
  const en = language === 'en';

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // Generate 8 role-specific tabs matching user's architecture specification
  const roleRailItems = React.useMemo(() => {
    switch (role) {
      case 'panchayat_officer':
        return [
          {
            id: 'dashboard',
            icon: Layers,
            labelEn: 'Dashboard',
            labelHi: 'डैशबोर्ड',
            color: '#059669',
            page: '/panchayat-officer/dashboard',
            headline: `${activePanchayat.name} · Today's Status`,
            detail: 'Local operational situation: 14.8mm rain tonight, 88% crop health, moderate waterlogging risk.',
            action: 'Clear field drainage bunds before 3 PM.'
          },
          {
            id: 'weather',
            icon: CloudSun,
            labelEn: 'Weather',
            labelHi: 'मौसम (1km)',
            color: '#0284c7',
            page: '/panchayat-officer/weather',
            headline: '1-km Micro-Climate Grid',
            detail: 'Hyperlocal WRF model output with cell uncertainty and agricultural interpretations.',
            action: 'Inspect high-precipitation cells.'
          },
          {
            id: 'crops',
            icon: Wheat,
            labelEn: 'Crops',
            labelHi: 'फसल व खेत',
            color: '#16a34a',
            page: '/panchayat-officer/crops',
            headline: 'Panchayat Crop Distribution',
            detail: '3,850 ha farmland across 4 villages. 2,450 ha Basmati Paddy at flowering stage.',
            action: 'Review village-wise crop stress.'
          },
          {
            id: 'water',
            icon: Droplets,
            labelEn: 'Water',
            labelHi: 'जल स्थिति',
            color: '#0891b2',
            page: '/panchayat-officer/water',
            headline: 'Water Situation: 🟡 MONITOR',
            detail: 'Soil moisture is 32.4% (near saturation). Zero net deficit; tubewell pumping suspended.',
            action: 'Check drainage channels.'
          },
          {
            id: 'risk',
            icon: AlertTriangle,
            labelEn: 'Risk',
            labelHi: 'जोखिम अलर्ट',
            color: '#dc2626',
            page: '/panchayat-officer/risk',
            headline: 'Active Risk: MODERATE',
            detail: 'Villages Rampur & Shivpur vulnerable to root zone waterlogging in heavy downpour.',
            action: 'Issue drainage maintenance directive.'
          },
          {
            id: 'map',
            icon: MapPin,
            labelEn: 'GIS Map',
            labelHi: 'मानचित्र',
            color: '#7c3aed',
            page: '/panchayat-officer/gis',
            headline: 'Panchayat Spatial Layers',
            detail: 'Interactive layer drawer for Weather, Crop, Soil, and Waterlogging hazard zones.',
            action: 'Inspect village hotspot boundaries.'
          },
          {
            id: 'advisories',
            icon: Send,
            labelEn: 'Advisories',
            labelHi: 'सलाह पत्र',
            color: '#059669',
            page: '/panchayat-officer/advisories',
            headline: 'Draft Local Advisories',
            detail: 'AI-assisted drafting with mandatory officer authorization before farmer SMS transmission.',
            action: 'Review pending advisory drafts.'
          },
          {
            id: 'reports',
            icon: FileText,
            labelEn: 'Reports',
            labelHi: 'रिपोर्ट्स',
            color: '#475569',
            page: '/panchayat-officer/reports',
            headline: 'Panchayat Daily Dossier',
            detail: 'Export official daily situation report in PDF or CSV format.',
            action: 'Download Panchayat CSV.'
          }
        ];

      case 'agriculture_expert':
        return [
          {
            id: 'dashboard',
            icon: Layers,
            labelEn: 'Dashboard',
            labelHi: 'डैशबोर्ड',
            color: '#059669',
            page: '/agriculture-expert/dashboard',
            headline: 'Agricultural Attention Areas',
            detail: 'Biophysical telemetry: Paddy flowering phenology, elevated canopy wetness, fungal risk.',
            action: 'Evaluate weather impact chain.'
          },
          {
            id: 'crops',
            icon: Wheat,
            labelEn: 'Crops',
            labelHi: 'फसल विज्ञान',
            color: '#16a34a',
            page: '/agriculture-expert/crop-intelligence',
            headline: 'Vegetation Indices: NDVI 0.76',
            detail: 'NDRE 0.64, EVI 0.58, GDD 1,420 °C·days. Synchronous anthesis across 2,450 ha.',
            action: 'Inspect scientific formulae.'
          },
          {
            id: 'soil',
            icon: Activity,
            labelEn: 'Soil',
            labelHi: 'मृदा विश्लेषण',
            color: '#d97706',
            page: '/agriculture-expert/soil',
            headline: 'Soil Physics: pH 7.2 · OC 0.58%',
            detail: 'Indo-Gangetic Sandy Clay Loam with 54% water holding capacity and moderate N constraint.',
            action: 'Read agronomic interpretation.'
          },
          {
            id: 'weather_impact',
            icon: CloudSun,
            labelEn: 'Weather Impact',
            labelHi: 'मौसम प्रभाव',
            color: '#0284c7',
            page: '/agriculture-expert/weather-impact',
            headline: 'Weather → Crop Response Chain',
            detail: '14.8mm rain during flowering risks pollen wash-off & sheath blight spore propagation.',
            action: 'Enforce nitrogen withholding.'
          },
          {
            id: 'suitability',
            icon: TrendingUp,
            labelEn: 'Suitability',
            labelHi: 'उपयुक्तता',
            color: '#059669',
            page: '/agriculture-expert/crop-suitability',
            headline: 'Crop Suitability Matrix + WHY',
            detail: 'Comparative multi-crop evaluation (Paddy, Bajra, Moong, Mustard) with explicit justifications.',
            action: 'Review candidate crop scores.'
          },
          {
            id: 'irrigation',
            icon: Droplets,
            labelEn: 'Irrigation',
            labelHi: 'सिंचाई (ETc)',
            color: '#0891b2',
            page: '/agriculture-expert/irrigation',
            headline: 'ETc Balance: 4.83 mm/day',
            detail: 'Penman-Monteith ET0 4.2mm × Kc 1.15. Zero irrigation deficit due to incoming rainfall.',
            action: 'Inspect water balance equation.'
          },
          {
            id: 'scenarios',
            icon: Sliders,
            labelEn: 'Scenarios',
            labelHi: 'सिनेरियो लैब',
            color: '#7c3aed',
            page: '/agriculture-expert/climate-scenarios',
            headline: 'Climate Scenarios Simulator',
            detail: 'Simulate -40% to +40% rainfall and +1°C/+2°C warming on crop yields and water demand.',
            action: 'Test rainfall deficit scenario.'
          },
          {
            id: 'advisory',
            icon: FileCheck,
            labelEn: 'Advisory Studio',
            labelHi: 'परामर्श केंद्र',
            color: '#047857',
            page: '/agriculture-expert/advisory-studio',
            headline: 'Peer-Reviewed Advisory Studio',
            detail: 'Draft, corroborate with scientific evidence & citations, and sign official agricultural advisory.',
            action: 'Sign expert bulletin.'
          }
        ];

      case 'district_officer':
      default:
        return [
          {
            id: 'overview',
            icon: Layers,
            labelEn: 'Overview',
            labelHi: 'जिला अवलोकन',
            color: '#0284c7',
            page: '/district-officer/dashboard',
            headline: 'District Command Overview',
            detail: 'District Situation: Lucknow (8 Blocks, 45 Panchayats, 142k ha Kharif farmland).',
            action: 'Check Priority #1 Panchayat.'
          },
          {
            id: 'weather',
            icon: CloudSun,
            labelEn: 'Weather',
            labelHi: 'मौसम कमान',
            color: '#0369a1',
            page: '/district-officer/weather',
            headline: 'District Weather Radar',
            detail: 'District-wide precipitation gradient: Northern arc receiving highest rainfall (14–18mm).',
            action: 'Drill down to block level.'
          },
          {
            id: 'panchayats',
            icon: Building2,
            labelEn: 'Panchayats',
            labelHi: 'पंचायत तुलना',
            color: '#059669',
            page: '/district-officer/panchayats',
            headline: 'Multi-Panchayat Comparison Matrix',
            detail: 'Compare all 5 pilot Panchayats on weather, crop stress, soil saturation, and risk tiers.',
            action: 'Filter high-risk Panchayats.'
          },
          {
            id: 'risk_command',
            icon: ShieldAlert,
            labelEn: 'Risk Command',
            labelHi: 'आपदा केंद्र',
            color: '#dc2626',
            page: '/district-officer/risk-command',
            headline: 'Active District Hazards',
            detail: '730 ha lowland waterlogging exposure across Bakshi Ka Talab & Itaunja.',
            action: 'Deploy drainage pump directive.'
          },
          {
            id: 'water',
            icon: Droplets,
            labelEn: 'Water',
            labelHi: 'जल संसाधन',
            color: '#0891b2',
            page: '/district-officer/water',
            headline: 'District Water Resources',
            detail: 'Reservoir and canal discharge status across Gomti basin agricultural tracts.',
            action: 'Review canal tail-end supply.'
          },
          {
            id: 'resources',
            icon: Truck,
            labelEn: 'Resources',
            labelHi: 'संसाधन नियोजन',
            color: '#d97706',
            page: '/district-officer/resource-planning',
            headline: 'Resource Planning Decision Support',
            detail: 'Optimize placement of de-watering pumps, field inspection squads, and seed buffers.',
            action: 'Allocate emergency pump sets.'
          },
          {
            id: 'scenarios',
            icon: Compass,
            labelEn: 'Scenarios',
            labelHi: 'परिदृश्य योजना',
            color: '#7c3aed',
            page: '/district-officer/scenarios',
            headline: 'District-Wide Scenario Planning',
            detail: 'Evaluate district vulnerability under -20% monsoon deficit and contingency pulse distribution.',
            action: 'Simulate district contingency.'
          },
          {
            id: 'reports',
            icon: FileText,
            labelEn: 'Reports',
            labelHi: 'जिला रिपोर्ट्स',
            color: '#475569',
            page: '/district-officer/reports',
            headline: 'District Executive Synthesis',
            detail: 'Generate comprehensive district agricultural intelligence report for district collectorate.',
            action: 'Export Master CSV / PDF.'
          }
        ];
    }
  }, [role, activePanchayat]);

  const activeItem = roleRailItems.find((item) => item.id === activeDrawer);

  return (
    <>
      {/* Floating Vertical Circular Rail */}
      <aside
        aria-label="Role Intelligence Rail"
        className="intelligence-floating-rail"
        style={{
          position: 'fixed',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {roleRailItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredId === item.id;
          const isOpen = activeDrawer === item.id;
          const isCurrentRoute = pageLocation.pathname.includes(item.id);

          return (
            <div
              key={item.id}
              style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Expanding Label Pill on Hover */}
              <AnimatePresence>
                {isHovered && !isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.95 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      right: '100%',
                      marginRight: '10px',
                      whiteSpace: 'nowrap',
                      background: '#ffffff',
                      border: `1.5px solid ${item.color}55`,
                      borderRadius: '10px',
                      padding: '6px 14px',
                      color: '#0f172a',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
                      pointerEvents: 'none'
                    }}
                  >
                    {en ? item.labelEn : item.labelHi}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Circular Button */}
              <motion.button
                type="button"
                onClick={() => {
                  if (isOpen) {
                    setActiveDrawer(null);
                  } else {
                    setActiveDrawer(item.id);
                  }
                }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: isOpen ? item.color : isCurrentRoute ? `${item.color}15` : '#ffffff',
                  color: isOpen ? '#ffffff' : item.color,
                  border: `2px solid ${isOpen ? item.color : isCurrentRoute ? item.color : 'rgba(203, 213, 225, 0.85)'}`,
                  boxShadow: isOpen
                    ? `0 0 16px ${item.color}77, 0 8px 20px rgba(0,0,0,0.15)`
                    : '0 4px 14px rgba(15, 23, 42, 0.08)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.18s ease'
                }}
                title={en ? item.labelEn : item.labelHi}
              >
                <Icon size={19} />
              </motion.button>
            </div>
          );
        })}
      </aside>

      {/* Slide-in Contextual Intelligence Drawer */}
      <AnimatePresence>
        {activeDrawer && activeItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.35)',
                backdropFilter: 'blur(3px)',
                zIndex: 90
              }}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                width: 'min(420px, 90vw)',
                background: '#ffffff',
                borderLeft: '1px solid #e2e8f0',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.15)',
                zIndex: 95,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span
                    style={{
                      background: `${activeItem.color}15`,
                      color: activeItem.color,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {role.replace('_', ' ').toUpperCase()} • {en ? activeItem.labelEn : activeItem.labelHi}
                  </span>

                  <button
                    type="button"
                    onClick={() => setActiveDrawer(null)}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b'
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '12px' }}>
                  {activeItem.headline}
                </h3>

                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                  {activeItem.detail}
                </p>

                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                    borderRadius: '14px',
                    padding: '14px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {en ? 'Role Directive Action' : 'कार्रवाई निर्देश'}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#14532d' }}>
                    {activeItem.action}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => playVoice(`${activeItem.headline}. ${activeItem.action}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    background: '#f8fafc',
                    color: '#059669',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginBottom: '20px'
                  }}
                >
                  <Volume2 size={16} />
                  <span>{en ? 'Listen Directive' : 'निर्देश सुनें'}</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveDrawer(null);
                    navigate(activeItem.page);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    background: activeItem.color,
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{en ? 'Open Full View' : 'पूरा विवरण खोलें'}</span>
                  <ExternalLink size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
