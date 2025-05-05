
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12 mt-16 md:mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              Welcome to CatatYo! By accessing or using our services, you agree to the following terms:
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Eligibility</h2>
            <p>You must be at least 13 years old to use this app.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Account Security</h2>
            <p>You are responsible for any activity that occurs under your account.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Use of the App</h2>
            <p>You agree not to misuse the app or use it for any unlawful purpose.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Subscription</h2>
            <p>Some features may require a paid subscription. You will be notified of any changes to pricing.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Termination</h2>
            <p>We reserve the right to suspend or terminate your account for violating these terms.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Limitation of Liability</h2>
            <p>We are not liable for any indirect or consequential damages.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Changes to Terms</h2>
            <p>We may update these terms. Continued use means you accept the new terms.</p>
            
            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
              <p className="font-medium">If you have any questions, please contact us at halo@catatyo.com.</p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
