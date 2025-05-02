
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LanguageToggle from '@/components/ui/LanguageToggle';

const Signup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock signup - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 left-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">
            D
          </div>
        </Link>
      </div>
      
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-outfit">{t('auth.letsGetStarted')} 🚀</CardTitle>
          <CardDescription>{t('auth.createAccountDesc')}</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.fullName')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('auth.namePlaceholder')}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="hello@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              <Label>{t('auth.choosePlan')}</Label>
              <RadioGroup 
                value={plan} 
                onValueChange={setPlan}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem 
                    value="free" 
                    id="free-plan"
                    className="peer sr-only"
                  />
                  <Label 
                    htmlFor="free-plan"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                  >
                    <span className="text-lg font-semibold">{t('pricing.freePlan.name')}</span>
                    <span className="text-sm text-muted-foreground">Rp0/mo</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem 
                    value="premium" 
                    id="premium-plan"
                    className="peer sr-only"
                  />
                  <Label 
                    htmlFor="premium-plan"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                  >
                    <span className="text-lg font-semibold">{t('pricing.premiumPlan.name')}</span>
                    <span className="text-sm text-muted-foreground">Rp50.000/mo</span>
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground text-center">
                <Link to="/pricing" className="text-purple-500 hover:underline">{t('auth.seeAllFeatures')}</Link>
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gradient-bg-purple" disabled={isLoading}>
              {isLoading ? t('auth.creating') : t('auth.createAccount')}
            </Button>
            
            <p className="text-center text-sm">
              {t('auth.haveAccount')}{' '}
              <Link to="/login" className="text-purple-500 hover:text-purple-600 font-medium">
                {t('auth.login')}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; 2025 DuitTemanseru. {t('landing.footer.allRights')}
      </p>
    </div>
  );
};

export default Signup;
