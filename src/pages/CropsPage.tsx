import React, { useState } from 'react';
import { useFarm, PILOT_PANCHAYATS_CATALOG } from '../contexts/FarmContext';
import { useApp } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Thermometer,
  CloudRain,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  Scale,
  X,
  Volume2
} from 'lucide-react';

interface CropSuitabilityProfile {
  id: string;
  nameHi: string;
  nameEn: string;
  scientificName: string;
  suitability: 'HIGH' | 'MODERATE' | 'LOW';
  suitabilityScore: number;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  durationDays: string;
  durationDaysEn: string;
  waterNeedMm: number;
  waterDemandLevel: 'LOW' | 'MODERATE' | 'HIGH';
  climateRiskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  rainfallFitPct: number;
  tempFitPct: number;
  soilFitPct: number;
  keyWhy: string;
  keyWhyEn: string;
  watchOut: string;
  watchOutEn: string;
  soilCompatibility: string;
  soilCompatibilityEn: string;
  economicOutlook: string;
  economicOutlookEn: string;
}

const CROPS_DATABASE: CropSuitabilityProfile[] = [
  {
    id: 'bajra',
    nameHi: 'बाजरा (Pearl Millet)',
    nameEn: 'Bajra (Pearl Millet)',
    scientificName: 'Pennisetum glaucum',
    suitability: 'HIGH',
    suitabilityScore: 92,
    season: 'Kharif',
    durationDays: '75–85 दिन',
    durationDaysEn: '75–85 days',
    waterNeedMm: 350,
    waterDemandLevel: 'LOW',
    climateRiskLevel: 'LOW',
    rainfallFitPct: 95,
    tempFitPct: 92,
    soilFitPct: 90,
    keyWhy: 'वर्तमान कम वर्षा अनुमान में सबसे उपयुक्त। 350 मिमी से कम पानी में भी स्वस्थ उपज देने में सक्षम। बलुई दोमट मिट्टी के अनुकूल।',
    keyWhyEn: 'Most resilient under low-rainfall conditions. Delivers high grain yields with under 350mm water. High compatibility with sandy loam soils.',
    watchOut: 'फूल आने (Flowering) के समय 40°C से ऊपर तापमान होने पर पोलन स्टेरिलिटी का जोखिम हो सकता है।',
    watchOutEn: 'Mild risk of pollen sterility if ambient temperatures exceed 40°C during the flowering window.',
    soilCompatibility: 'हल्की बलुई दोमट व दोमट मिट्टी (pH 6.5–7.8) के लिए सर्वोत्तम।',
    soilCompatibilityEn: 'Best suited for light sandy loam and loam soils (pH 6.5–7.8).',
    economicOutlook: 'कम लागत, सुनिश्चित न्यूनतम समर्थन मूल्य (MSP) और सूखा प्रतिरोध।',
    economicOutlookEn: 'Low input cost, guaranteed MSP procurement, and strong drought insurance.'
  },
  {
    id: 'moong',
    nameHi: 'मूंग (Green Gram)',
    nameEn: 'Moong (Green Gram)',
    scientificName: 'Vigna radiata',
    suitability: 'HIGH',
    suitabilityScore: 88,
    season: 'Kharif',
    durationDays: '60–70 दिन',
    durationDaysEn: '60–70 days',
    waterNeedMm: 400,
    waterDemandLevel: 'LOW',
    climateRiskLevel: 'LOW',
    rainfallFitPct: 88,
    tempFitPct: 90,
    soilFitPct: 86,
    keyWhy: 'कम अवधि (65 दिन) की दलहनी फसल। मिट्टी में नाइट्रोजन फिक्सेशन कर अगली रबी फसल की उर्वरता बढ़ाती है।',
    keyWhyEn: 'Short 65-day duration pulse. Fixes atmospheric nitrogen to enrich soil fertility for the following Rabi season.',
    watchOut: 'फली पकने के समय अत्यधिक आकस्मिक वर्षा होने पर दाने काले पड़ने का अंदेशा।',
    watchOutEn: 'Risk of grain discoloration if sudden excessive downpours occur during pod maturity.',
    soilCompatibility: 'अच्छी जल निकासी वाली दोमट मिट्टी (pH 7.0–7.5)।',
    soilCompatibilityEn: 'Well-drained loam soil (pH 7.0–7.5).',
    economicOutlook: 'उच्च बाजार भाव (₹8,000–9,000/क्विंटल), अत्यंत कम जल व खाद लागत।',
    economicOutlookEn: 'High market prices (₹8,000–9,000/quintal) with minimal irrigation and fertilizer expense.'
  },
  {
    id: 'groundnut',
    nameHi: 'मूंगफली (Groundnut)',
    nameEn: 'Groundnut (Peanut)',
    scientificName: 'Arachis hypogaea',
    suitability: 'MODERATE',
    suitabilityScore: 74,
    season: 'Kharif',
    durationDays: '105–120 दिन',
    durationDaysEn: '105–120 days',
    waterNeedMm: 550,
    waterDemandLevel: 'MODERATE',
    climateRiskLevel: 'MODERATE',
    rainfallFitPct: 78,
    tempFitPct: 84,
    soilFitPct: 82,
    keyWhy: 'सैंडी लोम मिट्टी में फली का विकास उत्कृष्ट। सीमित सिंचाई के साथ सुरक्षित नकदी फसल।',
    keyWhyEn: 'Excellent peg development in sandy loam. Reliable cash crop when supplemented with moderate irrigation.',
    watchOut: 'पेगिंग (Pegging) अवस्था में 15 दिन का सूखा पड़ने पर पैदावार घट सकती है। जलभराव बर्दाश्त नहीं करती।',
    watchOutEn: 'Yield drops if dry spell occurs during pegging; highly sensitive to stagnant water.',
    soilCompatibility: 'भुरभुरी, हल्की रेतीली दोमट मिट्टी (pH 6.0–7.5)।',
    soilCompatibilityEn: 'Friable, light sandy loam (pH 6.0–7.5).',
    economicOutlook: 'अच्छी बाजार मांग व खाद्य तेल मिलों से सीधा उठान।',
    economicOutlookEn: 'High demand from local oil extraction units and strong farmgate prices.'
  },
  {
    id: 'paddy_basmati',
    nameHi: 'धान - बासमती (Paddy Basmati)',
    nameEn: 'Basmati Paddy (Rice)',
    scientificName: 'Oryza sativa',
    suitability: 'MODERATE',
    suitabilityScore: 68,
    season: 'Kharif',
    durationDays: '125–140 दिन',
    durationDaysEn: '125–140 days',
    waterNeedMm: 1250,
    waterDemandLevel: 'HIGH',
    climateRiskLevel: 'HIGH',
    rainfallFitPct: 62,
    tempFitPct: 79,
    soilFitPct: 88,
    keyWhy: 'वर्तमान में पारंपरिक रूप से बोई जाने वाली फसल। दोमट मिट्टी अनुकूल है किंतु अत्यधिक भूजल दोहन की आवश्यकता पड़ती है।',
    keyWhyEn: 'Traditional crop choice. Clay loam soil is compatible, but demands heavy groundwater extraction (1,250mm).',
    watchOut: 'यदि वर्षा में 20% की भी कमी आती है तो नलकूप बिजली/डीजल खर्च में 45% तक भारी वृद्धि होगी।',
    watchOutEn: 'A 20% deficit in monsoon rainfall increases tubewell pumping costs by 45%.',
    soilCompatibility: 'मटियार दोमट (Clay Loam) जिसमें जल रोकने की क्षमता अधिक हो।',
    soilCompatibilityEn: 'Clay loam with high water holding capacity.',
    economicOutlook: 'बाजार भाव अच्छे किंतु अत्यधिक इनपुट लागत और भूजल ह्रास का जोखिम।',
    economicOutlookEn: 'Attractive gross realization, but net profit eroded by surging energy and pesticide costs.'
  },
  {
    id: 'mustard',
    nameHi: 'सरसों (Mustard - Rabi)',
    nameEn: 'Mustard (Rabi)',
    scientificName: 'Brassica juncea',
    suitability: 'HIGH',
    suitabilityScore: 90,
    season: 'Rabi',
    durationDays: '110–125 दिन',
    durationDaysEn: '110–125 days',
    waterNeedMm: 300,
    waterDemandLevel: 'LOW',
    climateRiskLevel: 'LOW',
    rainfallFitPct: 92,
    tempFitPct: 94,
    soilFitPct: 90,
    keyWhy: 'आगामी रबी सीजन के लिए सबसे अनुशंसित। केवल 2 हल्की सिंचाइयों में तैयार, कम जोखिम।',
    keyWhyEn: 'Most recommended crop for upcoming Rabi cycle. Matures in only 2 protective irrigations.',
    watchOut: 'दिसंबर-जनवरी में पाला (Frost) और माहू (Aphid) कीट का समय पर प्रबंधन आवश्यक।',
    watchOutEn: 'Requires timely preventive management for frost and aphid infestations in Dec-Jan.',
    soilCompatibility: 'मध्यम से भारी दोमट मिट्टी में उत्कृष्ट फैलाव।',
    soilCompatibilityEn: 'Medium to heavy loam soils with deep root expansion.',
    economicOutlook: 'स्थिर एमएसपी और खाद्य तेलों की घरेलू मांग से सुरक्षित रिटर्न।',
    economicOutlookEn: 'High guaranteed MSP and continuous domestic edible oil demand.'
  },
  {
    id: 'sugarcane',
    nameHi: 'गन्ना (Sugarcane)',
    nameEn: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    suitability: 'LOW',
    suitabilityScore: 42,
    season: 'Kharif',
    durationDays: '300–360 दिन',
    durationDaysEn: '300–360 days',
    waterNeedMm: 2200,
    waterDemandLevel: 'HIGH',
    climateRiskLevel: 'HIGH',
    rainfallFitPct: 35,
    tempFitPct: 75,
    soilFitPct: 80,
    keyWhy: 'अत्यधिक जल मांग (2200 मिमी)। इस पंचायत के वर्तमान गिरते भूजल स्तर के कारण नए रकबे में अनुशंसित नहीं।',
    keyWhyEn: 'Massive water consumption (2,200mm). Not recommended for acreage expansion due to falling aquifer levels.',
    watchOut: 'लगातार 10–12 माह तक नियमित नलकूप सिंचाई की आवश्यकता, अत्यधिक बिजली/डीजल खर्च।',
    watchOutEn: 'Year-round pumping requirement causes extreme electricity/diesel overhead and aquifer drawdown.',
    soilCompatibility: 'गहरी उपजाऊ दोमट मिट्टी, उच्च कार्बनिक पदार्थ युक्त।',
    soilCompatibilityEn: 'Deep fertile loam with high organic carbon content.',
    economicOutlook: 'चीनी मिलों का भुगतान विलंब व भारी सिंचाई लागत।',
    economicOutlookEn: 'High working capital lock-in and extended mill payment cycles.'
  }
];

export const CropsPage: React.FC = () => {
  const { farm, playVoice } = useFarm();
  const { language } = useApp();
  const navigate = useNavigate();
  const en = language === 'en';

  const [selectedPanchayatCode, setSelectedPanchayatCode] = useState(
    farm.panchayat?.code || PILOT_PANCHAYATS_CATALOG[0].code
  );
  const [filterSuitability, setFilterSuitability] = useState<'ALL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [selectedCropDetail, setSelectedCropDetail] = useState<CropSuitabilityProfile | null>(null);
  const [comparisonList, setComparisonList] = useState<string[]>(['bajra', 'moong', 'paddy_basmati']);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  const currentPanchayat =
    PILOT_PANCHAYATS_CATALOG.find((p) => p.code === selectedPanchayatCode) || PILOT_PANCHAYATS_CATALOG[0];

  const filteredCrops = CROPS_DATABASE.filter((crop) => {
    if (filterSuitability === 'ALL') return true;
    return crop.suitability === filterSuitability;
  });

  const toggleCompare = (cropId: string) => {
    if (comparisonList.includes(cropId)) {
      if (comparisonList.length > 1) {
        setComparisonList(comparisonList.filter((id) => id !== cropId));
      }
    } else {
      if (comparisonList.length < 3) {
        setComparisonList([...comparisonList, cropId]);
      } else {
        setComparisonList([comparisonList[1], comparisonList[2], cropId]);
      }
    }
  };

  const getSuitabilityBadge = (suit: 'HIGH' | 'MODERATE' | 'LOW') => {
    if (suit === 'HIGH') {
      return (
        <span
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.7rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <CheckCircle2 size={11} color="#059669" />
          {en ? 'HIGH SUITABILITY' : 'HIGH SUITABILITY (उच्च)'}
        </span>
      );
    }
    if (suit === 'MODERATE') {
      return (
        <span
          style={{
            background: '#fffbeb',
            color: '#92400e',
            border: '1px solid #fde68a',
            padding: '2px 8px',
            borderRadius: '999px',
            fontSize: '0.7rem',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Info size={11} color="#d97706" />
          {en ? 'MODERATE SUITABILITY' : 'MODERATE (मध्यम)'}
        </span>
      );
    }
    return (
      <span
        style={{
          background: '#fef2f2',
          color: '#991b1b',
          border: '1px solid #fecaca',
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.7rem',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px'
        }}
      >
        <AlertTriangle size={11} color="#dc2626" />
        {en ? 'LOW SUITABILITY' : 'LOW (कम उपयुक्त)'}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.25rem 1rem 4rem' }}
    >
      {/* Page Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          padding: '20px 24px',
          marginBottom: '1.25rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span
                style={{
                  background: '#ecfdf5',
                  color: '#059669',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}
              >
                PANCHAYAT CROP SUITABILITY MATRIX
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Climate + Soil + Water Feasibility Engine
              </span>
            </div>

            <h1 style={{ fontSize: '1.45rem', color: '#0f172a', fontWeight: 800, margin: '0 0 4px 0' }}>
              {en
                ? `Which Crops Are Most Suitable for ${currentPanchayat.name}?`
                : 'इस पंचायत में कौन सी फसल सबसे ज्यादा उपयुक्त है?'}
            </h1>
            <p style={{ color: '#475569', fontSize: '0.86rem', margin: 0, maxWidth: '780px' }}>
              {en
                ? 'Scientifically grounded feasibility based on prevailing rainfall, temperature windows, root-zone moisture, and climate stress scenarios.'
                : 'कोई भी सामान्य स्कोर नहीं — वर्षा, तापमान, जड़-क्षेत्र नमी और भावी जलवायु परिदृश्यों के आधार पर वैज्ञानिक उपयुक्तता विश्लेषण।'}
            </p>
          </div>

          {/* Panchayat Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
              {en ? 'Selected Panchayat:' : 'विश्लेषण हेतु पंचायत चुनें:'}
            </label>
            <select
              value={selectedPanchayatCode}
              onChange={(e) => setSelectedPanchayatCode(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '9px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0f172a',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {PILOT_PANCHAYATS_CATALOG.map((p) => (
                <option key={p.code} value={p.code}>
                  📍 {en ? p.name : p.hi} ({p.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Panchayat Quick Baseline Context */}
        <div
          style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '0.76rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', color: '#475569' }}>
            <span>
              <strong>{en ? 'Soil Type:' : 'मिट्टी का प्रकार:'}</strong> {en ? 'Sandy Loam' : currentPanchayat.soilType}
            </span>
            <span>
              <strong>{en ? 'Soil pH:' : 'मृदा pH:'}</strong> {currentPanchayat.ph}
            </span>
            <span>
              <strong>{en ? 'Water Table:' : 'भूजल स्तर:'}</strong> {currentPanchayat.waterTable}
            </span>
            <span>
              <strong>{en ? 'Prevailing Crop:' : 'पारंपरिक फसल:'}</strong> {currentPanchayat.dominantCrop}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCompareDrawerOpen(true)}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '5px 12px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Scale size={13} />
            <span>
              {en ? `Compare Crops (${comparisonList.length})` : `फसल तुलना करें (${comparisonList.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '5px', background: 'rgba(241, 245, 249, 0.9)', padding: '3px', borderRadius: '10px' }}>
          {(['ALL', 'HIGH', 'MODERATE', 'LOW'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterSuitability(tab)}
              style={{
                padding: '5px 12px',
                borderRadius: '7px',
                border: 'none',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: filterSuitability === tab ? '#ffffff' : 'transparent',
                color: filterSuitability === tab ? '#0f172a' : '#64748b',
                boxShadow: filterSuitability === tab ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {tab === 'ALL'
                ? (en ? 'All Crops' : 'सभी फसलें')
                : tab === 'HIGH'
                ? (en ? '✓ High Suitability' : '✓ उच्च उपयुक्तता')
                : tab === 'MODERATE'
                ? (en ? '⚠ Moderate' : '⚠ मध्यम उपयुक्तता')
                : (en ? '✕ Low' : '✕ कम उपयुक्त')}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            playVoice(
              en
                ? `In ${currentPanchayat.name}, Bajra and Moong exhibit highest suitability because seasonal water requirements are only 350 to 400 millimeters, compared to 1250 millimeters for Paddy.`
                : `${currentPanchayat.hi} पंचायत में इस समय बाजरा और मूंग सर्वाधिक उपयुक्त फसलें हैं क्योंकि इनकी जल मांग केवल 350 से 400 मिलीमीटर है, जबकि धान में 1250 मिलीमीटर से अधिक पानी लगता है।`
            )
          }
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1.5px solid #cbd5e1',
            borderRadius: '999px',
            padding: '5px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#334155',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Volume2 size={14} color="#059669" />
          <span>{en ? 'Listen Analysis' : '🔊 ऑडियो विश्लेषण सुनें'}</span>
        </button>
      </div>

      {/* Visual Crop Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filteredCrops.map((crop) => {
          const isCompared = comparisonList.includes(crop.id);

          return (
            <div
              key={crop.id}
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                borderRadius: '14px',
                border: `1.5px solid ${crop.suitability === 'HIGH' ? '#bbf7d0' : crop.suitability === 'MODERATE' ? '#fde68a' : '#fecaca'}`,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              {/* Header */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                      {en ? crop.nameEn : crop.nameHi}
                    </h3>
                    <span style={{ fontSize: '0.72rem', fontStyle: 'italic', color: '#64748b' }}>
                      {crop.scientificName} · {en ? crop.durationDaysEn : crop.durationDays}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCompare(crop.id)}
                    style={{
                      background: isCompared ? '#ecfdf5' : '#f8fafc',
                      color: isCompared ? '#059669' : '#94a3b8',
                      border: `1px solid ${isCompared ? '#a7f3d0' : '#e2e8f0'}`,
                      borderRadius: '6px',
                      padding: '3px 7px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isCompared ? (en ? '✓ In Compare' : '✓ तुलना में') : (en ? '+ Compare' : '+ तुलना करें')}
                  </button>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  {getSuitabilityBadge(crop.suitability)}
                </div>

                {/* Progress bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '2px', color: '#475569' }}>
                      <span>{en ? '🌧 Rainfall Fit' : '🌧 वर्षा अनुकूलता'}</span>
                      <strong>{crop.rainfallFitPct}%</strong>
                    </div>
                    <div style={{ height: '5px', width: '100%', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${crop.rainfallFitPct}%`,
                          background: crop.rainfallFitPct > 80 ? '#0284c7' : crop.rainfallFitPct > 60 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '2px', color: '#475569' }}>
                      <span>{en ? '🌡 Temperature Fit' : '🌡 तापमान अनुकूलता'}</span>
                      <strong>{crop.tempFitPct}%</strong>
                    </div>
                    <div style={{ height: '5px', width: '100%', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${crop.tempFitPct}%`,
                          background: crop.tempFitPct > 80 ? '#059669' : crop.tempFitPct > 60 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '2px', color: '#475569' }}>
                      <span>{en ? '🌱 Soil Fit' : '🌱 मिट्टी अनुकूलता'}</span>
                      <strong>{crop.soilFitPct}%</strong>
                    </div>
                    <div style={{ height: '5px', width: '100%', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${crop.soilFitPct}%`,
                          background: crop.soilFitPct > 80 ? '#059669' : crop.soilFitPct > 60 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    background: '#f8fafc',
                    padding: '8px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    fontSize: '0.72rem'
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>{en ? 'Water Need:' : 'जल आवश्यकता:'}</span>
                    <strong style={{ color: crop.waterDemandLevel === 'LOW' ? '#059669' : crop.waterDemandLevel === 'MODERATE' ? '#d97706' : '#dc2626' }}>
                      {crop.waterNeedMm} mm ({crop.waterDemandLevel})
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block' }}>{en ? 'Climate Risk:' : 'जलवायु जोखिम:'}</span>
                    <strong style={{ color: crop.climateRiskLevel === 'LOW' ? '#059669' : crop.climateRiskLevel === 'MODERATE' ? '#d97706' : '#dc2626' }}>
                      {crop.climateRiskLevel}
                    </strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#334155', lineHeight: 1.45, marginBottom: '10px' }}>
                  <strong>{en ? 'Why?' : 'कारण:'}</strong> {en ? crop.keyWhyEn : crop.keyWhy}
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={() => setSelectedCropDetail(crop)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#059669',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: 0
                  }}
                >
                  <span>{en ? '[ SEE WHY ]' : '[ देखें क्यों? ]'}</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/scenario')}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    color: '#475569',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {en ? 'Test in Scenario →' : 'सिनेरियो में परखें →'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {selectedCropDetail && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedCropDetail(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                  {en ? selectedCropDetail.nameEn : selectedCropDetail.nameHi}
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {selectedCropDetail.scientificName} · {en ? currentPanchayat.name : currentPanchayat.hi} {en ? 'Analysis' : 'पंचायत विश्लेषण'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCropDetail(null)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ marginBottom: '14px' }}>
              {getSuitabilityBadge(selectedCropDetail.suitability)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#334155' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                <strong style={{ color: '#059669', display: 'block', marginBottom: '3px' }}>
                  ✓ {en ? 'Why is it suitable?' : 'इस पंचायत के लिए क्यों उपयुक्त है?'}
                </strong>
                {en ? selectedCropDetail.keyWhyEn : selectedCropDetail.keyWhy}
              </div>

              <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #f59e0b' }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '3px' }}>
                  ⚠ {en ? 'What to watch out for?' : 'क्या जोखिम हो सकता है? (Watch Out)'}
                </strong>
                {en ? selectedCropDetail.watchOutEn : selectedCropDetail.watchOut}
              </div>

              <div>
                <strong>🌱 {en ? 'Soil Compatibility:' : 'मिट्टी की अनुकूलता:'}</strong>{' '}
                {en ? selectedCropDetail.soilCompatibilityEn : selectedCropDetail.soilCompatibility}
              </div>

              <div>
                <strong>💧 {en ? 'Water Requirement:' : 'मौसमी जल आवश्यकता:'}</strong> {selectedCropDetail.waterNeedMm} mm
              </div>

              <div>
                <strong>💰 {en ? 'Economic Outlook:' : 'आर्थिक दृष्टिकोण:'}</strong>{' '}
                {en ? selectedCropDetail.economicOutlookEn : selectedCropDetail.economicOutlook}
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setSelectedCropDetail(null)}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  padding: '7px 18px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {en ? 'Close' : 'समझ आ गया'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPARISON MODAL */}
      {isCompareDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setIsCompareDrawerOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '840px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                  {en ? 'Crop Suitability Comparison Matrix' : 'फसल तुलना मैट्रिक्स (Crop Comparison)'}
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {en ? currentPanchayat.name : currentPanchayat.hi} {en ? 'Climate Feasibility' : 'पंचायत जलवायु परिस्थिति'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCompareDrawerOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: '#64748b' }}>{en ? 'Metric' : 'मापदंड'}</th>
                    {comparisonList.map((id) => {
                      const c = CROPS_DATABASE.find((item) => item.id === id);
                      return (
                        <th key={id} style={{ padding: '10px', textAlign: 'left', color: '#0f172a', fontWeight: 800 }}>
                          {en ? c?.nameEn : c?.nameHi}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#475569' }}>{en ? 'Suitability' : 'उपयुक्तता'}</td>
                    {comparisonList.map((id) => {
                      const c = CROPS_DATABASE.find((item) => item.id === id);
                      return <td key={id} style={{ padding: '10px' }}>{c && getSuitabilityBadge(c.suitability)}</td>;
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#475569' }}>{en ? 'Water Need' : 'जल आवश्यकता'}</td>
                    {comparisonList.map((id) => {
                      const c = CROPS_DATABASE.find((item) => item.id === id);
                      return (
                        <td key={id} style={{ padding: '10px', fontWeight: 800, color: c?.waterDemandLevel === 'LOW' ? '#059669' : '#dc2626' }}>
                          {c?.waterNeedMm} mm ({c?.waterDemandLevel})
                        </td>
                      );
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#475569' }}>{en ? 'Duration' : 'अवधि'}</td>
                    {comparisonList.map((id) => {
                      const c = CROPS_DATABASE.find((item) => item.id === id);
                      return <td key={id} style={{ padding: '10px' }}>{en ? c?.durationDaysEn : c?.durationDays}</td>;
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#475569' }}>{en ? 'Rainfall Fit' : 'वर्षा अनुकूलता'}</td>
                    {comparisonList.map((id) => {
                      const c = CROPS_DATABASE.find((item) => item.id === id);
                      return <td key={id} style={{ padding: '10px', fontWeight: 700 }}>{c?.rainfallFitPct}%</td>;
                    })}
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 700, color: '#475569' }}>{en ? 'Climate Risk' : 'जलवायु जोखिम'}</td>
                    {comparisonList.map((id) => {
                      const c = CROPS_DATABASE.find((item) => item.id === id);
                      return <td key={id} style={{ padding: '10px', fontWeight: 700 }}>{c?.climateRiskLevel}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
