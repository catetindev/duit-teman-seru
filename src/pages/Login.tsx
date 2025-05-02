
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import LoginIllustration from '@/components/auth/LoginIllustration';

const Login = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to dashboard
        navigate('/dashboard');
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success(t('auth.loginSuccess'), {
        id: 'login-success',
      });
      
      // Check user role to determine where to redirect
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user?.id)
        .single();
        
      if (!profileError && profileData) {
        if (profileData.role === 'admin') {
          navigate('/admin');
        } else if (profileData.role === 'premium') {
          navigate('/dashboard/premium');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Default fallback if we can't get the role
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || t('auth.loginFailed'), {
        id: 'login-error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      // You would need to configure these providers in Supabase dashboard
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || t('auth.socialLoginFailed'));
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left section with illustration */}
      <LoginIllustration />
      
      {/* Right section with form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          {/* Only show mobile header on mobile */}
          <div className="mb-8 lg:hidden">
            <div className="flex justify-between items-center mb-12">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">
                  D
                </div>
              </Link>
              <div className="flex gap-4 items-center">
                <div className="text-sm font-medium" onClick={() => language === 'en' ? 'id' : 'en'}>
                  {language === 'en' ? '🇺🇸 English' : '🇮🇩 Indonesia'}
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-outfit font-bold mb-4">
              {language === 'en' ? 'Sign In to' : 'Masuk ke'} {t('app.name')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'en' ? 'If you don\'t have an account' : 'Jika belum punya akun'}{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">
                {language === 'en' ? 'Register here!' : 'Daftar di sini!'}
              </Link>
            </p>
          </div>
          
          {/* Only show on desktop */}
          <div className="hidden lg:flex justify-between items-center mb-12">
            <div className="text-2xl font-outfit font-bold">
              {t('auth.welcomeBack')} 👋
            </div>
            <div className="text-sm font-medium" onClick={() => language === 'en' ? 'id' : 'en'}>
              {language === 'en' ? '🇺🇸 English' : '🇮🇩 Indonesia'}
            </div>
          </div>
          
          <LoginForm 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            onSubmit={handleLogin}
            onSocialLogin={handleSocialLogin}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
