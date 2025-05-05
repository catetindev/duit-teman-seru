
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>We value your privacy and are committed to protecting your personal information.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Collection</h2>
            <p>
              We collect basic information such as name, email, and usage behavior 
              for the purpose of improving our app.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Data</h2>
            <p>
              Your data is used only for service improvements and is never sold to third parties.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Services</h2>
            <p>
              We may use tools like Google Analytics or authentication, which follow their own privacy policies.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p>
              You can request to access, update, or delete your data at any time.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
            <p>
              We take reasonable measures to secure your data.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Policy</h2>
            <p>
              Updates to this policy will be posted on this page.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              Questions? Contact us at <a href="mailto:halo@catatyo.com" className="text-[#28e57d] hover:underline">halo@catatyo.com</a>.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
