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
}

const defaultLocation: LocationInfo = {
  panchayatCode: '0924001001',
  panchayatName: 'Malihabad (मलिहाबाद)',
  district: 'Lucknow (लखनऊ)',
  state: 'Uttar Pradesh (उत्तर प्रदेश)',
  lat: 26.9167,
  lon: 80.7167
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi');
  const [viewMode, setViewMode] = useState<ViewMode>('simple');
  const [location, setLocation] = useState<LocationInfo>(defaultLocation);
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy (धान - बासमती)');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

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
        isSpeaking
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
