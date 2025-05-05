
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="container mx-auto px-4 py-12 border-t">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0">
          <img src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" alt="DuitTemanseru Logo" className="h-8" />
          <p className="text-gray-600 dark:text-gray-400 mt-2">© 2025 CatatYo!. All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap gap-8 justify-center">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Features</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Pricing</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Download</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-[#28e57d] dark:text-gray-400">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
