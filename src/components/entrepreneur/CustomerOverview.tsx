
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface CustomerData {
  id: string;
  name: string;
  lastOrder?: string;
  totalOrders: number;
}

export function CustomerOverview() {
  const { user } = useAuth();
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['recent-customers'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: customersData, error } = await supabase
        .from('customers')
        .select('id, name, last_order_date')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(4);
        
      if (error) throw error;
      
      const customersWithOrderCount: CustomerData[] = [];
      
      for (const customer of customersData || []) {
        const { count, error: countError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('customer_id', customer.id)
          .eq('user_id', user.id);
          
        if (!countError) {
          customersWithOrderCount.push({
            id: customer.id,
            name: customer.name,
            lastOrder: customer.last_order_date,
            totalOrders: count || 0
          });
        }
      }
      
      return customersWithOrderCount;
    },
    enabled: !!user
  });

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="text-base font-medium flex items-center">
          <Users className="h-4 w-4 mr-2 text-blue-500" />
          Customer Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : customers && customers.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {customers.map(customer => (
              <div key={customer.id} className="flex justify-between items-center p-3 hover:bg-slate-50 transition-colors">
                <p className="font-medium text-sm">{customer.name}</p>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                  {customer.totalOrders} orders
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Users className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">No customers yet</p>
          </div>
        )}
        
        <div className="bg-slate-50 p-3 flex justify-between items-center">
          <div className="text-xs text-slate-500 flex items-center">
            <PieChart className="h-3 w-3 mr-1" />
            <span>Customer analytics</span>
          </div>
          <Button asChild variant="ghost" className="h-8 px-2 text-xs hover:bg-slate-100">
            <Link to="/customers" className="flex items-center">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
