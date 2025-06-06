
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logSecurityEvent } from '@/utils/securityUtils';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    
    try {
      console.log('Sending password reset email to:', resetEmail);
      await logSecurityEvent('password_reset_request', { email: resetEmail });
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        await logSecurityEvent('password_reset_error', { email: resetEmail, error: error.message });
        throw error;
      }

      console.log('Password reset email sent successfully');
      await logSecurityEvent('password_reset_sent', { email: resetEmail });
      setResetEmailSent(true);
      toast.success('Password reset email sent! Check your inbox and spam folder.');
      
      setTimeout(() => {
        setResetEmail('');
        setResetEmailSent(false);
        onBack();
      }, 3000);
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast.error(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            {resetEmailSent ? (
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            ) : (
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {resetEmailSent ? 'Email Sent!' : 'Reset Password'}
          </CardTitle>
          <p className="text-muted-foreground">
            {resetEmailSent 
              ? 'We have sent a password reset link to your email address. Please check your inbox and spam folder.'
              : 'Enter your email address and we\'ll send you a link to reset your password.'
            }
          </p>
        </CardHeader>
        <CardContent>
          {!resetEmailSent ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={resetLoading}
                />
              </div>
              
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={resetLoading || !resetEmail}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Email'}
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={onBack}
                  disabled={resetLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setResetEmailSent(false);
                  setResetEmail('');
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="ghost"
                className="w-full"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForgotPasswordForm;
