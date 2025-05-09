
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';

const PageHeader = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const goToSignup = () => {
    navigate('/signup');
  };
  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" 
            alt="DuitTemanseru Logo" 
            className="h-8 md:h-10 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button onClick={() => navigate('/login')} variant="outline" size="sm">{t('auth.login')}</Button>
          <Button onClick={goToSignup} size="sm" className="border border-[#28e57d] bg-white text-black hover:bg-[#28e57d]/10 hover:scale-[1.03] transition-all">{t('auth.signup')}</Button>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
