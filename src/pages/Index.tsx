
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  // Demo login functions
  const loginAsFreeUser = () => {
    navigate('/dashboard');
  };
  
  const loginAsPremiumUser = () => {
    navigate('/dashboard/premium');
  };
  
  const loginAsAdmin = () => {
    navigate('/admin');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg w-10 h-10 flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-2xl font-outfit font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            {t('app.name')}
          </span>
        </div>
        <LanguageToggle />
      </header>
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-outfit font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {t('app.tagline')}
            </span>
          </h1>
          
          <p className="text-xl mb-8 text-muted-foreground">
            {t('app.tagline')} 💸✨
          </p>
          
          <div className="grid gap-4 md:grid-cols-3 mb-12">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2 emoji-bounce">👋</div>
              <h3 className="text-lg font-bold mb-2">Free Account</h3>
              <p className="text-muted-foreground mb-4">Track expenses, set a savings goal, and get started!</p>
              <Button onClick={loginAsFreeUser} className="w-full">Demo Free User</Button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
              <div className="text-3xl mb-2 emoji-bounce">✨</div>
              <h3 className="text-lg font-bold mb-2">Premium Account</h3>
              <p className="text-purple-100 mb-4">Unlimited goals, automatic tracking, and more features!</p>
              <Button onClick={loginAsPremiumUser} variant="secondary" className="w-full">Demo Premium User</Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="text-3xl mb-2 emoji-bounce">👩‍💼</div>
              <h3 className="text-lg font-bold mb-2">Admin Dashboard</h3>
              <p className="text-muted-foreground mb-4">Manage users, content, and system settings</p>
              <Button onClick={loginAsAdmin} variant="outline" className="w-full">Demo Admin</Button>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <img src="https://placehold.co/200x400/teal/white?text=Mobile+App+Demo" alt="Mobile App Preview" className="rounded-xl shadow-lg h-96 object-cover" />
            <img src="https://placehold.co/200x400/purple/white?text=Mobile+App+Demo" alt="Mobile App Preview" className="rounded-xl shadow-lg h-96 object-cover" />
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>&copy; 2025 DuitTemanseru. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
