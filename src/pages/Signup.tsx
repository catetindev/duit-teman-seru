
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Signup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("Please agree to the terms and privacy policy");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create the user with Supabase auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // If signup successful, show success message
      toast.success(t('auth.signupSuccess'));
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || t('auth.signupFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" 
            alt="DuitTemanseru Logo" 
            className="h-8 w-auto object-contain" 
          />
        </Link>
      </div>
      
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <div className="flex flex-1 w-full">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Get Started Now</h1>
              <p className="text-gray-500">Create your account and start managing your finances</p>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-lg"
                />
              </div>
              
              <div className="flex items-start space-x-2 my-4">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                  className="mt-1"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-tight cursor-pointer"
                >
                  I agree to the <Link to="/terms" className="text-[#28e57d] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#28e57d] hover:underline">Privacy Policy</Link>
                </label>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !agreeTerms}
                className="w-full h-12 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white rounded-lg font-medium transition-all hover:shadow-md"
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 rounded-lg mb-3 border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                Login with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Login with Email
              </Button>
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Have an account?{" "}
                  <Link to="/login" className="text-[#28e57d] hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden md:block md:w-1/2 bg-gray-50 p-6">
          <div className="h-full w-full flex items-center justify-center">
            <div className="bg-gray-200 rounded-xl w-full max-w-md h-96 flex items-center justify-center text-gray-400">
              Image Placeholder
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        &copy; 2025 DuitTemanseru. {t('landing.footer.allRights')}
      </footer>
    </div>
  );
};

export default Signup;
