
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
      
      <div className="grid grid-cols-3 gap-4">
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onSocialLogin('google')}
          className="flex justify-center items-center h-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.255H17.92C17.66 15.63 16.89 16.795 15.72 17.575V20.335H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
            <path d="M12 23C14.97 23 17.46 22.015 19.28 20.335L15.72 17.575C14.74 18.235 13.48 18.625 12 18.625C9.13504 18.625 6.71004 16.685 5.84504 14.09H2.17004V16.94C3.98004 20.535 7.70004 23 12 23Z" fill="#34A853"/>
            <path d="M5.84501 14.0899C5.62501 13.4299 5.50001 12.7249 5.50001 11.9999C5.50001 11.2749 5.63001 10.5699 5.84501 9.90992V7.05992H2.17001C1.40001 8.59492 0.950012 10.2849 0.950012 11.9999C0.950012 13.7149 1.40001 15.4049 2.17001 16.9399L5.84501 14.0899Z" fill="#FBBC05"/>
            <path d="M12 5.375C13.62 5.375 15.06 5.93 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.70004 1 3.98004 3.465 2.17004 7.06L5.84504 9.91C6.71004 7.315 9.13504 5.375 12 5.375Z" fill="#EA4335"/>
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onSocialLogin('apple')}
          className="flex justify-center items-center h-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.05 12.536C17.0346 10.7548 17.9769 9.34557 19.879 8.2569C18.8414 6.73553 17.2795 5.91025 15.2489 5.77262C13.3184 5.63499 11.2204 6.90578 10.4019 6.90578C9.54932 6.90578 7.68639 5.82034 6.16985 5.82034C3.51456 5.85812 0.699997 7.93274 0.699997 12.1428C0.699997 13.5144 0.941728 14.9327 1.42519 16.3978C2.06547 18.2883 4.22899 22.2879 6.47788 22.2312C7.74695 22.2028 8.63454 21.3114 10.2821 21.3114C11.8831 21.3114 12.7047 22.2312 14.1583 22.2312C16.429 22.2028 18.3816 18.6283 18.9896 16.7379C16.0768 15.3473 17.05 12.6356 17.05 12.536ZM14.0146 3.93628C15.6014 2.05577 15.4576 0.303223 15.4296 -0.000488281C14.0146 0.0747723 12.3817 0.955111 11.4942 2.01055C10.5164 3.12932 10.0609 4.47678 10.143 5.76018C11.6659 5.86449 13.0524 5.05913 14.0146 3.93628Z" fill="black"/>
          </svg>
        </motion.button>
        
        <motion.button
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onSocialLogin('facebook')}
          className="flex justify-center items-center h-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="#1877F2"/>
            <path d="M16.6711 15.4688L17.2031 12H13.875V9.75C13.875 8.80102 14.34 7.875 15.8306 7.875H17.3438V4.92188C17.3438 4.92188 15.9705 4.6875 14.6576 4.6875C11.9166 4.6875 10.125 6.34875 10.125 9.35625V12H7.07812V15.4688H10.125V23.8542C11.3674 24.0486 12.6326 24.0486 13.875 23.8542V15.4688H16.6711Z" fill="white"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

export default SocialLoginButtons;
