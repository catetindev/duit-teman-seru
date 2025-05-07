
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, BarChart2, Bell, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const FeaturesSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Palette size={36} className="text-pink-500" />,
      title: "UI super aesthetic & fun",
      description: "Desain yang bikin kamu betah dan semangat atur keuangan"
    },
    {
      icon: <BarChart2 size={36} className="text-purple-500" />,
      title: "Ringkasan yang mudah dimengerti",
      description: "Data keuanganmu disajikan dengan cara yang simpel dan jelas"
    },
    {
      icon: <Bell size={36} className="text-yellow-500" />,
      title: "Reminder otomatis biar gak lupa",
      description: "Notifikasi pintar yang bantu kamu tetap on track"
    },
    {
      icon: <Lightbulb size={36} className="text-blue-500" />,
      title: "Tips pintar tiap minggu",
      description: "Dapatkan insight dan tips atur keuangan yang sesuai dengan gayamu"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Kenapa Kamu Bakal Suka:</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-3px] flex items-start gap-5"
            >
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
