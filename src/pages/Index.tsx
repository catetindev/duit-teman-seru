import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { ArrowRight, CheckCircle, ChevronRight, Edit3, Smartphone, BarChart2, Bell, Download, Lightbulb, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
const Index = () => {
  const {
    t
  } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Navigation functions
  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');
  const goToAbout = () => navigate('/about');
  return <div className="min-h-screen bg-gradient-to-b from-white to-[#f8faf9] dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" alt="DuitTemanseru Logo" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button onClick={goToLogin} variant="outline" size={isMobile ? "sm" : "default"} className={`transition-all hover:scale-[1.03] ${isMobile ? "px-2" : ""}`}>
              Masuk
            </Button>
            <Button onClick={goToSignup} size={isMobile ? "sm" : "default"} className={`border border-[#28e57d] bg-white text-black dark:bg-transparent dark:text-white hover:bg-[#28e57d]/10 hover:scale-[1.03] transition-all font-medium ${isMobile ? "px-2" : ""}`}>
              Daftar
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto md:text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="mb-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Catat Keuangan Makin Gampang & Menyenangkan!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 md:text-xl">
              Nggak perlu ribet, kamu bisa tracking pemasukan & pengeluaran cuma dalam hitungan detik.
              Cocok buat kamu yang pengen atur duit dengan cara yang fun.
            </p>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            <Button onClick={goToSignup} size="lg" className="border-2 border-[#28e57d] bg-white hover:bg-[#28e57d]/5 text-black dark:bg-transparent dark:text-white dark:hover:bg-[#28e57d]/10 font-medium text-lg px-8 py-6 h-auto rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
              Mulai Sekarang
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
          
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="mt-14">
            <img src="/lovable-uploads/cdbfc368-edb8-448f-993c-3230adb08c71.png" alt="App Dashboard Preview" className="rounded-2xl shadow-xl mx-auto w-full md:w-[95%] lg:w-[100%]" />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-white dark:bg-gray-900 rounded-t-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Cara Kerjanya Simpel Banget</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            icon: <Edit3 size={40} className="text-[#28e57d] mb-4" />,
            title: "Catat transaksi kamu",
            description: "Catat setiap pemasukan atau pengeluaranmu dengan cepat dan mudah"
          }, {
            icon: <BarChart2 size={40} className="text-[#28e57d] mb-4" />,
            title: "Lihat grafik keuangan",
            description: "Visualisasi otomatis untuk membantu kamu melihat pola keuanganmu"
          }, {
            icon: <Lightbulb size={40} className="text-[#28e57d] mb-4" />,
            title: "Dapatkan tips pintar",
            description: "Tips personalisasi untuk mengatur keuanganmu lebih baik lagi"
          }].map((step, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: i * 0.2
          }} viewport={{
            once: true
          }} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
                <div className="flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>)}
          </div>
        </div>
      </section>
      
      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Kenapa Kamu Bakal Suka:</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[{
            icon: <Palette size={40} className="text-pink-500" />,
            title: "UI super aesthetic & fun",
            description: "Desain yang bikin kamu betah dan semangat atur keuangan"
          }, {
            icon: <BarChart2 size={40} className="text-purple-500" />,
            title: "Ringkasan yang mudah dimengerti",
            description: "Data keuanganmu disajikan dengan cara yang simpel dan jelas"
          }, {
            icon: <Bell size={40} className="text-yellow-500" />,
            title: "Reminder otomatis biar gak lupa",
            description: "Notifikasi pintar yang bantu kamu tetap on track"
          }, {
            icon: <Lightbulb size={40} className="text-blue-500" />,
            title: "Tips pintar tiap minggu",
            description: "Dapatkan insight dan tips atur keuangan yang sesuai dengan gayamu"
          }].map((feature, i) => <motion.div key={i} initial={{
            opacity: 0,
            x: i % 2 === 0 ? -20 : 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.5,
            delay: i * 0.1
          }} viewport={{
            once: true
          }} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-md transition-all duration-300 hover:scale-[1.03] flex items-start gap-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-gray-50 dark:bg-gray-800 rounded-t-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Apa Kata Mereka?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[{
            quote: "Desainnya bikin betah. Auto rajin nyatet!",
            name: "Rani, 21",
            emoji: ""
          }, {
            quote: "Serasa main game keuangan, seru!",
            name: "Yoga, 22",
            emoji: ""
          }, {
            quote: "Jadi ngerti kemana perginya uang jajan",
            name: "Dinda, 19",
            emoji: ""
          }].map((testimonial, i) => <motion.div key={i} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5,
            delay: i * 0.2
          }} viewport={{
            once: true
          }} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative">
                <div className="text-5xl mb-4">{testimonial.emoji}</div>
                <p className="italic text-gray-700 dark:text-gray-200 mb-4 text-lg">"{testimonial.quote}"</p>
                <p className="font-bold">{testimonial.name}</p>
                <div className="absolute top-4 right-4 text-5xl opacity-10">❝</div>
              </motion.div>)}
          </div>
        </div>
      </section>
      
      {/* Mobile-Friendly Design Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="md:flex items-center gap-16">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div initial={{
              opacity: 0,
              x: -30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5
            }} viewport={{
              once: true
            }}>
                <h2 className="text-2xl md:text-4xl font-bold mb-6">Aplikasi yang Bisa Kamu Bawa Kemana Aja!</h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                  Keuanganmu ada di genggaman tangan. Cek laporan keuangan, atur budget, dan dapatkan tips secara mudah kapan saja, di mana saja.
                </p>
                <Button onClick={goToAbout} size={isMobile ? "default" : "lg"} className="border-2 border-[#28e57d] bg-white hover:bg-[#28e57d]/5 text-black dark:bg-transparent dark:text-white dark:hover:bg-[#28e57d]/10 font-medium px-6 hover:shadow-lg hover:scale-[1.03] transition-all duration-300">
                  Download Sekarang!
                  <Download className="ml-2" />
                </Button>
              </motion.div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div initial={{
              opacity: 0,
              x: 30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} viewport={{
              once: true
            }} className="relative">
                <div className="bg-gray-900 rounded-[3rem] p-4 w-[280px] mx-auto shadow-xl">
                  <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-900">
                    <img src="/lovable-uploads/7d98b3c3-94ea-43a9-b93b-7329c3bb262d.png" alt="Mobile App" className="w-full" />
                  </div>
                  <div className="w-16 h-1 bg-gray-800 rounded-full mx-auto mt-4"></div>
                </div>
                <div className="absolute -z-10 inset-0 bg-[#28e57d]/5 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final Call To Action */}
      <section className="container mx-auto px-4 py-16 md:py-24">
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
      }} className="max-w-4xl mx-auto text-center p-8 md:p-16 rounded-3xl bg-gradient-to-r from-gray-900/90 to-gray-800/80 shadow-lg">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">Yuk Mulai Catat Keuanganmu Hari Ini!</h2>
          <p className="text-white/80 text-lg mb-8 md:mb-10 md:text-xl max-w-2xl mx-auto">
            Daftar sekarang dan rasain sendiri serunya atur duit versi kamu.
          </p>
          <Button onClick={goToSignup} size="lg" className="border-2 border-[#28e57d] bg-transparent hover:bg-[#28e57d]/20 text-white font-medium px-8 py-6 h-auto text-lg rounded-xl hover:shadow-[0_0_15px_rgba(40,229,125,0.3)] hover:scale-[1.03] transition-all duration-300">
            Coba Gratis Sekarang
            <ChevronRight className="ml-1" />
          </Button>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" alt="DuitTemanseru Logo" className="h-8" />
            <p className="text-gray-600 dark:text-gray-400 mt-2">© 2025 CatatYo!. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap gap-8 justify-center">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Download</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;