import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './hooks/useLanguage'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);