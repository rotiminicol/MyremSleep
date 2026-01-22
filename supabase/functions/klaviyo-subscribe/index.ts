import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SubscribeRequest {
  email: string;
  firstName: string;
  questionnaire?: {
    bedSize?: string;
    colors?: string[];
    colorOther?: string;
    feel?: string;
    priority?: string;
    bedFeeling?: string;
  };
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

    const { email, firstName, questionnaire }: SubscribeRequest = await req.json();

    if (!email || !firstName) {
      return new Response(
        JSON.stringify({ error: "Email and firstName are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Build custom properties for questionnaire data
    const customProperties: Record<string, unknown> = {};
    if (questionnaire) {
      if (questionnaire.bedSize) customProperties.bed_size = questionnaire.bedSize;
      if (questionnaire.colors && questionnaire.colors.length > 0) {
        customProperties.preferred_colors = questionnaire.colors.join(", ");
      }
      if (questionnaire.colorOther) customProperties.color_other = questionnaire.colorOther;
      if (questionnaire.feel) customProperties.preferred_feel = questionnaire.feel;
      if (questionnaire.priority) customProperties.purchase_priority = questionnaire.priority;
      if (questionnaire.bedFeeling) customProperties.bed_feeling = questionnaire.bedFeeling;
      customProperties.questionnaire_completed = true;
      customProperties.questionnaire_completed_at = new Date().toISOString();
    }

    // Subscribe to Klaviyo list using the new API (revision 2024-02-15)
    const profileData = {
      data: {
        type: "profile",
        attributes: {
          email: email,
          first_name: firstName,
          properties: {
            source: "remsleep_website",
            subscribed_at: new Date().toISOString(),
            ...customProperties,
          },
        },
      },
    };

    // Create or update profile
    const profileResponse = await fetch("https://a.klaviyo.com/api/profiles/", {
      method: "POST",
      headers: {
        "Authorization": `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
        "Content-Type": "application/json",
        "revision": "2024-02-15",
      },
      body: JSON.stringify(profileData),
    });

    let profileId: string;

    if (profileResponse.status === 409) {
      // Profile already exists, get the profile ID from the error response
      const errorData = await profileResponse.json();
      profileId = errorData.errors?.[0]?.meta?.duplicate_profile_id;
      
      if (profileId && questionnaire) {
        // Update existing profile with questionnaire data
        await fetch(`https://a.klaviyo.com/api/profiles/${profileId}/`, {
          method: "PATCH",
          headers: {
            "Authorization": `Klaviyo-API-Key ${KLAVIYO_PRIVATE_KEY}`,
            "Content-Type": "application/json",
            "revision": "2024-02-15",
          },
          body: JSON.stringify({
            data: {
              type: "profile",
              id: profileId,
              attributes: {
                properties: customProperties,
              },
            },
          }),
        });
      }
    } else if (!profileResponse.ok) {
      const errorText = await profileResponse.text();
      console.error("Klaviyo profile creation error:", errorText);
      throw new Error(`Failed to create profile: ${errorText}`);
    } else {
      const profileResult = await profileResponse.json();
      profileId = profileResult.data.id;
    }

    console.log("Klaviyo subscription successful:", { email, profileId, hasQuestionnaire: !!questionnaire });

    return new Response(
      JSON.stringify({ success: true, profileId }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in klaviyo-subscribe:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
