import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SHOP_DOMAIN = 'zr4ktm-7m.myshopify.com';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const JUDGEME_API_TOKEN = Deno.env.get('JUDGEME_API_TOKEN');
  if (!JUDGEME_API_TOKEN) {
    return new Response(JSON.stringify({ error: 'JUDGEME_API_TOKEN not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'fetch') {
      // Fetch reviews for a product
      const productId = url.searchParams.get('product_id');
      const page = url.searchParams.get('page') || '1';
      const perPage = url.searchParams.get('per_page') || '10';

      let apiUrl = `https://judge.me/api/v1/reviews?shop_domain=${SHOP_DOMAIN}&api_token=${JUDGEME_API_TOKEN}&per_page=${perPage}&page=${page}`;
      
      if (productId) {
        // Judge.me uses external_id for Shopify product IDs
        apiUrl += `&product_id=${productId}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create' && req.method === 'POST') {
      const body = await req.json();
      const { name, email, rating, title, reviewBody, productId, productUrl } = body;

      // Judge.me public review creation endpoint
      const formData = new URLSearchParams();
      formData.append('shop_domain', SHOP_DOMAIN);
      formData.append('api_token', JUDGEME_API_TOKEN);
      formData.append('platform', 'shopify');
      formData.append('name', name);
      formData.append('email', email || `${name.replace(/\s/g, '').toLowerCase()}@review.local`);
      formData.append('rating', String(rating));
      formData.append('title', title);
      formData.append('body', reviewBody);
      formData.append('id', String(productId));
      formData.append('url', productUrl || SHOP_DOMAIN);

      const response = await fetch('https://judge.me/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_domain: SHOP_DOMAIN,
          api_token: JUDGEME_API_TOKEN,
          platform: 'shopify',
          id: productId,
          url: productUrl || SHOP_DOMAIN,
          review: {
            rating,
            title,
            body: reviewBody,
            reviewer: {
              name,
              email: email || `${name.replace(/\s/g, '').toLowerCase()}@review.local`,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return new Response(JSON.stringify({ error: 'Failed to create review', details: data }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'widget') {
      // Fetch widget data (includes aggregate stats)
      const productUrl = url.searchParams.get('product_url') || '';
      const apiUrl = `https://judge.me/api/v1/widgets/product_review?shop_domain=${SHOP_DOMAIN}&api_token=${JUDGEME_API_TOKEN}&url=${encodeURIComponent(productUrl)}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use ?action=fetch, create, or widget' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Judge.me API error:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
