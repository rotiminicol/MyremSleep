import { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
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

export function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
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
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-[#f5f1ed]">
        <SheetHeader className="flex-shrink-0 border-b border-[#e0dbd5] pb-4">
          <SheetTitle className="text-lg font-medium tracking-wide">Shopping Cart</SheetTitle>
          <SheetDescription className="text-sm text-gray-600">
            {totalItems === 0
              ? 'Your cart is empty'
              : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-4 pb-6 border-b border-[#e0dbd5]"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-[#e8e3dc] rounded overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
                          {item.product.node.title}
                        </h4>
                        {item.selectedOptions.length > 0 && (
                          <p className="text-xs text-gray-500 mb-2">
                            {item.selectedOptions.map((opt) => opt.value).join(' • ')}
                          </p>
                        )}
                        <p className="text-sm font-medium text-gray-800">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="flex items-center gap-2 border border-gray-300 rounded">
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            className="p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-[#e0dbd5] bg-[#f5f1ed]">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800">Subtotal</span>
                  <span className="text-lg font-medium text-gray-900">
                    {items[0]?.price.currencyCode || 'GBP'} {totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Shipping and taxes calculated at checkout
                </p>
                <button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || isLoading || isSyncing}
                  className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    'Checkout'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
