
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './hooks/useLanguage'
import { TooltipProvider } from '@/components/ui/tooltip'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <LanguageProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </LanguageProvider>
  </AuthProvider>
);
