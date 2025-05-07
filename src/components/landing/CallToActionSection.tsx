
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const CallToActionSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const goToPricing = () => navigate('/pricing');
  const goToSignup = () => navigate('/signup');
  
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-[#f7fcf9] dark:bg-gray-800/30 rounded-3xl my-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Untuk Mengatur Keuanganmu?</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Atur, catat, dan kelola keuangan dengan cara menyenangkan. Mulai sekarang, gratis!
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={goToSignup} 
            className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium px-8 py-6 h-auto rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
          >
            Daftar Sekarang
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            onClick={goToPricing} 
            variant="outline"
            className="border-2 border-[#28e57d] bg-white hover:bg-[#28e57d]/5 text-black dark:bg-transparent dark:text-white dark:hover:bg-[#28e57d]/10 font-medium px-8 py-6 h-auto rounded-xl transition-all duration-300"
          >
            Lihat Harga
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
