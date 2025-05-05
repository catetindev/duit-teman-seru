
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import StatCardBase from '@/components/ui/StatCard';
import { useQuery } from '@tanstack/react-query';

interface StatCardProps {
  title: string;
  queryKey: string;
  filterFn?: (user: any) => boolean;
  icon: React.ReactNode;
  variant?: 'default' | 'teal' | 'purple' | 'orange';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  queryKey, 
  filterFn = () => true,
  icon, 
  variant = 'default',
  trend 
}) => {
  const { data: users = [] } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return data;
    }
  });

  const filteredUsers = users.filter(filterFn);
  const value = filteredUsers.length.toString();

  return (
    <StatCardBase
      title={title}
      value={value}
      icon={icon}
      variant={variant}
      trend={trend}
    />
  );
};

export default StatCard;
