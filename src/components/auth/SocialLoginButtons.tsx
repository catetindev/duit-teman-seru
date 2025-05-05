
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

type SocialProvider = 'google' | 'apple' | 'facebook';

interface SocialLoginButtonsProps {
  onSocialLogin: (provider: SocialProvider) => void;
}

const SocialLoginButtons = ({ onSocialLogin }: SocialLoginButtonsProps) => {
  const { language } = useLanguage();
  
  return (
    <div className="mt-6">
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
        <span className="flex-shrink mx-4 text-sm text-gray-600 dark:text-gray-400">
          {language === 'en' ? 'Or continue with' : 'Atau lanjutkan dengan'}
        </span>
        <div className="flex-grow border-t border-gray-200 dark:border-gray-800"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onSocialLogin('google')}
          className="flex justify-center items-center h-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.66 15.63 16.89 16.795 15.72 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
            <path d="M12 23C14.97 23 17.46 22.015 19.28 20.335L15.72 17.575C14.74 18.235 13.48 18.625 12 18.625C9.13504 18.625 6.71004 16.685 5.84504 14.09H2.17004V16.94C3.98004 20.535 7.70004 23 12 23Z" fill="#34A853"/>
            <path d="M5.84501 14.0899C5.62501 13.4299 5.50001 12.7249 5.50001 11.9999C5.50001 11.2749 5.63001 10.5699 5.84501 9.90992V7.05992H2.17001C1.40001 8.59492 0.950012 10.2849 0.950012 11.9999C0.950012 13.7149 1.40001 15.4049 2.17001 16.9399L5.84501 14.0899Z" fill="#FBBC05"/>
            <path d="M12 5.375C13.62 5.375 15.06 5.93 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.70004 1 3.98004 3.465 2.17004 7.06L5.84504 9.91C6.71004 7.315 9.13504 5.375 12 5.375Z" fill="#EA4335"/>
          </svg>
          <span>Sign in with Google</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
