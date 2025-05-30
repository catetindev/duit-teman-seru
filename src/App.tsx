
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/hooks/useLanguage';
import { EntrepreneurModeProvider } from '@/contexts/EntrepreneurModeContext';

// Page imports
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Goals from '@/pages/Goals';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Budget from '@/pages/Budget';
import Pricing from '@/pages/Pricing';
import Notifications from '@/pages/Notifications';
import Feedback from '@/pages/Feedback';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Customers from '@/pages/Customers';
import Calculator from '@/pages/entrepreneur/Calculator';
import Invoices from '@/pages/entrepreneur/Invoices';
import ProfitLoss from '@/pages/entrepreneur/ProfitLoss';
import FinanceReports from '@/pages/entrepreneur/FinanceReports';
import BusinessTransactions from '@/pages/BusinessTransactions';
import BusinessIncome from '@/pages/BusinessIncome';
import BusinessExpenses from '@/pages/BusinessExpenses';

// Components
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <EntrepreneurModeProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard/:type" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/transactions" 
                element={
                  <ProtectedRoute>
                    <Transactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business-transactions" 
                element={
                  <ProtectedRoute>
                    <BusinessTransactions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business-income" 
                element={
                  <ProtectedRoute>
                    <BusinessIncome />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business-expenses" 
                element={
                  <ProtectedRoute>
                    <BusinessExpenses />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/goals" 
                element={
                  <ProtectedRoute>
                    <Goals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/budget" 
                element={
                  <ProtectedRoute>
                    <Budget />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pricing" 
                element={
                  <ProtectedRoute>
                    <Pricing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute>
                    <Feedback />
                  </ProtectedRoute>
                } 
              />
              
              {/* Entrepreneur routes */}
              <Route 
                path="/products" 
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/customers" 
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calculator" 
                element={
                  <ProtectedRoute>
                    <Calculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/invoices" 
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profit-loss" 
                element={
                  <ProtectedRoute>
                    <ProfitLoss />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/finance-reports" 
                element={
                  <ProtectedRoute>
                    <FinanceReports />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Toaster />
          </EntrepreneurModeProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
