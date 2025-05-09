
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const mayarServerKey = Deno.env.get("MIDTRANS_SERVER_KEY") || "";
const mayarClientKey = Deno.env.get("MIDTRANS_CLIENT_KEY") || "";

// Validate configuration
if (!supabaseUrl || !supabaseServiceKey || !mayarServerKey || !mayarClientKey) {
  console.error("Missing required environment variables");
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Calculate price based on billing cycle
const getPriceAmount = (billingCycle: string): number => {
  return billingCycle === "yearly" ? 290000 : 29000; // IDR
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { user, billingCycle = "monthly", redirectUrl } = await req.json();
    
    if (!user || !user.id || !user.email) {
      return new Response(
        JSON.stringify({ error: "Missing user information" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Set up Mayar payment parameters
    const amount = getPriceAmount(billingCycle);
    const referenceId = `premium_${user.id}_${Date.now()}`; 
    const mayarPayload = {
      reference_id: referenceId,
      type: "checkout",
      amount: amount,
      currency: "IDR",
      line_items: [
        {
          name: `DuitTemanseru Premium ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`,
          quantity: 1,
          price: amount,
          description: `Premium subscription - ${billingCycle}`
        }
      ],
      customer: {
        given_names: user.fullName || user.email.split("@")[0],
        email: user.email
      },
      success_redirect_url: redirectUrl || `${new URL(req.url).origin}/dashboard`,
      failure_redirect_url: redirectUrl || `${new URL(req.url).origin}/pricing`,
    };

    console.log("Creating Mayar payment:", mayarPayload);

    // Create payment in Mayar
    const response = await fetch("https://api.mayar.id/online/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Mayar-API-Key": mayarServerKey,
        "X-Mayar-Origin": new URL(req.url).origin
      },
      body: JSON.stringify(mayarPayload)
    });

    const paymentResult = await response.json();
    console.log("Payment result:", paymentResult);

    if (!response.ok || !paymentResult.payment_url) {
      return new Response(
        JSON.stringify({ error: "Failed to create payment", details: paymentResult }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Save payment record to database
    const { error: dbError } = await supabase
      .from("payment_records")
      .insert({
        user_id: user.id,
        reference_id: referenceId,
        status: "PENDING",
        amount: amount,
        currency: "IDR"
      });

    if (dbError) {
      console.error("Error saving payment record:", dbError);
    }

    // Return payment URL and reference
    return new Response(
      JSON.stringify({ 
        success: true,
        payment_url: paymentResult.payment_url,
        reference_id: referenceId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
