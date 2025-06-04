
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
        <div className="text-center lg:text-left space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
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
              <div className="border-b border-slate-200 p-6">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="users" className="flex-1 sm:flex-none px-6 py-3">Users</TabsTrigger>
                  <TabsTrigger value="notifications" className="flex-1 sm:flex-none px-6 py-3">Notifications</TabsTrigger>
                  <TabsTrigger value="branding" className="flex-1 sm:flex-none px-6 py-3">Branding</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6 sm:p-8">
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
