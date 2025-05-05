
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, BarChart2, Bell, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const FeaturesSection = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Palette size={40} className="text-pink-500" />,
      title: "UI super aesthetic & fun",
      description: "Desain yang bikin kamu betah dan semangat atur keuangan"
    },
    {
      icon: <BarChart2 size={40} className="text-purple-500" />,
      title: "Ringkasan yang mudah dimengerti",
      description: "Data keuanganmu disajikan dengan cara yang simpel dan jelas"
    },
    {
      icon: <Bell size={40} className="text-yellow-500" />,
      title: "Reminder otomatis biar gak lupa",
      description: "Notifikasi pintar yang bantu kamu tetap on track"
    },
    {
      icon: <Lightbulb size={40} className="text-blue-500" />,
      title: "Tips pintar tiap minggu",
      description: "Dapatkan insight dan tips atur keuangan yang sesuai dengan gayamu"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Kenapa Kamu Bakal Suka:</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 hover:scale-[1.03] flex items-start gap-4"
            >
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
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
