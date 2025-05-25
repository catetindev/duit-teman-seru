
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Palette, Sun, Moon, Monitor } from 'lucide-react';

interface AppearanceSettingsProps {
  onBack: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ onBack }) => {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load preferences from localStorage
    const savedFontSize = localStorage.getItem('font-size') || 'medium';
    const savedCompactMode = localStorage.getItem('compact-mode') === 'true';
    setFontSize(savedFontSize);
    setCompactMode(savedCompactMode);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Apply font size to document
      document.documentElement.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
      
      // Apply compact mode
      if (compactMode) {
        document.documentElement.classList.add('compact-mode');
      } else {
        document.documentElement.classList.remove('compact-mode');
      }
    }
  }, [fontSize, compactMode, mounted]);

  const handleFontSizeChange = (newSize: string) => {
    setFontSize(newSize);
    localStorage.setItem('font-size', newSize);
    toast.success('Ukuran font berhasil diubah!');
  };

  const handleCompactModeChange = (checked: boolean) => {
    setCompactMode(checked);
    localStorage.setItem('compact-mode', checked.toString());
    toast.success(checked ? 'Mode kompak diaktifkan!' : 'Mode kompak dinonaktifkan!');
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success('Tema berhasil diubah!');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Pengaturan Tampilan</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Tema & Tampilan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Tema</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('light')}
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4" />
                Terang
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4" />
                Gelap
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => handleThemeChange('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                Sistem
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fontSize">Ukuran Font</Label>
            <Select value={fontSize} onValueChange={handleFontSizeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih ukuran font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Kecil</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="large">Besar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode Kompak</Label>
              <p className="text-sm text-muted-foreground">
                Kurangi spacing untuk tampilan yang lebih padat
              </p>
            </div>
            <Switch
              checked={compactMode}
              onCheckedChange={handleCompactModeChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
