import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UnsubscribeRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const KLAVIYO_PRIVATE_KEY = Deno.env.get("KLAVIYO_PRIVATE_KEY");
    if (!KLAVIYO_PRIVATE_KEY) {
      throw new Error("KLAVIYO_PRIVATE_KEY not configured");
    }

    const { email }: UnsubscribeRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Find profile by email
    const searchResponse = await fetch(
      `https://a.klaviyo.com/api/profiles/?filter=equals(email,"${encodeURIComponent(email)}")`,
      {
        method: "GET",
        headers: {
          "Authorization": `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
          "Content-Type": "application/json",
          "revision": "2024-02-15",
        },
      }
    );

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error("Klaviyo search error:", errorText);
      throw new Error(`Failed to search profile: ${errorText}`);
    }

    const searchResult = await searchResponse.json();
    const profiles = searchResult.data || [];

    if (profiles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No profile found with that email" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const profileId = profiles[0].id;

    // Suppress the profile (marks as unsubscribed from all lists)
    const suppressResponse = await fetch("https://a.klaviyo.com/api/profile-suppression-bulk-create-jobs/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
        "Content-Type": "application/json",
        "revision": "2024-02-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-suppression-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email: email,
                  },
                },
              ],
            },
          },
        },
      }),
    });

    if (!suppressResponse.ok) {
      const errorText = await suppressResponse.text();
      console.error("Klaviyo suppression error:", errorText);
      throw new Error(`Failed to suppress profile: ${errorText}`);
    }

    console.log("Klaviyo unsubscribe successful:", { email, profileId });

    return new Response(
      JSON.stringify({ success: true, message: "Successfully unsubscribed" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in klaviyo-unsubscribe:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
