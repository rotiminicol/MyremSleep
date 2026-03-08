import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SHOPIFY_STORE_PERMANENT_DOMAIN } from '@/lib/shopify';

/**
 * Catches /cart/c/* routes that Shopify redirects to the custom domain.
 * Immediately redirects the browser to Shopify's permanent domain for checkout.
 */
export default function ShopifyCheckoutRedirect() {
  const params = useParams();

  useEffect(() => {
    const token = params['*'] || '';
    const search = window.location.search;
    const targetUrl = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/cart/c/${token}${search}`;
    
    // Use location.replace so the user doesn't get stuck in back-button loops
    window.location.replace(targetUrl);
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1ed]">
      <p className="text-sm text-gray-500 font-light">Redirecting to checkout…</p>
    </div>
  );
}
