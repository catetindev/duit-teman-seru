
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Toaster } from '@/components/ui/sonner';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import Analytics from '@/pages/Analytics';
import Budget from '@/pages/Budget';
import Settings from '@/pages/Settings';
import AdminDashboard from '@/pages/AdminDashboard';
import Transactions from '@/pages/Transactions';
import { AuthProvider } from '@/contexts/AuthContext';
import Pricing from '@/pages/Pricing';
import Notifications from '@/pages/Notifications';
import Goals from '@/pages/Goals';
import GoalCollaborationDocs from '@/pages/GoalCollaborationDocs'; // Add this import

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/budgets" element={<Budget />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goals/collaboration-docs" element={<GoalCollaborationDocs />} /> {/* Add this route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
