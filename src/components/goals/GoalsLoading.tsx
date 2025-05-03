
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GoalsLoadingProps {
  isPremium: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const GoalsLoading: React.FC<GoalsLoadingProps> = ({ isPremium, error, onRetry }) => {
  if (error) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Savings Goals</h1>
          <p className="text-muted-foreground">Track your progress towards financial targets</p>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading goals</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>{error}</p>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-fit flex items-center gap-2"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="flex justify-between mb-6">
        <div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <div className="flex space-x-1">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
              
              <div className="space-y-2 mb-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
              
              <div className="flex justify-between mt-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-28" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default GoalsLoading;
