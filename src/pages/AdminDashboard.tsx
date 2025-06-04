
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
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            Admin Dashboard
          </h1>
          <p className="text-slate-600">
            Manage users, content, and system settings
          </p>
        </div>
        
        {/* Stats Section */}
        <ErrorBoundary>
          <AdminDashboardStats />
        </ErrorBoundary>
        
        {/* Tabs Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <ErrorBoundary>
            <Tabs defaultValue="users" className="w-full">
              <div className="border-b border-slate-200 px-4 sm:px-6 pt-6">
                <TabsList className="mb-4 w-full sm:w-auto">
                  <TabsTrigger value="users" className="flex-1 sm:flex-none">Users</TabsTrigger>
                  <TabsTrigger value="notifications" className="flex-1 sm:flex-none">Notifications</TabsTrigger>
                  <TabsTrigger value="branding" className="flex-1 sm:flex-none">Branding</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-4 sm:p-6">
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
    </DashboardLayout>
  );
};

export default AdminDashboard;
