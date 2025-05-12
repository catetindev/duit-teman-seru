
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import Transactions from '@/pages/Transactions';
import Goals from '@/pages/Goals';
import Analytics from '@/pages/Analytics';
import Budget from '@/pages/Budget';
import Notifications from '@/pages/Notifications';
import About from '@/pages/About';
import Settings from '@/pages/Settings';
import Pricing from '@/pages/Pricing';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import AdminDashboard from '@/pages/AdminDashboard';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Customers from '@/pages/Customers';
import { RoutePreserver } from '@/components/layout/RoutePreserver';
import { InvoiceCustomizationProvider } from '@/contexts/InvoiceCustomizationContext';

import PosRefactored from '@/pages/entrepreneur/PosRefactored';
import FinanceReports from '@/pages/entrepreneur/FinanceReports';
import InvoicesRefactored from '@/pages/entrepreneur/InvoicesRefactored';

function App() {
  return (
    <InvoiceCustomizationProvider>
      <ScrollToTop />
      <RoutePreserver />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/:type" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute admin={true}><AdminDashboard /></ProtectedRoute>} />
        
        {/* Entrepreneur Routes */}
        <Route path="/pos" element={<ProtectedRoute><PosRefactored /></ProtectedRoute>} />
        <Route path="/finance-reports" element={<ProtectedRoute><FinanceReports /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><InvoicesRefactored /></ProtectedRoute>} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Toast notifications */}
      <Toaster />
      <Sonner />
    </InvoiceCustomizationProvider>
  );
}

export default App;
