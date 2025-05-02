
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { ArrowRight, CheckCircle, CreditCard, PiggyBank, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Navigation functions
  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');
  const goToPricing = () => navigate('/pricing');
  
  // Features data
  const features = [
    {
      icon: <CreditCard className="h-12 w-12 text-teal-500" />,
      title: t('features.expense.title'),
      description: t('features.expense.description')
    },
    {
      icon: <PiggyBank className="h-12 w-12 text-purple-500" />,
      title: t('features.savings.title'),
      description: t('features.savings.description')
    },
    {
      icon: <User className="h-12 w-12 text-orange-500" />,
      title: t('features.personal.title'),
      description: t('features.personal.description')
    }
  ];

  // How it works steps
  const steps = [
    {
      number: '1',
      title: t('steps.record.title'),
      description: t('steps.record.description')
    },
    {
      number: '2',
      title: t('steps.categorize.title'),
      description: t('steps.categorize.description')
    },
    {
      number: '3',
      title: t('steps.analyze.title'),
      description: t('steps.analyze.description')
    }
  ];
  
  // Testimonials
  const testimonials = [
    {
      name: "Andi, 22",
      quote: t('testimonials.quote1'),
      avatar: "😎"
    },
    {
      name: "Budi, 19",
      quote: t('testimonials.quote2'),
      avatar: "👨‍🎓"
    },
    {
      name: "Cindy, 25",
      quote: t('testimonials.quote3'),
      avatar: "👩‍💼"
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-2xl font-outfit font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button onClick={goToLogin} variant="outline" size="sm">{t('auth.login')}</Button>
            <Button onClick={goToSignup} size="sm" className="gradient-bg-purple">{t('auth.signup')}</Button>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl font-outfit font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {t('landing.hero.title')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl mb-8 text-muted-foreground"
          >
            {t('landing.hero.subtitle')} ✨💰
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button onClick={goToSignup} size="lg" className="gradient-bg-purple">
              {t('landing.hero.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button onClick={goToPricing} variant="outline" size="lg">
              {t('landing.hero.seePricing')}
            </Button>
          </motion.div>
          
          <div className="mt-16">
            <img 
              src="https://placehold.co/800x450/teal/white?text=App+Dashboard+Preview" 
              alt="App Dashboard Preview"
              className="rounded-xl shadow-lg mx-auto"
            />
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-white dark:bg-gray-900 rounded-t-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">{t('landing.features.title')}</h2>
            <p className="text-muted-foreground">{t('landing.features.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                key={index} 
                className="bg-slate-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">{t('landing.howItWorks.title')}</h2>
            <p className="text-muted-foreground">{t('landing.howItWorks.subtitle')}</p>
          </div>
          
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                key={index} 
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-slate-50 dark:bg-gray-800 rounded-t-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">{t('landing.testimonials.title')}</h2>
            <p className="text-muted-foreground">{t('landing.testimonials.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <p className="font-bold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-teal-500 to-purple-500 p-12 rounded-2xl text-white shadow-lg">
          <h2 className="text-3xl md:text-4xl font-outfit font-bold mb-4">{t('landing.cta.title')}</h2>
          <p className="text-xl mb-8 max-w-lg mx-auto">{t('landing.cta.subtitle')}</p>
          <Button onClick={goToSignup} variant="secondary" size="lg">
            {t('landing.cta.button')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2025 DuitTemanseru. {t('landing.footer.allRights')}</p>
      </footer>
    </div>
  );
};

export default Index;
