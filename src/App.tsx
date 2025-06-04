
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { InvoiceCustomizationProvider } from "@/contexts/InvoiceCustomizationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import Budgets from "@/pages/Budgets";
import Goals from "@/pages/Goals";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import Customers from "@/pages/Customers";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import Invoices from "@/pages/Invoices";
import Calculator from "@/pages/entrepreneur/Calculator";
import Pos from "@/pages/entrepreneur/Pos";
import PosRefactored from "@/pages/entrepreneur/PosRefactored";
import FinancialReports from "@/pages/FinancialReports"; // New combined page
import ResetPassword from "@/pages/ResetPassword";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <InvoiceCustomizationProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard/:type" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                
                {/* Entrepreneur routes */}
                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
                <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
                <Route path="/pos" element={<ProtectedRoute><PosRefactored /></ProtectedRoute>} />
                
                {/* Combined Financial Reports (replaces profit-loss and reports) */}
                <Route path="/financial-reports" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />
                
                {/* Legacy routes for backwards compatibility */}
                <Route path="/profit-loss" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />
              </Routes>
            </TooltipProvider>
          </InvoiceCustomizationProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
