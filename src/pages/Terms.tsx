import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage

const Terms = () => {
  const { t } = useLanguage(); // Use the language hook

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">{t('terms.title')}</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>{t('terms.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.eligibility.title')}</h2>
            <p>{t('terms.eligibility.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.accountSecurity.title')}</h2>
            <p>{t('terms.accountSecurity.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.useOfApp.title')}</h2>
            <p>{t('terms.useOfApp.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.subscription.title')}</h2>
            <p>{t('terms.subscription.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.termination.title')}</h2>
            <p>{t('terms.termination.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.liability.title')}</h2>
            <p>{t('terms.liability.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.changes.title')}</h2>
            <p>{t('terms.changes.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('terms.contactUs.title')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t('terms.contactUs.p1') }} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;