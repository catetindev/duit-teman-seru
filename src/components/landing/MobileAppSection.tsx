import React from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
const MobileAppSection = () => {
  const {
    t
  } = useLanguage();
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
            <h2 className="text-2xl md:text-4xl font-bold mb-6">Lebih Fun Lagi Pakai App Mobile!</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Download app nya sekarang di HP kamu, dan nikmati pengalaman 
              ngatur keuangan yang lebih asyik dan gak ribet.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="lg" className="border-[#28e57d] text-[#28e57d] hover:bg-[#28e57d]/5 hover:border-[#28e57d] rounded-xl px-6">
                <img src="/lovable-uploads/9990595e-be96-4dac-9fce-6ee0303ee188.png" alt="App Store" className="h-7 mr-2" />
                App Store
              </Button>
              
              <Button variant="outline" size="lg" className="border-[#28e57d] text-[#28e57d] hover:bg-[#28e57d]/5 hover:border-[#28e57d] rounded-xl px-6">
                <img src="/lovable-uploads/9dfb4bc1-064f-4b55-b196-360715fddf7f.png" alt="Google Play" className="h-7 mr-2" />
                Google Play
              </Button>
            </div>
            
            <div className="mt-8 text-gray-500 dark:text-gray-400 text-sm">
              <p className="flex items-center">
                <DownloadCloud className="h-4 w-4 mr-2" />
                10k+ downloads dengan rating 4.9/5
              </p>
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
              <div className="rounded-[3rem] p-8 w-[340px] mx-auto shadow-xl flex items-center justify-center bg-gray-900/0">
                <img src="/lovable-uploads/b2e023e4-8b66-4848-89b7-af73cf396e8e.png" alt="Mobile app illustration" className="w-full h-auto" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};
export default MobileAppSection;