
import { motion } from 'framer-motion';
import { PenLine, ChartBar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface FreePlanCardProps {
  goToSignup: () => void;
  delay?: number;
}

const FreePlanCard = ({ goToSignup, delay = 0.4 }: FreePlanCardProps) => {
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
  );
};

export default FreePlanCard;
