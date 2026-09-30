import React, { createContext, useContext, useState, useEffect } from 'react';
import { speakFarmerAdvice, stopSpeaking } from '../services/voiceAgent';

export type FarmSetupState = 'NO_CONTEXT' | 'SETTING_UP' | 'ANALYZING' | 'ANALYZED';

export interface PanchayatInfo {
  code: string;
  name: string;
  hi: string;
  block: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
  soilType: string;
  ph: number;
  waterTable: string;
  dominantCrop: string;
}

export interface CropInfo {
  id: string;
  nameHi: string;
  nameEn: string;
  stage: 'Sowing' | 'Vegetative' | 'Flowering' | 'Grain Filling' | 'Harvest' | 'Unknown';
  sowingDate?: string;
  waterNeedMm: number;
}

export interface FarmProfile {
  isConfigured: boolean;
  isDemo: boolean;
  panchayat: PanchayatInfo;
  crop: CropInfo;
  landArea: number;
  landUnit: 'bigha' | 'acre';
  waterSource: 'tubewell' | 'canal' | 'rainfed' | 'mixed';
  soil: {
    type: string;
    ph: number;
    n: 'Low' | 'Medium' | 'High';
    p: 'Low' | 'Medium' | 'High';
    k: 'Low' | 'Medium' | 'High';
    hasSoilHealthCard: boolean;
  };
}

export const PILOT_PANCHAYATS_CATALOG: PanchayatInfo[] = [
  // Uttar Pradesh - Central Awadh Plain
  {
    code: '0924001001',
    name: 'Malihabad',
    hi: 'मलिहाबाद',
    block: 'Malihabad',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.9167,
    lon: 80.7167,
    soilType: 'Sandy Loam',
    ph: 7.2,
    waterTable: '14 m',
    dominantCrop: 'Paddy (Basmati) & Dasheri Mango'
  },
  {
    code: '0924001002',
    name: 'Mohanlalganj',
    hi: 'मोहनलालगंज',
    block: 'Mohanlalganj',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.6800,
    lon: 80.9800,
    soilType: 'Loam Clay',
    ph: 7.4,
    waterTable: '11 m',
    dominantCrop: 'Paddy & Wheat'
  },
  {
    code: '0924001003',
    name: 'Gharaunda',
    hi: 'घरौंदा',
    block: 'Gharaunda',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.9800,
    lon: 80.9200,
    soilType: 'Alluvial Loam',
    ph: 7.1,
    waterTable: '9 m',
    dominantCrop: 'Vegetables & Paddy'
  },
  {
    code: '0924001004',
    name: 'Chinhat',
    hi: 'चिनहट',
    block: 'Chinhat',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.8500,
    lon: 81.0500,
    soilType: 'Silt Loam',
    ph: 7.3,
    waterTable: '13 m',
    dominantCrop: 'Paddy & Pulses'
  },
  {
    code: '0924001005',
    name: 'Sarojini Nagar',
    hi: 'सरोजिनी नगर (अमौसी)',
    block: 'Sarojini Nagar',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    lat: 26.7600,
    lon: 80.8800,
    soilType: 'Clay Loam',
    ph: 7.5,
    waterTable: '10 m',
    dominantCrop: 'Wheat & Mustard'
  },
  {
    code: '0924002001',
    name: 'Kalyanpur',
    hi: 'कल्याणपुर',
    block: 'Kalyanpur',
    district: 'Kanpur Nagar',
    state: 'Uttar Pradesh',
    lat: 26.4950,
    lon: 80.2600,
    soilType: 'Alluvial Silt',
    ph: 7.6,
    waterTable: '12 m',
    dominantCrop: 'Wheat & Maize'
  },
  {
    code: '0924003001',
    name: 'Barabanki Dehat',
    hi: 'बाराबंकी देहात',
    block: 'Banki',
    district: 'Barabanki',
    state: 'Uttar Pradesh',
    lat: 26.9200,
    lon: 81.1800,
    soilType: 'Sandy Loam',
    ph: 7.0,
    waterTable: '8 m',
    dominantCrop: 'Mentha, Paddy & Potato'
  },
  {
    code: '0924004001',
    name: 'Hastinapur',
    hi: 'हस्तिनापुर',
    block: 'Hastinapur',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    lat: 29.1700,
    lon: 78.0200,
    soilType: 'Heavy Loam',
    ph: 7.4,
    waterTable: '7 m',
    dominantCrop: 'Sugarcane & Wheat'
  },
  // Delhi-NCR / Haryana - Trans-Gangetic Plain
  {
    code: '0601001001',
    name: 'Najafgarh Rural',
    hi: 'नजफगढ़ ग्रामीण',
    block: 'Najafgarh',
    district: 'South West Delhi',
    state: 'Delhi',
    lat: 28.6100,
    lon: 76.9850,
    soilType: 'Sandy Loam',
    ph: 7.8,
    waterTable: '22 m',
    dominantCrop: 'Wheat & Mustard'
  },
  {
    code: '0602001001',
    name: 'Karnal Rural',
    hi: 'करनाल ग्रामीण',
    block: 'Karnal',
    district: 'Karnal',
    state: 'Haryana',
    lat: 29.6857,
    lon: 76.9905,
    soilType: 'Indo-Gangetic Loam',
    ph: 7.7,
    waterTable: '18 m',
    dominantCrop: 'Basmati Paddy & Wheat'
  },
  // Punjab - Breadbasket
  {
    code: '0301001001',
    name: 'Talwandi Sabo',
    hi: 'तलवंडी साबो',
    block: 'Talwandi Sabo',
    district: 'Bathinda',
    state: 'Punjab',
    lat: 29.9800,
    lon: 75.0900,
    soilType: 'Light Sandy Loam',
    ph: 8.1,
    waterTable: '26 m',
    dominantCrop: 'Cotton & Wheat'
  },
  {
    code: '0302001001',
    name: 'Ludhiana Rural',
    hi: 'लुधियाना ग्रामीण',
    block: 'Samrala',
    district: 'Ludhiana',
    state: 'Punjab',
    lat: 30.8333,
    lon: 76.1833,
    soilType: 'Rich Alluvium',
    ph: 7.6,
    waterTable: '28 m',
    dominantCrop: 'Paddy & Wheat'
  },
  // Rajasthan - Semi-Arid Zone
  {
    code: '0801001001',
    name: 'Sanganer Gramin',
    hi: 'सांगानेर ग्रामीण',
    block: 'Sanganer',
    district: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.8180,
    lon: 75.7680,
    soilType: 'Arid Sandy Loam',
    ph: 8.2,
    waterTable: '35 m',
    dominantCrop: 'Pearl Millet (Bajra) & Mustard'
  },
  {
    code: '0802001001',
    name: 'Bikaner Dehat',
    hi: 'बीकानेर देहात',
    block: 'Bikaner',
    district: 'Bikaner',
    state: 'Rajasthan',
    lat: 28.0229,
    lon: 73.3119,
    soilType: 'Desert Sand Loam',
    ph: 8.4,
    waterTable: '45 m',
    dominantCrop: 'Guar, Groundnut & Bajra'
  },
  // Maharashtra - Deccan / Vidarbha
  {
    code: '2701001001',
    name: 'Hingna',
    hi: 'हिंगणा',
    block: 'Hingna',
    district: 'Nagpur',
    state: 'Maharashtra',
    lat: 21.0667,
    lon: 78.9667,
    soilType: 'Deep Black Soil (Vertisol)',
    ph: 7.9,
    waterTable: '16 m',
    dominantCrop: 'Soybean & Cotton'
  },
  {
    code: '2702001001',
    name: 'Baramati',
    hi: 'बारामती',
    block: 'Baramati',
    district: 'Pune',
    state: 'Maharashtra',
    lat: 18.1500,
    lon: 74.5800,
    soilType: 'Medium Black Soil',
    ph: 7.8,
    waterTable: '14 m',
    dominantCrop: 'Sugarcane & Grapes'
  },
  // Madhya Pradesh - Malwa
  {
    code: '2301001001',
    name: 'Sanwer',
    hi: 'सांवेर',
    block: 'Sanwer',
    district: 'Indore',
    state: 'Madhya Pradesh',
    lat: 22.9770,
    lon: 75.8360,
    soilType: 'Black Cotton Soil',
    ph: 7.8,
    waterTable: '20 m',
    dominantCrop: 'Soybean & Wheat'
  },
  // Karnataka - Southern Dry Zone
  {
    code: '2901001001',
    name: 'Devanahalli',
    hi: 'देवनहल्ली',
    block: 'Devanahalli',
    district: 'Bengaluru Rural',
    state: 'Karnataka',
    lat: 13.2483,
    lon: 77.7126,
    soilType: 'Red Sandy Loam',
    ph: 6.8,
    waterTable: '32 m',
    dominantCrop: 'Ragi (Finger Millet) & Vegetables'
  }
];

export const DEMO_FARM_DATA: FarmProfile = {
  isConfigured: true,
  isDemo: true,
  panchayat: PILOT_PANCHAYATS_CATALOG[0], // Malihabad
  crop: {
    id: 'paddy',
    nameHi: 'धान (बासमती)',
    nameEn: 'Paddy (Basmati)',
    stage: 'Flowering',
    sowingDate: '2026-07-15',
    waterNeedMm: 1250
  },
  landArea: 2,
  landUnit: 'bigha',
  waterSource: 'tubewell',
  soil: {
    type: 'सैंडी दोमट (Sandy Loam)',
    ph: 7.2,
    n: 'Medium',
    p: 'High',
    k: 'Medium',
    hasSoilHealthCard: true
  }
};

const EMPTY_FARM: FarmProfile = {
  isConfigured: false,
  isDemo: false,
  panchayat: PILOT_PANCHAYATS_CATALOG[0],
  crop: {
    id: '',
    nameHi: '',
    nameEn: '',
    stage: 'Unknown',
    waterNeedMm: 0
  },
  landArea: 0,
  landUnit: 'bigha',
  waterSource: 'tubewell',
  soil: {
    type: '',
    ph: 7.0,
    n: 'Medium',
    p: 'Medium',
    k: 'Medium',
    hasSoilHealthCard: false
  }
};

interface FarmContextType {
  farm: FarmProfile;
  appState: FarmSetupState;
  setAppState: (st: FarmSetupState) => void;
  configureFarm: (profile: Partial<FarmProfile>) => void;
  resetFarm: () => void;
  loadDemoFarm: () => void;
  isSpeaking: boolean;
  playVoice: (text: string) => void;
  stopVoice: () => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farm, setFarm] = useState<FarmProfile>(() => {
    try {
      const saved = localStorage.getItem('mausam_setu_farm');
      if (saved) return JSON.parse(saved);
    } catch {}
    return EMPTY_FARM;
  });

  const [appState, setAppState] = useState<FarmSetupState>(() => {
    return farm.isConfigured ? 'ANALYZED' : 'NO_CONTEXT';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    try {
      if (farm.isConfigured) {
        localStorage.setItem('mausam_setu_farm', JSON.stringify(farm));
      } else {
        localStorage.removeItem('mausam_setu_farm');
      }
    } catch {}
  }, [farm]);

  const configureFarm = (updates: Partial<FarmProfile>) => {
    setFarm((prev) => ({
      ...prev,
      ...updates,
      isConfigured: true,
      isDemo: false
    }));
    setAppState('ANALYZED');
  };

  const resetFarm = () => {
    setFarm(EMPTY_FARM);
    setAppState('NO_CONTEXT');
    try {
      localStorage.removeItem('mausam_setu_farm');
    } catch {}
  };

  const loadDemoFarm = () => {
    setFarm(DEMO_FARM_DATA);
    setAppState('ANALYZED');
  };

  const playVoice = (text: string) => {
    stopSpeaking();
    setIsSpeaking(true);
    speakFarmerAdvice(text, 'hi-IN');
    setTimeout(() => setIsSpeaking(false), 9000);
  };

  const stopVoice = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  return (
    <FarmContext.Provider
      value={{
        farm,
        appState,
        setAppState,
        configureFarm,
        resetFarm,
        loadDemoFarm,
        isSpeaking,
        playVoice,
        stopVoice
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error('useFarm must be used within FarmProvider');
  return ctx;
};
