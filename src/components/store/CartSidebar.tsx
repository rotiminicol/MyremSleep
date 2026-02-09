
import { useState } from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cartStore';

// Mock Data for Recommended Products
const RECOMMENDED_PRODUCTS = [
    {
        id: 'rec_1',
        title: 'Bamboo Sheet Set',
        price: '125.00',
        currency: 'GBP',
        image: '/products/bamboo-sheets-grey.png',
        colors: ['#808080', '#ffffff', '#e0e0e0'],
        sizes: ['King', 'Double'],
        variantId: 'gid://shopify/ProductVariant/mock1'
    },
    {
        id: 'rec_2',
        title: 'Cotton Quilt',
        price: '180.00',
        currency: 'GBP',
        image: '/products/cotton-quilt-sandstone.png',
        colors: ['#d2b48c', '#ffffff', '#808080'],
        sizes: ['King', 'Double'],
        variantId: 'gid://shopify/ProductVariant/mock2'
    },
    {
        id: 'rec_3',
        title: 'Linen Duvet Cover',
        price: '145.00',
        currency: 'GBP',
        image: '/products/linen-duvet-clay.png',
        colors: ['#bcaaa4', '#ffffff', '#808080'],
        sizes: ['King', 'Double'],
        variantId: 'gid://shopify/ProductVariant/mock3'
    }
];

export type SidebarMode = 'cart' | 'favorite';

interface CartSidebarProps {
    mode?: SidebarMode;
}

export function CartSidebar({ mode = 'cart' }: CartSidebarProps) {
    const { addItem } = useCartStore();

    return (
        <div className="w-[45%] md:w-[320px] bg-[#1a1a1a] text-white flex flex-col h-full border-r border-gray-800 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full z-10 p-3 md:p-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                <h3 className="text-sm md:text-lg font-medium tracking-wide flex items-center gap-2 text-white/90">
                    <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                    You Might Also Like
                </h3>
            </div>

            {/* Main Container for products - fills available space and distributes items */}
            <div className="flex-1 flex flex-col min-h-0">
                {RECOMMENDED_PRODUCTS.slice(0, 3).map((product) => (
                    <RecommendedProductCard
                        key={product.id}
                        product={product}
                        mode={mode}
                    />
                ))}
            </div>
        </div>
    );
}

function RecommendedProductCard({ product, mode }: { product: any, mode: SidebarMode }) {
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        setTimeout(() => {
            console.log(`Action: ${mode === 'cart' ? 'Add to Bag' : 'Favorite'} - ${product.title} - ${selectedColor} - ${selectedSize} x ${quantity}`);
            setIsAdding(false);
        }, 500);
    };

    return (
        <div className="group relative flex-1 min-h-[220px] md:min-h-0 w-full overflow-hidden border-b border-white/10 last:border-0">
            {/* Background Image - Full Size */}
            <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x600/333/fff?text=' + encodeURIComponent(product.title); }}
            />

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Content Overlay - Hidden by default, slides up/fades in on hover */}
            <div className="absolute inset-x-0 bottom-0 p-3 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/90 via-black/60 to-transparent">

                {/* Title & Price */}
                <div className="flex justify-between items-end mb-2 md:mb-4">
                    <div>
                        <h4 className="text-[12px] md:text-base font-medium text-white leading-tight shadow-black drop-shadow-md">{product.title}</h4>
                        <p className="text-[11px] md:text-sm text-gray-200 mt-0.5">{product.currency} {product.price}</p>
                    </div>
                </div>

                {/* Controls Container */}
                <div className="space-y-2 md:space-y-3">
                    {/* Colors & Sizes Row */}
                    <div className="flex flex-col gap-2">
                        {product.colors.length > 0 && (
                            <div className="flex gap-1.5 items-center">
                                {product.colors.map((color: string) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-3.5 h-3.5 md:w-5 md:h-5 rounded-full border ${selectedColor === color ? 'border-white scale-110' : 'border-transparent'} transition-all`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}

                        {product.sizes.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {product.sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-1.5 py-0.5 text-[8px] md:text-[10px] border ${selectedSize === size ? 'border-white text-white bg-white/20' : 'border-white/30 text-gray-300'} transition-colors uppercase font-medium rounded-sm`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quantity & Add Row */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center border border-white/30 rounded-sm h-7 md:h-9 bg-black/40 backdrop-blur-md w-fit">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-2 md:px-3 hover:bg-white/20 text-white h-full flex items-center justify-center transition-colors"
                            >
                                <Minus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </button>
                            <span className="text-[10px] md:text-xs w-4 md:w-6 text-center font-medium text-white">{quantity}</span>
                            <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-2 md:px-3 hover:bg-white/20 text-white h-full flex items-center justify-center transition-colors"
                            >
                                <Plus className="w-2.5 h-2.5 md:w-3 md:h-3" />
                            </button>
                        </div>

                        <Button
                            onClick={handleAddToCart}
                            className="w-full h-7 md:h-9 text-[9px] md:text-xs bg-white text-black hover:bg-gray-200 font-bold uppercase tracking-tight md:tracking-widest"
                            disabled={isAdding}
                        >
                            {isAdding ? '...' : (mode === 'cart' ? 'Add to Bag' : 'Favorite')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
