
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the supported languages
type Language = 'en' | 'id';

// Define the context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations: Record<Language, Record<string, string>> = {
  en: {
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.loggingIn': 'Logging In...',
    'auth.signupSuccess': 'Sign up successful! Redirecting to dashboard...',
    'auth.signupFailed': 'Sign up failed. Please try again.',
    // Add more translations as needed
  },
  id: {
    'auth.login': 'Masuk',
    'auth.signup': 'Daftar',
    'auth.loggingIn': 'Sedang Masuk...',
    'auth.signupSuccess': 'Pendaftaran berhasil! Mengalihkan ke dasbor...',
    'auth.signupFailed': 'Pendaftaran gagal. Silakan coba lagi.',
    // Add more translations as needed
  },
};

// Create the provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Default language based on browser settings or default to English
  const defaultLanguage: Language = 
    (navigator.language.startsWith('id') ? 'id' : 'en') as Language;
  
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Function to get translation
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
