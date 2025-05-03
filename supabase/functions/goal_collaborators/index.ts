
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get the Authorization header from the request
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create a Supabase client with the auth header
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        }
      }
    });
    
    // Parse the request body
    const { action, goalId, userId, email } = await req.json();
    
    console.log(`Processing ${action} for goal ${goalId} and user ${userId || email}`);
    
    let result;
    
    // Process the action
    switch (action) {
      case 'check': {
        if (!userId || !goalId) {
          throw new Error('Missing required parameters');
        }
        
        const { data, error } = await supabase
          .from('goal_collaborators')
          .select('*')
          .eq('goal_id', goalId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        
        result = { isCollaborator: !!data };
        break;
      }
      
      case 'add': {
        if (!userId || !goalId) {
          throw new Error('Missing required parameters');
        }
        
        // First check if the collaboration already exists
        const { data: existingData, error: checkError } = await supabase
          .from('goal_collaborators')
          .select('*')
          .eq('goal_id', goalId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        if (existingData) {
          result = { message: "Already a collaborator", status: "exists" };
        } else {
          const { data, error } = await supabase
            .from('goal_collaborators')
            .insert({ goal_id: goalId, user_id: userId })
            .select();
            
          if (error) throw error;
          
          result = { message: "Collaborator added successfully", data, status: "success" };
        }
        break;
      }
      
      case 'remove': {
        if (!userId || !goalId) {
          throw new Error('Missing required parameters');
        }
        
        const { error } = await supabase
          .from('goal_collaborators')
          .delete()
          .eq('goal_id', goalId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        result = { message: "Collaborator removed successfully", status: "success" };
        break;
      }
      
      case 'list': {
        if (!goalId) {
          throw new Error('Missing goal ID');
        }
        
        const { data, error } = await supabase
          .from('goal_collaborators')
          .select('user_id, profiles:user_id(email, full_name)')
          .eq('goal_id', goalId);
          
        if (error) throw error;
        
        // Transform the data to a more usable format
        const collaborators = data.map(item => ({
          user_id: item.user_id,
          email: (item.profiles as any)?.email || '',
          full_name: (item.profiles as any)?.full_name || ''
        }));
        
        result = { collaborators };
        break;
      }
      
      case 'find_user': {
        if (!email) {
          throw new Error('Missing email parameter');
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .eq('email', email)
          .maybeSingle();
          
        if (error) throw error;
        
        if (!data) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { 
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        result = { user: data };
        break;
      }
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
