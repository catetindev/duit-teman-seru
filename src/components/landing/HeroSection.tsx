import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
const HeroSection = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const goToSignup = () => navigate('/signup');
  return <section className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto md:text-center">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="mb-6">
          <h1 className="md:text-4xl font-bold mb-4 leading-tight md:leading-tight my-[51px] text-4xl">
            Catat Keuangan Makin Gampang & Menyenangkan!
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6 my-0 mx-0">
            Nggak perlu ribet, kamu bisa tracking pemasukan & pengeluaran cuma dalam hitungan detik.
            Cocok buat kamu yang pengen atur duit dengan cara yang fun.
          </p>
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
      }}>
          <Button onClick={goToSignup} size="lg" className="border-2 border-[#28e57d] bg-white hover:bg-[#28e57d]/5 text-black dark:bg-transparent dark:text-white dark:hover:bg-[#28e57d]/10 font-medium px-6 py-2 md:px-8 md:py-6 h-auto rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
            Mulai Sekarang
            <ArrowRight className="ml-2 h-4 w-4" />
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
      }} className="mt-10 md:mt-14">
          <img src="/lovable-uploads/cdbfc368-edb8-448f-993c-3230adb08c71.png" alt="App Dashboard Preview" className="rounded-2xl shadow-xl mx-auto w-full md:w-[95%] lg:w-[100%]" />
        </motion.div>
      </div>
    </section>;
};
export default HeroSection;