
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, Palette, HelpCircle } from 'lucide-react';
import OnboardingSection from '@/components/settings/OnboardingSection';
import EntrepreneurOnboardingSection from '@/components/settings/EntrepreneurOnboardingSection';

const Settings = () => {
  const { isPremium } = useAuth();

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pengaturan</h1>
          <p className="text-gray-500 mt-2">Kelola preferensi dan pengaturan akun Anda</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kelola informasi profil dan preferensi akun Anda.
              </p>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Atur preferensi notifikasi dan reminder.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privasi & Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Kelola pengaturan privasi dan keamanan akun.
              </p>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tampilan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Sesuaikan tema dan tampilan aplikasi.
              </p>
            </CardContent>
          </Card>

          {/* Onboarding Section */}
          <OnboardingSection />

          {/* Entrepreneur Onboarding Section */}
          <EntrepreneurOnboardingSection />

          {/* Help Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Bantuan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Dapatkan bantuan dan dukungan untuk menggunakan aplikasi.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="text-center text-sm text-gray-500">
          <p>Catatyo v1.0 - Aplikasi Keuangan untuk Gen Z</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
