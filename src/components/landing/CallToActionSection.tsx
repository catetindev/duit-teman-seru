
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();
  const goToSignup = () => navigate('/signup');
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#F8FAF9] to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-r from-[#F2FCE2]/50 to-[#E5DEFF]/50 dark:from-gray-800/50 dark:to-gray-800/80 rounded-3xl p-8 md:p-12 lg:p-16 shadow-sm">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
                Atur Uang dengan Cara yang Kamu Suka
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                Catatyo siap temani keuangan pribadi dan usaha kamu semuanya dalam satu aplikasi.
              </p>
              
              <Button 
                onClick={goToSignup} 
                size="lg"
                className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium px-8 py-6 h-auto text-lg rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                Daftar Gratis Sekarang
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
