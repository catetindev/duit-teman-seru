
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Users } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
}

interface GoalsListProps {
  goals: Goal[];
  formatCurrency: (amount: number, currency: 'IDR' | 'USD') => string;
  calculateProgress: (saved: number, target: number) => number;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onCollaborate: (goal: Goal) => void;
  isPremium: boolean;
}

const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  formatCurrency,
  calculateProgress,
  onEdit,
  onDelete,
  onCollaborate,
  isPremium
}) => {
  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-medium mb-2">No goals yet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Setting clear goals helps you stay motivated and focused on your financial journey.
          </p>
          <Button>Add Goal</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => {
        const progress = calculateProgress(goal.saved_amount, goal.target_amount);
        
        return (
          <Card key={goal.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{goal.emoji}</span>
                  <CardTitle>{goal.title}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => onCollaborate(goal)}
                    className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                  >
                    <Users className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(goal)}
                    className="h-8 w-8 text-gray-500 hover:text-blue-700 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(goal.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-muted-foreground">
                    Saved: {formatCurrency(goal.saved_amount, goal.currency)}
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(goal.target_amount, goal.currency)}
                  </span>
                </div>
                <Progress value={progress} />
              </div>
              
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="font-medium">{progress}%</span>
                {goal.target_date && (
                  <span className="text-muted-foreground">Target: {goal.target_date}</span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default GoalsList;
