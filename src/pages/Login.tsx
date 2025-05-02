
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LanguageToggle from '@/components/ui/LanguageToggle';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - replace with actual auth
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
          <CardTitle className="text-3xl font-outfit">{t('auth.welcomeBack')} 👋</CardTitle>
          <CardDescription>{t('auth.loginToContinue')}</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Link to="/forgot-password" className="text-sm text-purple-500 hover:text-purple-600">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full gradient-bg-purple" disabled={isLoading}>
              {isLoading ? t('auth.loggingIn') : t('auth.login')}
            </Button>
            
            <p className="text-center text-sm">
              {t('auth.noAccount')}{' '}
              <Link to="/signup" className="text-purple-500 hover:text-purple-600 font-medium">
                {t('auth.createAccount')}
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

export default Login;
