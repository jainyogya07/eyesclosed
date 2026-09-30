import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Building2,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Droplets,
  CloudSun,
  Wheat,
  FileText,
  Filter,
  ArrowRight,
  Download,
  CheckCircle2,
  Truck,
  Compass,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useRole } from '../../contexts/RoleContext';
import { useApp } from '../../contexts/AppContext';
import {
  DISTRICT_PANCHAYATS,
  UNIFIED_ACTIVE_RISKS,
  PanchayatRecord
} from '../../services/governanceIntelligenceService';

interface DistrictOfficerHubProps {
  initialTab?: string;
}

export const DistrictOfficerHub: React.FC<DistrictOfficerHubProps> = ({ initialTab = 'dashboard' }) => {
  const { scope, setActivePanchayatCode } = useRole();
  const { language } = useApp();
  const en = language === 'en';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [drilldownPanchayat, setDrilldownPanchayat] = useState<PanchayatRecord | null>(null);

  // Resource planning state
  const [selectedResourceType, setSelectedResourceType] = useState<string>('drainage_pumps');
  const [allocationToast, setAllocationToast] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<'normal' | 'deficit_15' | 'deficit_30' | 'excess_20'>('deficit_15');

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const tabs = [
    { id: 'dashboard', labelEn: 'District Overview', labelHi: 'जिला अवलोकन', icon: Layers },
    { id: 'panchayats', labelEn: 'Panchayat Comparison', labelHi: 'पंचायत तुलना', icon: Building2 },
    { id: 'weather', labelEn: 'Weather Intelligence', labelHi: 'मौसम कमान', icon: CloudSun },
    { id: 'risk-command', labelEn: 'Risk Command Center', labelHi: 'आपदा व जोखिम केंद्र', icon: ShieldAlert },
    { id: 'water', labelEn: 'Water Resources', labelHi: 'जिला जल संसाधन', icon: Droplets },
    { id: 'resource-planning', labelEn: 'Resource Planning', labelHi: 'संसाधन नियोजन', icon: Truck },
    { id: 'scenarios', labelEn: 'District Scenarios', labelHi: 'जिला परिदृश्य सिमुलेटर', icon: Compass },
    { id: 'reports', labelEn: 'District Reports', labelHi: 'जिला रिपोर्ट्स व निर्यात', icon: FileText }
  ];

  const filteredPanchayats = DISTRICT_PANCHAYATS.filter((p) => {
    if (filterRisk === 'all') return true;
    return p.riskSummary.level.toLowerCase() === filterRisk.toLowerCase();
  });

  const handleAllocateResource = () => {
    setAllocationToast(
      en
        ? 'Decision Support: 4 Mobile de-watering pump units flagged for deployment to Itaunja & Gharaunda lowlands.'
        : 'निर्णय समर्थन: इटौंजा और घरौंदा के निचले इलाकों के लिए 4 मोबाइल पंप यूनिट चिह्नित किए गए।'
    );
    setTimeout(() => setAllocationToast(null), 4500);
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Priority_Rank,Panchayat,Block,Farmland_Ha,Rainfall_Mm_24h,Crop_Health_Idx,Water_Situation,Risk_Level,Action\n' +
      DISTRICT_PANCHAYATS.map(
        (p) =>
          `${p.priorityRank},"${p.name}","${p.block}",${p.totalAreaHa},${p.weather.rainfallMm24h},${p.cropMetrics.cropHealthIndex},"${p.waterMetrics.waterSituation}","${p.riskSummary.level}","${p.riskSummary.recommendedAction.replace(/"/g, '""')}"`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'lucknow_district_priorities.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '20px 16px 80px' }}>
      {/* Scope Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)',
          borderRadius: '20px',
          padding: '24px 28px',
          color: '#ffffff',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.25)',
          marginBottom: '20px'
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
                🧑‍💼 {en ? 'District Strategic Command View' : 'जिला रणनीतिक कमान व योजना केंद्र'}
              </span>
              <span
                style={{
                  background: '#0284c7',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.68rem',
                  fontWeight: 900
                }}
              >
                PILOT VALIDATED
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              {en ? 'District Agriculture Command: Lucknow' : 'जिला कृषि कमान मुख्यालय: लखनऊ'}
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.86rem' }}>
              <strong>{en ? 'District Jurisdiction:' : 'जिला अधिकार क्षेत्र:'}</strong> 8 Blocks • 45 Panchayats (Pilot
              5 Live) • 142,000 ha Kharif Farmland
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              textAlign: 'right'
            }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8, fontWeight: 700 }}>
              {en ? 'Panchayats at Elevated Risk' : 'सक्रिय जोखिम पंचायतें'}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#fcd34d' }}>
              2 / 5 (Gharaunda & Itaunja)
            </div>
          </div>
        </div>
      </div>

      {/* Active Module Indicator (Driven by Sidebar) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '8px 16px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
          <span style={{ color: '#0284c7' }}>●</span>
          <span>{en ? 'Active Intelligence Module:' : 'सक्रिय मॉड्यूल:'}</span>
          <span style={{ color: '#0284c7', background: '#e0f2fe', padding: '2px 10px', borderRadius: '6px' }}>
            {tabs.find(t => t.id === activeTab)?.[en ? 'labelEn' : 'labelHi'] || activeTab}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {en ? 'Selected via left sidebar' : 'बाएं साइडबार से चयनित'}
        </span>
      </div>

      {/* Toast */}
      {allocationToast && (
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
          <span>{allocationToast}</span>
        </div>
      )}

      {/* TAB 1: DISTRICT OVERVIEW & PRIORITY RANKINGS */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Priority Areas Ranking */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {en ? 'District Priority Intervention Rankings' : 'जिला प्राथमिकता रैंकिंग (कहाँ तत्काल ध्यान आवश्यक?)'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  Ranked by composite exposure score: Rainfall anomaly + Soil Saturation + Crop Phenological Vulnerability
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCSV}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '7px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} color="#0284c7" />
                <span>Export Dossier (CSV)</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {DISTRICT_PANCHAYATS.sort((a, b) => a.priorityRank - b.priorityRank).map((p) => (
                <div
                  key={p.code}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: p.priorityRank === 1 ? '1.5px solid #f97316' : '1px solid #e2e8f0',
                    background: p.priorityRank === 1 ? '#fffbf5' : '#ffffff',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: p.priorityRank === 1 ? '#f97316' : p.priorityRank === 2 ? '#fb923c' : '#e2e8f0',
                        color: p.priorityRank <= 2 ? '#ffffff' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.95rem',
                        fontWeight: 900
                      }}
                    >
                      #{p.priorityRank}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '1rem', color: '#0f172a' }}>
                          {en ? p.name : p.nameHi}
                        </strong>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>({p.block} Block)</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, marginTop: '2px' }}>
                        ⚠️ {p.riskSummary.primaryHazard} ({p.riskSummary.level})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.78rem', color: '#475569' }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Rainfall 24h</span>
                      <strong>{p.weather.rainfallMm24h} mm</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Soil Moisture</span>
                      <strong>{p.waterMetrics.soilMoisturePct}%</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block' }}>Crop Health</span>
                      <strong style={{ color: '#059669' }}>{p.cropMetrics.cropHealthIndex}%</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActivePanchayatCode(p.code);
                      setDrilldownPanchayat(p);
                      setActiveTab('panchayats');
                    }}
                    style={{
                      background: 'transparent',
                      border: '1.5px solid #0284c7',
                      color: '#0284c7',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Drill Down
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PANCHAYAT COMPARISON TABLE */}
      {activeTab === 'panchayats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {en ? 'Multi-Panchayat Comparison Matrix' : 'पंचायतवार तुलनात्मक विश्लेषण तालिका'}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={15} color="#64748b" />
                <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>Risk Filter:</span>
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.76rem',
                    fontWeight: 700
                  }}
                >
                  <option value="all">All Levels</option>
                  <option value="high">High Risk</option>
                  <option value="moderate">Moderate Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>Panchayat</th>
                    <th style={{ padding: '10px 12px' }}>Block</th>
                    <th style={{ padding: '10px 12px' }}>Rainfall (24h)</th>
                    <th style={{ padding: '10px 12px' }}>Soil Moisture</th>
                    <th style={{ padding: '10px 12px' }}>Paddy Area</th>
                    <th style={{ padding: '10px 12px' }}>Risk Level</th>
                    <th style={{ padding: '10px 12px' }}>Action Protocol</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPanchayats.map((p) => (
                    <tr key={p.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>{p.name}</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{p.block}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0284c7' }}>{p.weather.rainfallMm24h} mm</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{p.waterMetrics.soilMoisturePct}%</td>
                      <td style={{ padding: '12px', color: '#475569' }}>{p.cropMetrics.paddyAreaHa} ha</td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: p.riskSummary.level === 'HIGH' ? '#fee2e2' : p.riskSummary.level === 'MODERATE' ? '#fef3c7' : '#dcfce7',
                            color: p.riskSummary.level === 'HIGH' ? '#b91c1c' : p.riskSummary.level === 'MODERATE' ? '#b45309' : '#15803d'
                          }}
                        >
                          {p.riskSummary.level}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#334155', maxWidth: '320px' }}>
                        {en ? p.riskSummary.recommendedAction : p.riskSummary.recommendedActionHi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RISK COMMAND CENTER */}
      {activeTab === 'risk-command' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'District Active Hazards & Command Center' : 'जिला सक्रिय आपदा व जोखिम कमान केंद्र'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {UNIFIED_ACTIVE_RISKS.map((risk) => (
                <div
                  key={risk.id}
                  style={{
                    padding: '18px 20px',
                    borderRadius: '12px',
                    border: '1.5px solid #fed7aa',
                    background: '#fffbf5'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
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
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      Duration: {risk.expectedDuration}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 8px', fontSize: '0.82rem', color: '#475569' }}>
                    <strong>Geographic Scope:</strong> {risk.location} ({risk.affectedAreaHa} ha affected) •{' '}
                    <strong>Affected Crop:</strong> {risk.affectedCrop}
                  </p>

                  <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#c2410c' }}>District Operational Response:</strong>
                    <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#9a3412', fontWeight: 600 }}>
                      {risk.recommendedResponse}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCE PLANNING (DECISION SUPPORT) */}
      {activeTab === 'resource-planning' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1.5px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Truck size={20} color="#0284c7" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {en ? 'District Resource Planning (Decision Support)' : 'जिला संसाधन आवंटन (निर्णय समर्थन प्रणाली)'}
              </h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#64748b' }}>
              <em>Note: This is decision support to help district administration prioritize equipment and teams.</em>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Resource Type
                </label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => setSelectedResourceType(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                >
                  <option value="drainage_pumps">Mobile De-watering Pumps</option>
                  <option value="advisory_squad">Field Plant Protection Squad</option>
                  <option value="seed_reserves">Contingency Seed Reserves</option>
                  <option value="emergency_aid">Canal Siphon Inspection Crews</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Target Priority Area
                </label>
                <input
                  type="text"
                  readOnly
                  value="Priority 1 & 2: Gharaunda + Itaunja Lowlands"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#f8fafc' }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAllocateResource}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '10px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Flag Resource Allocation Directive</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: WEATHER INTELLIGENCE (DISTRICT AWS NETWORK) */}
      {activeTab === 'weather' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {en ? 'District AWS Weather Network & Isohyet Telemetry' : 'जिला स्वचालित मौसम केंद्र (AWS) नेटवर्क टेलीमेट्री'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  {en ? 'Real-time telemetry from 5 IMD-standard automatic weather stations across Lucknow District' : 'लखनऊ जिले के 5 स्वचालित मौसम केंद्रों से लाइव टेलीमेट्री डेटा'}
                </p>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                5/5 AWS Online
              </span>
            </div>

            {/* AWS Stations Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {[
                { id: 'AWS_LKO_01', name: 'Amausi (South)', temp: 28.6, rain: 12.4, wind: 14, hum: 78, status: 'Normal' },
                { id: 'AWS_LKO_02', name: 'Gharaunda (North)', temp: 27.8, rain: 14.8, wind: 16, hum: 84, status: 'Heavy Rain Warning' },
                { id: 'AWS_LKO_03', name: 'Chinhat (East)', temp: 29.1, rain: 9.6, wind: 11, hum: 72, status: 'Normal' },
                { id: 'AWS_LKO_04', name: 'Malihabad (West)', temp: 28.2, rain: 11.2, wind: 13, hum: 79, status: 'Normal' },
                { id: 'AWS_LKO_05', name: 'Mohanlalganj (Basin)', temp: 28.9, rain: 10.5, wind: 12, hum: 76, status: 'Normal' },
              ].map((aws) => (
                <div key={aws.id} style={{ background: aws.status.includes('Warning') ? '#fffbf5' : '#f8fafc', padding: '16px', borderRadius: '12px', border: aws.status.includes('Warning') ? '1.5px solid #f97316' : '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>{aws.id}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: aws.status.includes('Warning') ? '#ea580c' : '#059669' }}>{aws.status}</span>
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block', marginBottom: '8px' }}>{aws.name}</strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '0.75rem' }}>
                    <div><span style={{ color: '#64748b' }}>Rain:</span> <strong>{aws.rain} mm</strong></div>
                    <div><span style={{ color: '#64748b' }}>Temp:</span> <strong>{aws.temp}°C</strong></div>
                    <div><span style={{ color: '#64748b' }}>Humidity:</span> <strong>{aws.hum}%</strong></div>
                    <div><span style={{ color: '#64748b' }}>Wind:</span> <strong>{aws.wind} km/h</strong></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Synoptic Summary */}
            <div style={{ background: '#f0f9ff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
              <strong style={{ fontSize: '0.84rem', color: '#0369a1', display: 'block', marginBottom: '4px' }}>
                🌧️ {en ? 'District Synoptic Summary (Next 24 Hours):' : 'जिला मौसम सारांश (अगले 24 घंटे):'}
              </strong>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#0c4a6e', lineHeight: 1.5 }}>
                {en
                  ? 'A localized convective band is crossing Gharaunda and Itaunja blocks between 4:30 PM and 9:30 PM. Peak intensity expected at 5.2 mm/hr. Water discharge gates on Gomti feeder canals are placed on alert.'
                  : 'स्थानीय मानसूनी चक्रवात घरौंदा और इटौंजा ब्लॉकों में शाम 4:30 से रात 9:30 के बीच सक्रिय रहेगा। अधिकतम वर्षा तीव्रता 5.2 मिमी/घंटा अनुमानित है।'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WATER RESOURCES */}
      {activeTab === 'water' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {en ? 'District Surface & Ground Water Ledger' : 'जिला सतही व भूजल प्रबंधन लेजर'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  {en ? 'Panchayat water-table depths, Sharda Sahayak canal system, and tubewell energy demand' : 'पंचायतवार भूजल गहराई, शारदा सहायक नहर प्रणाली व नलकूप ऊर्जा भार'}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>CANAL SYSTEM CAPACITY</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0284c7', margin: '4px 0' }}>82.4%</div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700 }}>Sharda Feeder Active</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>AVERAGE GROUNDWATER</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>11.4 m</div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Safe Stage (64.2% extracted)</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>LOWLAND WATERLOGGED</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', margin: '4px 0' }}>730 ha</div>
                <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 700 }}>Gharaunda & Itaunja Basins</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>TUBEWELL REST RECOM.</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', margin: '4px 0' }}>36 Hours</div>
                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>14.8mm rain covers root-zone</div>
              </div>
            </div>

            {/* Block Water Table Depth Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>Panchayat / Block</th>
                    <th style={{ padding: '10px 12px' }}>Water Table Depth</th>
                    <th style={{ padding: '10px 12px' }}>Soil Moisture</th>
                    <th style={{ padding: '10px 12px' }}>Canal Coverage</th>
                    <th style={{ padding: '10px 12px' }}>Water Situation</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Gharaunda', depth: '9.0 m', moisture: '32.4%', canal: '68% Command Area', status: 'Optimal / Monitor Lowlands' },
                    { name: 'Amausi', depth: '10.0 m', moisture: '26.8%', canal: '45% Command Area', status: 'Optimal' },
                    { name: 'Mohanlalganj', depth: '11.0 m', moisture: '24.2%', canal: '52% Command Area', status: 'Adequate' },
                    { name: 'Chinhat', depth: '13.0 m', moisture: '22.0%', canal: '30% Command Area', status: 'Moderate Deficit' },
                    { name: 'Malihabad', depth: '14.0 m', moisture: '21.5%', canal: '38% Command Area', status: 'Moderate Deficit' },
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 800, color: '#0f172a' }}>{row.name}</td>
                      <td style={{ padding: '10px 12px', color: '#0284c7', fontWeight: 700 }}>{row.depth}</td>
                      <td style={{ padding: '10px 12px', color: '#475569' }}>{row.moisture}</td>
                      <td style={{ padding: '10px 12px', color: '#475569' }}>{row.canal}</td>
                      <td style={{ padding: '10px 12px', color: row.status.includes('Monitor') ? '#d97706' : '#059669', fontWeight: 700 }}>{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DISTRICT SCENARIOS SIMULATOR */}
      {activeTab === 'scenarios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                {en ? 'District Climate Stress & Yield Impact Simulator' : 'जिला जलवायु तनाव व उपज प्रभाव सिमुलेटर'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                {en
                  ? 'Simulate precipitation shifts and heat stress to project district-wide Kharif grain output and ground water drawdown.'
                  : 'वर्षा में बदलाव और तापमान वृद्धि का जिले के कुल खाद्यान्न उत्पादन और भूजल पर प्रभाव जांचें।' }
              </p>
            </div>

            {/* Scenario Selector Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {[
                { id: 'normal', label: 'Baseline (Historical Normal)' },
                { id: 'deficit_15', label: 'Scenario A: -15% Monsoon Deficit' },
                { id: 'deficit_30', label: 'Scenario B: -30% Severe Drought' },
                { id: 'excess_20', label: 'Scenario C: +20% Flash Flood Excess' }
              ].map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenario(sc.id as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: selectedScenario === sc.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                    background: selectedScenario === sc.id ? '#f0f9ff' : '#ffffff',
                    color: selectedScenario === sc.id ? '#0284c7' : '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {sc.label}
                </button>
              ))}
            </div>

            {/* Impact Metric Cards based on Selected Scenario */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>EST. PADDY YIELD IMPACT</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: selectedScenario === 'normal' ? '#059669' : selectedScenario === 'deficit_30' ? '#dc2626' : '#d97706', margin: '4px 0' }}>
                  {selectedScenario === 'normal' ? '±0.0% (Stable)' : selectedScenario === 'deficit_15' ? '-6.5% Yield' : selectedScenario === 'deficit_30' ? '-18.4% Severe Loss' : '-8.2% (Submergence)'}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Basmati & PR-126 Varieties</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>GROUNDWATER STRESS</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: selectedScenario === 'deficit_30' ? '#dc2626' : '#0284c7', margin: '4px 0' }}>
                  {selectedScenario === 'normal' ? 'Normal Replenishment' : selectedScenario === 'deficit_15' ? '+1.2 m Drawdown' : selectedScenario === 'deficit_30' ? '+2.8 m Critical Drop' : 'Recharge +0.8 m'}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>5 Blocks Tubewell Grid</span>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 800 }}>RECOMMENDED INTERVENTION</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: '4px 0', lineHeight: 1.4 }}>
                  {selectedScenario === 'normal'
                    ? 'Standard irrigation scheduling & pest monitoring.'
                    : selectedScenario === 'deficit_15'
                    ? 'Prioritize canal tail-end rotation & AWD.'
                    : selectedScenario === 'deficit_30'
                    ? 'Trigger contingency pulse seeds (Moong PDM-139).'
                    : 'Deploy 8 mobile de-watering pumps to lowland blocks.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: DISTRICT REPORTS & EXPORT */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {en ? 'District Executive Reporting & Export Center' : 'जिला कार्यपालक रिपोर्टिंग व डेटा निर्यात केंद्र'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                  {en ? 'Download structured dossiers, panchayat compliance sheets, and inter-departmental briefs' : 'संरचित जिला रिपोर्ट, पंचायत अनुपालन प्रपत्र व अंतर-विभागीय सारांश डाउनलोड करें'}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  📄 1. District Master Priorities (CSV)
                </strong>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px' }}>
                  Complete 5-panchayat data matrix including rain totals, soil saturation, crop index, and risk rank.
                </p>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} />
                  <span>Download Priorities (CSV)</span>
                </button>
              </div>

              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                  📑 2. Weekly Agro-Meteorological Briefing
                </strong>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px' }}>
                  Executive briefing for District Magistrate and Chief Agriculture Officer on monsoon status.
                </p>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Download size={14} />
                  <span>Export Executive Briefing</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
