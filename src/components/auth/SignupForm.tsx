import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';
import SecureSignupFormEnhanced from './SecureSignupFormEnhanced';
import SocialLoginButtons from './SocialLoginButtons';
import { validateCSRFToken } from '@/utils/enhancedSecurityUtils';
import { trackSecurityEvent } from '@/utils/enhancedSecurityUtils';

const SignupForm = ({ logoUrl }: { logoUrl?: string }) => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (email: string, password: string, fullName: string, csrfToken: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate CSRF token (in a real app, this would be validated server-side)
      if (!csrfToken) {
        throw new Error('Security validation failed');
      }

      // Track signup attempt
      await trackSecurityEvent('signup_attempt', {
        email,
        fullName: fullName.substring(0, 3) + '***' // Log partial name for privacy
      });

      const error = await signup(email, password, fullName);
      
      if (error) {
        await trackSecurityEvent('signup_failed', {
          email,
          error: error.message
        });
        throw error;
      }
      
      await trackSecurityEvent('signup_success', { email });
      toast.success('Account created successfully! Please check your email for verification.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      toast.error(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'apple' | 'facebook') => {
    await trackSecurityEvent('social_signup_attempt', { provider });
    try {
      setLoading(true);
      setError(null);
      
      const redirectTo = `${window.location.origin}/dashboard`;
      console.log('Redirecting to:', redirectTo);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        await trackSecurityEvent('social_signup_failed', { provider, error: error.message });
        throw error;
      }
      
      console.log('Auth response:', data);
    } catch (err: any) {
      console.error('Social signup error:', err);
      setError(err.message || `Failed to signup with ${provider}`);
      toast.error(err.message || `Failed to signup with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="text-center md:text-left mb-8">
        {logoUrl && (
          <div className="flex justify-center md:justify-start mb-6">
            <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-400">Get started with your financial journey</p>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <SecureSignupFormEnhanced onSignup={handleSignup} loading={loading} />
      
      <div className="mt-6">
        <SocialLoginButtons onSocialLogin={handleSocialSignup} loading={loading} />
      </div>
      
      <div className="text-center mt-6">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#28e57d] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupForm;
