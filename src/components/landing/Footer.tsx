
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="container mx-auto px-4 py-12 border-t">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <Link to="/">
            <img src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" alt="DuitTemanseru Logo" className="h-8" />
          </Link>
          <p className="text-gray-600 dark:text-gray-400 mt-2">© 2025 CatatYo!. All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 justify-center">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Pricing</Link></li>
              <li><Link to="/features" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Features</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">About</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Blog</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
