
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import SocialLoginButtons from './SocialLoginButtons';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSocialLogin: (provider: 'google' | 'apple' | 'facebook') => Promise<void>;
}

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
  onSocialLogin
}: LoginFormProps) => {
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <div className="relative">
          <Input
            id="email"
            type="email"
            className="h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            placeholder={language === 'en' ? "Enter Email" : "Masukkan Email"}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="h-12 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400">
            {language === 'en' ? 'Recover Password?' : 'Lupa Kata Sandi?'}
          </Link>
        </div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button 
          type="submit" 
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></span>
              {t('auth.loggingIn')}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <LogIn size={18} />
              {language === 'en' ? 'Sign In' : 'Masuk'}
            </span>
          )}
        </Button>
      </motion.div>
      
      <SocialLoginButtons onSocialLogin={onSocialLogin} />
      
      <div className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
        <Link to="/signup" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium lg:hidden">
          {language === 'en' ? "Don't have an account? Register here!" : "Belum punya akun? Daftar disini!"}
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
