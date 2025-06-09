
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { sanitizeInput, sanitizeEmail } from '@/utils/securityUtils';
import { generateCSRFToken } from '@/utils/enhancedSecurityUtils';
import EnhancedPasswordValidation from './EnhancedPasswordValidation';

interface SecureSignupFormEnhancedProps {
  onSignup: (email: string, password: string, fullName: string, csrfToken: string) => Promise<any>;
  loading: boolean;
}

const SecureSignupFormEnhanced = ({ onSignup, loading }: SecureSignupFormEnhancedProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [csrfToken] = useState(() => generateCSRFToken());

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeEmail(e.target.value);
    setEmail(sanitizedEmail);
    
    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (sanitizedEmail && !emailRegex.test(sanitizedEmail)) {
      setEmailError('Please enter a valid email address');
    } else if (sanitizedEmail.length > 254) {
      setEmailError('Email address is too long');
    } else {
      setEmailError('');
    }
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedName = sanitizeInput(e.target.value);
    // Additional validation for name
    if (sanitizedName.length > 100) {
      return; // Don't allow names longer than 100 characters
    }
    setFullName(sanitizedName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!email || !password || !fullName || !confirmPassword) {
      return;
    }

    if (emailError) {
      return;
    }

    if (password !== confirmPassword) {
      return;
    }

    if (password.length < 8) {
      return;
    }

    try {
      await onSignup(email, password, fullName, csrfToken);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const isFormValid = !emailError && 
                     email.length > 0 && 
                     password.length >= 8 && 
                     fullName.length > 0 && 
                     password === confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={handleFullNameChange}
          disabled={loading}
          required
          autoComplete="name"
          maxLength={100}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          disabled={loading}
          required
          autoComplete="email"
          className={emailError ? 'border-red-500' : ''}
          maxLength={254}
        />
        {emailError && (
          <p className="text-sm text-red-600">{emailError}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        
        <EnhancedPasswordValidation 
          password={password} 
          showStrengthMeter={true}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </Button>
        </div>
        
        {confirmPassword.length > 0 && (
          <EnhancedPasswordValidation 
            password={password} 
            confirmPassword={confirmPassword}
            showStrengthMeter={false}
          />
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !isFormValid}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

export default SecureSignupFormEnhanced;
