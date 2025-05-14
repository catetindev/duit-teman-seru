
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ComparisonData } from '@/types/finance';

type BusinessHealthProps = {
  comparison: ComparisonData | null;
}

export const BusinessHealthCard = ({ comparison }: BusinessHealthProps) => {
  // Generate business health indicator
  const getBusinessHealthStatus = () => {
    if (!comparison) return { text: 'Calculating...', color: 'text-gray-500' };
    
    if (comparison.profitChange >= 10) {
      return {
        emoji: '🔥',
        text: 'On Fire!',
        subtext: 'Your business is thriving with outstanding growth.',
        color: 'text-emerald-500'
      };
    } else if (comparison.profitChange > 0) {
      return {
        emoji: '📈',
        text: 'Growing',
        subtext: 'Your business is showing positive trends.',
        color: 'text-blue-500'
      };
    } else if (comparison.profitChange > -10) {
      return {
        emoji: '⚠️',
        text: 'Needs Attention',
        subtext: 'Your profits are declining slightly.',
        color: 'text-amber-500'
      };
    } else {
      return {
        emoji: '🚨',
        text: 'Action Required',
        subtext: 'Your business is facing significant challenges.',
        color: 'text-red-500'
      };
    }
  };

  const healthStatus = getBusinessHealthStatus();

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-3xl">{healthStatus.emoji}</span>
              <span>Business Health:</span>
              <span className={healthStatus.color}>{healthStatus.text}</span>
            </h2>
            <p className="text-muted-foreground mt-1">{healthStatus.subtext}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="text-sm text-muted-foreground">
              Based on your last month's performance
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
