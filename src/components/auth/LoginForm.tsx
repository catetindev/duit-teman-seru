
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import SocialLoginButtons from './SocialLoginButtons';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
}

const LoginForm = ({
  onLogin,
  loading
}: LoginFormProps) => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            className="h-12 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            placeholder={language === 'en' ? "hello@example.com" : "email@contoh.com"}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-[#28e57d] dark:text-gray-400">
            {language === 'en' ? 'Forgot Password?' : 'Lupa Kata Sandi?'}
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="h-12 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button 
          type="submit" 
          className="w-full h-12 rounded-lg bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium transition-all hover:shadow-md"
          disabled={loading}
        >
          {loading ? (
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
    </form>
  );
};

export default LoginForm;
