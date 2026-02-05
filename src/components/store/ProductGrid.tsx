import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { useCartStore } from '@/stores/cartStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: true,
  });

  const [selectingSize, setSelectingSize] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(4);
        if (data && data.length > 0) {
          setProducts(data.slice(0, 4));
        } else {
          setProducts(MOCK_PRODUCTS.slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts(MOCK_PRODUCTS.slice(0, 4));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = async (product: ShopifyProduct, e: React.MouseEvent, sizeLabel?: string) => {
    e.preventDefault();
    e.stopPropagation();

    const hasSizes = product.node.options.some(opt => opt.name === 'Size');

    if (hasSizes && !sizeLabel) {
      setSelectingSize(product.node.id);
      return;
    }

    let variant = product.node.variants.edges[0]?.node;

    if (sizeLabel) {
      const selectedVariant = product.node.variants.edges.find(
        v => v.node.selectedOptions.some(opt => opt.name === 'Size' && opt.value === sizeLabel)
      );
      if (selectedVariant) {
        variant = selectedVariant.node;
      }
    }

    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    setSelectingSize(null);
    toast.success('Added to cart', {
      description: `${product.node.title}${sizeLabel ? ` - ${sizeLabel}` : ''}`,
      position: 'top-center',
    });
  };

  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-8 md:pb-24 px-6 bg-[#f5f1ed]" onMouseLeave={() => setSelectingSize(null)}>
      <div className="w-full">
        {/* Carousel Content */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {products.map((product, index) => {
              const image = product.node.images.edges[0]?.node;
              const price = product.node.priceRange.minVariantPrice;
              const isSelecting = selectingSize === product.node.id;
              const hasSizes = product.node.options.some(opt => opt.name === 'Size');

              return (
                <div key={product.node.id} className="flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] pl-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Link to={`/product/${product.node.handle}`} className="block">
                      <div className="relative aspect-[2/3] md:aspect-[4/5] bg-[#EBE7E0] overflow-hidden rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-500">
                        {image ? (
                          <img
                            src={image.url}
                            alt={image.altText || product.node.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            No image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                        {/* Quick Add Overlay */}
                        <div className="absolute bottom-6 left-6 right-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <AnimatePresence mode="wait">
                            {!isSelecting ? (
                              <motion.button
                                key="add-btn"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={(e) => handleAddToCart(product, e)}
                                disabled={isCartLoading}
                                className="w-full bg-white/95 backdrop-blur-md text-gray-900 py-3.5 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-white transition-all transform active:scale-[0.98]"
                              >
                                {isCartLoading ? 'Adding...' : 'Add to Cart'}
                              </motion.button>
                            ) : (
                              <motion.div
                                key="size-buttons"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex gap-2"
                              >
                                {['Double', 'King'].map((size) => (
                                  <button
                                    key={size}
                                    onClick={(e) => handleAddToCart(product, e, size)}
                                    className="flex-1 bg-white/95 backdrop-blur-md text-gray-900 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-black hover:text-white transition-all transform active:scale-[0.95]"
                                  >
                                    {size}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="pt-4 sm:pt-6 pb-2 text-left">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 uppercase tracking-[0.1em] font-medium mb-1 block">
                          New Arrival
                        </span>
                        <h3 className="text-[13px] sm:text-[15px] text-zinc-800 mb-1 font-medium tracking-tight group-hover:text-zinc-950 transition-colors line-clamp-1">
                          {product.node.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-zinc-600 italic font-playfair">
                          {price.currencyCode === 'GBP' ? '£' : price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="mt-8 flex justify-center md:hidden">
          <div className="h-0.5 w-12 bg-gray-200/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gray-400/50"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
