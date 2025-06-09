
import React from 'react';
import { Check, X, AlertTriangle, Shield } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/securityUtils';
import { Progress } from '@/components/ui/progress';

interface EnhancedPasswordValidationProps {
  password: string;
  confirmPassword?: string;
  showStrengthMeter?: boolean;
}

const EnhancedPasswordValidation: React.FC<EnhancedPasswordValidationProps> = ({
  password,
  confirmPassword,
  showStrengthMeter = true
}) => {
  const validation = validatePasswordStrength(password);
  const passwordsMatch = confirmPassword ? password === confirmPassword : true;
  
  const getStrengthColor = (score: number) => {
    if (score < 2) return 'text-red-600';
    if (score < 4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStrengthText = (score: number) => {
    if (score < 2) return 'Weak';
    if (score < 4) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      {showStrengthMeter && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Password Strength</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Progress 
              value={(validation.score / 5) * 100} 
              className="flex-1 h-2"
            />
            <span className={`text-sm font-medium ${getStrengthColor(validation.score)}`}>
              {getStrengthText(validation.score)}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {validation.feedback.map((feedback, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <X className="h-3 w-3 text-red-500 flex-shrink-0" />
            <span className="text-red-600">{feedback}</span>
          </div>
        ))}
        
        {validation.isValid && (
          <div className="flex items-center gap-2 text-sm">
            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
            <span className="text-green-600">Password meets security requirements</span>
          </div>
        )}
      </div>

      {confirmPassword && (
        <div className="flex items-center gap-2 text-sm">
          {passwordsMatch ? (
            <>
              <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span className="text-green-600">Passwords match</span>
            </>
          ) : (
            <>
              <X className="h-3 w-3 text-red-500 flex-shrink-0" />
              <span className="text-red-600">Passwords do not match</span>
            </>
          )}
        </div>
      )}
      
      {validation.score < 3 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Security Tip:</p>
            <p>Use a mix of uppercase, lowercase, numbers, and special characters for better security.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedPasswordValidation;
