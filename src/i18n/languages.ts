export const LANGUAGES = [
  { code: 'hi', native: 'हिंदी', english: 'Hindi', short: 'हि', bcp47: 'hi-IN' },
  { code: 'en', native: 'English', english: 'English', short: 'EN', bcp47: 'en-IN' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', short: 'ਪੰ', bcp47: 'pa-IN' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', short: 'ગુ', bcp47: 'gu-IN' },
  { code: 'mr', native: 'मराठी', english: 'Marathi', short: 'मर', bcp47: 'mr-IN' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali', short: 'বাং', bcp47: 'bn-IN' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil', short: 'த', bcp47: 'ta-IN' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu', short: 'తె', bcp47: 'te-IN' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', short: 'ಕ', bcp47: 'kn-IN' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia', short: 'ଓ', bcp47: 'or-IN' }
] as const;

export type Language = (typeof LANGUAGES)[number]['code'];

export const LANGUAGE_CODES = LANGUAGES.map((l) => l.code) as Language[];

export function isLanguage(value: string | null | undefined): value is Language {
  return !!value && LANGUAGE_CODES.includes(value as Language);
}

export function getLanguageMeta(code: Language) {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
