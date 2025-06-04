
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDashboardStats from '@/components/admin/AdminDashboardStats';
import UsersTab from '@/components/admin/UsersTab';
import NotificationsTab from '@/components/admin/NotificationsTab';
import BrandingTab from '@/components/admin/BrandingTab';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const AdminDashboard = () => {
  return (
    <DashboardLayout isAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600">
                  Manage users, content, and system settings
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="mb-8">
            <ErrorBoundary>
              <AdminDashboardStats />
            </ErrorBoundary>
          </div>
          
          {/* Tabs Section */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <ErrorBoundary>
              <Tabs defaultValue="users" className="w-full">
                <div className="border-b border-slate-200 px-6 pt-6">
                  <TabsList className="mb-4">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="branding">Branding</TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-6">
                  <TabsContent value="users" className="mt-0">
                    <UsersTab />
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="mt-0">
                    <NotificationsTab />
                  </TabsContent>
                  
                  <TabsContent value="branding" className="mt-0">
                    <BrandingTab />
                  </TabsContent>
                </div>
              </Tabs>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
