
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
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
      
      // If signup successful, show success message and redirect
      toast.success(t('auth.signupSuccess') || "Sign up successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error: any) {
      toast.error(error.message || t('auth.signupFailed'));
    } finally {
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
      toast.error(error.message);
      setIsLoading(false);
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-start space-x-2 my-4">
                <Checkbox 
                  id="terms" 
                  checked={agreeTerms} 
                  onCheckedChange={() => setAgreeTerms(!agreeTerms)}
                  className="mt-1"
                  disabled={isLoading}
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
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></span>
                    Creating Account...
                  </span>
                ) : (
                  "Sign Up"
                )}
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
                disabled={isLoading}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.66 15.63 16.89 16.795 15.72 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                  <path d="M12 23C14.97 23 17.46 22.015 19.28 20.335L15.72 17.575C14.74 18.235 13.48 18.625 12 18.625C9.13504 18.625 6.71004 16.685 5.84504 14.09H2.17004V16.94C3.98004 20.535 7.70004 23 12 23Z" fill="#34A853"/>
                  <path d="M5.84501 14.0899C5.62501 13.4299 5.50001 12.7249 5.50001 11.9999C5.50001 11.2749 5.63001 10.5699 5.84501 9.90992V7.05992H2.17001C1.40001 8.59492 0.950012 10.2849 0.950012 11.9999C0.950012 13.7149 1.40001 15.4049 2.17001 16.9399L5.84501 14.0899Z" fill="#FBBC05"/>
                  <path d="M12 5.375C13.62 5.375 15.06 5.93 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.70004 1 3.98004 3.465 2.17004 7.06L5.84504 9.91C6.71004 7.315 9.13504 5.375 12 5.375Z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full h-12 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all"
                disabled={isLoading}
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
      
      <Footer />
    </div>
  );
};

export default Signup;
