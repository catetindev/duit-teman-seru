
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecureLoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  loading: boolean;
  error?: string | null;
}

const SecureLoginForm: React.FC<SecureLoginFormProps> = ({
  onLogin,
  loading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      // Error handling is done in the parent component
      console.error('Login form error:', err);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      setFormErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
          className={`h-12 ${formErrors.email ? 'border-red-500' : ''}`}
          disabled={loading}
          autoComplete="email"
          required
        />
        {formErrors.email && (
          <p className="text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            className={`h-12 pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
            disabled={loading}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={loading}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {formErrors.password && (
          <p className="text-sm text-red-500">{formErrors.password}</p>
        )}
      </div>

      <motion.div
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button 
          type="submit" 
          className="w-full h-12 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white font-medium transition-all hover:shadow-md"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></span>
              Signing In...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <LogIn size={18} />
              Sign In Securely
            </span>
          )}
        </Button>
      </motion.div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          <Shield className="inline h-3 w-3 mr-1" />
          Your connection is secured with industry-standard encryption
        </p>
      </div>
    </form>
  );
};

export default SecureLoginForm;
