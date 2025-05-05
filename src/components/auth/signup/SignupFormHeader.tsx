import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
interface SignupFormHeaderProps {
  logoUrl: string | null;
}
export const SignupFormHeader: React.FC<SignupFormHeaderProps> = () => {
  const {
    t
  } = useLanguage();
  return <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold">{t('auth.createAccount') || 'Create an Account'}</h2>
      
    </div>;
};