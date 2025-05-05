
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const CallToActionSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const goToSignup = () => navigate('/signup');

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center p-8 md:p-16 rounded-3xl bg-gradient-to-r from-gray-900/90 to-gray-800/80 shadow-lg"
      >
        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">Yuk Mulai Catat Keuanganmu Hari Ini!</h2>
        <p className="text-white/80 text-lg mb-8 md:mb-10 md:text-xl max-w-2xl mx-auto">
          Daftar sekarang dan rasain sendiri serunya atur duit versi kamu.
        </p>
        <Button 
          onClick={goToSignup} 
          size="lg" 
          className="border-2 border-[#28e57d] bg-transparent hover:bg-[#28e57d]/20 text-white font-medium px-8 py-6 h-auto text-lg rounded-xl hover:shadow-[0_0_15px_rgba(40,229,125,0.3)] hover:scale-[1.03] transition-all duration-300"
        >
          Coba Gratis Sekarang
          <ChevronRight className="ml-1" />
        </Button>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;
