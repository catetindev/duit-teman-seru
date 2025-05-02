
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Toggle } from '@/components/ui/toggle';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };
  
  return (
    <Toggle
      pressed={language === 'id'}
      onPressedChange={toggleLanguage}
      variant="outline"
      className="px-3 py-1 rounded-full text-sm font-medium"
    >
      {language === 'en' ? '🇺🇸 EN' : '🇮🇩 ID'}
    </Toggle>
  );
};

export default LanguageToggle;
