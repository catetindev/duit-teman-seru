
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// CORS headers for browser requests (though webhooks are server-to-server)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const mayarServerKey = Deno.env.get("MIDTRANS_SERVER_KEY") || "";

// Validate configuration
if (!supabaseUrl || !supabaseServiceKey || !mayarServerKey) {
  console.error("Missing required environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to verify webhook signature
const verifySignature = (requestData: string, signature: string): boolean => {
  // In a production environment, you would verify the signature using 
  // Mayar's documentation to ensure the webhook is authentic
  // This is a placeholder for actual signature verification
  
  console.log("Verify signature (placeholder):", { signature });
  return true; // Always return true for now
};

// Handle webhook notifications from Mayar
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log incoming webhook
    console.log("Received webhook from Mayar");
    
    // Get signature from headers
    const signature = req.headers.get("X-Mayar-Signature") || "";
    
    // Get request body as text for signature verification
    const requestText = await req.text();
    let requestData;
    
    try {
      requestData = JSON.parse(requestText);
    } catch (e) {
      console.error("Failed to parse webhook payload", e);
      return new Response(
        JSON.stringify({ error: "Invalid JSON payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log("Webhook data:", requestData);
    
    // Verify the webhook signature (implementation depends on Mayar's specific requirements)
    if (!verifySignature(requestText, signature)) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Process the webhook based on the event type
    const { reference_id, status, payment_method } = requestData;
    
    if (!reference_id) {
      return new Response(
        JSON.stringify({ error: "Missing reference_id in webhook" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Processing webhook for reference_id: ${reference_id}, status: ${status}`);
    
    // Find the payment record
    const { data: paymentRecord, error: fetchError } = await supabase
      .from("payment_records")
      .select("*")
      .eq("reference_id", reference_id)
      .single();
    
    if (fetchError || !paymentRecord) {
      console.error("Payment record not found:", reference_id, fetchError);
      return new Response(
        JSON.stringify({ error: "Payment record not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update payment record
    const { error: updateError } = await supabase
      .from("payment_records")
      .update({ 
        status, 
        payment_method: payment_method || paymentRecord.payment_method,
        updated_at: new Date().toISOString()
      })
      .eq("reference_id", reference_id);
    
    if (updateError) {
      console.error("Error updating payment record:", updateError);
    }
    
    // If payment is successful, update user to premium
    if (status === "PAID") {
      // Get the user ID from the payment record
      const userId = paymentRecord.user_id;
      
      // Calculate subscription expiry (1 month or 1 year from now)
      const isYearly = paymentRecord.amount >= 200000; // Simple heuristic
      const now = new Date();
      const expiryDate = new Date(now);
      
      if (isYearly) {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      } else {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      }
      
      // Update user profile to premium
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          role: "premium",
          subscription_id: reference_id,
          subscription_expiry: expiryDate.toISOString()
        })
        .eq("id", userId);
      
      if (profileError) {
        console.error("Error updating user profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Error updating user profile", details: profileError }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`User ${userId} upgraded to premium until ${expiryDate.toISOString()}`);
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
