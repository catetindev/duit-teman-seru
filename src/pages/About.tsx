
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { ArrowDown, Users, PiggyBank, TrendingUp, Smartphone } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC] dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Tentang Kami
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-3xl"
            >
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
                Aplikasi keuangan yang didesain khusus untuk kamu, Gen Z Indonesia.
              </p>
              
              <div className="flex justify-center">
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="bg-[#E5DEFF] dark:bg-purple-900/30 p-3 rounded-full"
                >
                  <ArrowDown className="h-6 w-6 text-[#9766ff]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Problem Section */}
        <section className="py-16 bg-gradient-to-b from-[#F9FAFB] to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto mb-12 text-center"
            >
              <div className="inline-block bg-[#FFEBF0] dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                💭 Realita keuangan
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                Semua orang bilang "ngatur duit itu penting"<br />Tapi gak ada yang ngajarin gimana caranya.
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-10">
                Kamu hidup di zaman serba cepat.<br />
                Scroll-scroll, bayar ini itu, transfer sana sini.<br />
                Uang jalan terus. Tapi tiba-tiba...
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl mb-4">❌</div>
                  <p className="font-medium">Saldo nyisa sedikit</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl mb-4">❌</div>
                  <p className="font-medium">Gak tau duit habis buat apa</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl mb-4">❌</div>
                  <p className="font-medium">Gak tau harus mulai dari mana</p>
                </motion.div>
              </div>
              
              <div className="mt-12 text-xl font-medium">
                Capek ya?<br />
                Kamu gak sendirian. Kita juga pernah ngerasa gitu.
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-20 bg-[#F2FCE2] dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-16">
                <div className="inline-block text-3xl mb-6">🚀</div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Catatyo hadir karena keresahan itu nyata.
                </h2>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-10 shadow-md mb-12">
                <p className="text-lg mb-6">
                  Kita gak mau nge-judge. Kita pengin bantu.<br />
                  Kita percaya:
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-xl">💡</div>
                    <p>Ngatur keuangan itu harusnya gak ribet</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-xl">💡</div>
                    <p>Harusnya bisa dilakuin sambil rebahan</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-xl">💡</div>
                    <p>Harusnya bikin kamu ngerasa tenang, bukan stres</p>
                  </li>
                </ul>
              </div>
              
              <div className="text-center text-lg">
                <p className="mb-4">
                  Catatyo bukan aplikasi buat orang yang udah "matang secara finansial."
                </p>
                <p className="font-medium text-[#28e57d] dark:text-[#28e57d]">
                  Catatyo buat kamu — yang lagi belajar, nyari cara, dan pengin lebih paham soal duit sendiri.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Movement Section */}
        <section className="py-20 bg-gradient-to-b from-white to-[#FFDEE2] dark:from-gray-900 dark:to-pink-900/20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9766ff]/10 mb-6">
                <Users className="h-8 w-8 text-[#9766ff]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                <span className="text-[#9766ff]">🎯 </span>
                Kita bukan cuma aplikasi. Kita lagi bangun gerakan.
              </h2>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md mb-12">
                <p className="text-lg mb-2">
                  Gerakan buat kamu yang pernah dibilang boros, tapi gak pernah dikasih jalan keluar.
                </p>
                <p className="text-lg">
                  Gerakan yang ngajak kamu nyatet, nyimpen, dan ngatur uang dengan cara yang santai — tapi ngena.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Entrepreneur Mode Section */}
        <section className="py-20 bg-gradient-to-b from-[#FFDEE2] to-white dark:from-pink-900/20 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#28e57d]/10 mb-6">
                  <TrendingUp className="h-8 w-8 text-[#28e57d]" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  <span className="text-[#28e57d]">🔥 </span>
                  Entrepreneur Mode
                </h2>
                
                <p className="text-lg mb-10">
                  Kalau kamu lagi jualan, freelance, buka usaha kecil-kecilan — fitur ini bantu kamu ngerti:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-t-4 border-t-[#28e57d]"
                >
                  <p className="font-medium">Duit kamu masuk dari mana</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-t-4 border-t-[#28e57d]"
                >
                  <p className="font-medium">Keluar buat apa</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-t-4 border-t-[#28e57d]"
                >
                  <p className="font-medium">Usaha kamu sebenernya cuan atau cuma sibuk doang?</p>
                </motion.div>
              </div>
              
              <div className="text-center text-lg">
                <p>
                  Karena kamu bukan cuma pengatur keuangan pribadi. Kamu juga pebisnis. Dan kamu layak dibantu.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-20 bg-[#E5DEFF] dark:bg-purple-900/20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9766ff]/10 mb-6">
                <PiggyBank className="h-8 w-8 text-[#9766ff]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-8">
                <span>✊ </span>
                Kita percaya...
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                >
                  <div className="text-2xl mb-4">💚</div>
                  <p>Kamu berhak ngerti keuangan kamu sendiri</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                >
                  <div className="text-2xl mb-4">💚</div>
                  <p>Kamu gak harus jago dulu buat mulai</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                >
                  <div className="text-2xl mb-4">💚</div>
                  <p>Kamu bisa berkembang — mulai dari hal paling sederhana: catat pengeluaran</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-b from-white to-[#F9FAFB] dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#28e57d]/10 mb-6">
                <Smartphone className="h-8 w-8 text-[#28e57d]" />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                <span>✨ </span>
                Yuk, mulai bareng.
              </h2>
              
              <p className="text-xl mb-12">
                📱 Dari catatan kecil sampai mimpi besar, kami temenin.<br />
                <span className="font-medium">#Kamuyangatur bareng Catatyo</span>
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="inline-block"
              >
                <a 
                  href="/signup" 
                  className="inline-block px-8 py-4 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white rounded-lg font-medium text-lg transition-all"
                >
                  Mulai Sekarang
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
