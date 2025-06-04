
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { EntrepreneurModeProvider } from '@/contexts/EntrepreneurModeContext';
import { GoalsProvider } from '@/contexts/goals/GoalsProvider';
import { InvoiceCustomizationProvider } from '@/contexts/InvoiceCustomizationContext';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { ThemeProvider } from 'next-themes';

// Import pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Transactions from '@/pages/Transactions';
import Budget from '@/pages/Budget';
import Goals from '@/pages/Goals';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Notifications from '@/pages/Notifications';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import Feedback from '@/pages/Feedback';
import AdminDashboard from '@/pages/AdminDashboard';

// Entrepreneur pages
import EntrepreneurDashboard from '@/pages/entrepreneur/Dashboard';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Customers from '@/pages/Customers';
import EntrepreneurInvoices from '@/pages/entrepreneur/Invoices';
import EntrepreneurPosRefactored from '@/pages/entrepreneur/PosRefactored';
import BusinessTransactions from '@/pages/BusinessTransactions';
import BusinessIncome from '@/pages/BusinessIncome';
import BusinessExpenses from '@/pages/BusinessExpenses';
import FinanceReports from '@/pages/entrepreneur/FinanceReports';
import ProfitLoss from '@/pages/entrepreneur/ProfitLoss';
import Calculator from '@/pages/entrepreneur/Calculator';
import GoalsCollaborationDocs from '@/pages/GoalsCollaborationDocs';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <EntrepreneurModeProvider>
              <GoalsProvider>
                <InvoiceCustomizationProvider>
                  <Router>
                    <ScrollToTop />
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/goals-collaboration" element={<GoalsCollaborationDocs />} />
                      
                      {/* Protected routes */}
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                      <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
                      <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                      
                      {/* Entrepreneur routes */}
                      <Route path="/entrepreneur" element={<ProtectedRoute><EntrepreneurDashboard /></ProtectedRoute>} />
                      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                      <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                      <Route path="/invoices" element={<ProtectedRoute><EntrepreneurInvoices /></ProtectedRoute>} />
                      <Route path="/pos" element={<ProtectedRoute><EntrepreneurPosRefactored /></ProtectedRoute>} />
                      <Route path="/business-transactions" element={<ProtectedRoute><BusinessTransactions /></ProtectedRoute>} />
                      <Route path="/business-income" element={<ProtectedRoute><BusinessIncome /></ProtectedRoute>} />
                      <Route path="/business-expenses" element={<ProtectedRoute><BusinessExpenses /></ProtectedRoute>} />
                      <Route path="/finance-reports" element={<ProtectedRoute><FinanceReports /></ProtectedRoute>} />
                      <Route path="/profit-loss" element={<ProtectedRoute><ProfitLoss /></ProtectedRoute>} />
                      <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
                      
                      {/* 404 route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster position="top-right" />
                  </Router>
                </InvoiceCustomizationProvider>
              </GoalsProvider>
            </EntrepreneurModeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
