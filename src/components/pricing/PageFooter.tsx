
import { useLanguage } from '@/hooks/useLanguage';

const PageFooter = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="container mx-auto px-4 py-8 text-center text-gray-500 mt-12">
      <p>&copy; 2025 Catatyo. {t('landing.footer.allRights')}</p>
    </footer>
  );
};

export default PageFooter;
