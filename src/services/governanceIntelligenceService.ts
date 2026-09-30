/**
 * Unified Governance & Agricultural Intelligence Service
 * Single underlying data layer supporting all 3 roles:
 * 1. PANCHAYAT OFFICER (Operational Local Action & Village Oversight)
 * 2. AGRICULTURE EXPERT (Scientific Agronomy, Soil Constraints & Crop Suitability)
 * 3. DISTRICT OFFICER (Strategic Prioritization & Multi-Panchayat Command)
 */

export interface VillageInfo {
  name: string;
  nameHi: string;
  farmsCount: number;
  totalAreaHa: number;
  primaryCrop: string;
  soilType: string;
  waterStatus: 'Adequate' | 'Monitor' | 'Critical';
  activeRisk: string | null;
}

export interface PanchayatRecord {
  code: string;
  name: string;
  nameHi: string;
  block: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  totalAreaHa: number;
  farmersCount: number;
  villages: VillageInfo[];
  weather: {
    tempC: number;
    rainfallMm24h: number;
    rainfallProbPct: number;
    humidityPct: number;
    windKmh: number;
    heatIndexRisk: 'Low' | 'Moderate' | 'High';
  };
  cropMetrics: {
    paddyAreaHa: number;
    paddyStage: string;
    cropHealthIndex: number; // 0-100
    stressedAreaHa: number;
    rainfallExposure: 'Low' | 'Moderate' | 'Elevated';
  };
  waterMetrics: {
    soilMoisturePct: number;
    waterSituation: 'Adequate' | 'Monitor' | 'Critical';
    waterSituationHi: string;
    irrigationDemandMm: number;
    waterloggingRisk: 'Low' | 'Moderate' | 'High';
    droughtStress: 'Low' | 'Moderate' | 'High';
  };
  riskSummary: {
    level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    primaryHazard: string;
    primaryHazardHi: string;
    affectedVillages: string[];
    affectedCrop: string;
    recommendedAction: string;
    recommendedActionHi: string;
  };
  priorityRank: number; // District ranking: 1, 2, 3...
}

// 5 Panchayats under District Lucknow (Bakshi Ka Talab, Malihabad, Itaunja, Kakori, Sarojini Nagar)
export const DISTRICT_PANCHAYATS: PanchayatRecord[] = [
  {
    code: '0924001001',
    name: 'Bakshi Ka Talab',
    nameHi: 'बख्शी का तालाब',
    block: 'Bakshi Ka Talab',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 27.0167,
    lon: 80.8833,
    totalAreaHa: 3850,
    farmersCount: 4210,
    villages: [
      { name: 'Rampur Kalan', nameHi: 'रामपुर कलां', farmsCount: 920, totalAreaHa: 820, primaryCrop: 'Paddy', soilType: 'Sandy Loam', waterStatus: 'Monitor', activeRisk: 'Waterlogging' },
      { name: 'Shivpur Majra', nameHi: 'शिवपुर मजरा', farmsCount: 1140, totalAreaHa: 1040, primaryCrop: 'Paddy', soilType: 'Clay Loam', waterStatus: 'Monitor', activeRisk: 'Waterlogging' },
      { name: 'Kalyanpur', nameHi: 'कल्याणपुर', farmsCount: 880, totalAreaHa: 760, primaryCrop: 'Mustard / Veg', soilType: 'Alluvial Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Kishanpur', nameHi: 'किशनपुर', farmsCount: 1270, totalAreaHa: 1230, primaryCrop: 'Paddy', soilType: 'Silty Loam', waterStatus: 'Monitor', activeRisk: 'Drainage Alert' }
    ],
    weather: {
      tempC: 31.4,
      rainfallMm24h: 14.8,
      rainfallProbPct: 84,
      humidityPct: 78,
      windKmh: 14,
      heatIndexRisk: 'Moderate'
    },
    cropMetrics: {
      paddyAreaHa: 2450,
      paddyStage: 'Flowering / Heading',
      cropHealthIndex: 88,
      stressedAreaHa: 320,
      rainfallExposure: 'Elevated'
    },
    waterMetrics: {
      soilMoisturePct: 32.4,
      waterSituation: 'Monitor',
      waterSituationHi: 'निगरानी आवश्यक (Monitor)',
      irrigationDemandMm: 0, // No irrigation needed due to incoming rain
      waterloggingRisk: 'Moderate',
      droughtStress: 'Low'
    },
    riskSummary: {
      level: 'MODERATE',
      primaryHazard: 'Heavy Rainfall & Waterlogging',
      primaryHazardHi: 'भारी बारिश व जलभराव जोखिम',
      affectedVillages: ['Rampur Kalan', 'Shivpur Majra'],
      affectedCrop: 'Paddy (Flowering)',
      recommendedAction: 'Clear village field drainage bunds before 3 PM; suspend tubewell pumping; alert farmers.',
      recommendedActionHi: 'दोपहर 3 बजे से पहले निकासी नालियां खोलें; ट्यूबवेल बंद रखें; किसानों को सूचित करें।'
    },
    priorityRank: 1 // Highest district priority due to heavy rain + flowering stage
  },
  {
    code: '0924001002',
    name: 'Itaunja',
    nameHi: 'इटौंजा',
    block: 'Bakshi Ka Talab',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 27.0833,
    lon: 80.9167,
    totalAreaHa: 3200,
    farmersCount: 3450,
    villages: [
      { name: 'Itaunja Dehat', nameHi: 'इटौंजा देहात', farmsCount: 890, totalAreaHa: 780, primaryCrop: 'Paddy', soilType: 'Clayey Loam', waterStatus: 'Critical', activeRisk: 'Drainage Overflow' },
      { name: 'Mahuwa Khurd', nameHi: 'महुआ खुर्द', farmsCount: 1100, totalAreaHa: 1020, primaryCrop: 'Paddy', soilType: 'Alluvial', waterStatus: 'Monitor', activeRisk: 'Waterlogging' },
      { name: 'Tikaitganj', nameHi: 'टिकैतगंज', farmsCount: 1460, totalAreaHa: 1400, primaryCrop: 'Sugarcane', soilType: 'Loam', waterStatus: 'Adequate', activeRisk: null }
    ],
    weather: {
      tempC: 30.8,
      rainfallMm24h: 18.2,
      rainfallProbPct: 88,
      humidityPct: 82,
      windKmh: 18,
      heatIndexRisk: 'Moderate'
    },
    cropMetrics: {
      paddyAreaHa: 1890,
      paddyStage: 'Tillering',
      cropHealthIndex: 82,
      stressedAreaHa: 410,
      rainfallExposure: 'Elevated'
    },
    waterMetrics: {
      soilMoisturePct: 35.1,
      waterSituation: 'Critical',
      waterSituationHi: 'गंभीर (Critical)',
      irrigationDemandMm: 0,
      waterloggingRisk: 'High',
      droughtStress: 'Low'
    },
    riskSummary: {
      level: 'HIGH',
      primaryHazard: 'Lowland Inundation & Silt Runoff',
      primaryHazardHi: 'निचले इलाकों में जलभराव व गाद बहाव',
      affectedVillages: ['Itaunja Dehat', 'Mahuwa Khurd'],
      affectedCrop: 'Paddy (Tillering)',
      recommendedAction: 'Deploy mobile de-watering pump sets to lower canal culvert; inspect bunds.',
      recommendedActionHi: 'नहर साइफन पर मोबाइल पंप तैनात करें; मेड़ों का निरीक्षण करें।'
    },
    priorityRank: 2
  },
  {
    code: '0924001003',
    name: 'Malihabad',
    nameHi: 'मलिहाबाद',
    block: 'Malihabad',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.9167,
    lon: 80.7167,
    totalAreaHa: 4100,
    farmersCount: 4680,
    villages: [
      { name: 'Kavi Nagar', nameHi: 'कवि नगर', farmsCount: 960, totalAreaHa: 890, primaryCrop: 'Mango & Veg', soilType: 'Alluvial Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Kasmandi Kalan', nameHi: 'कसमंडी कलां', farmsCount: 1320, totalAreaHa: 1250, primaryCrop: 'Paddy / Mustard', soilType: 'Sandy Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Bakhtiyarnagar', nameHi: 'बख्तियारनगर', farmsCount: 1200, totalAreaHa: 1100, primaryCrop: 'Horticulture', soilType: 'Clay Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Rahimabad', nameHi: 'रहीमाबाद', farmsCount: 1200, totalAreaHa: 860, primaryCrop: 'Vegetables', soilType: 'Loam', waterStatus: 'Adequate', activeRisk: null }
    ],
    weather: {
      tempC: 32.2,
      rainfallMm24h: 6.4,
      rainfallProbPct: 52,
      humidityPct: 70,
      windKmh: 11,
      heatIndexRisk: 'Moderate'
    },
    cropMetrics: {
      paddyAreaHa: 1450,
      paddyStage: 'Vegetative',
      cropHealthIndex: 94,
      stressedAreaHa: 110,
      rainfallExposure: 'Low'
    },
    waterMetrics: {
      soilMoisturePct: 27.8,
      waterSituation: 'Adequate',
      waterSituationHi: 'पर्याप्त (Adequate)',
      irrigationDemandMm: 12,
      waterloggingRisk: 'Low',
      droughtStress: 'Low'
    },
    riskSummary: {
      level: 'LOW',
      primaryHazard: 'Mild Rain / Light Pest Monitoring',
      primaryHazardHi: 'हल्की वर्षा / कीट निगरानी',
      affectedVillages: ['Rahimabad'],
      affectedCrop: 'Horticulture & Vegetables',
      recommendedAction: 'Monitor fruit fly traps; light weeding recommended.',
      recommendedActionHi: 'मक्खी जाल की निगरानी करें; निराई-गुड़ाई जारी रखें।'
    },
    priorityRank: 4
  },
  {
    code: '0924001004',
    name: 'Kakori',
    nameHi: 'काकोरी',
    block: 'Kakori',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8833,
    lon: 80.8000,
    totalAreaHa: 2900,
    farmersCount: 3120,
    villages: [
      { name: 'Badauna', nameHi: 'बडौना', farmsCount: 780, totalAreaHa: 680, primaryCrop: 'Pulses / Mustard', soilType: 'Sandy Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Jalalpur', nameHi: 'जलालपुर', farmsCount: 940, totalAreaHa: 820, primaryCrop: 'Vegetables', soilType: 'Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Sarai Premraj', nameHi: 'सराय प्रेमराज', farmsCount: 1400, totalAreaHa: 1400, primaryCrop: 'Paddy', soilType: 'Clay Loam', waterStatus: 'Monitor', activeRisk: 'Mild Drainage' }
    ],
    weather: {
      tempC: 32.6,
      rainfallMm24h: 8.2,
      rainfallProbPct: 58,
      humidityPct: 72,
      windKmh: 12,
      heatIndexRisk: 'Moderate'
    },
    cropMetrics: {
      paddyAreaHa: 1120,
      paddyStage: 'Heading',
      cropHealthIndex: 90,
      stressedAreaHa: 140,
      rainfallExposure: 'Moderate'
    },
    waterMetrics: {
      soilMoisturePct: 29.4,
      waterSituation: 'Adequate',
      waterSituationHi: 'पर्याप्त (Adequate)',
      irrigationDemandMm: 5,
      waterloggingRisk: 'Low',
      droughtStress: 'Low'
    },
    riskSummary: {
      level: 'LOW',
      primaryHazard: 'Isolated Showers',
      primaryHazardHi: 'छिटपुट बौछारें',
      affectedVillages: ['Sarai Premraj'],
      affectedCrop: 'Paddy',
      recommendedAction: 'Regular surveillance; delay chemical spray by 24h.',
      recommendedActionHi: 'निगरानी रखें; रासायनिक छिड़काव 24 घंटे टालें।'
    },
    priorityRank: 5
  },
  {
    code: '0924001005',
    name: 'Sarojini Nagar',
    nameHi: 'सरोजिनी नगर',
    block: 'Sarojini Nagar',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.7500,
    lon: 80.8667,
    totalAreaHa: 3450,
    farmersCount: 3890,
    villages: [
      { name: 'Banthra', nameHi: 'बंथरा', farmsCount: 1050, totalAreaHa: 980, primaryCrop: 'Vegetables / Paddy', soilType: 'Alluvial', waterStatus: 'Monitor', activeRisk: 'Soil Crusting' },
      { name: 'Gauri', nameHi: 'गौरी', farmsCount: 920, totalAreaHa: 840, primaryCrop: 'Paddy', soilType: 'Clay Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Natkur', nameHi: 'नटकुर', farmsCount: 1120, totalAreaHa: 1030, primaryCrop: 'Fodder / Veg', soilType: 'Sandy Loam', waterStatus: 'Adequate', activeRisk: null },
      { name: 'Piparsand', nameHi: 'पीपरसंड', farmsCount: 800, totalAreaHa: 600, primaryCrop: 'Floriculture', soilType: 'Loam', waterStatus: 'Adequate', activeRisk: null }
    ],
    weather: {
      tempC: 33.1,
      rainfallMm24h: 11.5,
      rainfallProbPct: 70,
      humidityPct: 75,
      windKmh: 15,
      heatIndexRisk: 'Moderate'
    },
    cropMetrics: {
      paddyAreaHa: 1680,
      paddyStage: 'Panicle Initiation',
      cropHealthIndex: 86,
      stressedAreaHa: 260,
      rainfallExposure: 'Moderate'
    },
    waterMetrics: {
      soilMoisturePct: 30.8,
      waterSituation: 'Monitor',
      waterSituationHi: 'निगरानी आवश्यक (Monitor)',
      irrigationDemandMm: 2,
      waterloggingRisk: 'Moderate',
      droughtStress: 'Low'
    },
    riskSummary: {
      level: 'MODERATE',
      primaryHazard: 'Surface Runoff in Vegetable Belts',
      primaryHazardHi: 'सब्जी क्षेत्रों में सतही बहाव',
      affectedVillages: ['Banthra'],
      affectedCrop: 'Vegetables / Cucurbits',
      recommendedAction: 'Clear furrow drains between beds; support vine staking.',
      recommendedActionHi: 'क्यारियों के बीच की नालियां साफ करें; बेलों को सहारा दें।'
    },
    priorityRank: 3
  }
];

// Unified Soil Intelligence Profile (Central Awadh / Indo-Gangetic Alluvial)
export interface SoilProfileData {
  soilType: string;
  texture: string;
  ph: number;
  ecDsM: number;
  organicCarbonPct: number;
  npkKgHa: { n: number; p: number; k: number };
  moisturePct: number;
  waterHoldingCapacityPct: number;
  bulkDensityGcm3: number;
  soilDepthCm: number;
  agronomicInterpretationEn: string;
  agronomicInterpretationHi: string;
}

export const UNIFIED_SOIL_DATA: SoilProfileData = {
  soilType: 'Indo-Gangetic Deep Alluvial (Sandy Clay Loam)',
  texture: 'Sandy Clay Loam (48% Sand, 28% Silt, 24% Clay)',
  ph: 7.2,
  ecDsM: 0.42,
  organicCarbonPct: 0.58,
  npkKgHa: { n: 182, p: 24, k: 210 },
  moisturePct: 32.4,
  waterHoldingCapacityPct: 54.0,
  bulkDensityGcm3: 1.34,
  soilDepthCm: 120,
  agronomicInterpretationEn:
    'Slightly alkaline to neutral pH (7.2) allows optimal nutrient bioavailability. Organic carbon at 0.58% is moderately low—organic mulching or green manuring recommended. High water-holding capacity (54%) retains standing water for up to 36 hours post-15mm precipitation event, making drainage maintenance critical during paddy flowering stage.',
  agronomicInterpretationHi:
    'उदासीन से हल्का क्षारीय पीएच (7.2) पोषक तत्वों के अवशोषण के लिए अनुकूल है। जैविक कार्बन 0.58% मध्यम-कम है—हरी खाद या जैविक मल्चिंग की सलाह दी जाती है। जल धारण क्षमता 54% होने के कारण 15 मिमी बारिश के बाद 36 घंटे तक नमी बनी रहेगी, इसलिए धान में फूल आने के दौरान जल निकासी नालियां खुली रखना अनिवार्य है।'
};

// Crop Suitability Candidate Matrix with explicit "WHY"
export interface CropSuitabilityRecord {
  cropName: string;
  cropNameHi: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  suitabilityScore: number; // 0-100
  suitabilityLevel: 'HIGH' | 'MODERATE' | 'LOW';
  climateCompatibility: 'Optimal' | 'Favorable' | 'Stress Prone';
  soilCompatibility: 'Ideal' | 'Good' | 'Constrained';
  waterRequirementMm: number;
  economicReturnPerHa: string;
  riskFactor: string;
  whyExplanationEn: string;
  whyExplanationHi: string;
}

export const UNIFIED_CROP_SUITABILITY: CropSuitabilityRecord[] = [
  {
    cropName: 'Paddy (Basmati / CSR-30)',
    cropNameHi: 'धान (बासमती / CSR-30)',
    season: 'Kharif',
    suitabilityScore: 89,
    suitabilityLevel: 'HIGH',
    climateCompatibility: 'Optimal',
    soilCompatibility: 'Ideal',
    waterRequirementMm: 1100,
    economicReturnPerHa: '₹68,000 - ₹75,000',
    riskFactor: 'Waterlogging during flowering; sheath blight',
    whyExplanationEn:
      'High seasonal rainfall (720mm historical Kharif average) coupled with alluvial clay-loam soil provides optimal puddle conditions. Basmati varieties fetch high market premium in nearby Lucknow and Kanpur mandis.',
    whyExplanationHi:
      'औसत मानसूनी वर्षा (720 मिमी) और दोमट मिट्टी धान की खेती के लिए सर्वोत्तम परिस्थितियां बनाती हैं। स्थानीय मंडियों में बासमती का बेहतर मूल्य मिलता है।'
  },
  {
    cropName: 'Bajra (Pearl Millet - Hybrid)',
    cropNameHi: 'बाजरा (संकर किस्म)',
    season: 'Kharif',
    suitabilityScore: 92,
    suitabilityLevel: 'HIGH',
    climateCompatibility: 'Optimal',
    soilCompatibility: 'Good',
    waterRequirementMm: 350,
    economicReturnPerHa: '₹42,000 - ₹48,000',
    riskFactor: 'Grain molding if prolonged unseasonal rain occurs at maturity',
    whyExplanationEn:
      'Exceptionally low water demand (350mm vs 1100mm for paddy). Deep taproot tolerates dry spells; ideal for upland sandy-loam tracts of Bakshi Ka Talab with minimal irrigation infrastructure.',
    whyExplanationHi:
      'बहुत कम पानी की आवश्यकता (केवल 350 मिमी)। गहरी जड़ प्रणाली सूखे को सहन कर लेती है। बिना सिंचाई वाले ऊंचे खेतों के लिए सर्वाधिक उपयुक्त।'
  },
  {
    cropName: 'Moong (Green Gram - PDM-139)',
    cropNameHi: 'मूंग (हरा चना - पीडीएम-139)',
    season: 'Kharif',
    suitabilityScore: 84,
    suitabilityLevel: 'HIGH',
    climateCompatibility: 'Favorable',
    soilCompatibility: 'Ideal',
    waterRequirementMm: 300,
    economicReturnPerHa: '₹50,000 - ₹56,000',
    riskFactor: 'Susceptible to yellow mosaic virus and water stagnation',
    whyExplanationEn:
      'Fixes 35-40 kg atmospheric nitrogen per hectare, enriching low organic carbon soil. Short 65-day crop cycle frees field early for timely Rabi wheat sowing.',
    whyExplanationHi:
      'प्रति हेक्टेयर 35-40 किग्रा नाइट्रोजन जोड़कर मिट्टी को उपजाऊ बनाता है। मात्र 65 दिनों में तैयार होकर रबी गेहूं की बुवाई के लिए खेत समय पर खाली कर देता है।'
  },
  {
    cropName: 'Groundnut (TG-37A)',
    cropNameHi: 'मूंगफली (TG-37A)',
    season: 'Kharif',
    suitabilityScore: 73,
    suitabilityLevel: 'MODERATE',
    climateCompatibility: 'Favorable',
    soilCompatibility: 'Good',
    waterRequirementMm: 500,
    economicReturnPerHa: '₹52,000 - ₹58,000',
    riskFactor: 'Soil compaction hinders peg penetration in heavy clay patches',
    whyExplanationEn:
      'Performs well on light sandy-loam soils with good aeration. However, fields with >25% clay content impede pegging, leading to lower pod yields.',
    whyExplanationHi:
      'हल्की बलुई दोमट मिट्टी में अच्छा उत्पादन देती है। लेकिन अधिक चिकनी मिट्टी वाले खेतों में फलियां कम बनती हैं, इसलिए मध्यम उपयुक्त है।'
  },
  {
    cropName: 'Mustard (Pusa Bold)',
    cropNameHi: 'सरसों (पूसा बोल्ड)',
    season: 'Rabi',
    suitabilityScore: 94,
    suitabilityLevel: 'HIGH',
    climateCompatibility: 'Optimal',
    soilCompatibility: 'Ideal',
    waterRequirementMm: 280,
    economicReturnPerHa: '₹55,000 - ₹62,000',
    riskFactor: 'Aphid infestation during flowering; frost risk in late Dec',
    whyExplanationEn:
      'Requires only 2 protective irrigations. Deep taproot utilizes residual Kharif soil moisture. Excellent oil content (41%) under Gangetic agro-climatic conditions.',
    whyExplanationHi:
      'केवल 2 हल्की सिंचाइयों की आवश्यकता। खरीफ की बची नमी का पूरा उपयोग करती है। 41% तेल मात्रा के साथ उच्च बाजारी मांग।'
  }
];

// Unified Irrigation & Water Balance Data
export interface IrrigationWaterBalance {
  et0MmDay: number; // Reference evapotranspiration
  kc: number; // Crop coefficient at flowering
  etcMmDay: number; // Actual crop evapotranspiration = ET0 * Kc
  soilMoisturePct: number;
  fieldCapacityPct: number;
  permanentWiltingPointPct: number;
  rainfallContributionMm24h: number;
  netIrrigationDeficitMm: number;
  recommendedWindowFarmer: string;
  recommendedWindowFarmerHi: string;
}

export const UNIFIED_IRRIGATION_DATA: IrrigationWaterBalance = {
  et0MmDay: 4.2,
  kc: 1.15,
  etcMmDay: 4.83, // 4.2 * 1.15
  soilMoisturePct: 32.4,
  fieldCapacityPct: 34.0,
  permanentWiltingPointPct: 14.5,
  rainfallContributionMm24h: 14.8,
  netIrrigationDeficitMm: 0, // Surplus water from rainfall
  recommendedWindowFarmer:
    'No tubewell irrigation required for the next 4 to 5 days. Keep drainage bunds clear to prevent standing water above 5 cm.',
  recommendedWindowFarmerHi:
    'अगले 4 से 5 दिनों तक ट्यूबवेल चलाने की बिल्कुल आवश्यकता नहीं है। 5 सेमी से अधिक पानी जमा न होने दें, निकासी नाली खुली रखें।'
};

// Unified Weather -> Crop Impact Chain
export interface WeatherCropImpactChain {
  weatherEvent: string;
  weatherMetric: string;
  cropStage: string;
  cropResponse: string;
  agronomicImpact: string;
  recommendedIntervention: string;
}

export const UNIFIED_WEATHER_IMPACT: WeatherCropImpactChain[] = [
  {
    weatherEvent: '14.8 mm Overnight Rain + 78% Humidity',
    weatherMetric: 'Precipitation 14.8 mm, RH 78%, Wind 14 km/h',
    cropStage: 'Paddy Flowering / Heading Stage',
    cropResponse:
      'Pollen wash-off risk if rain occurs during 9 AM–12 PM anthesis; canopy saturation creates microclimate for fungal spores.',
    agronomicImpact:
      'Potential 4–7% spikelet sterility if rain hits peak flowering. Risk of Sheath Blight (Rhizoctonia solani) escalation in dense canopy.',
    recommendedIntervention:
      'Postpone urea/nitrogen top-dressing. Open field drains to keep water below 5 cm. Spray validamycin 3% L only after foliage dries.'
  },
  {
    weatherEvent: 'Heat Index 36°C with 64% RH',
    weatherMetric: 'Tmax 34.2°C, RH 64%',
    cropStage: 'Vegetables & Pulses (Vegetative)',
    cropResponse: 'Elevated transpirational pull; transient afternoon wilting in shallow-rooted crops.',
    agronomicImpact: 'Temporary stomatal closure; slowing photosynthetic accumulation.',
    recommendedIntervention:
      'Apply light sprinkler irrigation in evening or mulch root zones with crop residues to conserve root zone moisture.'
  }
];

// Unified Active Hazards for Risk Command Center
export interface ActiveRiskHazard {
  id: string;
  hazardType: 'Heavy Rain' | 'Waterlogging' | 'Pest Outbreak' | 'Heatwave' | 'Drought Stress';
  severity: 'MODERATE' | 'HIGH' | 'CRITICAL';
  location: string;
  affectedAreaHa: number;
  affectedCrop: string;
  expectedDuration: string;
  modelUncertaintyPct: number;
  recommendedResponse: string;
  recommendedResponseHi: string;
}

export const UNIFIED_ACTIVE_RISKS: ActiveRiskHazard[] = [
  {
    id: 'risk-01',
    hazardType: 'Waterlogging',
    severity: 'HIGH',
    location: 'Bakshi Ka Talab (Villages Rampur & Shivpur) + Itaunja Lowlands',
    affectedAreaHa: 730,
    affectedCrop: 'Paddy (Flowering / Tillering)',
    expectedDuration: 'Next 24 to 36 hours',
    modelUncertaintyPct: 12,
    recommendedResponse:
      'Inspect Gomti drainage tributaries, ensure culverts are free of debris, alert village pradhans to maintain field bund outlets.',
    recommendedResponseHi:
      'गोमती की सहायक जल निकासी नालियों का निरीक्षण करें, पुलिया साफ रखें और ग्राम प्रधानों को मेड़ नाली खुली रखने का निर्देश दें।'
  },
  {
    id: 'risk-02',
    hazardType: 'Heavy Rain',
    severity: 'MODERATE',
    location: 'District Northern Arc (Bakshi Ka Talab & Itaunja Blocks)',
    affectedAreaHa: 1420,
    affectedCrop: 'Standing Kharif Crops',
    expectedDuration: 'Next 18 hours (Peak 4 PM - 9 PM)',
    modelUncertaintyPct: 15,
    recommendedResponse:
      'Halt all government fertilizer distribution in open yards; issue agricultural SMS advisory to delay pesticide application.',
    recommendedResponseHi:
      'खुले गोदामों में उर्वरक वितरण रोकें; किसानों को कीटनाशक छिड़काव 24 घंटे टालने का एसएमएस परामर्श जारी करें।'
  },
  {
    id: 'risk-03',
    hazardType: 'Pest Outbreak',
    severity: 'MODERATE',
    location: 'Malihabad Horticultural Belt',
    affectedAreaHa: 340,
    affectedCrop: 'Mango & Seasonal Vegetables',
    expectedDuration: 'Ongoing 48 hours',
    modelUncertaintyPct: 18,
    recommendedResponse:
      'Deploy 4 mobile plant protection surveillance squads; monitor yellow sticky traps for fruit flies and whiteflies.',
    recommendedResponseHi:
      '4 मोबाइल पौध संरक्षण दल तैनात करें; फल मक्खी और सफेद मक्खी के पीले चिपचिपे जालों की सघन जांच करें।'
  }
];

// Unified Advisories Store
export interface AdvisoryItem {
  id: string;
  targetRole: 'panchayat' | 'expert' | 'district';
  title: string;
  titleHi: string;
  issue: string;
  affectedCrop: string;
  affectedVillages: string[];
  urgency: 'URGENT' | 'HIGH' | 'NORMAL';
  message: string;
  messageHi: string;
  evidence: string;
  sources: string[];
  uncertainty: string;
  status: 'draft' | 'reviewed' | 'published';
  author: string;
  timestamp: string;
}

export const INITIAL_ADVISORIES: AdvisoryItem[] = [
  {
    id: 'adv-001',
    targetRole: 'panchayat',
    title: 'Drainage Alert: Stop Tubewells & Clear Outlets Ahead of 14mm Rain',
    titleHi: 'जल निकासी अलर्ट: 14 मिमी बारिश से पहले ट्यूबवेल बंद रखें व नाली खोलें',
    issue: 'Heavy Overnight Downpour & Waterlogging in Flowering Paddy',
    affectedCrop: 'Paddy (Basmati)',
    affectedVillages: ['Rampur Kalan', 'Shivpur Majra'],
    urgency: 'HIGH',
    message:
      'Farmers of Rampur Kalan and Shivpur Majra are advised to halt tubewell pumping immediately. Clear boundary drainage cuts by 3 PM to prevent standing water above 5cm.',
    messageHi:
      'रामपुर कलां व शिवपुर मजरा के किसान तुरंत ट्यूबवेल बंद रखें। शाम 3 बजे से पहले खेत की मेड़ की निकास नाली खोलें ताकि 5 सेमी से अधिक पानी न भरे।',
    evidence: 'WRF 1km rainfall model forecast (14.8 mm ±2mm) + Sentinel-2 soil moisture (32.4%).',
    sources: ['MausamSetu High-Res Ensemble', 'IMD Agro-met Bulletin Lucknow'],
    uncertainty: 'Rainfall occurrence probability: 84% (Low uncertainty).',
    status: 'draft',
    author: 'Panchayat Agriculture Field Cell',
    timestamp: 'Today, 08:30 AM'
  },
  {
    id: 'adv-002',
    targetRole: 'expert',
    title: 'Agronomic Protocol: Nutrient Withholding & Fungal Prophylaxis',
    titleHi: 'वैज्ञानिक परामर्श: यूरिया का छिड़काव रोकें व फफूंदनाशी सुरक्षा',
    issue: 'High Canopy Humidity and Elevated ETc during Panicle Emergence',
    affectedCrop: 'Paddy & Early Mustard',
    affectedVillages: ['Bakshi Ka Talab Cluster'],
    urgency: 'HIGH',
    message:
      'Nitrogen top-dressing must be withheld until surface leaf wetness drops below 4 hours. If sheath blight symptoms appear on leaf sheaths, prepare 0.2% validamycin spray after rain event passes.',
    messageHi:
      'पत्तियों पर नमी सूखने तक यूरिया का छिड़काव स्थगित रखें। शीथ ब्लाइट के लक्षण दिखने पर बारिश रुकने के बाद 0.2% वैलिडामाइसिन का छिड़काव करें।',
    evidence: 'Relative humidity > 78% for > 16 continuous hours; optimal Rhizoctonia incubation.',
    sources: ['ICAR-IARI Agronomy Guidelines', 'MausamSetu Plant Pathology Model M7'],
    uncertainty: 'Canopy wetness duration confidence: 89%.',
    status: 'reviewed',
    author: 'Dr. S. K. Verma (Senior Agronomist)',
    timestamp: 'Today, 07:15 AM'
  }
];
