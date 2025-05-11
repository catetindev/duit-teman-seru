
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from '@/pages/Index';
import Signup from '@/pages/Signup';
import Login from '@/pages/Login';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Pricing from '@/pages/Pricing';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import Transactions from '@/pages/Transactions';
import Budget from '@/pages/Budget';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Notifications from '@/pages/Notifications';
import Feedback from '@/pages/Feedback';
import AdminDashboard from '@/pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import GoalsCollaborationDocs from '@/pages/GoalsCollaborationDocs';
import Calculator from './pages/entrepreneur/Calculator';
// Import our new pages
import Products from './pages/Products';
import Customers from './pages/Customers';
import Orders from './pages/Orders';

// App component to handle page routing
const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/goals-collaboration-docs" element={<GoalsCollaborationDocs />} />
        
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/analytics" element={
            <ProtectedRoute premium>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/feedback" element={<Feedback />} />
          
          {/* Entrepreneur Mode Routes */}
          <Route path="/products" element={<ProtectedRoute premium><Products /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute premium><Orders /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute premium><Customers /></ProtectedRoute>} />
          <Route path="/profit-loss" element={<ProtectedRoute premium><div>Profit & Loss Reports</div></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute premium><Calculator /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute premium><div>Invoice Generator</div></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute premium><div>Finance & Reports</div></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute admin>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
