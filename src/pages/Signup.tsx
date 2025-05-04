
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  const [plan, setPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
      
      // If premium plan selected, we'll need to handle that separately
      if (plan === 'premium') {
        // In a real app, this would redirect to payment processing
        // For demo purposes, just add a message
        toast.info(t('auth.premiumRedirect'));
      }
      
      // Redirect to dashboard (or a verification page in production)
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || t('auth.signupFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" 
            alt="DuitTemanseru Logo" 
            className="h-10"
          />
        </Link>
      </div>
      
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white">
          <CardHeader className="space-y-1 text-center bg-gradient-to-r from-purple-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 pb-6 pt-8">
            <CardTitle className="text-3xl font-outfit bg-gradient-to-r from-purple-500 to-teal-400 bg-clip-text text-transparent">
              {t('auth.letsGetStarted')} 🚀
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {t('auth.createAccountDesc')}
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t('auth.fullName')}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('auth.namePlaceholder')}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t('auth.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t('auth.password')}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-700 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-sm font-medium">{t('auth.choosePlan')}</Label>
                <RadioGroup 
                  value={plan} 
                  onValueChange={setPlan}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <RadioGroupItem 
                      value="free" 
                      id="free-plan"
                      className="peer sr-only"
                    />
                    <Label 
                      htmlFor="free-plan"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all peer-data-[state=checked]:border-purple-400 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-purple-400 [&:has([data-state=checked])]:border-purple-400"
                    >
                      <span className="text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">{t('pricing.freePlan.name')}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rp0/mo</span>
                    </Label>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                    <RadioGroupItem 
                      value="premium" 
                      id="premium-plan"
                      className="peer sr-only"
                    />
                    <Label 
                      htmlFor="premium-plan"
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all peer-data-[state=checked]:border-teal-400 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-teal-400 [&:has([data-state=checked])]:border-teal-400"
                    >
                      <span className="text-lg font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">{t('pricing.premiumPlan.name')}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rp50.000/mo</span>
                    </Label>
                  </motion.div>
                </RadioGroup>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  <Link to="/pricing" className="text-teal-500 hover:text-teal-600 hover:underline transition-colors">
                    {t('auth.seeAllFeatures')}
                  </Link>
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 pb-8">
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }}
                className="w-full"
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white font-medium border-0 shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.creating') : t('auth.createAccount')}
                </Button>
              </motion.div>
              
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t('auth.haveAccount')}{' '}
                <Link to="/login" className="font-medium text-purple-500 hover:text-purple-600 transition-colors hover:underline">
                  {t('auth.login')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
      
      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 DuitTemanseru. {t('landing.footer.allRights')}
      </p>
    </div>
  );
};

export default Signup;
