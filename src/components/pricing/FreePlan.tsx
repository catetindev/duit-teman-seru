
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, ChartBar, Target } from 'lucide-react';
import PlanFeature from './PlanFeature';
import { useNavigate } from 'react-router-dom';

const FreePlan = () => {
  const navigate = useNavigate();
  
  const goToSignup = () => {
    navigate('/signup');
  };
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
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
            <PlanFeature icon={PenLine} text="Catat pengeluaran" />
            <PlanFeature icon={ChartBar} text="Lihat ringkasan laporan" />
            <PlanFeature icon={Target} text="1 tabungan goal" />
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
  );
};

export default FreePlan;
