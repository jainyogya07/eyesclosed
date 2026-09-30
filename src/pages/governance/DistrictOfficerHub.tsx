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
        ? 'Decision Support: 4 Mobile de-watering pump units flagged for deployment to Itaunja & Bakshi Ka Talab lowlands.'
        : 'निर्णय समर्थन: इटौंजा और बख्शी का तालाब के निचले इलाकों के लिए 4 मोबाइल पंप यूनिट चिह्नित किए गए।'
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
              2 / 5 (BKT & Itaunja)
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          scrollbarWidth: 'none'
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '12px',
                border: isActive ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                background: isActive ? '#f0f9ff' : '#ffffff',
                color: isActive ? '#0284c7' : '#475569',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.12)' : 'none'
              }}
            >
              <Icon size={16} color={isActive ? '#0284c7' : '#64748b'} />
              <span>{en ? tab.labelEn : tab.labelHi}</span>
            </button>
          );
        })}
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
                  value="Priority 1 & 2: Bakshi Ka Talab + Itaunja Lowlands"
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

      {/* TAB 5: DISTRICT SCENARIOS & REPORTS */}
      {(activeTab === 'scenarios' || activeTab === 'weather' || activeTab === 'water' || activeTab === 'reports') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              {en ? 'District Synthesis & Scenario Simulation' : 'जिला परिदृश्य सिमुलेशन व रिपोर्ट्स'}
            </h3>

            <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.6 }}>
              In a 20% seasonal rainfall reduction scenario across Lucknow District, 3 out of 5 Panchayats will face
              elevated ground water pumping stress by September 15. The simulation engine recommends pre-positioning
              short-duration pulse seeds (Moong PDM-139) across Kakori and Malihabad blocks.
            </p>

            <button
              type="button"
              onClick={handleExportCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.84rem',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              <Download size={16} />
              <span>Download Full District Master Report (CSV)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
