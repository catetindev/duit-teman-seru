
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configure Midtrans client
interface MidtransConfig {
  isProduction: boolean;
  serverKey: string;
  clientKey: string;
}

const midtransConfig: MidtransConfig = {
  isProduction: false, // Set to true for production
  serverKey: Deno.env.get("MIDTRANS_SERVER_KEY") || "",
  clientKey: Deno.env.get("MIDTRANS_CLIENT_KEY") || "",
};

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get request body
    const body = await req.json();
    const { id, amount, itemName, customerName, customerEmail, billingCycle } = body;

    // Check if we have the required Midtrans credentials
    if (!midtransConfig.serverKey) {
      return new Response(JSON.stringify({ error: 'Missing Midtrans configuration' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Convert amount to a string since Midtrans expects string values
    const amountStr = amount.toString();

    // Set transaction details
    const transactionDetails = {
      order_id: `ORDER-${id}-${Date.now()}`,
      gross_amount: amountStr,
    };

    // Set item details
    const itemDetails = [
      {
        id: `premium-${billingCycle}`,
        name: itemName,
        price: amountStr,
        quantity: 1,
      },
    ];

    // Set customer details
    const customerDetails = {
      first_name: customerName || "Customer",
      email: customerEmail || "",
    };

    // Create Midtrans Snap API request
    const snapApiUrl = midtransConfig.isProduction
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const snapResponse = await fetch(snapApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Basic ${btoa(midtransConfig.serverKey + ":")}`
      },
      body: JSON.stringify({
        transaction_details: transactionDetails,
        item_details: itemDetails,
        customer_details: customerDetails,
      }),
    });

    const snapData = await snapResponse.json();

    if (!snapResponse.ok) {
      return new Response(JSON.stringify({ error: snapData.error_messages || "Midtrans API error" }), {
        status: snapResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save transaction to database
    const { error } = await supabase
      .from("transactions")
      .insert([
        {
          order_id: transactionDetails.order_id,
          user_id: id,
          amount: amount,
          status: "pending",
          payment_type: "midtrans",
          subscription_type: billingCycle,
          metadata: snapData
        },
      ]);

    if (error) {
      console.error("Error saving transaction:", error);
    }

    // Return the redirect URL
    return new Response(JSON.stringify({ redirectUrl: snapData.redirect_url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error("Error processing payment:", error);
    
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
