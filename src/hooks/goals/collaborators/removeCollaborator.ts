
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRemoveCollaborator() {
  const { toast } = useToast();

  const removeCollaborator = async (goalId: string, userId: string): Promise<boolean> => {
    try {
      // Remove the collaborator
      const { error } = await supabase
        .from('goal_collaborators')
        .delete()
        .eq('goal_id', goalId)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error removing collaborator:', error);
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to remove collaborator: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      throw error;
    }
  };

  return { removeCollaborator };
}
