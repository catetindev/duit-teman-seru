
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AuthIllustration from '@/components/auth/AuthIllustration';
import LoginContainer from '@/components/auth/LoginContainer';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { logSecurityEvent } from '@/utils/securityUtils';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }

    // Check for redirect response
    const checkForRedirectResponse = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data?.session) {
        console.log('User is authenticated after redirect');
        await logSecurityEvent('oauth_login_success');
        navigate('/dashboard');
      }
      
      if (error) {
        console.error('Auth error after redirect:', error);
        await logSecurityEvent('oauth_login_error', { error: error.message });
        toast.error('Authentication error: ' + error.message);
      }
    };
    
    checkForRedirectResponse();
  }, [user, navigate]);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const error = await login(email, password);
      
      if (error) {
        throw error;
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      toast.error(err.message || 'Failed to login');
      throw err; // Re-throw for SecureLoginForm to handle
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(true);
    setError(null);
    
    try {
      await logSecurityEvent('oauth_login_attempt', { provider });
      
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
        await logSecurityEvent('oauth_login_error', { provider, error: error.message });
        throw error;
      }
      
      console.log('Auth response:', data);
    } catch (err: any) {
      console.error('Social login error:', err);
      setError(err.message || `Failed to login with ${provider}`);
      toast.error(err.message || `Failed to login with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 w-full mt-16 md:mt-20">
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          {showForgotPassword ? (
            <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
          ) : (
            <LoginContainer
              error={error}
              loading={loading}
              onLogin={handleLogin}
              onSocialLogin={handleSocialLogin}
              onShowForgotPassword={() => setShowForgotPassword(true)}
            />
          )}
        </div>
        
        <AuthIllustration />
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
