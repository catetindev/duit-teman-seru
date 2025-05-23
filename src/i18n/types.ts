
export type Language = 'id' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export interface TranslationKeyValues {
  [key: string]: {
    en: string;
    id: string;
  };
}
