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
    <section className="pb-16 md:pb-32 px-6 bg-[#f5f1ed]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="group"
      >
        <Link to={`/product/${product.node.handle}`} className="block">
          <div className="relative aspect-[4/5] md:aspect-[21/9] bg-[#EBE7E0] overflow-hidden rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-700">
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

      {/* Color Swatches */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="mt-8 flex flex-col items-start"
      >
        <span className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-medium mb-4">
          Color: {activeColor.name}
        </span>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_VARIANTS.map((color) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveColor(color);
              }}
              className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${activeColor.name === color.name
                ? 'border-zinc-800 scale-110'
                : 'border-transparent hover:border-zinc-300 hover:scale-105'
                }`}
              title={color.name}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
