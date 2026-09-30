import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  CloudSun,
  Wheat,
  Droplets,
  AlertTriangle,
  Map as MapIcon,
  FileText,
  FileCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Send,
  Download,
  Info,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { useRole } from '../../contexts/RoleContext';
import { useApp } from '../../contexts/AppContext';
import { UNIFIED_ACTIVE_RISKS, INITIAL_ADVISORIES, AdvisoryItem } from '../../services/governanceIntelligenceService';

interface PanchayatOfficerHubProps {
  initialTab?: string;
}

export const PanchayatOfficerHub: React.FC<PanchayatOfficerHubProps> = ({ initialTab = 'dashboard' }) => {
  const { scope, activePanchayat, setActivePanchayatCode, allDistrictPanchayats } = useRole();
  const { language } = useApp();
  const en = language === 'en';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedVillage, setSelectedVillage] = useState<string>('all');
  const [selectedGridCell, setSelectedGridCell] = useState<{ id: string; lat: number; lon: number; rain: number; risk: string } | null>({
    id: 'Cell-GHR-04',
    lat: 27.016,
    lon: 80.884,
    rain: 14.8,
    risk: 'Moderate Waterlogging'
  });
  const [activeGisLayer, setActiveGisLayer] = useState<'weather' | 'crop' | 'water' | 'risk'>('risk');
  const [advisoriesList, setAdvisoriesList] = useState<AdvisoryItem[]>(INITIAL_ADVISORIES);
  const [advisoryDraft, setAdvisoryDraft] = useState({
    issue: 'Overnight heavy rain (14.8mm) leading to root-zone saturation in flowering paddy',
    affectedCrop: 'Paddy (Basmati)',
    affectedVillages: 'Rampur Kalan, Shivpur Majra',
    urgency: 'HIGH',
    message: 'Stop all electric tubewell pumping. Open field drainage cuts before 3:00 PM to discharge standing water.'
  });
  const [publishedSuccess, setPublishedSuccess] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', icon: Layers },
    { id: 'weather', labelEn: 'Weather (1km)', labelHi: 'मौसम (1 किमी)', icon: CloudSun },
    { id: 'crops', labelEn: 'Crops & Farms', labelHi: 'फसल व खेत', icon: Wheat },
    { id: 'water', labelEn: 'Water Situation', labelHi: 'जल स्थिति', icon: Droplets },
    { id: 'risk', labelEn: 'Risk & Alerts', labelHi: 'जोखिम व अलर्ट', icon: AlertTriangle },
    { id: 'gis', labelEn: 'GIS Map', labelHi: 'जीआईएस मानचित्र', icon: MapIcon },
    { id: 'advisories', labelEn: 'Local Advisories', labelHi: 'स्थानीय सलाह', icon: Send },
    { id: 'reports', labelEn: 'Reports & Export', labelHi: 'रिपोर्ट्स व निर्यात', icon: FileText }
  ];

  const handlePublishAdvisory = () => {
    const newAdv: AdvisoryItem = {
      id: `adv-${Date.now()}`,
      targetRole: 'panchayat',
      title: `Officer Action Notice: ${advisoryDraft.issue.slice(0, 48)}...`,
      titleHi: 'पंचायत अधिकारी सूचना: तुरंत जल निकासी नालियां खोलें',
      issue: advisoryDraft.issue,
      affectedCrop: advisoryDraft.affectedCrop,
      affectedVillages: advisoryDraft.affectedVillages.split(',').map((s) => s.trim()),
      urgency: 'HIGH',
      message: advisoryDraft.message,
      messageHi: 'खेत की मेड़ की निकास नाली तुरंत खोलें और ट्यूबवेल बंद रखें।',
      evidence: 'High-resolution WRF model (14.8 mm rain) + field saturation check.',
      sources: ['MausamSetu High-Res Ensemble', 'Panchayat Ground Sensor Unit'],
      uncertainty: 'Rain probability 84%',
      status: 'published',
      author: 'Panchayat Officer (Authorized)',
      timestamp: 'Just now'
    };
    setAdvisoriesList([newAdv, ...advisoriesList]);
    setPublishedSuccess(en ? 'Local Advisory published and transmitted to registered farmers!' : 'स्थानीय सलाह स्वीकृत व पंजीकृत किसानों को प्रेषित की गई!');
    setTimeout(() => setPublishedSuccess(null), 4000);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Panchayat,Village,Area_Ha,Farms_Count,Primary_Crop,Water_Status,Active_Risk\n' +
      activePanchayat.villages
        .map((v) => `${activePanchayat.name},"${v.name}",${v.totalAreaHa},${v.farmsCount},"${v.primaryCrop}",${v.waterStatus},"${v.activeRisk || 'None'}"`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activePanchayat.name}_panchayat_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 16px 80px' }}>
      {/* Scope Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
          borderRadius: '20px',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: '0 12px 32px rgba(6, 78, 59, 0.18)',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                🏛️ {en ? 'Panchayat Operational Intelligence' : 'पंचायत परिचालन सूचना प्रणाली'}
              </span>
              <span style={{ fontSize: '0.74rem', opacity: 0.85 }}>
                {en ? 'Role: Local Action & Village Oversight' : 'दायित्व: स्थानीय क्रियान्वयन व निगरानी'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {en ? activePanchayat.name : activePanchayat.nameHi} {en ? 'Panchayat' : 'ग्राम पंचायत'}
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.86rem' }}>
              <strong>{en ? 'Block:' : 'ब्लॉक:'}</strong> {activePanchayat.block} •{' '}
              <strong>{en ? 'District:' : 'जिला:'}</strong> {activePanchayat.district} •{' '}
              <strong>{en ? 'Villages:' : 'गांव:'}</strong> {activePanchayat.villages.length} {en ? 'Villages' : 'ग्राम'} (
              {activePanchayat.villages.map((v) => (en ? v.name : v.nameHi)).join(', ')})
            </p>
          </div>

          {/* Quick Scope Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontSize: '0.72rem', opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>
              {en ? 'Switch Assigned Panchayat' : 'पंचायत बदलें'}
            </span>
            <select
              value={activePanchayat.code}
              onChange={(e) => setActivePanchayatCode(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {allDistrictPanchayats.map((p) => (
                <option key={p.code} value={p.code} style={{ color: '#0f172a' }}>
                  {en ? p.name : p.nameHi} ({p.villages.length} villages)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Module Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {en ? 'Active Module' : 'सक्रिय मॉड्यूल'}:
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#065f46' }}>
            {tabs.find((t) => t.id === activeTab)?.[en ? 'labelEn' : 'labelHi'] || 'Dashboard'}
          </span>
        </div>
      </div>

      {/* Notification Toast */}
      {publishedSuccess && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#065f46',
            fontWeight: 700,
            fontSize: '0.86rem'
          }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          <span>{publishedSuccess}</span>
        </div>
      )}

      {/* TAB CONTENT 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Primary Status Banner */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px'
            }}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  {en ? 'Panchayat Weather' : 'पंचायत मौसम'}
                </span>
                <CloudSun size={18} color="#0284c7" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
                {activePanchayat.weather.tempC}°C
              </div>
              <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700, marginTop: '4px' }}>
                🌧️ {activePanchayat.weather.rainfallMm24h} mm {en ? 'rain expected tonight' : 'बारिश का अनुमान'} (
                {activePanchayat.weather.rainfallProbPct}% prob)
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  {en ? 'Crop Health & Stage' : 'फसल स्वास्थ्य व अवस्था'}
                </span>
                <Wheat size={18} color="#059669" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
                {activePanchayat.cropMetrics.cropHealthIndex}%
              </div>
              <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                🌾 {activePanchayat.cropMetrics.paddyStage} ({activePanchayat.cropMetrics.paddyAreaHa} ha Paddy)
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  {en ? 'Water Situation' : 'जल स्थिति'}
                </span>
                <Droplets size={18} color="#d97706" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🟡</span>
                <span>{en ? activePanchayat.waterMetrics.waterSituation : activePanchayat.waterMetrics.waterSituationHi}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginTop: '4px' }}>
                💧 Soil moisture: {activePanchayat.waterMetrics.soilMoisturePct}% (Optimal, zero deficit)
              </div>
            </div>

            <div
              style={{
                background: '#fffbeb',
                borderRadius: '16px',
                padding: '18px 20px',
                border: '1.5px solid #fcd34d',
                boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase' }}>
                  {en ? 'Active Risk Level' : 'सक्रिय जोखिम स्तर'}
                </span>
                <AlertTriangle size={18} color="#b45309" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b45309' }}>
                ⚠️ {activePanchayat.riskSummary.level}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 700, marginTop: '4px' }}>
                {en ? activePanchayat.riskSummary.primaryHazard : activePanchayat.riskSummary.primaryHazardHi}
              </div>
            </div>
          </div>

          {/* Attention Required Block */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1.5px solid #fed7aa',
              boxShadow: '0 8px 24px rgba(234, 88, 12, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span
                style={{
                  background: '#ffedd5',
                  color: '#c2410c',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  textTransform: 'uppercase'
                }}
              >
                ⚠️ {en ? 'Attention Required Today' : 'आज का ध्यानार्थ / तत्काल कार्रवाई'}
              </span>
              <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>
                {en ? 'Automated operational flags for local field cell' : 'पंचायत स्तर पर तत्काल फील्ड दिशा-निर्देश'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>🌧️</span>
                <div>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                    {en ? 'Heavy Rainfall Exposure Expected Tonight (14.8 mm)' : 'आज रात 14.8 मिमी भारी बारिश की आशंका'}
                  </strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#475569' }}>
                    {en
                      ? 'Precipitation front will pass between 4:30 PM and 9:30 PM. Peak intensity 5.2 mm/hr.'
                      : 'शाम 4:30 से 9:30 बजे के बीच वर्षा का मुख्य दौर रहेगा। अधिकतम तीव्रता 5.2 मिमी/घंटा अनुमानित है।'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>🌾</span>
                <div>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                    {en ? 'Paddy Flowering Zone at Risk of Standing Water' : 'धान की फूल अवस्था में 5 सेमी से अधिक जलभराव का खतरा'}
                  </strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#475569' }}>
                    {en
                      ? `Villages ${activePanchayat.riskSummary.affectedVillages.join(' and ')} have clayey soil patches vulnerable to root suffocation.`
                      : `${activePanchayat.riskSummary.affectedVillages.join(' व ')} के भारी दोमट खेतों में जलभराव से जड़ें प्रभावित हो सकती हैं।`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '10px' }}>
                <span style={{ fontSize: '1.1rem' }}>💧</span>
                <div>
                  <strong style={{ fontSize: '0.84rem', color: '#0f172a' }}>
                    {en ? 'Irrigation Tubewells Must Be Suspended' : 'सरकारी व निजी नलकूप तुरंत बंद करने की सलाह'}
                  </strong>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#475569' }}>
                    {en
                      ? 'Soil moisture is currently at 32.4% (near saturation). Additional pumping will cause avoidable energy waste and waterlogging.'
                      : 'मिट्टी में 32.4% नमी पहले से मौजूद है। नलकूप चलाने से बिजली/ईंधन का नुकसान और फसलों में रोग बढ़ेंगे।'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('gis')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#059669',
                  color: '#ffffff',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <MapIcon size={16} />
                <span>{en ? 'View Risk Map' : 'जोखिम मानचित्र देखें'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('advisories')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  background: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Send size={16} color="#059669" />
                <span>{en ? 'Generate Local Advisory' : 'स्थानीय सलाह पत्र बनाएं'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: WEATHER (1KM GRID) */}
      {activeTab === 'weather' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Hyperlocal 1 km Weather Grid for' : 'अति-स्थानीय 1 किमी मौसम ग्रिड:'} {activePanchayat.name}
            </h3>

            {/* Simulated 1km Grid Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
              {[
                { id: 'Cell-GHR-01', name: 'Rampur North', rain: 13.2, risk: 'Low' },
                { id: 'Cell-GHR-02', name: 'Rampur South', rain: 16.4, risk: 'Moderate' },
                { id: 'Cell-GHR-03', name: 'Shivpur Center', rain: 15.6, risk: 'Moderate' },
                { id: 'Cell-GHR-04', name: 'Kishanpur Basin', rain: 18.0, risk: 'High Waterlogging' },
                { id: 'Cell-GHR-05', name: 'Kalyanpur East', rain: 11.2, risk: 'Low' },
                { id: 'Cell-GHR-06', name: 'Kalyanpur West', rain: 12.0, risk: 'Low' },
                { id: 'Cell-GHR-07', name: 'Panchayat Hub', rain: 14.8, risk: 'Moderate' },
                { id: 'Cell-GHR-08', name: 'Canal Siphon', rain: 17.5, risk: 'High Silt Runoff' }
              ].map((cell) => {
                const isSelected = selectedGridCell?.id === cell.id;
                return (
                  <div
                    key={cell.id}
                    onClick={() =>
                      setSelectedGridCell({
                        id: cell.id,
                        lat: 27.016,
                        lon: 80.884,
                        rain: cell.rain,
                        risk: cell.risk
                      })
                    }
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                      background: cell.risk.includes('High') ? '#fef2f2' : cell.risk.includes('Moderate') ? '#fffbeb' : '#f0fdf4',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b' }}>{cell.id}</div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{cell.name}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0284c7', margin: '4px 0' }}>
                      {cell.rain} mm
                    </div>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: cell.risk.includes('High') ? '#b91c1c' : '#b45309'
                      }}
                    >
                      {cell.risk}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Grid Inspector */}
            {selectedGridCell && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginTop: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Info size={16} color="#059669" />
                  <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>
                    {en ? 'Selected 1km Grid Inspector:' : 'चयनित 1 किमी ग्रिड विवरण:'} {selectedGridCell.id}
                  </strong>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#475569' }}>
                  <strong>Prediction:</strong> {selectedGridCell.rain} mm (Confidence: 86% • Uncertainty: ±1.8 mm) •{' '}
                  <strong>Risk:</strong> {selectedGridCell.risk}
                </p>
                <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                  <strong style={{ fontSize: '0.78rem', color: '#065f46' }}>
                    {en ? 'What does this mean for the Panchayat?' : 'पंचायत के लिए इसका क्या अर्थ है?'}
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#047857' }}>
                    {en
                      ? 'Elevated rainfall will saturate low-lying fields. Bund cuts must be maintained to prevent more than 5cm submergence during flowering.'
                      : 'अत्यधिक वर्षा से निचले खेतों में जल जमाव हो सकता है। फूल आने के समय 5 सेमी से अधिक पानी न भरने दें, मेड़ निकास सुचारू रखें।'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CROPS & FARMS */}
      {activeTab === 'crops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                {en ? 'Crop Distribution & Stressed Areas' : 'फसल आच्छादन व तनावग्रस्त क्षेत्र'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Total Panchayat Farmland: 3,850 ha
              </span>
            </div>

            {/* Table of Villages */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>{en ? 'Village' : 'ग्राम'}</th>
                    <th style={{ padding: '10px 12px' }}>{en ? 'Farmland (ha)' : 'कृषि भूमि (हे.)'}</th>
                    <th style={{ padding: '10px 12px' }}>{en ? 'Registered Farmers' : 'पंजीकृत किसान'}</th>
                    <th style={{ padding: '10px 12px' }}>{en ? 'Primary Crop' : 'मुख्य फसल'}</th>
                    <th style={{ padding: '10px 12px' }}>{en ? 'Soil Type' : 'मृदा प्रकार'}</th>
                    <th style={{ padding: '10px 12px' }}>{en ? 'Water Status' : 'जल स्थिति'}</th>
                    <th style={{ padding: '10px 12px' }}>{en ? 'Active Action' : 'सक्रिय कार्रवाई'}</th>
                  </tr>
                </thead>
                <tbody>
                  {activePanchayat.villages.map((v) => (
                    <tr key={v.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>
                        {en ? v.name : v.nameHi}
                      </td>
                      <td style={{ padding: '12px', color: '#475569' }}>{v.totalAreaHa} ha</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{v.farmsCount}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#059669' }}>{v.primaryCrop}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{v.soilType}</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: v.waterStatus === 'Critical' ? '#fee2e2' : v.waterStatus === 'Monitor' ? '#fef3c7' : '#dcfce7',
                            color: v.waterStatus === 'Critical' ? '#b91c1c' : v.waterStatus === 'Monitor' ? '#b45309' : '#15803d'
                          }}
                        >
                          {v.waterStatus}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 700, color: v.activeRisk ? '#b45309' : '#64748b' }}>
                        {v.activeRisk ? `⚠️ ${v.activeRisk}` : '✓ Normal'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: WATER SITUATION */}
      {activeTab === 'water' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Droplets size={24} color="#d97706" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                  {en ? 'Panchayat Water Situation: ' : 'पंचायत जल स्थिति: '}
                  <span style={{ color: '#d97706' }}>🟡 MONITOR (निगरानी आवश्यक)</span>
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Soil moisture is adequate with zero irrigation deficit. Incoming rains demand drainage preparedness.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  {en ? 'Soil Moisture' : 'मृदा नमी'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                  {activePanchayat.waterMetrics.soilMoisturePct}%
                </div>
                <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>Optimal Root Zone Capacity</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  {en ? 'Irrigation Demand' : 'सिंचाई मांग'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', margin: '4px 0' }}>
                  0.0 mm
                </div>
                <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>No Pumping Required</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  {en ? 'Waterlogging Risk' : 'जलभराव जोखिम'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>
                  Moderate
                </div>
                <div style={{ fontSize: '0.74rem', color: '#d97706', fontWeight: 700 }}>Rampur & Shivpur lowlands</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  {en ? 'Drought Stress' : 'सूखा तनाव'}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#10b981', margin: '4px 0' }}>
                  None / Low
                </div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>Full seasonal reserve</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: RISK & ALERTS */}
      {activeTab === 'risk' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Panchayat Operational Risk Breakdown' : 'पंचायत स्तर जोखिम व शमन योजना'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {UNIFIED_ACTIVE_RISKS.map((risk) => (
                <div
                  key={risk.id}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '14px',
                    border: '1.5px solid #fed7aa',
                    background: '#fffbf5'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={18} color="#ea580c" />
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{risk.hazardType}</strong>
                      <span
                        style={{
                          background: '#ea580c',
                          color: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          fontSize: '0.68rem',
                          fontWeight: 800
                        }}
                      >
                        {risk.severity}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                      Expected: {risk.expectedDuration}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#475569' }}>
                    <strong>Affected Area:</strong> {risk.location} ({risk.affectedAreaHa} ha) •{' '}
                    <strong>Affected Crop:</strong> {risk.affectedCrop}
                  </p>

                  <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#c2410c' }}>
                      {en ? 'Recommended Officer Action:' : 'पंचायत अधिकारी के लिए संस्तुत कार्रवाई:'}
                    </strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>
                      {en ? risk.recommendedResponse : risk.recommendedResponseHi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: GIS MAP */}
      {activeTab === 'gis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {en ? 'Panchayat Spatial GIS Map' : 'पंचायत स्थानिक जीआईएस मानचित्र'}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Click layer drawer to view specific attributes. One active primary thematic layer at a time.
                </p>
              </div>

              {/* Layer Drawer Pills */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['risk', 'weather', 'crop', 'water'] as const).map((layer) => (
                  <button
                    key={layer}
                    type="button"
                    onClick={() => setActiveGisLayer(layer)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      border: activeGisLayer === layer ? '1.5px solid #059669' : '1px solid #cbd5e1',
                      background: activeGisLayer === layer ? '#ecfdf5' : '#ffffff',
                      color: activeGisLayer === layer ? '#059669' : '#64748b'
                    }}
                  >
                    {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated GIS Canvas View */}
            <div
              style={{
                width: '100%',
                height: '420px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)'
              }}
            >
              {/* Background Grid Pattern */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Interactive Village Hotspots on Map */}
              {activePanchayat.villages.map((v, i) => (
                <div
                  key={v.name}
                  onClick={() => setSelectedVillage(v.name)}
                  style={{
                    position: 'absolute',
                    top: `${30 + i * 18}%`,
                    left: `${25 + i * 16}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: v.activeRisk ? 'rgba(239, 68, 68, 0.85)' : 'rgba(16, 185, 129, 0.85)',
                      border: '2px solid #ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 16px rgba(0,0,0,0.5)',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 900
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    style={{
                      background: 'rgba(0,0,0,0.75)',
                      color: '#ffffff',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {en ? v.name : v.nameHi}
                  </span>
                </div>
              ))}

              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  lineHeight: 1.4
                }}
              >
                <div><strong>Panchayat:</strong> {activePanchayat.name} (Grid 1km Resolution)</div>
                <div><strong>Active Theme:</strong> {activeGisLayer.toUpperCase()} • <strong>Zoom:</strong> Block Cadastral Level</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: ADVISORIES */}
      {activeTab === 'advisories' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Advisory Generator with Review Gate */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1.5px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {en ? 'Draft Local Agricultural Advisory' : 'स्थानीय कृषि परामर्श प्रारूप'}
                </h3>
              </div>
              <span
                style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '0.72rem',
                  fontWeight: 800
                }}
              >
                {en ? 'AI-generated draft — officer review required' : 'AI प्रारूप — अधिकारी समीक्षा अनिवार्य'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {en ? 'Issue Title' : 'समस्या / विषय'}
                </label>
                <input
                  type="text"
                  value={advisoryDraft.issue}
                  onChange={(e) => setAdvisoryDraft({ ...advisoryDraft, issue: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    {en ? 'Affected Crop' : 'प्रभावित फसल'}
                  </label>
                  <input
                    type="text"
                    value={advisoryDraft.affectedCrop}
                    onChange={(e) => setAdvisoryDraft({ ...advisoryDraft, affectedCrop: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    {en ? 'Target Villages' : 'लक्षित गांव'}
                  </label>
                  <input
                    type="text"
                    value={advisoryDraft.affectedVillages}
                    onChange={(e) => setAdvisoryDraft({ ...advisoryDraft, affectedVillages: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  {en ? 'Operational Directive / Message for Farmers' : 'किसानों के लिए कार्यकारी संदेश'}
                </label>
                <textarea
                  rows={3}
                  value={advisoryDraft.message}
                  onChange={(e) => setAdvisoryDraft({ ...advisoryDraft, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handlePublishAdvisory}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{en ? 'Approve & Transmit Advisory' : 'अनुमोदन करें व प्रेषित करें'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Advisories Stream */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Panchayat Advisory Bulletin History' : 'जारी किए गए परामर्श बुलेटिन'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {advisoriesList.map((adv) => (
                <div key={adv.id} style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                      {en ? adv.title : adv.titleHi}
                    </strong>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: adv.status === 'published' ? '#dcfce7' : '#fef3c7',
                        color: adv.status === 'published' ? '#15803d' : '#b45309'
                      }}
                    >
                      {adv.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: '0.8rem', color: '#475569' }}>
                    {en ? adv.message : adv.messageHi}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    By {adv.author} • {adv.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: REPORTS & EXPORT */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'Panchayat Intelligence Reports & Data Export' : 'पंचायत रिपोर्ट व डेटा निर्यात'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  📄 {en ? 'Daily Panchayat Weather & Risk Dossier' : 'दैनिक पंचायत मौसम व आपदा डोजियर'}
                </strong>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px' }}>
                  Includes 1km rainfall predictions, soil saturation indicators, and village-wise drainage status.
                </p>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} color="#059669" />
                  <span>{en ? 'Export CSV' : 'सीएसवी डाउनलोड करें'}</span>
                </button>
              </div>

              <div style={{ padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                  🌾 {en ? 'Panchayat Kharif Crop Health Audit' : 'पंचायत खरीफ फसल स्वास्थ्य ऑडिट'}
                </strong>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 12px' }}>
                  Aggregates 3,850 ha area with variety stage breakups, waterlogging risks, and farmer contact registry.
                </p>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} color="#059669" />
                  <span>{en ? 'Export CSV' : 'सीएसवी डाउनलोड करें'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
