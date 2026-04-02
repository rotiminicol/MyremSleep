import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, X } from 'lucide-react';
import { useUserCart } from '@/stores/userCartStore';
import { normalizeShopifyCheckoutUrl, ShopifyProduct } from '@/lib/shopify';
import { COLOR_HEX, extractColorFromTitle } from '@/lib/product-colors';

import { useCurrency } from '@/hooks/useCurrency';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


const COLOR_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  'Winter Cloud': {
    title: 'Winter Cloud  Crisp white. Soft glow. Always polished.',
    description: 'A bright, clean white with a hotel-fresh finish. In sateen it looks luminous (never flat) and makes every room feel lighter.'
  },
  'Buttermilk': {
    title: 'Buttermilk  Warm cream. Quiet luxury.',
    description: 'A creamy off-white with a gentle warmth. Sateen makes it look rich and smoothlike classic white, upgraded.'
  },
  'Desert Whisperer': {
    title: 'Desert Whisperer  Sun-washed nude. Calm, not sweet.',
    description: 'A blush-sand neutral that warms a room without stealing focus. Sateen adds a refined, clean sheen.'
  },
  'Desert Sand': {
    title: 'Desert Sand  The anchor neutral. Effortlessly styled.',
    description: 'A modern beige with balance and depthmade for layering. Always looks intentional, even on low-effort days.'
  },
  'Clay Blush': {
    title: 'Clayblush Pink  Muted blush. Modern and grown.',
    description: 'A dusty rose-clay neutralsoft, earthy, quietly romantic. In sateen it reads smooth and elevated, not shiny.'
  },
  'Pebble Haze': {
    title: 'Pebble Haze  Cool grey. Clean calm.',
    description: 'A mid-grey with an architectural feel. Sateen gives it depth and softnessminimal, but never cold.'
  },
  'Cinnamon Bark': {
    title: 'Cinnamon Bark  Deep brown. Grounded. Inviting.',
    description: 'A rich, earthy brown that makes the room feel intentional. Sateen adds a soft sheen and tailored drape.'
  },
  'Clay': {
    title: 'Clay  Soft clay. Lightly sun-warmed. Calm and clean.',
    description: 'A pale clay with no pink in itjust a quiet warmth that feels natural and modern. It brightens the room without turning cold.'
  }
};



export function CartDrawer() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { items, isLoading, isSyncing, isCartOpen, updateQuantity, removeItem, getCheckoutUrl, syncCart, setCartOpen } =
    useUserCart();
  const { formatPrice } = useCurrency();
  

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );

  // Auto-close cart when it becomes empty
  useEffect(() => {
    if (items.length === 0 && isCartOpen) {
      setCartOpen(false);
    }
  }, [items.length, isCartOpen, setCartOpen]);

  // Debug logging
  useEffect(() => {
    console.log('[CartDrawer] State updated:', {
      itemCount: items.length,
      totalItems,
      isCartOpen,
      items
    });
  }, [items, isCartOpen, totalItems]);

  // Sync cart with Shopify when drawer opens
  useEffect(() => {
    if (isCartOpen) syncCart();
  }, [isCartOpen, syncCart]);

  const buildCheckoutNavigationUrl = (rawCheckoutUrl: string) => {
    const baseUrl = normalizeShopifyCheckoutUrl(rawCheckoutUrl);
    const url = new URL(baseUrl);
    const failedReturnUrl = `${window.location.origin}/checkout/failed`;

    url.searchParams.set('return_url', failedReturnUrl);
    url.searchParams.set('channel', 'online_store');

    return url.toString();
  };

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.location.href = buildCheckoutNavigationUrl(checkoutUrl);
    } else {
      navigate('/checkout');
      setCartOpen(false);
    }
  };

  // Helper function to get currency symbol
  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      'GBP': '£',
      'USD': '$',
      'EUR': '€',
      'CAD': 'CA$',
      'AUD': 'A$',
    };
    return symbols[code] || code;
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <button className="relative text-gray-800 hover:text-gray-600 transition-colors">
          <img src="/shopping-bag (1).png" alt="Cart" className="h-5 w-5 object-contain" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-white">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={`bg-[#F2EDE8] p-0 gap-0 border-zinc-200 h-full flex flex-col overflow-hidden ${isMobile
          ? "w-full border-l shadow-2xl"
          : "w-full sm:max-w-md border-l"
          }`}
      >

        {/* Cart Content */}
        <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
          <SheetHeader className="sticky top-0 z-30 flex-shrink-0 px-3 md:px-8 py-4 md:py-6 border-b border-[#e0dbd5] bg-[#F2EDE8]">
            <div className="flex items-center justify-between gap-2">
              <SheetTitle className="text-[15px] md:text-[22px] font-medium tracking-tight text-gray-900 whitespace-nowrap">Shopping Bag</SheetTitle>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 md:p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500 hover:text-gray-900 flex-shrink-0"
                aria-label="Close cart"
              >
                <img src="/cancel.png" alt="Remove" className="h-4 w-4 md:h-5 md:w-5 object-contain" />
              </button>
            </div>
          </SheetHeader>

          <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#F2EDE8]">
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center px-8">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-light italic">Your shopping bag is currently empty.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0 custom-scrollbar">
                  <div className="space-y-10">
                    {items.map((item) => {
                      // Get the selected color from the item's selected options
                      const selectedColor = item.selectedOptions.find(opt => 
                        opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
                      )?.value;
                      
                      // Get color-specific title and image
                      const colorName = selectedColor || extractColorFromTitle(item.product.node.title, item.product.node.handle);
                      const colorTitle = colorName 
                        ? `${colorName}  ${COLOR_HEX[colorName]?.fill || ''}` // Fallback logic
                        : item.product.node.title;
                      
                      const colorImage = item.product.node.images?.edges?.[0]?.node?.url;

                      return (
                        <div
                          key={item.variantId}
                          className="grid grid-cols-[80px_1fr_auto] gap-6 items-start"
                        >
                          {/* Product Image */}
                          <div className="aspect-square bg-white rounded-sm overflow-hidden flex-shrink-0 shadow-sm">
                            {colorImage && (
                              <img
                                src={colorImage}
                                alt={colorTitle}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-semibold mb-0.5">
                              {item.product.node.productType || 'Bedding'}
                            </span>
                            <h4 className="text-[15px] font-medium text-gray-900 leading-tight">
                              {colorTitle}
                            </h4>
                            {item.selectedOptions.some(opt => opt.value !== 'Default Title' && opt.value !== 'Default') && (
                              <p className="text-[11px] text-gray-500 font-medium italic mb-2">
                                {item.selectedOptions.filter(opt => opt.value !== 'Default').map((opt) => opt.value).join(' • ')}
                              </p>
                            )}

                            {/* Quantity Controls - Boxed Style */}
                            <div className="mt-2 flex items-center border border-gray-200 bg-white w-fit divide-x divide-gray-200">
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-5 py-1.5 text-xs font-medium min-w-[40px] text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                className="px-3 py-1.5 text-gray-500 hover:text-gray-900 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[14px] font-medium text-gray-900">
                              {formatPrice(parseFloat(item.price.amount))}
                            </span>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="mt-6 text-gray-400 hover:text-gray-600 transition-colors text-[10px] uppercase underline tracking-wider font-bold"
                            >
                              <Trash2 className="w-4 h-4 inline mr-1 text-red-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-20 flex-shrink-0 px-8 py-8 border-t border-[#e0dbd5] bg-[#F2EDE8]/95 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Subtotal</span>
                    <span className="text-lg font-bold text-gray-900 tracking-tight">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={items.length === 0 || isLoading || isSyncing}
                      className="w-full bg-primary text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all transform active:scale-[0.99] disabled:opacity-50"
                    >
                      {isLoading || isSyncing ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </button>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="w-full bg-white border border-gray-200 text-gray-900 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all transform active:scale-[0.99]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
