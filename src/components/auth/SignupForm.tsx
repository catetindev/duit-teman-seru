import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SignupFormHeader } from './signup/SignupFormHeader';
import { SocialLoginButton } from './signup/SocialLoginButton';
import { useAuth } from '@/contexts/AuthContext';

interface SignupFormProps {
  logoUrl: string | null;
}

const SignupForm: React.FC<SignupFormProps> = ({ logoUrl }) => {
  const { t } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeTerms: checked
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and privacy policy");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the signup method from AuthContext that now properly handles full_name
      const error = await signup(formData.email, formData.password, formData.name);
      
      if (error) {
        throw error;
      }
      
      // If signup successful, show success message and redirect
      toast.success(t('auth.signupSuccess') || "Sign up successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error: any) {
      toast.error(error.message || t('auth.signupFailed'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <SignupFormHeader logoUrl={logoUrl} />
      
      <form onSubmit={handleSignup} className="space-y-5">
        <FormField
          id="name"
          label="Full Name"
          type="text"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="hello@example.com"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        
        <FormField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />
        
        <div className="flex items-start space-x-2 my-4">
          <Checkbox 
            id="agreeTerms" 
            checked={formData.agreeTerms} 
            onCheckedChange={handleCheckboxChange}
            className="mt-1"
            disabled={isLoading}
          />
          <label
            htmlFor="agreeTerms"
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            I agree to the <Link to="/terms" className="text-[#28e57d] hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#28e57d] hover:underline">Privacy Policy</Link>
          </label>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !formData.agreeTerms}
          className="w-full h-12 bg-[#28e57d] hover:bg-[#28e57d]/90 text-white rounded-lg font-medium transition-all hover:shadow-md"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></span>
              Creating Account...
            </span>
          ) : (
            "Sign Up"
          )}
        </Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or continue with</span>
          </div>
        </div>
        
        <SocialLoginButton 
          provider="google"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        />
        
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Have an account?{" "}
            <Link to="/login" className="text-[#28e57d] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  required: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  disabled,
  required
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="h-12 rounded-lg"
        disabled={disabled}
      />
    </div>
  );
};

export default SignupForm;
