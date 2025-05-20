
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, CheckCheck } from 'lucide-react';

const EntrepreneurSection = () => {
  const navigate = useNavigate();
  const goToPricing = () => navigate('/pricing');
  const goToSignup = () => navigate('/signup');
  
  const entrepreneurFeatures = [
    "Jualan online",
    "Jadi reseller",
    "Punya usaha sampingan"
  ];
  
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-1 bg-[#F2FCE2] text-green-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              🚀 Punya Usaha Kecil?
            </span>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
              Aktifkan <span className="text-purple-600">Mode Entrepreneur</span> dan ubah Catatyo jadi alat pembukuan simpel untuk bisnismu.
            </h2>
            
            <div className="mb-8">
              <p className="text-lg font-medium mb-4">Cocok buat kamu yang:</p>
              <ul className="space-y-3">
                {entrepreneurFeatures.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 0.3 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2"
                  >
                    <CheckCheck className="h-5 w-5 text-[#28e57d]" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <p className="text-lg mb-6">
              Catat transaksi, hitung untung rugi, dan pantau cash flow dengan mudah.
            </p>
            
            <div className="flex items-center space-x-2 mb-8">
              <span className="text-purple-600">🔓</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Fitur ini tersedia di Paket Premium
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={goToSignup} 
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
              >
                Coba Sekarang
              </Button>
              <Button 
                onClick={goToPricing} 
                variant="outline"
                className="border-2 border-purple-200 hover:bg-purple-50 text-purple-700 rounded-xl"
              >
                Lihat Harga
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-green-500/10 rounded-3xl transform -rotate-3 dark:from-purple-500/20 dark:to-green-500/20"></div>
            
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-100 dark:border-gray-700 transform rotate-1 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-purple-500" />
                  <h3 className="font-bold text-lg">Mode Entrepreneur</h3>
                </div>
                <span className="bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded">Premium</span>
              </div>
              
              <img 
                src="/lovable-uploads/d75492ea-96d6-43e6-ab44-7a8b36916d0f.png" 
                alt="Entrepreneur Mode Dashboard" 
                className="w-full rounded-lg mb-4 shadow-sm" 
              />
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Pendapatan Mei</span>
                    <span className="text-green-500 font-medium">Rp8,230,000</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm p-2">
                  <span className="text-gray-600 dark:text-gray-400">Transaksi Bulan Ini</span>
                  <span className="font-medium">68</span>
                </div>
                
                <div className="flex justify-between items-center text-sm p-2">
                  <span className="text-gray-600 dark:text-gray-400">Profit Ratio</span>
                  <span className="font-medium text-green-600">32.5%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EntrepreneurSection;
