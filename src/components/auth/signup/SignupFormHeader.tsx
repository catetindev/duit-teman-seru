
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface SignupFormHeaderProps {
  logoUrl: string | null;
}

export const SignupFormHeader: React.FC<SignupFormHeaderProps> = ({ logoUrl }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8 text-center">
      <div className="flex justify-center mb-6">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-12 object-contain" />
        ) : (
          <Link to="/" className="flex items-center mb-6 text-2xl font-semibold">
            Catatuy
          </Link>
        )}
      </div>
      <h2 className="text-2xl font-bold">{t('auth.createAccount') || 'Create an Account'}</h2>
      <p className="text-sm text-gray-600 mt-1">
        {t('auth.signupDescription') || 'Sign up and start tracking your finances'}
      </p>
    </div>
  );
};
