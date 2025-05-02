
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  // Common
  'app.name': {
    en: 'DuitTemanseru',
    id: 'DuitTemanseru'
  },
  'app.tagline': {
    en: 'Make money management fun!',
    id: 'Bikin atur uang jadi seru!'
  },
  
  // Navigation
  'nav.dashboard': {
    en: 'Dashboard',
    id: 'Dasbor'
  },
  'nav.transactions': {
    en: 'Transactions',
    id: 'Transaksi'
  },
  'nav.goals': {
    en: 'Goals',
    id: 'Target'
  },
  'nav.budget': {
    en: 'Budget',
    id: 'Anggaran'
  },
  'nav.analytics': {
    en: 'Analytics',
    id: 'Analitik'
  },
  'nav.settings': {
    en: 'Settings',
    id: 'Pengaturan'
  },
  
  // Dashboard
  'dashboard.welcome': {
    en: 'Hi there, money master!',
    id: 'Hai, master duit!'
  },
  'dashboard.balance': {
    en: 'Current Balance',
    id: 'Saldo Saat Ini'
  },
  'dashboard.income': {
    en: 'Income',
    id: 'Pemasukan'
  },
  'dashboard.expense': {
    en: 'Expense',
    id: 'Pengeluaran'
  },
  'dashboard.savings': {
    en: 'Savings',
    id: 'Tabungan'
  },
  
  // Goals
  'goals.title': {
    en: 'Savings Goals',
    id: 'Target Menabung'
  },
  'goals.add': {
    en: 'Add Goal',
    id: 'Tambah Target'
  },
  'goals.empty': {
    en: 'No goals yet! Add one to start saving.',
    id: 'Belum ada target! Yuk tambahkan untuk mulai menabung.'
  },
  
  // Transactions
  'transactions.title': {
    en: 'Recent Transactions',
    id: 'Transaksi Terakhir'
  },
  'transactions.add': {
    en: 'Add Transaction',
    id: 'Tambah Transaksi'
  },
  'transactions.income': {
    en: 'Income',
    id: 'Pemasukan'
  },
  'transactions.expense': {
    en: 'Expense',
    id: 'Pengeluaran'
  },
  'transactions.empty': {
    en: 'No transactions yet. Time to add your first one!',
    id: 'Belum ada transaksi. Saatnya tambah yang pertama!'
  },
  
  // Budget
  'budget.title': {
    en: 'Monthly Budget',
    id: 'Anggaran Bulanan'
  },
  'budget.remaining': {
    en: 'Remaining',
    id: 'Sisa'
  },
  'budget.warning': {
    en: 'Whoa there! You\'re spending too fast! 🚨',
    id: 'Wah! Kamu belanja terlalu cepat! 🚨'
  },
  'budget.good': {
    en: 'You\'re on track! Keep it up! ✨',
    id: 'Kamu on track! Pertahankan! ✨'
  },
  
  // Admin
  'admin.users': {
    en: 'Total Users',
    id: 'Total Pengguna'
  },
  'admin.premium': {
    en: 'Premium Users',
    id: 'Pengguna Premium'
  },
  'admin.free': {
    en: 'Free Users',
    id: 'Pengguna Gratis'
  },
  'admin.notifications': {
    en: 'Send Notification',
    id: 'Kirim Notifikasi'
  },
  
  // Auth
  'auth.login': {
    en: 'Log In',
    id: 'Masuk'
  },
  'auth.signup': {
    en: 'Sign Up',
    id: 'Daftar'
  },
  'auth.logout': {
    en: 'Log Out',
    id: 'Keluar'
  },
  'auth.email': {
    en: 'Email',
    id: 'Email'
  },
  'auth.password': {
    en: 'Password',
    id: 'Kata Sandi'
  },
  'auth.fullName': {
    en: 'Full Name',
    id: 'Nama Lengkap'
  },
  'auth.namePlaceholder': {
    en: 'John Doe',
    id: 'Budi Santoso'
  },
  'auth.welcomeBack': {
    en: 'Welcome back!',
    id: 'Selamat datang kembali!'
  },
  'auth.loginToContinue': {
    en: 'Log in to continue to your account',
    id: 'Masuk untuk lanjut ke akunmu'
  },
  'auth.forgotPassword': {
    en: 'Forgot password?',
    id: 'Lupa kata sandi?'
  },
  'auth.noAccount': {
    en: 'Don\'t have an account?',
    id: 'Belum punya akun?'
  },
  'auth.createAccount': {
    en: 'Create account',
    id: 'Buat akun'
  },
  'auth.haveAccount': {
    en: 'Already have an account?',
    id: 'Sudah punya akun?'
  },
  'auth.letsGetStarted': {
    en: 'Let\'s get started!',
    id: 'Yuk, mulai!'
  },
  'auth.createAccountDesc': {
    en: 'Create an account to start managing your money',
    id: 'Buat akun untuk mulai mengatur keuanganmu'
  },
  'auth.choosePlan': {
    en: 'Choose your plan',
    id: 'Pilih paket'
  },
  'auth.seeAllFeatures': {
    en: 'See all features',
    id: 'Lihat semua fitur'
  },
  'auth.loggingIn': {
    en: 'Logging in...',
    id: 'Masuk...'
  },
  'auth.creating': {
    en: 'Creating account...',
    id: 'Membuat akun...'
  },
  
  // Landing Page
  'landing.hero.title': {
    en: 'Make money management fun!',
    id: 'Catat keuangan makin gampang dan seru!'
  },
  'landing.hero.subtitle': {
    en: 'Track your spending, set goals, and take control of your finances with our easy-to-use app',
    id: 'Lacak pengeluaran, atur target, dan kelola keuanganmu dengan aplikasi yang mudah digunakan'
  },
  'landing.hero.getStarted': {
    en: 'Get started',
    id: 'Mulai sekarang'
  },
  'landing.hero.seePricing': {
    en: 'See pricing',
    id: 'Lihat harga'
  },
  'landing.features.title': {
    en: 'Features you\'ll love',
    id: 'Fitur yang kamu pasti suka'
  },
  'landing.features.subtitle': {
    en: 'Simple yet powerful tools to help you manage your finances',
    id: 'Alat yang sederhana tapi powerful untuk membantu mengatur keuanganmu'
  },
  'landing.howItWorks.title': {
    en: 'How it works',
    id: 'Cara kerjanya'
  },
  'landing.howItWorks.subtitle': {
    en: 'Getting started is as easy as 1-2-3',
    id: 'Mulai semudah 1-2-3'
  },
  'landing.testimonials.title': {
    en: 'What our users say',
    id: 'Kata pengguna kami'
  },
  'landing.testimonials.subtitle': {
    en: 'Join thousands of happy users who love our app',
    id: 'Gabung dengan ribuan pengguna yang menyukai aplikasi kami'
  },
  'landing.cta.title': {
    en: 'Ready to take control of your finances?',
    id: 'Siap mengelola keuanganmu?'
  },
  'landing.cta.subtitle': {
    en: 'Join now and start tracking your money today',
    id: 'Gabung sekarang dan mulai lacak keuanganmu hari ini'
  },
  'landing.cta.button': {
    en: 'Create free account',
    id: 'Buat akun gratis'
  },
  'landing.footer.allRights': {
    en: 'All rights reserved.',
    id: 'Semua hak dilindungi.'
  },
  
  // Features section
  'features.expense.title': {
    en: 'Track Expenses',
    id: 'Catat Pengeluaran'
  },
  'features.expense.description': {
    en: 'Easily log and categorize your daily spending',
    id: 'Catat dan kategorikan pengeluaran harianmu dengan mudah'
  },
  'features.savings.title': {
    en: 'Set Savings Goals',
    id: 'Atur Target Menabung'
  },
  'features.savings.description': {
    en: 'Plan and track progress towards your financial goals',
    id: 'Rencanakan dan lacak kemajuan target keuanganmu'
  },
  'features.personal.title': {
    en: 'Get Personal Insights',
    id: 'Dapatkan Insight Pribadi'
  },
  'features.personal.description': {
    en: 'See where your money goes with beautiful charts and reports',
    id: 'Lihat ke mana uangmu pergi dengan grafik dan laporan yang menarik'
  },
  
  // How it works steps
  'steps.record.title': {
    en: 'Record transactions',
    id: 'Catat transaksi'
  },
  'steps.record.description': {
    en: 'Log your income and expenses with just a few taps',
    id: 'Catat pemasukan dan pengeluaranmu hanya dengan beberapa ketukan'
  },
  'steps.categorize.title': {
    en: 'Categorize automatically',
    id: 'Kategorisasi otomatis'
  },
  'steps.categorize.description': {
    en: 'Our app automatically sorts your spending for easier tracking',
    id: 'Aplikasi kami otomatis mengelompokkan pengeluaranmu untuk pelacakan lebih mudah'
  },
  'steps.analyze.title': {
    en: 'Analyze and save',
    id: 'Analisis dan tabung'
  },
  'steps.analyze.description': {
    en: 'Get insights and recommendations to help you save more',
    id: 'Dapatkan insight dan rekomendasi untuk membantumu menabung lebih banyak'
  },
  
  // Testimonials
  'testimonials.quote1': {
    en: 'This app helped me save for my dream trip to Bali! The goal tracking feature is amazing.',
    id: 'Aplikasi ini membantu ku nabung untuk liburan impianku ke Bali! Fitur pelacakan targetnya keren banget.'
  },
  'testimonials.quote2': {
    en: 'Now I finally understand where my money goes each month. Game changer for a college student!',
    id: 'Sekarang aku akhirnya paham kemana uangku pergi setiap bulan. Sangat membantu untuk mahasiswa!'
  },
  'testimonials.quote3': {
    en: 'I love how simple it is to use while still having all the features I need.',
    id: 'Aku suka bagaimana sederhananya untuk digunakan namun tetap memiliki semua fitur yang kuperlukan.'
  },
  
  // Pricing
  'pricing.title': {
    en: 'Simple, transparent pricing',
    id: 'Harga sederhana dan transparan'
  },
  'pricing.subtitle': {
    en: 'Choose the plan that works best for your financial goals',
    id: 'Pilih paket yang paling cocok untuk tujuan keuanganmu'
  },
  'pricing.monthly': {
    en: 'Monthly',
    id: 'Bulanan'
  },
  'pricing.yearly': {
    en: 'Yearly',
    id: 'Tahunan'
  },
  'pricing.off': {
    en: 'off',
    id: 'diskon'
  },
  'pricing.perMonth': {
    en: 'month',
    id: 'bulan'
  },
  'pricing.perYear': {
    en: 'year',
    id: 'tahun'
  },
  'pricing.saveWith': {
    en: 'Save with annual billing',
    id: 'Hemat dengan pembayaran tahunan'
  },
  'pricing.recommended': {
    en: 'RECOMMENDED',
    id: 'REKOMENDASI'
  },
  
  'pricing.freePlan.name': {
    en: 'Free but Cool 😎',
    id: 'Gratis tapi Kece 😎'
  },
  'pricing.freePlan.description': {
    en: 'Get started with the basics',
    id: 'Mulai dengan dasar-dasar'
  },
  'pricing.freePlan.feature1': {
    en: 'Track up to 50 transactions/month',
    id: 'Catat sampai 50 transaksi/bulan'
  },
  'pricing.freePlan.feature2': {
    en: 'Set 1 savings goal',
    id: 'Atur 1 target menabung'
  },
  'pricing.freePlan.feature3': {
    en: 'Basic expense categories',
    id: 'Kategori pengeluaran dasar'
  },
  'pricing.freePlan.feature4': {
    en: 'Monthly summary report',
    id: 'Laporan ringkasan bulanan'
  },
  
  'pricing.premiumPlan.name': {
    en: 'Sultan Mode 💸',
    id: 'Mode Sultan 💸'
  },
  'pricing.premiumPlan.description': {
    en: 'Everything you need to master your finances',
    id: 'Semua yang kamu butuhkan untuk menguasai keuanganmu'
  },
  'pricing.premiumPlan.feature1': {
    en: 'Unlimited transactions',
    id: 'Transaksi tidak terbatas'
  },
  'pricing.premiumPlan.feature2': {
    en: 'Unlimited savings goals',
    id: 'Target menabung tidak terbatas'
  },
  'pricing.premiumPlan.feature3': {
    en: 'Custom expense categories',
    id: 'Kategori pengeluaran kustom'
  },
  'pricing.premiumPlan.feature4': {
    en: 'Advanced analytics and reports',
    id: 'Analitik dan laporan lanjutan'
  },
  'pricing.premiumPlan.feature5': {
    en: 'Recurring transactions',
    id: 'Transaksi berulang'
  },
  'pricing.premiumPlan.feature6': {
    en: 'Budget alerts and notifications',
    id: 'Peringatan anggaran dan notifikasi'
  },
  
  'pricing.startFree': {
    en: 'Start for free',
    id: 'Mulai gratis'
  },
  'pricing.getPremium': {
    en: 'Get Premium',
    id: 'Dapatkan Premium'
  },
  
  // Actions
  'action.save': {
    en: 'Save',
    id: 'Simpan'
  },
  'action.cancel': {
    en: 'Cancel',
    id: 'Batal'
  },
  'action.edit': {
    en: 'Edit',
    id: 'Ubah'
  },
  'action.delete': {
    en: 'Delete',
    id: 'Hapus'
  },
  'action.add': {
    en: 'Add',
    id: 'Tambah'
  },
  'action.upgrade': {
    en: 'Upgrade to Premium',
    id: 'Tingkatkan ke Premium'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
