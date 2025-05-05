
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Login successful - the session check will redirect automatically
    } catch (error: any) {
      toast.error(error.message || t('auth.loginFailed'));
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || t('auth.socialLoginFailed'));
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 mt-16 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 rounded-xl shadow-md bg-white">
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Let's get you in ✨
              </h1>
              <p className="text-gray-600">
                Sign in to your account to manage your finances
              </p>
            </div>
            
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              onSubmit={handleLogin}
              onSocialLogin={handleGoogleLogin}
            />
            
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account yet?{" "}
                <Link to="/pricing" className="text-[#28e57d] hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
