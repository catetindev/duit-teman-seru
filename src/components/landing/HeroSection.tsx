
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const goToSignup = () => navigate('/signup');
  
  return (
    <section className="container mx-auto md:py-24 mt-16 sm:mt-20 my-0 px-[16px] py-0">
      <div className="max-w-4xl mx-auto md:text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-bold mb-6 leading-tight text-3xl sm:text-4xl md:text-5xl my-[10px]">
            {t('landing.hero.title')}
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('landing.hero.subtitle')}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <Button
            onClick={goToSignup}
            size="lg"
            className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium px-6 py-3 h-auto rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            {t('landing.hero.getStarted')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-12 md:mt-16 overflow-hidden rounded-2xl shadow-lg"
        >
          <img
            src="/lovable-uploads/cdbfc368-edb8-448f-993c-3230adb08c71.png"
            alt="App Dashboard Preview"
            className="w-full h-auto rounded-2xl hover:scale-[1.01] transition-all duration-500"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
