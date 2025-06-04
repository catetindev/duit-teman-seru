
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './hooks/useLanguage'
import { EntrepreneurModeProvider } from './contexts/EntrepreneurModeContext'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { InvoiceCustomizationProvider } from '@/contexts/InvoiceCustomizationContext'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <EntrepreneurModeProvider>
            <TooltipProvider>
              <InvoiceCustomizationProvider>
                <App />
              </InvoiceCustomizationProvider>
            </TooltipProvider>
          </EntrepreneurModeProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
