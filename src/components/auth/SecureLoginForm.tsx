
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { sanitizeEmail, validatePasswordStrength } from '@/utils/securityUtils';
import { useSecureAuth } from '@/hooks/auth/useSecureAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SecureLoginFormProps {
  onLogin: (email: string, password: string) => Promise<any>;
  loading: boolean;
}

const SecureLoginForm = ({ onLogin, loading }: SecureLoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const { authState, handleFailedLogin, handleSuccessfulLogin, checkLoginAllowed } = useSecureAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedEmail = sanitizeEmail(e.target.value);
    setEmail(sanitizedEmail);
    
    if (sanitizedEmail && !sanitizedEmail.includes('@')) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security checks
    const isAllowed = await checkLoginAllowed();
    if (!isAllowed) return;

    // Basic validation
    if (!email || !password) {
      return;
    }

    if (emailError) {
      return;
    }

    try {
      const error = await onLogin(email, password);
      
      if (error) {
        await handleFailedLogin(error);
      } else {
        await handleSuccessfulLogin();
      }
    } catch (error: any) {
      await handleFailedLogin(error);
    }
  };

  // Show blocking message if user is blocked
  if (authState.isBlocked && authState.blockUntil) {
    const remainingTime = Math.ceil((authState.blockUntil - Date.now()) / 60000);
    
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Account temporarily locked due to multiple failed login attempts. 
          Please try again in {remainingTime} minutes.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {authState.loginAttempts > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Shield className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            {authState.loginAttempts} failed login attempt{authState.loginAttempts > 1 ? 's' : ''}. 
            {5 - authState.loginAttempts} attempts remaining.
          </AlertDescription>
        </Alert>
      )}
      
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="current-password"
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
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loading || !email || !password || !!emailError}
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
};

export default SecureLoginForm;
