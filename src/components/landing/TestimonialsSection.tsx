
import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-[#F8FAF9] dark:bg-gray-800/50 rounded-t-3xl mt-12">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-1 bg-[#FFEBF0] text-pink-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            ❤️ Dipakai oleh Ratusan Gen Z
          </span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-3xl mx-auto relative"
        >
          <div className="text-5xl absolute top-6 left-6 text-gray-100 dark:text-gray-700">❝</div>
          
          <div className="relative z-10">
            <p className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 italic">
              "Aku gak nyangka bisa konsisten nyatet pengeluaran. Catatyo tampilannya lucu dan super gampang!"
            </p>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-500 font-bold text-xl">
                R
              </div>
              <div>
                <p className="font-medium">Rara, 21 tahun</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mahasiswa & Pemilik Usaha Kecil</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
