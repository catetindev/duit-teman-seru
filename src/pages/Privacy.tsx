
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const Privacy = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              We value your privacy and are committed to protecting your personal information.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Data Collection</h2>
            <p>We collect basic information such as name, email, and usage behavior for the purpose of improving our app.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Use of Data</h2>
            <p>Your data is used only for service improvements and is never sold to third parties.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Third-Party Services</h2>
            <p>We may use tools like Google Analytics or authentication, which follow their own privacy policies.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Your Rights</h2>
            <p>You can request to access, update, or delete your data at any time.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Security</h2>
            <p>We take reasonable measures to secure your data.</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-3">Changes to Policy</h2>
            <p>Updates to this policy will be posted on this page.</p>
            
            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
              <p className="font-medium">Questions? Contact us at halo@catatyo.com.</p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
