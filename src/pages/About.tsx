import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
const About = () => {
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
                Who are we?
              </h1>
              
              <p className="text-lg text-gray-700 mb-4">
                We make finance uncomplicated.
              </p>
              
              <p className="text-lg text-gray-600">
                Catatyo was born for those who want to manage money without the stress 
                – everything is simple, fun, and relatable.
              </p>
              
              <p className="text-lg text-gray-600">
                From budgeting to saving, you're in full control. Because we believe 
                money management should feel as easy as scrolling TikTok ✨
              </p>
              
              <motion.div whileHover={{
              scale: 1.02
            }} transition={{
              type: "spring",
              stiffness: 400,
              damping: 10
            }} className="inline-block">
                <a href="/pricing" className="inline-block px-8 py-3 mt-4 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white rounded-lg font-medium transition-all">
                  Get Started
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
                [ Illustration of young people managing their money ]
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default About;