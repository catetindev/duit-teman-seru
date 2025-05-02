
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';

const Pricing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const goToSignup = () => {
    navigate('/signup');
  };
  
  // Pricing features
  const freeFeatures = [
    t('pricing.freePlan.feature1'),
    t('pricing.freePlan.feature2'),
    t('pricing.freePlan.feature3'),
    t('pricing.freePlan.feature4')
  ];
  
  const premiumFeatures = [
    t('pricing.premiumPlan.feature1'),
    t('pricing.premiumPlan.feature2'),
    t('pricing.premiumPlan.feature3'),
    t('pricing.premiumPlan.feature4'),
    t('pricing.premiumPlan.feature5'),
    t('pricing.premiumPlan.feature6')
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-2xl font-outfit font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button onClick={() => navigate('/login')} variant="outline" size="sm">{t('auth.login')}</Button>
            <Button onClick={goToSignup} size="sm" className="gradient-bg-purple">{t('auth.signup')}</Button>
          </div>
        </div>
      </header>
      
      {/* Pricing section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-outfit font-bold mb-4">
              <span className="bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                {t('pricing.title')}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('pricing.subtitle')}
            </p>
          </div>
          
          {/* Pricing toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button
                className={`px-4 py-2 text-sm rounded-md ${
                  billingCycle === 'monthly'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                {t('pricing.monthly')}
              </button>
              <button
                className={`px-4 py-2 text-sm rounded-md ${
                  billingCycle === 'yearly'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                {t('pricing.yearly')} <span className="text-xs text-purple-500">(20% {t('pricing.off')})</span>
              </button>
            </div>
          </div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free plan */}
            <Card className="border-2 hover:border-teal-500 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-outfit">{t('pricing.freePlan.name')} 😎</CardTitle>
                <CardDescription>{t('pricing.freePlan.description')}</CardDescription>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold">Rp0</span>
                  <span className="text-muted-foreground">/{t('pricing.perMonth')}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button onClick={goToSignup} variant="outline" className="w-full border-teal-500 text-teal-700 dark:text-teal-300">
                  {t('pricing.startFree')}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Premium plan */}
            <Card className="border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-950 shadow-lg hover:shadow-xl transition-all">
              <CardHeader>
                <div className="inline-block bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-300 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  {t('pricing.recommended')}
                </div>
                <CardTitle className="text-2xl font-outfit">{t('pricing.premiumPlan.name')} 💸</CardTitle>
                <CardDescription>{t('pricing.premiumPlan.description')}</CardDescription>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold">
                    {billingCycle === 'monthly' ? 'Rp50.000' : 'Rp480.000'}
                  </span>
                  <span className="text-muted-foreground">
                    /{billingCycle === 'monthly' ? t('pricing.perMonth') : t('pricing.perYear')}
                  </span>
                  
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-purple-500 font-medium mt-1">
                      {t('pricing.saveWith')}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {premiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button onClick={goToSignup} className="w-full gradient-bg-purple">
                  {t('pricing.getPremium')}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* FAQ section could go here */}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2025 DuitTemanseru. {t('landing.footer.allRights')}</p>
      </footer>
    </div>
  );
};

export default Pricing;
