
import { supabase } from '@/integrations/supabase/client';
import { Collaborator } from './types';
import { useToast } from '@/hooks/use-toast';

export function useCollaboratorApi() {
  const { toast } = useToast();

  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      console.log('Fetching collaborators for goal:', goalId);
      
      // First check if goal exists
      const { data: goalData, error: goalError } = await supabase
        .from('savings_goals')
        .select('id')
        .eq('id', goalId)
        .single();
        
      if (goalError) {
        console.error('Error finding goal:', goalError);
        throw new Error('Goal not found');
      }
      
      // Now that we have the goal_collaborators table, we can query it directly
      const { data: collaborators, error } = await supabase
        .from('goal_collaborators')
        .select('user_id')
        .eq('goal_id', goalId);
        
      if (error) {
        console.error('Error fetching collaborators:', error);
        throw error;
      }
      
      if (!collaborators || collaborators.length === 0) {
        return []; // Return empty array if no collaborators
      }
      
      // Get the profiles data for all collaborators
      const userIds = collaborators.map(col => col.user_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Convert to expected format
      const formattedCollaborators: Collaborator[] = profiles.map(profile => ({
        user_id: profile.id,
        email: profile.email,
        full_name: profile.full_name
      }));
      
      return formattedCollaborators;
    } catch (error: any) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to load collaborators: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      return []; // Return empty array instead of throwing to prevent cascading errors
    }
  };

  const addCollaborator = async (goalId: string, email: string): Promise<boolean> => {
    try {
      // Find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error('Error finding user:', userError);
        throw userError;
      }
      
      if (!userData) {
        throw new Error('User not found with that email');
      }
      
      // Check if this user is already a collaborator
      const { data: existingCollaborator, error: existingError } = await supabase
        .from('goal_collaborators')
        .select('id')
        .eq('goal_id', goalId)
        .eq('user_id', userData.id)
        .maybeSingle();
        
      if (existingError) {
        console.error('Error checking existing collaborator:', existingError);
        throw existingError;
      }
      
      if (existingCollaborator) {
        throw new Error('This user is already a collaborator');
      }
      
      // Add the collaborator
      const { error: insertError } = await supabase
        .from('goal_collaborators')
        .insert({
          goal_id: goalId,
          user_id: userData.id
        });
        
      if (insertError) {
        console.error('Error adding collaborator:', insertError);
        throw insertError;
      }
      
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

  return {
    fetchCollaborators,
    addCollaborator,
    removeCollaborator
  };
}
