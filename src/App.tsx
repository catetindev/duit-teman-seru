import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/hooks/useLanguage";
import { InvoiceCustomizationProvider } from "@/contexts/InvoiceCustomizationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Budget from "@/pages/Budget";
import Goals from "@/pages/Goals";
import Settings from "@/pages/Settings";
import AdminDashboard from "@/pages/AdminDashboard";
import Customers from "@/pages/Customers";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import Invoices from "@/pages/Invoices";
import Calculator from "@/pages/entrepreneur/Calculator";
import Pos from "@/pages/entrepreneur/Pos";
import PosRefactored from "@/pages/entrepreneur/PosRefactored";
import ProfitLoss from "@/pages/entrepreneur/ProfitLoss";
import BusinessIncome from "@/pages/BusinessIncome";
import BusinessExpenses from "@/pages/BusinessExpenses";
import ResetPassword from "@/pages/ResetPassword";
import Feedback from "@/pages/Feedback";
import Transactions from "@/pages/Transactions";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/feedback" element={<Feedback />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/:type" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        
        {/* Entrepreneur routes */}
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
        <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
        <Route path="/pos" element={<ProtectedRoute><PosRefactored /></ProtectedRoute>} />
        
        {/* Business Finance routes */}
        <Route path="/business-income" element={<ProtectedRoute><BusinessIncome /></ProtectedRoute>} />
        <Route path="/business-expenses" element={<ProtectedRoute><BusinessExpenses /></ProtectedRoute>} />
        
        {/* Profit Loss Report */}
        <Route path="/profit-loss" element={<ProtectedRoute><ProfitLoss /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
