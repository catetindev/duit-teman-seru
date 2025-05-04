
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { ArrowRight, ChevronRight, Edit3, BarChart2, Bell, Download, Lightbulb, Palette, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Navigation functions
  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');
  const goToAbout = () => navigate('/about');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" alt="DuitTemanseru Logo" className="h-8 md:h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button 
              onClick={goToLogin} 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              className={`rounded-xl transition-all hover:scale-[1.03] hover:shadow-sm border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/30 ${isMobile ? "px-2" : ""}`}
            >
              Masuk
            </Button>
            <Button 
              onClick={goToSignup} 
              size={isMobile ? "sm" : "default"} 
              className={`rounded-xl border border-teal-400 bg-transparent text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:shadow-sm hover:scale-[1.03] transition-all font-medium ${isMobile ? "px-2" : ""}`}
            >
              Daftar
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto md:text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-block mb-4">
              <Badge className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 dark:from-purple-900/50 dark:to-indigo-900/50 dark:text-purple-300 border-0">
                Cara Baru Atur Keuangan!
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4 leading-tight my-[17px] md:text-5xl bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
              Catat Keuangan Makin Gampang & Menyenangkan!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 md:text-xl">
              Nggak perlu ribet, kamu bisa tracking pemasukan & pengeluaran cuma dalam hitungan detik.
              Cocok buat kamu yang pengen atur duit dengan cara yang fun.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button 
              onClick={goToSignup} 
              size="lg" 
              className="border-2 border-teal-400 bg-white hover:bg-teal-50 text-teal-600 dark:bg-transparent dark:text-teal-400 dark:hover:bg-teal-900/20 font-medium text-lg px-8 py-6 h-auto rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              Mulai Sekarang
              <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-14"
          >
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
              <img 
                src="/lovable-uploads/cdbfc368-edb8-448f-993c-3230adb08c71.png" 
                alt="App Dashboard Preview" 
                className="rounded-3xl mx-auto w-full md:w-[105%] lg:w-[110%] transform md:-translate-y-4"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 rounded-t-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-teal-100 text-indigo-800 dark:from-indigo-900/50 dark:to-teal-900/50 dark:text-indigo-300 border-0 mb-4">
              Simple & Fun
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
              Cara Kerjanya Simpel Banget
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Edit3 size={40} className="text-purple-500 mb-4" />,
                title: "Catat transaksi kamu",
                description: "Catat setiap pemasukan atau pengeluaranmu dengan cepat dan mudah",
                color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30"
              }, 
              {
                icon: <BarChart2 size={40} className="text-indigo-500 mb-4" />,
                title: "Lihat grafik keuangan",
                description: "Visualisasi otomatis untuk membantu kamu melihat pola keuanganmu",
                color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30"
              }, 
              {
                icon: <Lightbulb size={40} className="text-teal-500 mb-4" />,
                title: "Dapatkan tips pintar",
                description: "Tips personalisasi untuk mengatur keuanganmu lebih baik lagi",
                color: "from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/30"
              }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: i * 0.2 }} 
                viewport={{ once: true }} 
                className={`bg-gradient-to-b ${step.color} p-6 rounded-2xl text-center shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300`}
              >
                <div className="flex justify-center">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Key Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 dark:from-teal-900/50 dark:to-blue-900/50 dark:text-teal-300 border-0 mb-4">
              Fitur-Fitur Keren
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
              Kenapa Kamu Bakal Suka:
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Palette size={40} className="text-pink-500" />,
                title: "UI super aesthetic & fun",
                description: "Desain yang bikin kamu betah dan semangat atur keuangan",
                color: "border-pink-100 bg-pink-50/50 dark:border-pink-900/50 dark:bg-pink-900/10"
              }, 
              {
                icon: <BarChart2 size={40} className="text-purple-500" />,
                title: "Ringkasan yang mudah dimengerti",
                description: "Data keuanganmu disajikan dengan cara yang simpel dan jelas",
                color: "border-purple-100 bg-purple-50/50 dark:border-purple-900/50 dark:bg-purple-900/10"
              }, 
              {
                icon: <Bell size={40} className="text-yellow-500" />,
                title: "Reminder otomatis biar gak lupa",
                description: "Notifikasi pintar yang bantu kamu tetap on track",
                color: "border-yellow-100 bg-yellow-50/50 dark:border-yellow-900/50 dark:bg-yellow-900/10"
              }, 
              {
                icon: <Lightbulb size={40} className="text-blue-500" />,
                title: "Tips pintar tiap minggu",
                description: "Dapatkan insight dan tips atur keuangan yang sesuai dengan gayamu",
                color: "border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: i * 0.1 }} 
                viewport={{ once: true }} 
                className={`p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] flex items-start gap-4 border ${feature.color}`}
              >
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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
      
      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-t-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-900/50 dark:to-red-900/50 dark:text-orange-300 border-0 mb-4">
              Testimonial
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
              Apa Kata Mereka?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Desainnya bikin betah. Auto rajin nyatet!",
                name: "Rani, 21",
                color: "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20"
              }, 
              {
                quote: "Serasa main game keuangan, seru!",
                name: "Yoga, 22",
                color: "from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20"
              }, 
              {
                quote: "Jadi ngerti kemana perginya uang jajan",
                name: "Dinda, 19",
                color: "from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20"
              }
            ].map((testimonial, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: i * 0.2 }} 
                viewport={{ once: true }} 
                className={`bg-gradient-to-br ${testimonial.color} p-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative border border-gray-100 dark:border-gray-800`}
              >
                <p className="italic text-gray-700 dark:text-gray-200 mb-4 text-lg">"{testimonial.quote}"</p>
                <p className="font-bold">{testimonial.name}</p>
                <div className="absolute top-4 right-4 text-5xl opacity-10">❝</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Mobile-Friendly Design Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="md:flex items-center gap-16">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5 }} 
                viewport={{ once: true }}
              >
                <Badge className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-300 border-0 mb-4">
                  Mobile App
                </Badge>
                <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-100 dark:to-white bg-clip-text text-transparent">
                  Aplikasi yang Bisa Kamu Bawa Kemana Aja!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                  Keuanganmu ada di genggaman tangan. Cek laporan keuangan, atur budget, dan dapatkan tips secara mudah kapan saja, di mana saja.
                </p>
                <Button 
                  onClick={goToAbout} 
                  size={isMobile ? "default" : "lg"} 
                  className="border-2 border-blue-400 bg-white hover:bg-blue-50 text-blue-600 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-900/20 font-medium px-6 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300"
                >
                  Download Sekarang!
                  <Download className="ml-2" />
                </Button>
              </motion.div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }} 
                viewport={{ once: true }} 
                className="relative"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] p-4 w-[280px] mx-auto shadow-xl">
                  <div className="rounded-[2.5rem] overflow-hidden border-8 border-gray-900">
                    <img src="/lovable-uploads/7d98b3c3-94ea-43a9-b93b-7329c3bb262d.png" alt="Mobile App" className="w-full" />
                  </div>
                  <div className="w-16 h-1 bg-white/40 rounded-full mx-auto mt-4"></div>
                </div>
                <div className="absolute -z-10 inset-0 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-full blur-3xl"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final Call To Action */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          viewport={{ once: true }} 
          className="max-w-4xl mx-auto text-center p-8 md:p-16 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
        >
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
            Yuk Mulai Catat Keuanganmu Hari Ini!
          </h2>
          <p className="text-white/90 text-lg mb-8 md:mb-10 md:text-xl max-w-2xl mx-auto">
            Daftar sekarang dan rasain sendiri serunya atur duit versi kamu.
          </p>
          <Button 
            onClick={goToSignup} 
            size="lg" 
            className="border-2 border-white bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-6 h-auto text-lg rounded-xl hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-[1.03] transition-all duration-300"
          >
            Coba Gratis Sekarang
            <ChevronRight className="ml-1" />
          </Button>
        </motion.div>
      </section>
      
      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" alt="DuitTemanseru Logo" className="h-8" />
            <p className="text-gray-600 dark:text-gray-400 mt-2">© 2025 CatatYo!. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap gap-8 justify-center">
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Download</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-500 dark:text-gray-400">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
