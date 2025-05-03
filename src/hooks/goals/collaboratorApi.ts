
import { supabase } from '@/integrations/supabase/client';
import { Collaborator } from './types';
import { useToast } from '@/hooks/use-toast';

export function useCollaboratorApi() {
  const { toast } = useToast();

  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      // Use the edge function instead of direct database access
      const { data: response, error } = await supabase.functions.invoke('goal_collaborators', {
        body: {
          action: 'list',
          goalId
        }
      });
      
      if (error) throw error;
      
      return response?.collaborators || [];
    } catch (error: any) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to load collaborators: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      return [];
    }
  };

  const addCollaborator = async (goalId: string, email: string): Promise<boolean> => {
    try {
      // First, find the user by email using the edge function
      const { data: userData, error: userError } = await supabase.functions.invoke('goal_collaborators', {
        body: {
          action: 'find_user',
          email
        }
      });
      
      if (userError) throw userError;
      
      if (!userData?.user) {
        throw new Error('User not found with that email');
      }
      
      // Add the collaborator using the edge function
      const { data: addResult, error: addError } = await supabase.functions.invoke('goal_collaborators', {
        body: {
          action: 'add',
          goalId,
          userId: userData.user.id
        }
      });
      
      if (addError) throw addError;
      
      if (addResult?.status === 'exists') {
        throw new Error('This user is already a collaborator');
      }
      
      // Return true to indicate success
      return true;
    } catch (error: any) {
      console.error('Error adding collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to add collaborator: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeCollaborator = async (goalId: string, userId: string): Promise<boolean> => {
    try {
      // Use the edge function to remove the collaborator
      const { data, error } = await supabase.functions.invoke('goal_collaborators', {
        body: {
          action: 'remove',
          goalId,
          userId
        }
      });
      
      if (error) throw error;
      
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

  return {
    fetchCollaborators,
    addCollaborator,
    removeCollaborator
  };
}
