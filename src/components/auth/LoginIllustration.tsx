
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

const LoginIllustration = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 items-center justify-center relative overflow-hidden">
      <div className="absolute w-full h-full">
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" 
              alt="Catatuy Logo" 
              className="h-12 object-contain" 
            />
          </Link>
        </div>
      </div>
      <img 
        src="public/lovable-uploads/d75492ea-96d6-43e6-ab44-7a8b36916d0f.png" 
        alt="Person waving" 
        className="w-3/4 max-w-md z-10"
      />
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
