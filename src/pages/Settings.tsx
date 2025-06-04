
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Palette, HelpCircle } from 'lucide-react';
import OnboardingSection from '@/components/settings/OnboardingSection';
import EntrepreneurOnboardingSection from '@/components/settings/EntrepreneurOnboardingSection';
import ProfileSettings from '@/components/settings/ProfileSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';

type SettingsView = 'main' | 'profile' | 'privacy' | 'appearance';

const Settings = () => {
  const { isPremium } = useAuth();
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  const handleCardClick = (view: SettingsView) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  if (currentView === 'profile') {
    return (
      <DashboardLayout isPremium={isPremium}>
        <ProfileSettings onBack={handleBack} />
      </DashboardLayout>
    );
  }

  if (currentView === 'privacy') {
    return (
      <DashboardLayout isPremium={isPremium}>
        <PrivacySettings onBack={handleBack} />
      </DashboardLayout>
    );
  }

  if (currentView === 'appearance') {
    return (
      <DashboardLayout isPremium={isPremium}>
        <AppearanceSettings onBack={handleBack} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Pengaturan</h1>
            <p className="text-slate-600">Kelola preferensi dan pengaturan akun Anda</p>
          </div>

          {/* Content */}
          <div className="px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Profile Settings - Active */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleCardClick('profile')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    Profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Kelola informasi profil dan preferensi akun Anda.
                  </p>
                </CardContent>
              </Card>

              {/* Notification Settings - Disabled */}
              <Card className="opacity-50 cursor-not-allowed">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Bell className="h-5 w-5 text-yellow-600" />
                    </div>
                    Notifikasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Atur preferensi notifikasi dan reminder.
                  </p>
                  <p className="text-xs text-slate-400 mt-2 bg-slate-50 px-2 py-1 rounded">
                    Fitur belum tersedia
                  </p>
                </CardContent>
              </Card>

              {/* Privacy Settings - Active */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleCardClick('privacy')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    Privasi & Keamanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Kelola pengaturan privasi dan keamanan akun.
                  </p>
                </CardContent>
              </Card>

              {/* Theme Settings - Active */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleCardClick('appearance')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Palette className="h-5 w-5 text-purple-600" />
                    </div>
                    Tampilan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Sesuaikan tema dan tampilan aplikasi.
                  </p>
                </CardContent>
              </Card>

              {/* Onboarding Section */}
              <OnboardingSection />

              {/* Entrepreneur Onboarding Section */}
              <EntrepreneurOnboardingSection />

              {/* Help Settings - Disabled */}
              <Card className="opacity-50 cursor-not-allowed">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    Bantuan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Dapatkan bantuan dan dukungan untuk menggunakan aplikasi.
                  </p>
                  <p className="text-xs text-slate-400 mt-2 bg-slate-50 px-2 py-1 rounded">
                    Fitur belum tersedia
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="text-center text-sm text-slate-500">
                <p>Catatyo v1.0 - Aplikasi Keuangan untuk Gen Z</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
