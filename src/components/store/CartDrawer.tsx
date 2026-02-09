import { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
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

import { CartSidebar } from '@/components/store/CartSidebar';

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );

  // Sync cart with Shopify when drawer opens
  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative text-gray-800 hover:text-gray-600 transition-colors">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-gray-900 text-white">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className={`bg-[#f5f1ed] p-0 gap-0 border-zinc-200 h-full flex flex-row overflow-hidden ${isMobile
          ? "w-full border-l shadow-2xl"
          : "w-full sm:max-w-3xl border-l"
          }`}
      >

        {/* Left Sidebar - Recommendations */}
        <CartSidebar mode="cart" />

        {/* Right Side - Cart Content */}
        <div className="flex flex-col w-[55%] md:flex-1 h-full min-w-0 overflow-hidden">
          <SheetHeader className="sticky top-0 z-30 flex-shrink-0 px-3 md:px-8 py-4 md:py-6 border-b border-[#e0dbd5] bg-[#f5f1ed]">
            <div className="flex items-center justify-between gap-2">
              <SheetTitle className="text-[15px] md:text-[22px] font-medium tracking-tight text-gray-900 whitespace-nowrap">Shopping Bag</SheetTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 md:p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500 hover:text-gray-900 flex-shrink-0"
                aria-label="Close cart"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </SheetHeader>

          <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#f5f1ed]">
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
                    {items.map((item) => (
                      <div
                        key={item.variantId}
                        className="grid grid-cols-[80px_1fr_auto] gap-6 items-start"
                      >
                        {/* Product Image */}
                        <div className="aspect-square bg-white rounded-sm overflow-hidden flex-shrink-0 shadow-sm">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img
                              src={item.product.node.images.edges[0].node.url}
                              alt={item.product.node.title}
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
                            {item.product.node.title}
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
                            {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="mt-6 text-gray-400 hover:text-gray-600 transition-colors text-[10px] uppercase underline tracking-wider font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-20 flex-shrink-0 px-8 py-8 border-t border-[#e0dbd5] bg-[#f5f1ed]/95 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Subtotal</span>
                    <span className="text-lg font-bold text-gray-900 tracking-tight">
                      {items[0]?.price.currencyCode || 'GBP'} {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-center text-[11px] text-gray-500 italic mb-8">
                    Shipping and taxes calculated at checkout
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={items.length === 0 || isLoading || isSyncing}
                      className="w-full bg-gray-900 text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all transform active:scale-[0.99] disabled:opacity-50"
                    >
                      {isLoading || isSyncing ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
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
