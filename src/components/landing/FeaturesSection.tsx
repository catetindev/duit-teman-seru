
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Star } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart2 size={36} className="text-[#28e57d]" />,
      title: "Catat pemasukan & pengeluaran harian",
      description: "Pantau dengan mudah ke mana uangmu mengalir setiap hari"
    },
    {
      icon: <TrendingUp size={36} className="text-purple-500" />,
      title: "Lihat tren keuangan lewat grafik",
      description: "Visualisasi data yang bikin kamu paham kondisi keuanganmu"
    },
    {
      icon: <Star size={36} className="text-yellow-500" />,
      title: "Buat dan capai tujuan nabung",
      description: "Setting target finansial dan rayakan tiap pencapaianmu"
    }
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-1 bg-[#F1F0FB] text-purple-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
            💸 Gak Ribet, Gak Ngebosenin
          </span>
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Dengan Catatyo, kamu bisa:</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-3px] border border-gray-100 dark:border-gray-700"
            >
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl inline-flex mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-gray-700 dark:text-gray-300"
        >
          <p className="font-medium">Semua dengan tampilan simpel dan warna yang bikin betah.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
