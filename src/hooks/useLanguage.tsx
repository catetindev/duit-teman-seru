
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, LanguageContextType } from '@/i18n/types';
import { useTranslation } from '@/i18n/useTranslation';

// Create a context with a default value to prevent the "must be used within a provider" error
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the LanguageProvider as a proper React functional component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id'); // Default to Indonesian
  const [isInitialized, setIsInitialized] = useState(false);
  const { t } = useTranslation(language);
  
  // Load language preference from localStorage on initial render
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('preferred_language');
      if (savedLanguage === 'en' || savedLanguage === 'id') {
        setLanguage(savedLanguage);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading language preference:", error);
      setIsInitialized(true);
    }
  }, []);
  
  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('preferred_language', language);
      } catch (error) {
        console.error("Error saving language preference:", error);
      }
    }
  }, [language, isInitialized]);
  
  // Only render children when the language is initialized
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Add a utility function that doesn't throw an error if used outside a provider
export const useSafeLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Return a default implementation
    return {
      language: 'en' as Language,
      setLanguage: () => {}, // No-op function
      t: (key: string) => key // Return the key itself
    };
  }
  return context;
};
