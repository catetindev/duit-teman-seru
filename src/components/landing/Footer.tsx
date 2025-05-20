
import React from 'react';
import { Link } from 'react-router-dom';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const { logoUrl } = useBrandingAssets();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src={logoUrl || "/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png"} 
                alt="Catatyo Logo" 
                className="h-8 object-contain" 
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
              Aplikasi pencatat keuangan yang simpel dan menyenangkan untuk Gen Z. Catat, kelola, dan raih mimpimu!
            </p>
            
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#28e57d] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#28e57d] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#28e57d] transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Halaman</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Harga
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} Catatyo. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">Made with 💚 in Indonesia</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
