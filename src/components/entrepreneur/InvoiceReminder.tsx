
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export function InvoiceReminder() {
  const { user } = useAuth();
  
  const { data: upcomingInvoices, isLoading } = useQuery({
    queryKey: ['upcoming-invoices'],
    queryFn: async () => {
      if (!user) return [];
      
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 14); // Get invoices due within next 14 days
      
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          id, 
          invoice_number,
          total,
          payment_due_date,
          status,
          customers (name)
        `)
        .eq('user_id', user.id)
        .eq('status', 'Unpaid')
        .gte('payment_due_date', today.toISOString())
        .lte('payment_due_date', futureDate.toISOString())
        .order('payment_due_date', { ascending: true })
        .limit(3);
        
      if (error) throw error;
      
      return data;
    },
    enabled: !!user
  });

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-base font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-red-500" />
          Upcoming Payments
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
        ) : upcomingInvoices && upcomingInvoices.length > 0 ? (
          <div className="divide-y">
            {upcomingInvoices.map((invoice: any) => {
              const dueDate = new Date(invoice.payment_due_date);
              const isUrgent = dueDate.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000; // Less than 3 days
              
              return (
                <div key={invoice.id} className="flex justify-between items-center p-3 hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm truncate max-w-[150px]">
                      {invoice.customers?.name || 'Customer'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{invoice.invoice_number} • {
                      formatDistanceToNow(new Date(invoice.payment_due_date), { addSuffix: true })
                      }
                    </p>
                  </div>
                  <div className="flex items-center">
                    {isUrgent && (
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isUrgent 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    }`}>
                      Due soon
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming payments</p>
          </div>
        )}
        
        <div className="bg-muted/20 p-3 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Manage your pending invoices
          </div>
          <Button asChild variant="ghost" className="h-8 px-2 text-xs">
            <Link to="/invoices" className="flex items-center">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
