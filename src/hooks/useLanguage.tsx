
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
