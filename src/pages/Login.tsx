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
const Login = () => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        // User is already logged in, redirect to dashboard
        navigate('/dashboard');
      }
    };
    checkSession();
  }, [navigate]);
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const {
        error
      } = await supabase.auth.signInWithOAuth({
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
  return <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 my-[163px]">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="w-full max-w-md">
          <Card className="p-8 rounded-xl shadow-md bg-white">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Let's get you in ✨
              </h1>
              <p className="text-gray-600">
                Just one click with Google – easy peasy!
              </p>
            </div>
            
            <Button onClick={handleGoogleLogin} disabled={isLoading} className="w-full h-12 rounded-lg mb-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-medium transition-all">
              {isLoading ? <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-r-transparent"></span>
                  Loading...
                </span> : <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Login with Google
                </>}
            </Button>
            
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
    </div>;
};
export default Login;