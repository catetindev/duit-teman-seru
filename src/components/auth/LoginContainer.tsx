
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SecureLoginForm from './SecureLoginForm';
import SocialLoginButtons from './SocialLoginButtons';

interface LoginContainerProps {
  error: string | null;
  loading: boolean;
  onLogin: (email: string, password: string) => Promise<any>;
  onSocialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
  onShowForgotPassword: () => void;
}

const LoginContainer = ({ 
  error, 
  loading, 
  onLogin, 
  onSocialLogin, 
  onShowForgotPassword 
}: LoginContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <SecureLoginForm onLogin={onLogin} loading={loading} />
      
      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onShowForgotPassword}
          className="text-sm text-[#28e57d] hover:underline"
        >
          Forgot your password?
        </Button>
      </div>
      
      <div className="mt-6">
        <SocialLoginButtons onSocialLogin={onSocialLogin} loading={loading} />
      </div>
      
      <div className="text-center mt-6">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#28e57d] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginContainer;
