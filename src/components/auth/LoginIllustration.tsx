
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

const LoginIllustration = () => {
  const { t, language } = useLanguage();
  const { logoUrl, backgroundUrl } = useBrandingAssets();
  
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 items-center justify-center relative overflow-hidden">
      <div className="absolute w-full h-full">
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2">
            {logoUrl && (
              <img 
                src={logoUrl}
                alt="App Logo" 
                className="h-12 object-contain" 
              />
            )}
          </Link>
        </div>
      </div>
      {backgroundUrl && (
        <img 
          src={backgroundUrl}
          alt="Financial freedom illustration" 
          className="w-3/4 max-w-md z-10 object-contain rounded-xl"
        />
      )}
      <div className="absolute bottom-12 left-12 right-12">
        <h1 className="text-4xl font-outfit font-bold mb-4">
          {language === 'en' ? 'Sign In to' : 'Masuk ke'}
          <span className="block">Catatuy</span>
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          {language === 'en' ? 'If you don\'t have an account' : 'Jika belum punya akun'}{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium">
            {language === 'en' ? 'Register here!' : 'Daftar di sini!'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginIllustration;
