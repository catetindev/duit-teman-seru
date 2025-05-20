import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';
const TestimonialsSection = () => {
  return <section className="bg-gradient-to-b from-white to-[#F8FAF9] dark:from-gray-900 dark:to-gray-800 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} viewport={{
        once: true
      }} className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 bg-[#FFEBF0] text-pink-600 px-3.5 py-1.5 rounded-full text-sm font-medium mb-4">❤️ Dipakai oleh Ratusan Sahabat Kita</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Kata Mereka Tentang Catatyo</h2>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Testimonial 1 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.1
          }} viewport={{
            once: true
          }}>
              <Card className="h-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)}
                  </div>
                  <p className="text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300">
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
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} viewport={{
            once: true
          }}>
              <Card className="h-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />)}
                  </div>
                  <p className="text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300">
                    "Sejak pakai Catatyo, aku jadi lebih paham uangku pergi ke mana aja. Desainnya simpel tapi lengkap!"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-500 font-bold text-xl">
                      D
                    </div>
                    <div>
                      <p className="font-medium">Dika, 24 tahun</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Karyawan & Content Creator</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;