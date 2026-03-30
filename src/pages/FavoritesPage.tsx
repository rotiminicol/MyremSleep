import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowLeft, Loader2, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useUserCart } from '@/stores/userCartStore';
import { useCurrency } from '@/hooks/useCurrency';
import { SimpleBackButton } from '@/components/SimpleBackButton';
import { toast } from 'sonner';

// Color mappings for favorites display
const COLOR_MAP: Record<string, string> = {
  'Winter Cloud': '/products/midnight-silk.png',
  'Desert Whisperer': '/products/linen-duvet-clay.png',
  'Buttermilk': '/products/cotton-quilt-sandstone.png',
  'Clay': '/products/bamboo-sheets-grey.png',
  'Clay Blush': '/products/lavender-eye-pillow.png',
  'Pebble Haze': '/products/sleep-mask-indigo.png',
  'Desert Sand': '/products/midnight-silk.png',
  'Cinnamon Bark': '/cinamon3.png',
};

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

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { items, removeFavorite, clearFavorites, syncFromDb } = useFavoritesStore();
  const { addItem: addToCart, isLoading: isCartLoading } = useUserCart();
  const { formatPrice } = useCurrency();
  const [isRemoving, setIsRemoving] = useState<string | null>(null);

  useEffect(() => {
    syncFromDb();
  }, []);

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

  const handleRemoveFavorite = async (productId: string) => {
    setIsRemoving(productId);
    await new Promise(resolve => setTimeout(resolve, 300)); // Small delay for visual feedback
    removeFavorite(productId);
    setIsRemoving(null);
    toast.success('Removed from favorites', { position: 'top-center' });
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      clearFavorites();
      toast.success('All favorites cleared', { position: 'top-center' });
    }
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
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          className="absolute top-[-80px] right-0 w-[500px] h-[500px] rounded-full bg-[#d4ccc3] blur-[100px] opacity-20"
          animate={{ scale: [1, 1.15, 1], x: [0, -40, 0] }} 
          transition={{ duration: 20, repeat: Infinity }} 
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#c8c0b7] blur-[90px] opacity-15"
          animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }} 
          transition={{ duration: 16, repeat: Infinity, delay: 4 }} 
        />
      </div>

      <SimpleBackButton />

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-16 pb-24">
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] tracking-[0.5em] text-[#8f877d] block mb-3 uppercase font-medium">My Account</span>
              <h1 className="text-[clamp(40px,5.5vw,72px)] font-serif text-gray-900 leading-none tracking-tight">
                My Favorites
              </h1>
              <p className="text-gray-600 mt-3 text-lg">
                {items.length === 0 
                  ? 'Start building your dream bedroom collection' 
                  : `You have ${items.length} favorite${items.length === 1 ? '' : 's'}`
                }
              </p>
            </div>
            {items.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50/80 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Clear All</span>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Favorites Grid */}
        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-24"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#f0ece7] to-[#e8e3dc] flex items-center justify-center shadow-lg"
                >
                  <Heart className="w-10 h-10 text-gray-400" />
                </motion.div>
                <h3 className="text-2xl font-serif text-gray-900 mb-4">No favorites yet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Start exploring our collection and save your favorite bedding sets. Click the heart icon on any product to add it here.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/store')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-sm font-bold tracking-[0.2em] uppercase hover:bg-black transition-all shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Start Shopping
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {items.map((item, index) => {
                const variant = item.selectedVariant || item.product.node.variants.edges[0]?.node;
                const selectedColor = variant?.selectedOptions?.find(opt => 
                  opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
                )?.value;
                
                const colorTitle = selectedColor && COLOR_DESCRIPTIONS[selectedColor] 
                  ? COLOR_DESCRIPTIONS[selectedColor].title 
                  : item.product.node.title;
                
                const colorImage = selectedColor && COLOR_MAP[selectedColor]
                  ? COLOR_MAP[selectedColor]
                  : item.product.node.images?.edges?.[0]?.node?.url;

                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    layout
                    className="group"
                  >
                    <div className="bg-white/75 backdrop-blur-lg rounded-2xl border border-white/80 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                      {/* Product Image */}
                      <div className="aspect-[4/5] bg-gray-50 overflow-hidden relative">
                        {colorImage && (
                          <motion.img
                            src={colorImage}
                            alt={colorTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            whileHover={{ scale: 1.05 }}
                          />
                        )}
                        
                        {/* Remove Favorite Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveFavorite(item.productId)}
                          disabled={isRemoving === item.productId}
                          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 transition-all"
                        >
                          {isRemoving === item.productId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Heart className="w-4 h-4 fill-current" />
                          )}
                        </motion.button>
                      </div>

                      {/* Product Info */}
                      <div className="p-6 space-y-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.15em] text-gray-400 font-semibold block mb-2">
                            {item.product.node.productType || 'Bedding'}
                          </span>
                          <h3 className="text-lg font-serif text-gray-900 leading-tight mb-2">
                            {colorTitle}
                          </h3>
                          {variant && variant.selectedOptions?.some(opt => opt.value !== 'Default Title' && opt.value !== 'Default') && (
                            <p className="text-[11px] text-gray-500 font-medium italic">
                              {variant.selectedOptions.filter(opt => opt.value !== 'Default').map((opt) => opt.value).join(' • ')}
                            </p>
                          )}
                        </div>

                        {/* Price and Actions */}
                        <div className="flex items-center justify-between pt-2">
                          {variant && (
                            <span className="text-lg font-bold text-gray-900">
                              {formatPrice(parseFloat(variant.price.amount))}
                            </span>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCart(item)}
                            disabled={isCartLoading}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all disabled:opacity-50"
                          >
                            {isCartLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5" />
                            )}
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
