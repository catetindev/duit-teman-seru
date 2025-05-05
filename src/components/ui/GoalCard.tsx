
import React from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GoalCardProps {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  currency: 'IDR' | 'USD';
  isPremium?: boolean;
  hasCollaborators?: boolean;
  emoji?: string;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onCollaborate?: () => void;
  onUpdate?: () => void;
  className?: string;
}

const GoalCard = ({
  id,
  title,
  targetAmount,
  currentAmount,
  targetDate,
  currency,
  isPremium = false,
  hasCollaborators = false,
  emoji = '🎯',
  onEdit,
  onDelete,
  onCollaborate,
  onUpdate,
  className = '',
}: GoalCardProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  // Calculate progress percentage
  const progress = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
  
  // Format date
  const formattedDate = targetDate ? new Date(targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : 'No deadline';
  
  // Handle delete
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      if (onDelete) {
        onDelete(id);
      } else if (onUpdate) {
        // Direct delete functionality
        const { error } = await supabase
          .from('savings_goals')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast("Goal deleted successfully");
        
        onUpdate();
      }
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast("Failed to delete goal: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className={cn("p-5 overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {emoji && <span className="text-xl">{emoji}</span>}
          <h3 className="font-semibold text-lg truncate pr-4">{title}</h3>
        </div>
        <div className="flex gap-1">
          {isPremium && onCollaborate && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-violet-600" 
              onClick={onCollaborate}
              title="Manage collaborators"
            >
              <Users className="h-4 w-4" />
            </Button>
          )}
          {onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-blue-500" 
              onClick={onEdit}
              title="Edit goal"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-red-500" 
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete goal"
          >
            {isDeleting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-r-transparent" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between mb-1 text-sm">
        <div>Target: {formatCurrency(targetAmount, currency)}</div>
        <div>By: {formattedDate}</div>
      </div>
      
      <div className="mb-2">
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex justify-between text-sm">
        <div className={progress >= 100 ? "text-green-600 font-medium" : ""}>
          {formatCurrency(currentAmount, currency)} saved
        </div>
        <div className={progress >= 100 ? "text-green-600 font-medium" : ""}>
          {progress}%
        </div>
      </div>
      
      {hasCollaborators && (
        <div className="mt-3 bg-purple-50 rounded-md p-2 text-xs text-purple-700 flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>Collaborative Goal</span>
        </div>
      )}
    </Card>
  );
};

export default GoalCard;
