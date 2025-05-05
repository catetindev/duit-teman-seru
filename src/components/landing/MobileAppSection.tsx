import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/useLanguage';
const MobileAppSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    t
  } = useLanguage();
  const goToAbout = () => navigate('/about');
  return <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="md:flex items-center gap-16">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }}>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">Aplikasi yang Bisa Kamu Bawa Kemana Aja!</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Keuanganmu ada di genggaman tangan. Cek laporan keuangan, atur budget, dan dapatkan tips secara mudah kapan saja, di mana saja.
              </p>
              
            </motion.div>
          </div>
          
          <div className="md:w-1/2">
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} viewport={{
            once: true
          }} className="relative">
              <div className="bg-gray-900 rounded-[3rem] p-4 w-[280px] mx-auto shadow-xl">
                <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-900">
                  <img src="/lovable-uploads/7d98b3c3-94ea-43a9-b93b-7329c3bb262d.png" alt="Mobile App" className="w-full" />
                </div>
                <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mt-4"></div>
              </div>
              <div className="absolute -z-10 inset-0 bg-[#28e57d]/5 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
};
export default MobileAppSection;