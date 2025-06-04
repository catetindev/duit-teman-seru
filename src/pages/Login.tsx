
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import AuthIllustration from '@/components/auth/AuthIllustration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

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
        navigate('/dashboard');
      }
      
      if (error) {
        console.error('Auth error after redirect:', error);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(true);
    setError(null);
    
    try {
      // Use current origin for redirectTo to ensure proper redirect back
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
        throw error;
      }
      
      // Redirect is handled by Supabase automatically
      console.log('Auth response:', data);
    } catch (err: any) {
      console.error('Social login error:', err);
      setError(err.message || `Failed to login with ${provider}`);
      toast.error(err.message || `Failed to login with ${provider}`);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    
    try {
      console.log('Sending password reset email to:', resetEmail);
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      console.log('Password reset email sent successfully');
      setResetEmailSent(true);
      toast.success('Password reset email sent! Check your inbox and spam folder.');
      
      // Reset form after successful send
      setTimeout(() => {
        setResetEmail('');
        setResetEmailSent(false);
        setShowForgotPassword(false);
      }, 3000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <Navbar />
        
        <div className="flex flex-1 w-full mt-16 md:mt-20 items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  {resetEmailSent ? (
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  ) : (
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {resetEmailSent ? 'Email Sent!' : 'Reset Password'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {resetEmailSent 
                    ? 'We have sent a password reset link to your email address. Please check your inbox and spam folder.'
                    : 'Enter your email address and we\'ll send you a link to reset your password.'
                  }
                </p>
              </CardHeader>
              <CardContent>
                {!resetEmailSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        disabled={resetLoading}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={resetLoading || !resetEmail}
                      >
                        {resetLoading ? 'Sending...' : 'Send Reset Email'}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setShowForgotPassword(false)}
                        disabled={resetLoading}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Didn't receive the email? Check your spam folder or try again.
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setResetEmailSent(false);
                        setResetEmail('');
                      }}
                    >
                      Try Again
                    </Button>
                    
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 w-full mt-16 md:mt-20">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
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

            <LoginForm onLogin={handleLogin} loading={loading} />
            
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-[#28e57d] hover:underline"
              >
                Forgot your password?
              </Button>
            </div>
            
            <div className="mt-6">
              <SocialLoginButtons onSocialLogin={handleSocialLogin} loading={loading} />
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
        </div>
        
        {/* Right side - Image as background */}
        <AuthIllustration />
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
