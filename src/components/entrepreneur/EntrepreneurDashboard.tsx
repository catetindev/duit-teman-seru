
import React from 'react';
import { BusinessSummary } from './BusinessSummary';
import { BusinessTransactionButtons } from './BusinessTransactionButtons';
import { BusinessChart } from './BusinessChart';
import { ClientTracker } from './ClientTracker';
import { InvoiceReminder } from './InvoiceReminder';

interface EntrepreneurDashboardProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function EntrepreneurDashboard({
  onAddIncome,
  onAddExpense
}: EntrepreneurDashboardProps) {
  // This would come from real data in a production app
  const businessData = {
    totalIncome: 10200000,
    totalExpenses: 5500000
  };

  return (
    <div className="space-y-6">
      {/* Business Summary */}
      <BusinessSummary 
        totalIncome={businessData.totalIncome} 
        totalExpenses={businessData.totalExpenses} 
        currency="IDR"
      />
      
      {/* Quick Actions */}
      <BusinessTransactionButtons 
        onAddIncome={onAddIncome} 
        onAddExpense={onAddExpense} 
      />
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Business Chart */}
          <BusinessChart />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Invoice Reminder */}
          <InvoiceReminder />
          
          {/* Client Tracker */}
          <ClientTracker />
        </div>
      </div>
    </div>
  );
}
