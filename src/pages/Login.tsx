
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import LoginIllustration from '@/components/auth/LoginIllustration';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

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
    
    // Fetch custom background
    const fetchBackground = async () => {
      try {
        // Fetch custom background if it exists
        const { data: bgData } = await supabase.storage
          .from('branding')
          .getPublicUrl('background.jpg');
          
        if (bgData?.publicUrl) {
          setBackgroundUrl(`${bgData.publicUrl}?t=${Date.now()}`);
        } else {
          // Fallback to default background
          setBackgroundUrl("/lovable-uploads/9990595e-be96-4dac-9fce-6ee0303ee188.png");
        }
      } catch (error) {
        console.error('Error fetching background:', error);
        setBackgroundUrl("/lovable-uploads/9990595e-be96-4dac-9fce-6ee0303ee188.png");
      }
    };
    
    fetchBackground();
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
              <p className="text-gray-500">Sign in to your account to continue</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <LoginForm onLogin={handleLogin} loading={loading} />
            
            <div className="mt-6">
              <SocialLoginButtons onSocialLogin={handleSocialLogin} loading={loading} />
            </div>
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#28e57d] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-gray-50 p-6">
          <div className="h-full w-full flex items-center justify-center">
            <img 
              src={backgroundUrl || "/lovable-uploads/9990595e-be96-4dac-9fce-6ee0303ee188.png"} 
              alt="Financial freedom illustration" 
              className="max-w-full max-h-full object-contain rounded-xl" 
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
