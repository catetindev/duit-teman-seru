import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { calculateProgress } from '@/utils/formatUtils';

export function useGoals(userId: string | undefined) {
  const { toast } = useToast();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchGoals = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Type conversion to ensure Goal[] type compatibility
      const typedGoals = (data || []).map(goal => ({
        ...goal,
        currency: (goal.currency === 'USD' ? 'USD' : 'IDR') as 'USD' | 'IDR'
      }));
      
      setGoals(typedGoals);
      setLoading(false);
      return typedGoals;
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error loading goals",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return [];
    }
  }, [userId, toast]);

  return { goals, fetchGoals, setGoals, loading };
}
