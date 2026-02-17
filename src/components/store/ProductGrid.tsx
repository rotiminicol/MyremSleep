import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLOR_VARIANTS = [
  { name: 'Winter Cloud', hex: '#F5F5F7', image: '/products/midnight-silk.png' },
  { name: 'Desert Whisperer', hex: '#E5DACE', image: '/products/linen-duvet-clay.png' },
  { name: 'Buttermilk', hex: '#FFF4D2', image: '/products/cotton-quilt-sandstone.png' },
  { name: 'Sandstone Drift', hex: '#D2C4B5', image: '/products/bamboo-sheets-grey.png' },
  { name: 'Clay Blush', hex: '#D9A891', image: '/products/lavender-eye-pillow.png' },
  { name: 'Pebble Haze', hex: '#A3A3A3', image: '/products/sleep-mask-indigo.png' },
  { name: 'Desert Sand', hex: '#E2CA9D', image: '/products/midnight-silk.png' },
  { name: 'Cinnamon Bark', hex: '#8B4513', image: '/products/linen-duvet-clay.png' },
];

export function ProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeColor, setActiveColor] = useState(COLOR_VARIANTS[0]);

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


  if (loading) {
    return (
      <section className="py-16 px-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const product = products[0];
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;

  return (
    <section className="pb-8 md:pb-12 md:px-6 bg-[#f5f1ed]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="group"
      >
        <Link to={`/product/${product.node.handle}`} className="block">
          <div className="relative aspect-[3/4] md:aspect-[21/9] bg-[#EBE7E0] overflow-hidden md:rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-700">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeColor.name}
                src={activeColor.image}
                alt={`${product.node.title} in ${activeColor.name}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

            {/* Centered Content Overlay for wide card */}
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-16 flex flex-col items-center text-center bg-gradient-to-t from-black/20 to-transparent">
              <div className="w-full max-w-xs transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-full bg-white text-gray-900 py-4 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-black hover:text-white transition-all transform active:scale-[0.98] flex items-center justify-center cursor-pointer"
                >
                  Shop Now
                </motion.div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Color Swatches Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-2 md:mt-12 flex flex-col items-center text-center px-6"
      >
        <h3 className="text-[11px] min-[375px]:text-[13px] min-[425px]:text-sm sm:text-lg md:text-2xl font-serif text-gray-900 mb-2 md:mb-6 whitespace-nowrap">
          Seven seasonless colours. One calm aesthetic.
        </h3>

        <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-2 mb-2 md:mb-4 w-full max-w-full overflow-x-auto px-4 no-scrollbar">
          {COLOR_VARIANTS.map((color) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveColor(color);
              }}
              className={`flex-shrink-0 w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 min-[425px]:w-10 min-[425px]:h-10 md:w-12 md:h-12 border transition-all duration-300 ${activeColor.name === color.name
                ? 'border-gray-900 scale-105 shadow-sm'
                : 'border-transparent hover:border-gray-300'
                }`}
              title={color.name}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>

        <span className="text-[11px] text-gray-900 font-sans uppercase tracking-[0.1em] font-medium min-h-[1.5em]">
          {activeColor.name}
        </span>
      </motion.div>
    </section>
  );
}
