
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransactionList from '@/components/ui/TransactionList';
import { TransactionData } from '@/hooks/useTransactions';

interface TransactionLayoutProps {
  transactions: TransactionData[];
  isPremium: boolean;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  isLoading: boolean;
  onUpdate: () => void;
}

export default function TransactionLayout({
  transactions,
  isPremium,
  timeFilter,
  setTimeFilter,
  categoryFilter,
  setCategoryFilter,
  isLoading,
  onUpdate
}: TransactionLayoutProps) {
  
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  return (
    <div className="space-y-4">
      {/* Mobile-friendly filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="flex-1">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="bills">Bills</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile-responsive tabs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="income" className="text-xs sm:text-sm">Income</TabsTrigger>
              <TabsTrigger value="expense" className="text-xs sm:text-sm">Expenses</TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="all" className="space-y-2">
                <div className="overflow-x-auto">
                  <TransactionList 
                    transactions={transactions}
                    isLoading={isLoading}
                    onUpdate={onUpdate}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="income" className="space-y-2">
                <div className="overflow-x-auto">
                  <TransactionList 
                    transactions={incomeTransactions}
                    isLoading={isLoading}
                    onUpdate={onUpdate}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="expense" className="space-y-2">
                <div className="overflow-x-auto">
                  <TransactionList 
                    transactions={expenseTransactions}
                    isLoading={isLoading}
                    onUpdate={onUpdate}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
