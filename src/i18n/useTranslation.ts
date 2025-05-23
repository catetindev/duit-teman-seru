
import { useCallback } from 'react';
import { translations } from './translations';
import { Language } from './types';

export const useTranslation = (language: Language) => {
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    let translatedText = translations[key][language] || key;
    
    // Replace parameters in the translated text if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translatedText = translatedText.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
      });
    }
    
    return translatedText;
  }, [language]);

  return { t };
};
