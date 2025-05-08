
import React from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

const MobileAppSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const goToSignup = () => navigate('/signup');

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              Sengaja Kita Bikin Gampang dan Nyenengin!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Semuanya emang didesain biar kamu ngerasa nyaman dan gampang dipake kapan pun, 
              di mana pun. No ribet-ribet! Coba dan rasain sendiri aja deh, supaya atur duit 
              segampang dan semenyenangkan itu.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="rounded-[3rem] p-2 w-full md:w-[500px] mx-auto">
                <img 
                  src="/lovable-uploads/b2e023e4-8b66-4848-89b7-af73cf396e8e.png" 
                  alt="Mobile app illustration" 
                  className="w-full h-auto rounded-3xl transition-all duration-300" 
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
