import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'id' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
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
    en: 'Hi there, {userName}!', // Added placeholder
    id: 'Hai, {userName}!' // Added placeholder
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
  'transactions.loading': {
    en: 'Loading your transactions...',
    id: 'Memuat transaksimu...'
  },
  'transactions.deleted': {
    en: 'Transaction deleted',
    id: 'Transaksi dihapus'
  },
  'transactions.added': {
    en: 'Transaction added',
    id: 'Transaksi ditambahkan'
  },
  'transactions.updated': {
    en: 'Transaction updated',
    id: 'Transaksi diperbarui'
  },
  'transactions.noData': {
    en: 'No transaction data available',
    id: 'Belum ada data transaksi'
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
  'budget.spent': {
    en: 'Spent',
    id: 'Terpakai'
  },
  'budget.periodLabel': {
    en: 'Period',
    id: 'Periode'
  },
  'budget.empty': {
    en: 'No budgets created yet',
    id: 'Belum ada anggaran dibuat'
  },
  'budget.create': {
    en: 'Create Budget',
    id: 'Buat Anggaran'
  },
  'budget.deleteConfirmTitle': {
    en: 'Delete Budget',
    id: 'Hapus Anggaran'
  },
  'budget.deleteConfirmMessage': {
    en: 'Are you sure you want to delete this budget? This action cannot be undone.',
    id: 'Apakah Anda yakin ingin menghapus anggaran ini? Tindakan ini tidak dapat dibatalkan.'
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
  'auth.logoutFailed': {
    en: 'Failed to log out. Please try again.',
    id: 'Gagal keluar. Silakan coba lagi.'
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
  'auth.signupSuccess': {
    en: 'Sign up successful! Redirecting to dashboard...',
    id: 'Pendaftaran berhasil! Mengalihkan ke dasbor...'
  },
  'auth.signupFailed': {
    en: 'Sign up failed',
    id: 'Pendaftaran gagal'
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
  'footer.pages': { en: 'Pages', id: 'Halaman' },
  'footer.legal': { en: 'Legal', id: 'Legal' },
  'footer.home': { en: 'Home', id: 'Beranda' },
  'footer.aboutUs': { en: 'About Us', id: 'Tentang Kami' },
  'footer.pricing': { en: 'Pricing', id: 'Harga' },
  'footer.contact': { en: 'Contact', id: 'Kontak' },
  'footer.terms': { en: 'Terms of Service', id: 'Ketentuan Layanan' },
  'footer.privacy': { en: 'Privacy Policy', id: 'Kebijakan Privasi' },
  'footer.madeWith': { en: 'Made with 💚 for You', id: 'Dibuat dengan 💚 untuk Kamu' },
  'footer.copyright': { en: '© {year} Catatyo. All rights reserved.', id: '© {year} Catatyo. Semua hak dilindungi.' },
  
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
  'pricing.upgradeNow': {
    en: '🚀 Upgrade to Premium',
    id: '🚀 Upgrade ke Premium'
  },
  'pricing.redirecting': {
    en: 'Redirecting...',
    id: 'Mengalihkan...'
  },
  
  // Notifications
  'notifications.title': {
    en: 'Notifications',
    id: 'Notifikasi'
  },
  'notifications.pageTitle': { en: 'Notifications', id: 'Notifikasi' },
  'notifications.pageSubtitle': { en: 'Stay updated on important events', id: 'Tetap terupdate tentang kejadian penting' },
  'notifications.markAllAsRead': {
    en: 'Mark all as read',
    id: 'Tandai semua sudah dibaca'
  },
  'notifications.clearAll': { en: 'Clear all', id: 'Bersihkan semua' },
  'notifications.loadFailed': { en: 'Failed to load notifications', id: 'Gagal memuat notifikasi' },
  'notifications.tryAgain': { en: 'Try Again', id: 'Coba Lagi' },
  'notifications.empty': {
    en: 'No notifications yet',
    id: 'Belum ada notifikasi'
  },
  'notifications.emptyTitle': { en: 'No Notifications', id: 'Tidak Ada Notifikasi' },
  'notifications.emptyDescription': { en: "You don't have any notifications yet. When you receive updates about your budgets, goals, or other important events, they'll appear here.", id: "Anda belum memiliki notifikasi. Ketika Anda menerima pembaruan tentang anggaran, target, atau kejadian penting lainnya, notifikasi akan muncul di sini." },
  'notifications.createSample': { en: 'Create Sample Notification', id: 'Buat Contoh Notifikasi' },
  'notifications.sampleCreatedTitle': { en: 'Sample notification created', id: 'Contoh notifikasi dibuat' },
  'notifications.sampleCreatedDesc': { en: 'Check it out below', id: 'Lihat di bawah ini' },
  'notifications.goalInviteTitle': { en: 'Goal Collaboration Invitation', id: 'Undangan Kolaborasi Target' },
  'notifications.goalInviteMessage': { en: "You've been invited to collaborate on the goal \"{goalTitle}\"", id: "Anda diundang untuk berkolaborasi pada target \"{goalTitle}\"" },
  'notifications.decline': { en: 'Decline', id: 'Tolak' },
  'notifications.accept': { en: 'Accept', id: 'Terima' },
  'notifications.markAsRead': { en: 'Mark as read', id: 'Tandai sudah dibaca' },
  'notifications.newAnnouncement': {
    en: 'New announcement from admin',
    id: 'Pengumuman baru dari admin'
  },
  'notifications.loading': {
    en: 'Loading notifications...',
    id: 'Memuat notifikasi...'
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
  },

  // Common
  'common.cancel': {
    en: 'Cancel',
    id: 'Batal'
  },
  'common.delete': {
    en: 'Delete',
    id: 'Hapus'
  },
  
  // Orders
  'order.status.paid': {
    en: 'Paid',
    id: 'Sudah Dibayar'
  },
  'order.status.pending': {
    en: 'Pending',
    id: 'Menunggu Pembayaran'
  },
  'order.status.canceled': {
    en: 'Canceled',
    id: 'Dibatalkan'
  },
  'order.status.delivered': {
    en: 'Delivered',
    id: 'Terkirim'
  },
  'order.title': {
    en: 'Orders & Transactions',
    id: 'Pesanan & Transaksi'
  },
  'order.new': {
    en: 'New Order',
    id: 'Pesanan Baru'
  },
  'order.search': {
    en: 'Search orders...',
    id: 'Cari pesanan...'
  },
  'order.allStatuses': {
    en: 'All Statuses',
    id: 'Semua Status'
  },
  'order.allCustomers': {
    en: 'All Customers',
    id: 'Semua Pelanggan'
  },
  'order.selectDates': {
    en: 'Select dates...',
    id: 'Pilih tanggal...'
  },
  'order.filteredByDate': {
    en: 'Filtered by date',
    id: 'Difilter berdasarkan tanggal'
  },
  'order.clear': {
    en: 'Clear',
    id: 'Hapus'
  },
  'order.viewAll': {
    en: 'View all transactions',
    id: 'Lihat semua transaksi'
  },
  
  // Product related
  'product.title': {
    en: 'Products & Services',
    id: 'Produk & Layanan'
  },

  // About Page
  'about.title': { en: 'Who are we?', id: 'Siapa Kami?' },
  'about.subtitle': { en: 'We make finance uncomplicated.', id: 'Kami membuat keuangan jadi mudah.' },
  'about.p1': { en: "Catatyo was born for those who want to manage money without the stress – everything is simple, fun, and relatable.", id: "Catatyo lahir untuk kamu yang ingin mengatur uang tanpa stres – semuanya simpel, seru, dan nyambung." },
  'about.p2': { en: "From budgeting to saving, you're in full control. Because we believe money management should feel as easy as scrolling TikTok ✨", id: "Mulai dari anggaran hingga menabung, kamu pegang kendali penuh. Karena kami percaya mengatur uang seharusnya semudah scroll TikTok ✨" },
  'about.getStarted': { en: 'Get Started', id: 'Mulai Sekarang' },
  'about.illustrationAlt': { en: '[ Illustration of young people managing their money ]', id: '[ Ilustrasi anak muda mengatur keuangan ]' },

  // Contact Page
  'contact.title': { en: 'Got something to say?', id: 'Ada yang mau disampaikan?' },
  'contact.subtitle': { en: "Feedback, ideas, or just wanna say \"hi\"? Drop us a DM via email or this form below — we're quick to respond 😎", id: "Masukan, ide, atau cuma mau say \"hai\"? Kirim pesan lewat email atau formulir di bawah ini — kami cepat balasnya 😎" },
  'contact.emailUs': { en: 'Email us directly:', id: 'Email kami langsung:' },
  'contact.form.name': { en: 'Name', id: 'Nama' },
  'contact.form.namePlaceholder': { en: 'Your name', id: 'Nama kamu' },
  'contact.form.email': { en: 'Email', id: 'Email' },
  'contact.form.emailPlaceholder': { en: 'your.email@example.com', id: 'email.kamu@contoh.com' },
  'contact.form.message': { en: 'Message', id: 'Pesan' },
  'contact.form.messagePlaceholder': { en: "What's on your mind?", id: 'Apa yang ada di pikiranmu?' },
  'contact.form.send': { en: 'Send 💌', id: 'Kirim 💌' },
  'contact.form.sending': { en: 'Sending...', id: 'Mengirim...' },
  'contact.toast.fillFields': { en: 'Please fill all fields', id: 'Mohon isi semua kolom' },
  'contact.toast.sentSuccess': { en: 'Message sent successfully!', id: 'Pesan berhasil terkirim!' },
  'contact.illustrationAlt': { en: '[ Illustration of someone sending a message or chatting ]', id: '[ Ilustrasi seseorang mengirim pesan atau mengobrol ]' },

  // Privacy Page
  'privacy.title': { en: 'Privacy Policy', id: 'Kebijakan Privasi' },
  'privacy.p1': { en: 'We value your privacy and are committed to protecting your personal information.', id: 'Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda.' },
  'privacy.dataCollection.title': { en: 'Data Collection', id: 'Pengumpulan Data' },
  'privacy.dataCollection.p1': { en: 'We collect basic information such as name, email, and usage behavior for the purpose of improving our app.', id: 'Kami mengumpulkan informasi dasar seperti nama, email, dan perilaku penggunaan untuk tujuan meningkatkan aplikasi kami.' },
  'privacy.useOfData.title': { en: 'Use of Data', id: 'Penggunaan Data' },
  'privacy.useOfData.p1': { en: 'Your data is used only for service improvements and is never sold to third parties.', id: 'Data Anda hanya digunakan untuk peningkatan layanan dan tidak pernah dijual kepada pihak ketiga.' },
  'privacy.thirdParty.title': { en: 'Third-Party Services', id: 'Layanan Pihak Ketiga' },
  'privacy.thirdParty.p1': { en: 'We may use tools like Google Analytics or authentication, which follow their own privacy policies.', id: 'Kami mungkin menggunakan alat seperti Google Analytics atau otentikasi, yang mengikuti kebijakan privasi mereka sendiri.' },
  'privacy.yourRights.title': { en: 'Your Rights', id: 'Hak Anda' },
  'privacy.yourRights.p1': { en: 'You can request to access, update, or delete your data at any time.', id: 'Anda dapat meminta untuk mengakses, memperbarui, atau menghapus data Anda kapan saja.' },
  'privacy.security.title': { en: 'Security', id: 'Keamanan' },
  'privacy.security.p1': { en: 'We take reasonable measures to secure your data.', id: 'Kami mengambil langkah-langkah yang wajar untuk mengamankan data Anda.' },
  'privacy.changes.title': { en: 'Changes to Policy', id: 'Perubahan Kebijakan' },
  'privacy.changes.p1': { en: 'Updates to this policy will be posted on this page.', id: 'Pembaruan kebijakan ini akan diposting di halaman ini.' },
  'privacy.contactUs.title': { en: 'Contact Us', id: 'Hubungi Kami' },
  'privacy.contactUs.p1': { en: 'Questions? Contact us at <a href="mailto:halo@catatyo.com" class="text-[#28e57d] hover:underline">halo@catatyo.com</a>.', id: 'Ada pertanyaan? Hubungi kami di <a href="mailto:halo@catatyo.com" class="text-[#28e57d] hover:underline">halo@catatyo.com</a>.' },

  // Terms Page
  'terms.title': { en: 'Terms of Service', id: 'Ketentuan Layanan' },
  'terms.p1': { en: 'Welcome to Catatyo! By accessing or using our services, you agree to the following terms:', id: 'Selamat datang di Catatyo! Dengan mengakses atau menggunakan layanan kami, Anda menyetujui ketentuan berikut:' },
  'terms.eligibility.title': { en: 'Eligibility', id: 'Kelayakan' },
  'terms.eligibility.p1': { en: 'You must be at least 13 years old to use this app.', id: 'Anda harus berusia minimal 13 tahun untuk menggunakan aplikasi ini.' },
  'terms.accountSecurity.title': { en: 'Account Security', id: 'Keamanan Akun' },
  'terms.accountSecurity.p1': { en: 'You are responsible for any activity that occurs under your account.', id: 'Anda bertanggung jawab atas segala aktivitas yang terjadi di bawah akun Anda.' },
  'terms.useOfApp.title': { en: 'Use of the App', id: 'Penggunaan Aplikasi' },
  'terms.useOfApp.p1': { en: 'You agree not to misuse the app or use it for any unlawful purpose.', id: 'Anda setuju untuk tidak menyalahgunakan aplikasi atau menggunakannya untuk tujuan yang melanggar hukum.' },
  'terms.subscription.title': { en: 'Subscription', id: 'Langganan' },
  'terms.subscription.p1': { en: 'Some features may require a paid subscription. You will be notified of any changes to pricing.', id: 'Beberapa fitur mungkin memerlukan langganan berbayar. Anda akan diberitahu tentang perubahan harga apa pun.' },
  'terms.termination.title': { en: 'Termination', id: 'Penghentian' },
  'terms.termination.p1': { en: 'We reserve the right to suspend or terminate your account for violating these terms.', id: 'Kami berhak untuk menangguhkan atau menghentikan akun Anda karena melanggar ketentuan ini.' },
  'terms.liability.title': { en: 'Limitation of Liability', id: 'Batasan Tanggung Jawab' },
  'terms.liability.p1': { en: 'We are not liable for any indirect or consequential damages.', id: 'Kami tidak bertanggung jawab atas kerugian tidak langsung atau konsekuensial.' },
  'terms.changes.title': { en: 'Changes to Terms', id: 'Perubahan Ketentuan' },
  'terms.changes.p1': { en: 'We may update these terms. Continued use means you accept the new terms.', id: 'Kami dapat memperbarui ketentuan ini. Penggunaan berkelanjutan berarti Anda menerima ketentuan baru.' },
  'terms.contactUs.title': { en: 'Contact Us', id: 'Hubungi Kami' },
  'terms.contactUs.p1': { en: 'If you have any questions, please contact us at <a href="mailto:halo@catatyo.com" class="text-[#28e57d] hover:underline">halo@catatyo.com</a>.', id: 'Jika Anda memiliki pertanyaan, silakan hubungi kami di <a href="mailto:halo@catatyo.com" class="text-[#28e57d] hover:underline">halo@catatyo.com</a>.' },

  // Settings Page
  'settings.pageTitle': { en: 'Settings', id: 'Pengaturan' },
  'settings.pageSubtitle': { en: 'Manage your account settings and preferences', id: 'Kelola pengaturan akun dan preferensi Anda' },
  'settings.tab.profile': { en: 'Profile', id: 'Profil' },
  'settings.tab.preferences': { en: 'Preferences', id: 'Preferensi' },
  'settings.tab.password': { en: 'Password', id: 'Kata Sandi' },
  'settings.profile.title': { en: 'Profile', id: 'Profil' },
  'settings.profile.description': { en: 'Manage your personal information', id: 'Kelola informasi pribadi Anda' },
  'settings.profile.emailDesc': { en: 'Email address cannot be changed', id: 'Alamat email tidak dapat diubah' },
  'settings.profile.saveButton': { en: 'Save Changes', id: 'Simpan Perubahan' },
  'settings.toast.profileUpdatedTitle': { en: 'Settings updated', id: 'Pengaturan diperbarui' },
  'settings.toast.profileUpdatedDesc': { en: 'Your profile has been updated successfully', id: 'Profil Anda berhasil diperbarui' },
  'settings.toast.profileErrorTitle': { en: 'Error updating profile', id: 'Gagal memperbarui profil' },
  'settings.preferences.title': { en: 'Preferences', id: 'Preferensi' },
  'settings.preferences.description': { en: 'Manage your app preferences and settings', id: 'Kelola preferensi dan pengaturan aplikasi Anda' },
  'settings.preferences.currency': { en: 'Currency', id: 'Mata Uang' },
  'settings.preferences.selectCurrency': { en: 'Select currency', id: 'Pilih mata uang' },
  'settings.preferences.language': { en: 'Language', id: 'Bahasa' },
  'settings.preferences.selectLanguage': { en: 'Select language', id: 'Pilih bahasa' },
  'settings.preferences.saveButton': { en: 'Save Preferences', id: 'Simpan Preferensi' },
  'settings.toast.prefsUpdatedTitle': { en: 'Settings updated', id: 'Pengaturan diperbarui' },
  'settings.toast.prefsUpdatedDesc': { en: 'Your preferences have been updated successfully', id: 'Preferensi Anda berhasil diperbarui' },
  'settings.toast.prefsErrorTitle': { en: 'Error updating preferences', id: 'Gagal memperbarui preferensi' },
  'settings.security.title': { en: 'Security', id: 'Keamanan' },
  'settings.security.description': { en: 'Change your password and security settings', id: 'Ubah kata sandi dan pengaturan keamanan Anda' },
  'settings.security.currentPassword': { en: 'Current Password', id: 'Kata Sandi Saat Ini' },
  'settings.security.newPassword': { en: 'New Password', id: 'Kata Sandi Baru' },
  'settings.security.confirmNewPassword': { en: 'Confirm New Password', id: 'Konfirmasi Kata Sandi Baru' },
  'settings.security.changePasswordButton': { en: 'Change Password', id: 'Ubah Kata Sandi' },
  'settings.toast.passwordUpdatedTitle': { en: 'Password updated', id: 'Kata sandi diperbarui' },
  'settings.toast.passwordUpdatedDesc': { en: 'Your password has been changed successfully', id: 'Kata sandi Anda berhasil diubah' },
  'settings.toast.passwordErrorTitle': { en: 'Error updating password', id: 'Gagal memperbarui kata sandi' },
  'settings.dangerZone.title': { en: 'Danger Zone', id: 'Zona Berbahaya' },
  'settings.dangerZone.desc': { en: 'Once you delete your account, there is no going back. Please be certain.', id: 'Setelah Anda menghapus akun Anda, tidak ada jalan untuk kembali. Mohon pastikan.' },
  'settings.dangerZone.deleteButton': { en: 'Delete Account', id: 'Hapus Akun' },
  'settings.deleteDialog.title': { en: 'Are you absolutely sure?', id: 'Apakah Anda benar-benar yakin?' },
  'settings.deleteDialog.desc': { en: 'This action cannot be undone. This will permanently delete your account and remove your data from our servers.', id: 'Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun Anda secara permanen dan menghapus data Anda dari server kami.' },
  'settings.toast.accountDeletedTitle': { en: 'Account deleted', id: 'Akun dihapus' },
  'settings.toast.accountDeletedDesc': { en: 'Your account has been deleted successfully', id: 'Akun Anda berhasil dihapus' },
  'settings.toast.accountDeleteErrorTitle': { en: 'Error deleting account', id: 'Gagal menghapus akun' },
};

// Create a context with a default undefined value
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the LanguageProvider as a proper React functional component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id'); // Default to Indonesian
  
  // Load language preference from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language');
    if (savedLanguage === 'en' || savedLanguage === 'id') {
      setLanguage(savedLanguage);
    }
  }, []);
  
  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('preferred_language', language);
  }, [language]);
  
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[key]?.[language] || key;
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
    }
    return translation;
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