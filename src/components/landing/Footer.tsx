import React from 'react';
import { Link } from 'react-router-dom';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage

const Footer = () => {
  const { logoUrl } = useBrandingAssets();
  const { t } = useLanguage(); // Use the language hook
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={logoUrl || "/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png"} 
                alt="App Logo" 
                className="h-8 object-contain" 
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
              {t('app.tagline')} {/* Using translation key */}
            </p>
            
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t('footer.pages')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  {t('footer.pricing')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  {t('footer.contact')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">{t('footer.legal')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('footer.copyright', { year: currentYear.toString() })}
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('footer.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;