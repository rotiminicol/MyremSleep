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

    if (action === 'create') {
      const response = await fetch(JUDGE_ME_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_domain: shopDomain,
          api_token: token,
          platform: 'shopify',
          id: body.productId,
          url: shopDomain,
          review: {
            rating: body.rating,
            title: body.title,
            body: body.reviewBody,
            reviewer: {
              name: body.name,
              email: body.email || `${String(body.name || 'reviewer').replace(/\s/g, '').toLowerCase()}@review.local`,
            },
          },
        }),
      });

      const responseData = await response.json();
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const page = Number(body?.page || 1);
    const perPage = Number(body?.perPage || 10);

    const url = new URL(JUDGE_ME_API_URL);
    url.searchParams.set('shop_domain', shopDomain);
    url.searchParams.set('api_token', token);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const responseData = await response.json();

    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected proxy error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
