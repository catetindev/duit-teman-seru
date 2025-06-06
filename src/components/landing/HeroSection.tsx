import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
const HeroSection = () => {
  const navigate = useNavigate();
  const goToSignup = () => navigate('/signup');
  const goToFeatures = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="container mx-auto px-4 py-16 md:py-24 mt-16 sm:mt-20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="mb-8">
          <span className="inline-flex items-center gap-1 bg-[#F2FCE2] text-green-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            🎉 Catat Keuangan Jadi Lebih Menyenangkan
          </span>
          
          <h1 className="font-bold mb-6 leading-tight text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-white">Catatyo bantu kamu kelola keuangan harian praktis, visual, dan fun dipakai setiap hari!</h1>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="flex flex-wrap gap-4 justify-center mb-12">
          <Button onClick={goToSignup} size="lg" className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium px-6 py-3 h-auto rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
            Mulai Gratis
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button onClick={goToFeatures} variant="outline" size="lg" className="border-2 border-[#E5DEFF] bg-white hover:bg-[#E5DEFF]/20 text-gray-700 dark:bg-transparent dark:text-white dark:hover:bg-[#E5DEFF]/10 font-medium px-6 py-3 h-auto rounded-xl transition-all duration-300">
            Lihat Fitur
          </Button>
        </motion.div>
        
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="mt-12 md:mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-gray-900 dark:to-transparent z-10 h-8 bottom-0 top-auto"></div>
          
          <img src="/lovable-uploads/cdbfc368-edb8-448f-993c-3230adb08c71.png" alt="App Dashboard Preview" className="w-full h-auto rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500" />
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;