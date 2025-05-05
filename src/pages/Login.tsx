
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import LoginIllustration from '@/components/auth/LoginIllustration';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    setLoading(true);
    setError(null);
    
    try {
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b">
        <div className="container flex justify-start">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container flex flex-col md:flex-row h-full py-8 md:py-12 gap-8">
          <div className="md:w-1/2 flex flex-col justify-center">
            <div className="space-y-2 mb-6">
              <h1 className="text-3xl font-bold tracking-tighter">Welcome back</h1>
              <p className="text-muted-foreground">Login to your account to continue</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <LoginForm onLogin={handleLogin} loading={loading} />
            
            <div className="mt-6">
              <SocialLoginButtons onSocialLogin={handleSocialLogin} />
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary underline underline-offset-4">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="hidden md:flex md:w-1/2 items-center justify-center">
            <LoginIllustration />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
