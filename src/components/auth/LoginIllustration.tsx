
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

const LoginIllustration = () => {
  const { language } = useLanguage();
  const { backgroundUrl } = useBrandingAssets();
  
  return (
    <div 
      className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute bottom-12 left-12 right-12 bg-white/80 backdrop-blur-sm p-5 rounded-lg">
        <h1 className="text-4xl font-outfit font-bold mb-4">
          {language === 'en' ? 'Sign In to' : 'Masuk ke'}
          <span className="block">Catatuy</span>
        </h1>
        <p className="text-gray-700">
          {language === 'en' ? 'If you don\'t have an account' : 'Jika belum punya akun'}{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
            {language === 'en' ? 'Register here!' : 'Daftar di sini!'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginIllustration;
