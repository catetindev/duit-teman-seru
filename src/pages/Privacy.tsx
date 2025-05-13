import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage

const Privacy = () => {
  const { t } = useLanguage(); // Use the language hook

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-white">
        <div className="container mx-auto px-4 py-20 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8">{t('privacy.title')}</h1>
          
          <div className="prose prose-lg max-w-none">
            <p>{t('privacy.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.dataCollection.title')}</h2>
            <p>{t('privacy.dataCollection.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.useOfData.title')}</h2>
            <p>{t('privacy.useOfData.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.thirdParty.title')}</h2>
            <p>{t('privacy.thirdParty.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.yourRights.title')}</h2>
            <p>{t('privacy.yourRights.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.security.title')}</h2>
            <p>{t('privacy.security.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.changes.title')}</h2>
            <p>{t('privacy.changes.p1')}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('privacy.contactUs.title')}</h2>
            <p dangerouslySetInnerHTML={{ __html: t('privacy.contactUs.p1') }} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;