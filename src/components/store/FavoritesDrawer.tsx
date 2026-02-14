import { Heart, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCartStore } from '@/stores/cartStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { CartSidebar } from './CartSidebar';
import { toast } from 'sonner';

export function FavoritesDrawer() {
    const { items, isFavoritesOpen, setFavoritesOpen, removeFavorite } = useFavoritesStore();
    const { addItem: addToCart } = useCartStore();
    const isMobile = useIsMobile();

    const handleAddToCart = async (item: typeof items[0]) => {
        const variant = item.selectedVariant || item.product.node.variants.edges[0]?.node;

        if (!variant) {
            toast.error('Product variant not available');
            return;
        }

        await addToCart({
            product: item.product,
            variantId: variant.id,
            variantTitle: variant.title,
            price: variant.price,
            quantity: 1,
            selectedOptions: variant.selectedOptions || item.product.node.variants.edges[0]?.node.selectedOptions || [],
        });

        toast.success('Added to cart', {
            description: item.product.node.title,
            position: 'top-center',
        });
    };

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
        <Sheet open={isFavoritesOpen} onOpenChange={setFavoritesOpen}>
            <SheetTrigger asChild>
                <button className="relative text-gray-800 hover:text-gray-600 transition-colors">
                    <img src="/wishlist.png" alt="Favorites" className="h-5 w-5 object-contain" />
                    {items.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-gray-900 text-white">
                            {items.length}
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
                <CartSidebar mode="favorite" />

                {/* Right Side - Favorites Content */}
                <div className="flex flex-col w-[55%] md:flex-1 h-full min-w-0 overflow-hidden">
                    <SheetHeader className="sticky top-0 z-30 flex-shrink-0 px-3 md:px-8 py-4 md:py-6 border-b border-[#e0dbd5] bg-[#f5f1ed]">
                        <div className="flex items-center justify-between gap-2">
                            <SheetTitle className="text-[15px] md:text-[22px] font-medium tracking-tight text-gray-900 whitespace-nowrap">
                                Favorites
                            </SheetTitle>
                            <button
                                onClick={() => setFavoritesOpen(false)}
                                className="p-1.5 md:p-2 hover:bg-gray-200/50 rounded-full transition-colors text-gray-500 hover:text-gray-900 flex-shrink-0"
                                aria-label="Close favorites"
                            >
                                <img src="/cancel.png" alt="Remove" className="h-4 w-4 md:h-5 md:w-5 object-contain" />
                            </button>
                        </div>
                    </SheetHeader>

                    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-[#f5f1ed]">
                        {items.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center px-8">
                                <div className="text-center">
                                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-light italic">Your favorites list is currently empty.</p>
                                    <p className="text-gray-400 text-sm mt-2">Click the heart icon on products to save them here.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto px-8 py-6 min-h-0 custom-scrollbar">
                                <div className="space-y-10">
                                    {items.map((item) => {
                                        const variant = item.selectedVariant || item.product.node.variants.edges[0]?.node;

                                        return (
                                            <div
                                                key={item.productId}
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
                                                        {item.product.node.productType || 'Product'}
                                                    </span>
                                                    <h4 className="text-[15px] font-medium text-gray-900 leading-tight">
                                                        {item.product.node.title}
                                                    </h4>
                                                    {variant && variant.selectedOptions?.some(opt => opt.value !== 'Default Title' && opt.value !== 'Default') && (
                                                        <p className="text-[11px] text-gray-500 font-medium italic mb-2">
                                                            {variant.selectedOptions.filter(opt => opt.value !== 'Default').map((opt) => opt.value).join(' • ')}
                                                        </p>
                                                    )}

                                                    {/* Add to Cart Button */}
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        className="mt-2 w-fit px-4 py-2 bg-gray-900 text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>

                                                {/* Price & Remove */}
                                                <div className="flex flex-col items-end gap-1">
                                                    {variant && (
                                                        <span className="text-[14px] font-medium text-gray-900">
                                                            {getCurrencySymbol(variant.price.currencyCode)}{parseFloat(variant.price.amount).toFixed(2)}
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => removeFavorite(item.productId)}
                                                        className="mt-6 text-gray-400 hover:text-gray-600 transition-colors text-[10px] uppercase underline tracking-wider font-bold"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer - Only show if there are items */}
                    {items.length > 0 && (
                        <div className="sticky bottom-0 z-20 flex-shrink-0 px-8 py-6 border-t border-[#e0dbd5] bg-[#f5f1ed]/95 backdrop-blur-md">
                            <button
                                onClick={() => setFavoritesOpen(false)}
                                className="w-full bg-white border border-gray-200 text-gray-900 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all transform active:scale-[0.99]"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
