
import { supabase } from '@/integrations/supabase/client';
import { Collaborator } from './types';
import { useToast } from '@/hooks/use-toast';

export const useCollaboratorApi = () => {
  const { toast } = useToast();

  // Fetch collaborators for a goal
  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'get_goal_collaborators',
          params: { goalId }
        }
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collaborators",
        variant: "destructive"
      });
      return [];
    }
  };

  // Add a collaborator
  const addCollaborator = async (goalId: string, email: string): Promise<boolean> => {
    try {
      // Find user with this email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email.trim())
        .maybeSingle();
      
      if (userError) throw userError;
      
      if (!userData) {
        throw new Error("User not found with this email");
      }
      
      // Check if already a collaborator
      const { data: isCollaborator, error: checkError } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'is_collaborator',
          params: { goalId, userId: userData.id }
        }
      });
        
      if (checkError) throw checkError;
      
      if (isCollaborator) {
        throw new Error("This user is already a collaborator");
      }
      
      // Add collaborator
      const { error: addError } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'add_collaborator',
          params: { goalId, userId: userData.id }
        }
      });
      
      if (addError) throw addError;
      
      toast({
        title: "Collaborator added!",
        description: `${userData.full_name || userData.email} has been added as a collaborator.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add collaborator",
        variant: "destructive",
      });
      return false;
    }
  };

  // Remove a collaborator
  const removeCollaborator = async (goalId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'remove_collaborator',
          params: { goalId, userId }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove collaborator",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchCollaborators,
    addCollaborator,
    removeCollaborator
  };
};
