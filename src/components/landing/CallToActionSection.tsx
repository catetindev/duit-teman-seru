
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();
  const goToSignup = () => navigate('/signup');
  
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#F2FCE2]/50 to-[#E5DEFF]/50 dark:from-gray-800/50 dark:to-gray-800/80 rounded-3xl p-8 md:p-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Atur Uang dengan Cara yang Kamu Suka
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Catatyo siap temani keuangan pribadi dan usaha kamu semuanya dalam satu aplikasi.
          </p>
          
          <Button 
            onClick={goToSignup} 
            size="lg"
            className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium px-8 py-6 h-auto rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
          >
            Daftar Gratis Sekarang
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CallToActionSection;
