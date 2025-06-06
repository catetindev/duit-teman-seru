import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';
import { Menu, X } from 'lucide-react';
const Navbar = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const {
    logoUrl
  } = useBrandingAssets();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation functions
  const goToLogin = () => navigate('/login');
  const goToPricing = () => navigate('/pricing');
  const goToSignup = () => navigate('/signup');
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'backdrop-blur-lg bg-white/90 dark:bg-gray-900/90 shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoUrl || "/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png"} alt="Catatyo Logo" className="h-8 md:h-10 w-auto object-contain" />
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            
            
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <Button onClick={goToLogin} variant="outline" className="transition-all hover:scale-[1.03]">
            {t('auth.login')}
          </Button>
          <Button onClick={goToSignup} className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white hover:scale-[1.03] transition-all font-medium rounded-xl">
            {t('auth.signup')}
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageToggle />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="ml-2">
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg p-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            <Link to="/pricing" className="flex w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Harga
            </Link>
            <Link to="/about" className="flex w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              Tentang Kami
            </Link>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <Button onClick={goToLogin} variant="outline" className="w-full justify-start">
              {t('auth.login')}
            </Button>
            <Button onClick={goToSignup} className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white w-full justify-start">
              {t('auth.signup')}
            </Button>
          </div>
        </div>}
    </header>;
};
export default Navbar;