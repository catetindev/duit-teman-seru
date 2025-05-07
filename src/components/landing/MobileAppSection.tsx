
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
  
  return <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="order-2 md:order-1">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">Sengaja Kita Bikin Gampang dan Nyenengin! </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">Semuanya emang didesain biar kamu ngerasa nyaman dan gampang dipake kapan pun, di mana pun. No ribet-ribet! Coba dan rasain sendiri aja deh, supaya atur duit segampang dan semenyenangkan itu.</p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={goToSignup} 
                className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium px-6 py-2 rounded-xl shadow-sm transition-all duration-300 flex items-center gap-2"
              >
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
              
            </div>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="rounded-[3rem] p-2 w-[500px] mx-auto">
                <img src="/lovable-uploads/b2e023e4-8b66-4848-89b7-af73cf396e8e.png" alt="Mobile app illustration" className="w-full h-auto" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default MobileAppSection;
