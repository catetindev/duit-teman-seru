
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  useEffect(() => {
    // Check if we have the required parameters
    const type = searchParams.get('type');
    const token = searchParams.get('token');
    
    if (type === 'recovery' && token) {
      setIsValidToken(true);
    } else {
      toast.error('Link reset password tidak valid atau sudah kedaluwarsa');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setIsPasswordReset(true);
      toast.success('Password berhasil diubah!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      console.error('Reset password error:', err);
      toast.error(err.message || 'Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-6 mt-16">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-6">
              <p className="text-gray-600 dark:text-gray-400">
                Memvalidasi link reset password...
              </p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center p-6 mt-16">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">Password Berhasil Diubah!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Password Anda telah berhasil diubah. Anda akan diarahkan ke halaman login dalam beberapa detik.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Kembali ke Login
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 items-center justify-center p-6 mt-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
            <p className="text-muted-foreground">
              Masukkan password baru untuk akun Anda
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password baru"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Konfirmasi password baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Password dan konfirmasi password tidak cocok
                </p>
              )}

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                >
                  {loading ? 'Mengubah Password...' : 'Ubah Password'}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate('/login')}
                  disabled={loading}
                >
                  Kembali ke Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
