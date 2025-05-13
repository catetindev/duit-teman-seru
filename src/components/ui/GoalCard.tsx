import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users, PlusCircle } from 'lucide-react';
import { formatCurrency, calculateProgress } from '@/utils/formatUtils';
import { Goal } from '@/hooks/goals/types';

interface GoalCardProps {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  currency: 'IDR' | 'USD';
  targetDate?: string;
  emoji?: string;
  isPremium?: boolean; // Added isPremium prop
  onEdit: () => void;
  onDelete: (id: string) => void;
  onCollaborate: () => void; // Added onCollaborate prop
  onUpdate: () => void; // Added onUpdate prop for potential direct updates
}

const GoalCard: React.FC<GoalCardProps> = ({
  id,
  title,
  targetAmount,
  currentAmount,
  currency,
  targetDate,
  emoji = '🎯',
  isPremium = false, // Default to false
  onEdit,
  onDelete,
  onCollaborate,
  onUpdate,
}) => {
  const progress = calculateProgress(currentAmount, targetAmount);
  const isCompleted = progress >= 100;

  return (
    <Card className="overflow-hidden transition-shadow card-hover">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{emoji}</div>
            <div>
              <h3 className="text-lg font-semibold">{title}</h3>
              {targetDate && (
                <p className="text-xs text-muted-foreground">
                  Target by: {new Date(targetDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            {isPremium && ( // Only show collaborate button for premium
              <Button variant="ghost" size="icon" onClick={onCollaborate} title="Collaborators">
                <Users className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onEdit} title="Edit Goal">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(id)} title="Delete Goal">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div className="space-y-2 mb-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Saved: {formatCurrency(currentAmount, currency)}</span>
            <span>Target: {formatCurrency(targetAmount, currency)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium">{progress}% Complete</span>
          {isCompleted ? (
            <span className="text-green-600 text-sm font-semibold">Goal Achieved! 🎉</span>
          ) : (
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" /> Add Savings
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;