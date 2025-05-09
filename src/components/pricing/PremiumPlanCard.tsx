
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChartBar, Target, Rainbow, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/use-toast';

interface PremiumPlanCardProps {
  billingCycle: 'monthly' | 'yearly';
  delay?: number;
}

const PremiumPlanCard = ({ billingCycle, delay = 0.6 }: PremiumPlanCardProps) => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
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
  );
};

export default PremiumPlanCard;
