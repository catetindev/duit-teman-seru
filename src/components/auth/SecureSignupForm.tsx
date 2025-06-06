
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { sanitizeInput, sanitizeEmail, validatePasswordStrength } from '@/utils/securityUtils';
import { Progress } from '@/components/ui/progress';

interface SecureSignupFormProps {
  onSignup: (email: string, password: string, fullName: string) => Promise<any>;
  loading: boolean;
}

const SecureSignupForm = ({ onSignup, loading }: SecureSignupFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const passwordValidation = validatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeEmail(e.target.value);
    setEmail(sanitizedEmail);
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedName = sanitizeInput(e.target.value);
    setFullName(sanitizedName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid || !passwordsMatch || !email || !fullName) {
      return;
    }

    try {
      await onSignup(email, password, fullName);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score < 2) return 'bg-red-500';
    if (score < 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        />
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
        
        {password.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Progress 
                value={(passwordValidation.score / 5) * 100} 
                className="flex-1 h-2"
              />
              <span className={`text-sm font-medium ${
                passwordValidation.score < 2 ? 'text-red-600' :
                passwordValidation.score < 4 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {getPasswordStrengthText(passwordValidation.score)}
              </span>
            </div>
            
            <div className="space-y-1">
              {passwordValidation.feedback.map((feedback, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                  <X className="h-3 w-3" />
                  {feedback}
                </div>
              ))}
              {passwordValidation.isValid && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-3 w-3" />
                  Password meets security requirements
                </div>
              )}
            </div>
          </div>
        )}
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
          <div className={`flex items-center gap-2 text-sm ${
            passwordsMatch ? 'text-green-600' : 'text-red-600'
          }`}>
            {passwordsMatch ? (
              <>
                <Check className="h-3 w-3" />
                Passwords match
              </>
            ) : (
              <>
                <X className="h-3 w-3" />
                Passwords do not match
              </>
            )}
          </div>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !passwordValidation.isValid || !passwordsMatch || !email || !fullName}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
};

export default SecureSignupForm;
