import React, { createContext, useContext, useState } from 'react';

export type Language = 'hi' | 'en';
export type ViewMode = 'simple' | 'scientific';

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
      const saved = localStorage.getItem('kisaan-lang') as Language;
      return saved === 'hi' || saved === 'en' ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('kisaan-lang', lang);
    } catch {
      // Ignore
    }
    setLanguageState(lang);
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
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
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
