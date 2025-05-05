
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Users, UserCheck } from 'lucide-react';
import StatCard from './StatCard';

const AdminDashboardStats = () => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title={t('admin.users')} 
        queryKey="admin-users-total"
        icon={<Users size={20} />} 
        variant="purple" 
      />
      <StatCard 
        title={t('admin.premium')} 
        queryKey="admin-users-premium"
        filterFn={(u) => u.role === 'premium'}
        icon={<UserCheck size={20} className="text-purple-500" />} 
        trend={{ value: 8.5, isPositive: true }} 
        variant="purple" 
      />
      <StatCard 
        title={t('admin.free')} 
        queryKey="admin-users-free"
        filterFn={(u) => u.role === 'free'}
        icon={<Users size={20} className="text-teal-500" />} 
        trend={{ value: 12, isPositive: true }} 
        variant="teal" 
      />
    </div>
  );
};

export default AdminDashboardStats;
