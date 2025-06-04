
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { BusinessTransactions as BusinessTransactionsComponent } from '@/components/entrepreneur/BusinessTransactions';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BusinessTransactions() {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const navigate = useNavigate();

  if (!isEntrepreneurMode || !isPremium) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Lock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Business Transactions</h3>
              <p className="text-muted-foreground mb-6">
                {!isPremium 
                  ? "Premium subscription and entrepreneur mode required to access business transactions."
                  : "Entrepreneur mode required to access business transactions."
                }
              </p>
              {!isPremium && (
                <Button onClick={() => navigate('/pricing')}>
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Business Transactions</h1>
            <p className="text-muted-foreground text-lg">
              View and manage all your business income and expenses
            </p>
          </div>
        </div>
        
        <BusinessTransactionsComponent />
      </div>
    </DashboardLayout>
  );
}
