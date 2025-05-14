
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerOverview } from '@/hooks/entrepreneur/useCustomerOverview';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatUtils';
import { Skeleton } from '@/components/ui/skeleton';

export function CustomerOverview() {
  const { recentCustomers, loading } = useCustomerOverview(5);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <Users className="h-4 w-4" />
          Recent Customers
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/customers" className="flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        ) : recentCustomers.length > 0 ? (
          <div className="space-y-3">
            {recentCustomers.map((customer) => (
              <div 
                key={customer.id} 
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 dark:bg-gray-800 h-9 w-9 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{customer.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <p className="text-xs text-muted-foreground">
                        <ShoppingBag className="h-3 w-3 mr-1 inline" /> 
                        {/* Remove orderCount reference since it's not available */}
                        Customer
                      </p>
                      {customer.tags && customer.tags.length > 0 && (
                        <Badge variant="outline" className="text-xs h-4 px-1">
                          {customer.tags[0]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-right">
                  {customer.last_order_date ? (
                    <p className="text-muted-foreground">
                      Last order: {formatDate(new Date(customer.last_order_date))}
                    </p>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">No orders</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No customers yet</p>
            <Button variant="outline" className="mt-2" asChild>
              <Link to="/customers">Add Customer</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
