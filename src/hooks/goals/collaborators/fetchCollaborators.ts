
import { supabase } from '@/integrations/supabase/client';
import { Collaborator } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useFetchCollaborators() {
  const { toast } = useToast();

  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      console.log('Fetching collaborators for goal:', goalId);
      
      // First check if goal exists
      const { data: goalData, error: goalError } = await supabase
        .from('savings_goals')
        .select('id')
        .eq('id', goalId)
        .maybeSingle();
        
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

  return { fetchCollaborators };
}
