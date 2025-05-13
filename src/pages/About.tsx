import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage

const About = () => {
  const { t } = useLanguage(); // Use the language hook

  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-[#F9FAFB]">
        <div className="container mx-auto px-4 py-20 my-[78px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Left column - Text content */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }} className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('about.title')}
              </h1>
              
              <p className="text-lg text-gray-700 mb-4">
                {t('about.subtitle')}
              </p>
              
              <p className="text-lg text-gray-600">
                {t('about.p1')}
              </p>
              
              <p className="text-lg text-gray-600">
                {t('about.p2')}
              </p>
              
              <motion.div whileHover={{
              scale: 1.02
            }} transition={{
              type: "spring",
              stiffness: 400,
              damping: 10
            }} className="inline-block">
                <a href="/pricing" className="inline-block px-8 py-3 mt-4 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white rounded-lg font-medium transition-all">
                  {t('about.getStarted')}
                </a>
              </motion.div>
            </motion.div>
            
            {/* Right column - Image */}
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} viewport={{
            once: true
          }} className="rounded-xl overflow-hidden shadow-lg">
              <div className="bg-gray-200 h-80 md:h-96 flex items-center justify-center text-gray-500">
                {t('about.illustrationAlt')}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default About;