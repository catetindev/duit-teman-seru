
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20 max-w-4xl">
          {/* Hero Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight">
              Catatyo: It's Time to Stop Guessing Your Finances
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Sering gak sih ngerasa gajian cuma numpang lewat?
              Lagi semangat nabung, eh seminggu kemudian udah gesek sana-sini dan gak tau sisa saldo.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mb-6">
              Tenang. Lo gak sendiri.
              Ngatur uang itu bukan soal "gak bisa", tapi emang dari dulu tools-nya ribet, serius, dan gak bikin betah.
            </p>
            <p className="text-lg md:text-xl text-gray-700">
              Catatyo dateng buat ubah itu semua.
              Biar nyatat keuangan tuh terasa ringan, fun, dan akhirnya… jadi kebiasaan sehari-hari yang masuk akal.
            </p>
          </motion.section>
          
          {/* Movement Statement */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="border-l-4 border-[#28e57d] pl-6 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Catatyo bukan sekadar aplikasi.<br />Ini gerakan.</h2>
            </div>
            
            <p className="text-lg text-gray-700 mb-6">
              Gerakan buat lo yang capek jalan gelap-gelapan soal uang sendiri.
              Buat lo yang pengen hidup lebih terarah, tapi gak mau dipaksa ribet.
              Kita bareng-bareng bangun kebiasaan keuangan yang santai tapi nempel.
            </p>
            <p className="text-lg text-gray-700">
              Tanpa malu-maluin. Tanpa jargon aneh.
              Cuma lo, uang lo, dan cara lo ngatur hidup.
            </p>
          </motion.section>
          
          {/* Real Case Insight */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                Banyak bisnis kecil keren yang tumbang,
                bukan karena gak laku, tapi karena gak pernah tau duitnya ke mana.
              </h2>
              
              <p className="text-lg text-gray-700 mb-6">
                Mereka sibuk jualan, sibuk kerja, tapi pas dicek…
                "Loh, kok segini doang?"
              </p>
              <p className="text-lg text-gray-700">
                Catat itu penting—dan harusnya gak ngebosenin.
                Di situlah Catatyo berdiri.
              </p>
            </div>
            
            {/* Testimonial */}
            <blockquote className="border-l-4 border-gray-300 pl-6 italic text-xl text-gray-600 my-12">
              "Sejak pakai Catatyo, aku gak lagi stress tiap akhir bulan. 
              Akhirnya tahu juga duit larinya kemana, dan bisa mulai nabung beneran."
              <footer className="text-base font-medium text-gray-700 mt-4 not-italic">
                — Rini, 24, Freelance Designer
              </footer>
            </blockquote>
          </motion.section>
          
          {/* Call to Action */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8">
              Track smarter. Feel lighter. Grow stronger.
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              📘 Bukan soal jadi jago keuangan. Tapi soal gak lagi nebak-nebak.
              Mulai pelan-pelan. Yang penting konsisten.
              Bareng Catatyo.
            </p>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="inline-block"
            >
              <a 
                href="/signup" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white rounded-lg font-medium text-lg transition-all"
              >
                Mulai sekarang
                <ArrowRight className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.section>
          
          {/* Simple iconography/illustrations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F8FAF9] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#28e57d]">
                  <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"></path>
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Sederhana</h3>
              <p className="text-gray-600">Interface yang intuitif, mudah digunakan bahkan sambil rebahan</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F8FAF9] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#28e57d]">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Transparan</h3>
              <p className="text-gray-600">Lihat dengan jelas kemana uangmu pergi dan datang dari mana</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#F8FAF9] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#28e57d]">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-2">Adaptif</h3>
              <p className="text-gray-600">Menyesuaikan dengan gaya hidupmu, bukan sebaliknya</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
