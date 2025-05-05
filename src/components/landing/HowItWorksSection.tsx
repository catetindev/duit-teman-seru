
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Edit3, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const HowItWorksSection = () => {
  const { t } = useLanguage();
  
  const steps = [
    {
      icon: <Edit3 size={40} className="text-[#28e57d] mb-4" />,
      title: "Catat transaksi kamu",
      description: "Catat setiap pemasukan atau pengeluaranmu dengan cepat dan mudah"
    },
    {
      icon: <BarChart2 size={40} className="text-[#28e57d] mb-4" />,
      title: "Lihat grafik keuangan",
      description: "Visualisasi otomatis untuk membantu kamu melihat pola keuanganmu"
    },
    {
      icon: <Lightbulb size={40} className="text-[#28e57d] mb-4" />,
      title: "Dapatkan tips pintar",
      description: "Tips personalisasi untuk mengatur keuanganmu lebih baik lagi"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-white dark:bg-gray-900 rounded-t-3xl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Cara Kerjanya Simpel Banget</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              <div className="flex justify-center">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
