
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Target, ChartBar, Rainbow } from 'lucide-react';
import PlanFeature from './PlanFeature';
import { useAuth } from '@/contexts/AuthContext';
import { initiatePayment } from '@/utils/midtransPayment';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PremiumPlanProps {
  billingCycle: 'monthly' | 'yearly';
}

const PremiumPlan = ({ billingCycle }: PremiumPlanProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleUpgrade = async () => {
    setIsLoading(true);
    
    try {
      // Calculate price based on billing cycle
      const price = billingCycle === 'monthly' ? 29000 : 290000;
      const itemName = `Catatyo Premium (${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})`;
      
      // Call the payment API directly without checking login status
      const paymentUrl = await initiatePayment({
        id: user?.id || `guest-${Date.now()}`, // Use a guest ID if no user
        amount: price,
        itemName,
        customerName: user?.user_metadata?.name || '',
        customerEmail: user?.email || '',
        billingCycle,
      });
      
      // Redirect to Midtrans payment page
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Payment error:', error);
      
      // Check if error is due to authentication
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login or create an account to continue with payment.",
          variant: "default",
        });
        navigate('/signup', { state: { redirectAfter: '/pricing' } });
      } else {
        toast({
          title: "Payment Error",
          description: "Failed to process payment. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
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
            <PlanFeature icon={Check} text="Semua fitur Gratis" />
            <PlanFeature icon={Target} text="Unlimited saving goals" />
            <PlanFeature icon={ChartBar} text="Laporan detail & grafik" />
            <PlanFeature icon={Rainbow} text="Tema lucu biar makin semangat" />
          </ul>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            onClick={handleUpgrade} 
            disabled={isLoading}
            className="w-full bg-[#28e57d] hover:bg-[#28e57d]/90 text-white transition-all rounded-lg py-6"
          >
            {isLoading ? 'Processing...' : 'Upgrade Sekarang'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PremiumPlan;
