const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const JUDGE_ME_API_URL = 'https://judge.me/api/v1/reviews';

function toNumericShopifyId(value: unknown): string | null {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const raw = String(value).trim();
  if (!raw) return null;

  if (/^\d+$/.test(raw)) return raw;

  const gidMatch = raw.match(/\/(\d+)(?:\D*)$/);
  if (gidMatch?.[1]) return gidMatch[1];

  return null;
}

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
      const name = String(body?.name || '').trim();
      const title = String(body?.title || '').trim();
      const reviewBody = String(body?.reviewBody || '').trim();
      const rating = Number(body?.rating || 0);
      const productId = toNumericShopifyId(body?.productId);
      const fallbackEmailLocal = String(body?.name || 'reviewer').replace(/\s/g, '').toLowerCase();
      const email = String(body?.email || `${fallbackEmailLocal}@review.local`).trim();

      if (!name || !title || !reviewBody || !productId || Number.isNaN(rating) || rating < 1 || rating > 5) {
        return new Response(JSON.stringify({ error: 'Missing required review fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const response = await fetch(JUDGE_ME_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_domain: shopDomain,
          api_token: token,
          platform: 'shopify',
          id: productId,
          url: `https://${shopDomain}`,
          name,
          email,
          rating,
          title,
          body: reviewBody,
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
    const handle = typeof body?.handle === 'string' ? body.handle.trim() : '';

    const url = new URL(JUDGE_ME_API_URL);
    url.searchParams.set('shop_domain', shopDomain);
    url.searchParams.set('api_token', token);
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', String(perPage));
    if (handle) {
      url.searchParams.set('handle', handle);
    }

    let response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 422 && handle) {
      const fallbackUrl = new URL(JUDGE_ME_API_URL);
      fallbackUrl.searchParams.set('shop_domain', shopDomain);
      fallbackUrl.searchParams.set('api_token', token);
      fallbackUrl.searchParams.set('page', String(page));
      fallbackUrl.searchParams.set('per_page', String(perPage));
      response = await fetch(fallbackUrl.toString(), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });
    }

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
