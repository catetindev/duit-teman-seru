
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" 
                alt="Catatyo Logo" 
                className="h-8 object-contain" 
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-sm">
              Manage your money without stress. Simple, fun, and made for you.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.272.636 1.772 1.153.509.5.902 1.105 1.153 1.772.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772c-.5.5-1.105.902-1.772 1.153-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427.25-.668.636-1.272 1.153-1.772.5-.509 1.105-.902 1.772-1.153.636-.247 1.363-.416 2.427-.465 1.067-.048 1.407-.06 4.123-.06h.08zm-.717 1.442h-.718c-2.136 0-2.389.007-3.232.046-.78.035-1.204.166-1.486.275-.373.145-.64.318-.92.598-.28.28-.453.547-.598.92-.11.281-.24.705-.275 1.485-.039.843-.047 1.096-.047 3.231s.008 2.389.047 3.232c.035.78.166 1.203.275 1.485.145.373.319.64.599.92.28.28.546.453.92.598.28.11.704.24 1.485.275.843.039 1.096.047 3.231.047s2.389-.008 3.232-.047c.78-.035 1.203-.166 1.485-.275.373-.145.64-.319.92-.599.28-.28.453-.546.598-.92.11-.28.24-.704.275-1.485.039-.843.047-1.096.047-3.232s-.008-2.389-.047-3.231c-.035-.78-.166-1.204-.275-1.486-.145-.373-.319-.64-.599-.92-.28-.28-.546-.453-.92-.598-.281-.11-.704-.24-1.485-.275-.843-.039-1.096-.047-3.232-.047z" clipRule="evenodd"/>
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Pages</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-[#28e57d]">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Catatyo. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Made with 💚 for Gen Z
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
