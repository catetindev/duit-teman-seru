
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Welcome to Catatyo! By accessing or using our services, you agree to the following terms:
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Eligibility</h2>
            <p>
              You must be at least 13 years old to use this app.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Account Security</h2>
            <p>
              You are responsible for any activity that occurs under your account.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Use of the App</h2>
            <p>
              You agree not to misuse the app or use it for any unlawful purpose.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Subscription</h2>
            <p>
              Some features may require a paid subscription. 
              You will be notified of any changes to pricing.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account for violating these terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
            <p>
              We are not liable for any indirect or consequential damages.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
            <p>
              We may update these terms. Continued use means you accept the new terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions, please contact us at <a href="mailto:halo@catatyo.com" className="text-[#28e57d] hover:underline">halo@catatyo.com</a>.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
