const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const JUDGE_ME_API_URL = 'https://judge.me/api/v1/reviews';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const token = Deno.env.get('JUDGEME_API_TOKEN');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Missing Judge.me token' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const action = body?.action;
    const shopDomain = body?.shopDomain;

    if (!shopDomain) {
      return new Response(JSON.stringify({ error: 'shopDomain is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === CREATE REVIEW ===
    if (action === 'create') {
      const name = String(body?.name || '').trim();
      const email = String(body?.email || '').trim();
      const reviewBody = String(body?.reviewBody || '').trim();
      const rating = Number(body?.rating || 0);
      const title = String(body?.title || '').trim();
      const productId = body?.productId;

      if (!name || !email || !reviewBody || !rating || rating < 1 || rating > 5) {
        return new Response(JSON.stringify({ error: 'Missing required review fields (name, email, body, rating 1-5)' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Extract numeric Shopify product ID from GID format
      let externalId: number | undefined;
      if (productId) {
        const raw = String(productId);
        const match = raw.match(/(\d+)/);
        if (match) externalId = parseInt(match[1], 10);
      }

      // Judge.me Create endpoint format (public, no auth needed)
      const createPayload: Record<string, unknown> = {
        shop_domain: shopDomain,
        platform: 'shopify',
        name,
        email,
        rating,
        body: reviewBody,
      };
      if (title) createPayload.title = title;
      if (externalId) createPayload.id = externalId;

      console.log('Creating review with payload:', JSON.stringify(createPayload));

      const response = await fetch(JUDGE_ME_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createPayload),
      });

      const responseText = await response.text();
      console.log('Judge.me create response:', response.status, responseText);

      let responseData;
      try { responseData = JSON.parse(responseText); } catch { responseData = { raw: responseText }; }

      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // === LIST REVIEWS ===
    const page = Number(body?.page || 1);
    const perPage = Number(body?.perPage || 10);

    const url = new URL(JUDGE_ME_API_URL);
    url.searchParams.set('shop_domain', shopDomain);
    url.searchParams.set('api_token', token);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));

    console.log('Fetching reviews:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const responseText = await response.text();
    console.log('Judge.me list response:', response.status, responseText.substring(0, 500));

    let responseData;
    try { responseData = JSON.parse(responseText); } catch { responseData = { reviews: [] }; }

    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected proxy error';
    console.error('Edge function error:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
