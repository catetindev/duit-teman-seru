
// Edge function to automatically expire and process invitation that are past their expiration date
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

// Used for CRON invocations - we recommend daily schedule
serve(async (req) => {
  try {
    // Create authenticated Supabase client (using service role)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Checking for expired invitations...');

    // Find all expired invitations that are still pending
    const { data: expiredInvitations, error: findError } = await supabase
      .from('goal_invitations')
      .select('id, goal_id, invitee_id, inviter_id')
      .eq('status', 'pending')
      .lt('expires_at', new Date().toISOString());

    if (findError) {
      throw findError;
    }

    console.log(`Found ${expiredInvitations?.length || 0} expired invitations`);

    // Update all expired invitations
    if (expiredInvitations && expiredInvitations.length > 0) {
      const { error: updateError } = await supabase
        .from('goal_invitations')
        .update({ status: 'expired' })
        .in('id', expiredInvitations.map(inv => inv.id));

      if (updateError) {
        throw updateError;
      }

      // Create notification for each expired invitation
      for (const invitation of expiredInvitations) {
        // Get goal details
        const { data: goalData, error: goalError } = await supabase
          .from('savings_goals')
          .select('title')
          .eq('id', invitation.goal_id)
          .single();

        if (goalError) {
          console.error(`Error getting goal info for ${invitation.goal_id}:`, goalError);
          continue;
        }

        // Create notification for invitee
        await supabase
          .from('notifications')
          .insert({
            user_id: invitation.invitee_id,
            title: 'Goal Invitation Expired',
            message: `Your invitation to collaborate on goal "${goalData.title}" has expired`,
            type: 'warning'
          });

        // Create notification for inviter
        await supabase
          .from('notifications')
          .insert({
            user_id: invitation.inviter_id,
            title: 'Goal Invitation Expired',
            message: `Your invitation to ${invitation.invitee_id} for goal "${goalData.title}" has expired`,
            type: 'warning'
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${expiredInvitations?.length || 0} expired invitations`,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in check_expired_invitations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
