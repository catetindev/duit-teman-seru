
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

const TestimonialsSection = () => {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      quote: "Desainnya bikin betah. Auto rajin nyatet!",
      name: "Rani, 21",
      emoji: "😊"
    },
    {
      quote: "Serasa main game keuangan, seru!",
      name: "Yoga, 22",
      emoji: "🎮"
    },
    {
      quote: "Jadi ngerti kemana perginya uang jajan",
      name: "Dinda, 19",
      emoji: "💸"
    }
  ];

  return (
    <section className="container mx-auto px-4 py-16 md:py-24 bg-gray-50 dark:bg-gray-800 rounded-t-3xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Apa Kata Mereka?</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-700 p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transform hover:translate-y-[-5px] transition-all duration-300 relative"
            >
              <div className="text-4xl mb-4">{testimonial.emoji}</div>
              <p className="italic text-gray-700 dark:text-gray-200 mb-4 text-lg">"{testimonial.quote}"</p>
              <p className="font-bold">{testimonial.name}</p>
              <div className="absolute top-4 right-4 text-4xl opacity-10">❝</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
