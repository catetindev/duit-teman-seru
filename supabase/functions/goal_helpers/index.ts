
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
    // Parse the request body
    const { method, params } = await req.json();
    
    // Get the authorization header to authenticate the user
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
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        }
      }
    });
    
    let result;
    
    switch (method) {
      case 'is_collaborator': {
        const { goalId, userId } = params;
        if (!goalId || !userId) {
          throw new Error('Missing required parameters');
        }
        
        const { data, error } = await supabase
          .from('goal_collaborators')
          .select('*')
          .eq('goal_id', goalId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (error) throw error;
        
        result = !!data;
        break;
      }
      
      case 'add_collaborator': {
        const { goalId, userId } = params;
        if (!goalId || !userId) {
          throw new Error('Missing required parameters');
        }
        
        // Check if collaborator already exists
        const { data: existingCollaborator } = await supabase
          .from('goal_collaborators')
          .select('*')
          .eq('goal_id', goalId)
          .eq('user_id', userId)
          .maybeSingle();
          
        if (existingCollaborator) {
          result = { status: 'already_exists' };
          break;
        }
        
        // Add collaborator
        const { data, error } = await supabase
          .from('goal_collaborators')
          .insert({ goal_id: goalId, user_id: userId })
          .select();
          
        if (error) throw error;
        
        result = { status: 'success', data };
        break;
      }
      
      case 'remove_collaborator': {
        const { goalId, userId } = params;
        if (!goalId || !userId) {
          throw new Error('Missing required parameters');
        }
        
        const { error } = await supabase
          .from('goal_collaborators')
          .delete()
          .eq('goal_id', goalId)
          .eq('user_id', userId);
          
        if (error) throw error;
        
        result = { status: 'success' };
        break;
      }
      
      case 'get_goal_collaborators': {
        const { goalId } = params;
        if (!goalId) {
          throw new Error('Missing goal ID');
        }
        
        const { data, error } = await supabase
          .from('goal_collaborators')
          .select(`
            user_id,
            profiles (
              email,
              full_name
            )
          `)
          .eq('goal_id', goalId);
          
        if (error) throw error;
        
        // Transform to a more friendly format
        const collaborators = data.map(item => ({
          user_id: item.user_id,
          email: (item.profiles as any)?.email || '',
          full_name: (item.profiles as any)?.full_name || ''
        }));
        
        result = collaborators;
        break;
      }
      
      default:
        throw new Error(`Unknown method: ${method}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
