
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Toggle } from '@/components/ui/toggle';

const LanguageToggle = () => {
  const {
    language,
    setLanguage
  } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };
  
  return (
    <Toggle 
      aria-label="Toggle language" 
      pressed={language === 'id'}
      onPressedChange={toggleLanguage}
      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 data-[state=on]:bg-blue-100 dark:data-[state=on]:bg-blue-900"
    >
      {language === 'en' ? 'EN' : 'ID'}
    </Toggle>
  );
};

export default LanguageToggle;
