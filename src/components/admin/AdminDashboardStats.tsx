
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import StatCard from '@/components/ui/StatCard';
import { Users, UserCheck } from 'lucide-react';

const AdminDashboardStats = () => {
  const { t } = useLanguage();

  // Fetch users for stats
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title={t('admin.users')} 
        value={users.length.toString()} 
        icon={<Users size={20} />} 
        variant="purple" 
      />
      <StatCard 
        title={t('admin.premium')} 
        value={users.filter(u => u.role === 'premium').length.toString()} 
        icon={<UserCheck size={20} className="text-purple-500" />} 
        trend={{ value: 8.5, isPositive: true }} 
        variant="purple" 
      />
      <StatCard 
        title={t('admin.free')} 
        value={users.filter(u => u.role === 'free').length.toString()} 
        icon={<Users size={20} className="text-teal-500" />} 
        trend={{ value: 12, isPositive: true }} 
        variant="teal" 
      />
    </div>
  );
};

export default AdminDashboardStats;
