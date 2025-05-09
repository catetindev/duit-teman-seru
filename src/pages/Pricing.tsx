
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, ChartBar, Target, Rainbow, Check, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Pricing = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const goToSignup = () => {
    navigate('/signup');
  };
  
  const handleUpgrade = () => {
    setIsRedirecting(true);
    
    // Show toast notification
    toast({
      title: "Redirecting to payment",
      description: "You're being redirected to a secure payment page",
      duration: 3000,
    });
    
    // Redirect to Mayar payment URL after a short delay
    setTimeout(() => {
      window.location.href = 'https://catatyo.myr.id/membership/premium-user';
    }, 500);
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" 
              alt="DuitTemanseru Logo" 
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button onClick={() => navigate('/login')} variant="outline" size="sm">{t('auth.login')}</Button>
            <Button onClick={goToSignup} size="sm" className="border border-[#28e57d] bg-white text-black hover:bg-[#28e57d]/10 hover:scale-[1.03] transition-all">{t('auth.signup')}</Button>
          </div>
        </div>
      </header>
      
      {/* Pricing section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-outfit font-bold mb-4">
              Duit makin teratur, hidup makin terarah.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Pilih yang cocok buat kamu — mau yang free-free aja, atau upgrade dikit buat hidup lebih rapi.
            </p>
          </motion.div>
          
          {/* Pricing toggle */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mb-10"
          >
            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-full">
              <Label htmlFor="billing-toggle" 
                className={`text-sm px-4 py-2 rounded-full cursor-pointer ${billingCycle === 'monthly' ? 'bg-white shadow-sm font-medium' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </Label>
              
              <Switch
                id="billing-toggle"
                checked={billingCycle === 'yearly'}
                onCheckedChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="data-[state=checked]:bg-[#28e57d]"
              />
              
              <Label htmlFor="billing-toggle" 
                className={`text-sm px-4 py-2 rounded-full cursor-pointer ${billingCycle === 'yearly' ? 'bg-white shadow-sm font-medium' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="text-[#28e57d] text-xs font-medium">Save 20%</span>
              </Label>
            </div>
          </motion.div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free plan */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              <Card className="border border-gray-200 hover:border-[#28e57d] hover:shadow-md transition-all rounded-xl h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-outfit">Gratis</CardTitle>
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                      FREE
                    </span>
                  </div>
                  <CardDescription className="text-gray-600">Basic tapi cukup! Cocok buat kamu yang baru mulai ngatur keuangan.</CardDescription>
                  
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-3xl font-bold">Rp0</span>
                    <span className="text-gray-500 mb-1">/bulan</span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
                        <PenLine className="h-4 w-4 text-[#28e57d]" />
                      </div>
                      <span>Catat pengeluaran</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
                        <ChartBar className="h-4 w-4 text-[#28e57d]" />
                      </div>
                      <span>Lihat ringkasan laporan</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
                        <Target className="h-4 w-4 text-[#28e57d]" />
                      </div>
                      <span>1 tabungan goal</span>
                    </li>
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <Button 
                    onClick={goToSignup} 
                    variant="outline" 
                    className="w-full border-[#28e57d] text-[#28e57d] hover:bg-[#28e57d]/5 hover:border-[#28e57d] transition-all rounded-lg py-6"
                  >
                    Mulai Gratis
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            {/* Premium plan */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.6 }}
            >
              <Card className="border-2 border-[#28e57d] shadow-lg hover:shadow-xl transition-all rounded-xl h-full flex flex-col bg-white relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#28e57d] text-white text-xs font-medium px-3 py-1 rounded-full">
                  Recommended
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-outfit">Glow Up</CardTitle>
                    <span className="bg-[#28e57d]/10 text-[#28e57d] text-xs font-semibold px-2 py-1 rounded-full">
                      PREMIUM
                    </span>
                  </div>
                  <CardDescription className="text-gray-600">Fitur lengkap buat kamu yang niat banget nabung & lihat progres hidup.</CardDescription>
                  
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-3xl font-bold">
                      {billingCycle === 'monthly' ? 'Rp29K' : 'Rp290K'}
                    </span>
                    <span className="text-gray-500 mb-1">
                      /{billingCycle === 'monthly' ? 'bulan' : 'tahun'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <span className="text-xs text-[#28e57d] font-medium mt-1 block">
                      Hemat 20% dengan berlangganan tahunan
                    </span>
                  )}
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
                        <Check className="h-4 w-4 text-[#28e57d]" />
                      </div>
                      <span>Semua fitur Gratis</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
                        <Target className="h-4 w-4 text-[#28e57d]" />
                      </div>
                      <span>Unlimited saving goals</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
                        <ChartBar className="h-4 w-4 text-[#28e57d]" />
                      </div>
                      <span>Laporan detail & grafik</span>
                    </li>
                    <li className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#28e57d]/10 flex items-center justify-center mr-3">
                        <Rainbow className="h-4 w-4 text-[#28e57d]" />
                      </div>
                      <span>Tema lucu biar makin semangat</span>
                    </li>
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={handleUpgrade} 
                          disabled={isRedirecting}
                          aria-disabled={isRedirecting}
                          className="w-full bg-[#28e57d] hover:bg-[#28e57d]/90 text-white transition-all rounded-lg py-6 focus:ring-2 focus:ring-[#28e57d]/30"
                        >
                          {isRedirecting ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Redirecting...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              🚀 Upgrade to Premium
                              <ArrowRight className="h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white">
                        <p>You'll be redirected to a secure payment page</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-lg text-gray-600 mb-4">Belum yakin? Cobain aja yang Gratis dulu~</p>
            <Button 
              onClick={goToSignup} 
              variant="outline" 
              className="border-[#28e57d] text-[#28e57d] hover:bg-[#28e57d]/5 hover:border-[#28e57d] transition-all rounded-lg"
            >
              Daftar Akun Gratis
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-500 mt-12">
        <p>&copy; 2025 Catatyo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Pricing;
