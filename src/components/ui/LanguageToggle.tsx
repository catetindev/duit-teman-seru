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
  return;
};
export default LanguageToggle;