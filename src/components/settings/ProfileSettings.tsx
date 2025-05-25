
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, User } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface ProfileSettingsProps {
  onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onBack }) => {
  const { user, profile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          email: email,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profil berhasil diperbarui!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Pengaturan Profil</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informasi Profil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nama Lengkap</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Bahasa</Label>
            <Select value={language} onValueChange={(value: 'en' | 'id') => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih bahasa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleUpdateProfile} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
