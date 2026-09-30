import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, getLanguageMeta, isLanguage } from '../i18n/languages';

export type { Language };
export type ViewMode = 'simple' | 'scientific';
export type PlatformMode = 'farmer' | 'panchayat' | 'scientific';

export interface LocationInfo {
  panchayatCode: string;
  panchayatName: string;
  district: string;
  state: string;
  lat: number;
  lon: number;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  platformMode: PlatformMode;
  setPlatformMode: (mode: PlatformMode) => void;
  location: LocationInfo;
  setLocation: (loc: LocationInfo) => void;
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  speakText: (text: string) => void;
  isSpeaking: boolean;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const defaultLocation: LocationInfo = {
  panchayatCode: '0924001001',
  panchayatName: 'Malihabad',
  district: 'Lucknow',
  state: 'Uttar Pradesh',
  lat: 26.9167,
  lon: 80.7167
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mausam-lang') || localStorage.getItem('kisaan-lang');
      if (isLanguage(saved)) return saved;
    } catch {
      // ignore
    }
    const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'hi';
    if (nav.startsWith('hi')) return 'hi';
    if (nav.startsWith('pa')) return 'pa';
    if (nav.startsWith('gu')) return 'gu';
    if (nav.startsWith('mr')) return 'mr';
    if (nav.startsWith('bn')) return 'bn';
    if (nav.startsWith('ta')) return 'ta';
    if (nav.startsWith('te')) return 'te';
    if (nav.startsWith('kn')) return 'kn';
    if (nav.startsWith('or')) return 'or';
    return 'hi';
  });

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('mausam-lang', lang);
    } catch {
      // Ignore
    }
    setLanguageState(lang);
  };

  useEffect(() => {
    const meta = getLanguageMeta(language);
    document.documentElement.lang = meta.bcp47;
    document.title = `MausamSetu — ${meta.native}`;
  }, [language]);

  const [platformMode, setPlatformModeState] = useState<PlatformMode>(() => {
    try {
      const saved = localStorage.getItem('kisaan_platform_mode') as PlatformMode;
      return saved === 'farmer' || saved === 'panchayat' || saved === 'scientific' ? saved : 'farmer';
    } catch {
      return 'farmer';
    }
  });

  const setPlatformMode = (mode: PlatformMode) => {
    try {
      localStorage.setItem('kisaan_platform_mode', mode);
    } catch {}
    setPlatformModeState(mode);
  };

  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [location, setLocation] = useState<LocationInfo>(defaultLocation);
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy (Basmati)');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => sessionStorage.getItem('kisaan-signed-in') === 'true');

  const signIn = () => {
    sessionStorage.setItem('kisaan-signed-in', 'true');
    setIsSignedIn(true);
  };

  const signOut = () => {
    sessionStorage.removeItem('kisaan-signed-in');
    setIsSignedIn(false);
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getLanguageMeta(language).bcp47;
    utterance.rate = 0.92;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        viewMode,
        setViewMode,
        platformMode,
        setPlatformMode,
        location,
        setLocation,
        selectedCrop,
        setSelectedCrop,
        speakText,
        isSpeaking,
        isSignedIn,
        signIn,
        signOut
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
