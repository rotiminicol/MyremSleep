import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLOR_HEX: Record<string, { fill: string; shadow: string }> = {
  'Winter Cloud':     { fill: '#F5F5F7', shadow: '#d0d0d4' },
  'Desert Whisperer': { fill: '#E5DACE', shadow: '#c0b8ac' },
  'Buttermilk':       { fill: '#FFF4D2', shadow: '#e0d4a0' },
  'Clay':             { fill: '#D2C4B5', shadow: '#a89c8e' },
  'Clay Blush':       { fill: '#D9A891', shadow: '#b07a63' },
  'Clayblush Pink':   { fill: '#D9A891', shadow: '#b07a63' },
  'Pebble Haze':      { fill: '#A3A3A3', shadow: '#787878' },
  'Desert Sand':      { fill: '#E2CA9D', shadow: '#c0a870' },
  'Cinnamon Bark':    { fill: '#8B4513', shadow: '#5a2c0a' },
};

function extractColorFromTitle(title: string): string | null {
  if (title.toLowerCase().includes('winter cloud')) return 'Winter Cloud';
  if (title.toLowerCase().includes('buttermilk')) return 'Buttermilk';
  if (title.toLowerCase().includes('desert whisperer')) return 'Desert Whisperer';
  if (title.toLowerCase().includes('desert sand')) return 'Desert Sand';
  if (title.toLowerCase().includes('clay blush') || title.toLowerCase().includes('clayblush')) return 'Clay Blush';
  if (title.toLowerCase().includes('pebble haze')) return 'Pebble Haze';
  if (title.toLowerCase().includes('cinnamon bark')) return 'Cinnamon Bark';
  if (title.toLowerCase().includes('clay') && !title.toLowerCase().includes('blush')) return 'Clay';
  return null;
}

export function ProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const breatheRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('Loading products from Shopify store...');
        const data = await fetchProducts(20);
        console.log('Shopify API response:', data);
        
        if (data && data.length > 0) {
          console.log(`Successfully loaded ${data.length} products from Shopify`);
          setProducts(data);
        } else {
          console.warn('No products returned from Shopify API');
          setProducts([]);
        }
      } catch (error) {
        console.error('Failed to load products from Shopify API:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (breatheRef.current) clearInterval(breatheRef.current);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
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

  const activeProduct = products[activeProductIndex];
  const activeImage = activeProduct.node.images.edges[0]?.node;
  const activeColorName = extractColorFromTitle(activeProduct.node.title);
  const activeColor = activeColorName ? COLOR_HEX[activeColorName] : null;

  return (
    <section className="pb-8 md:pb-12 md:px-6 bg-[#f2e9dc]">
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes swatchBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.09); }
        }
        @keyframes swatchRipple {
          0%   { transform: scale(1);   opacity: 0.65; }
          100% { transform: scale(1.85); opacity: 0; }
        }
        @keyframes swatchIdlePulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.05); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="group"
      >
        <Link to={`/product/${activeProduct.node.handle}`} className="block">
          <div className="relative aspect-[3/4] md:aspect-[21/9] bg-[#EBE7E0] overflow-hidden md:rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-700">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeProduct.node.id}
                src={activeImage?.url}
                alt={activeImage?.altText || activeProduct.node.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

            {/* Centered Content Overlay */}
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
          One set. Eight seasonless colourways. Effortless calm
        </h3>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-2 md:mb-4 w-full max-w-full px-4">
          {products.map((product, idx) => {
            const colorName = extractColorFromTitle(product.node.title);
            const color = colorName ? COLOR_HEX[colorName] : { fill: '#ccc', shadow: '#999' };
            const isActive = activeProductIndex === idx;

            return (
              <button
                key={product.node.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveProductIndex(idx);
                }}
                title={colorName || product.node.title}
                className="flex flex-col items-center gap-1.5 flex-shrink-0 bg-transparent border-none cursor-pointer"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Ripple ring — only on active */}
                {isActive && (
                  <span
                    key={`ripple-${idx}`}
                    style={{
                      position: 'absolute',
                      inset: '8px',
                      borderRadius: '50%',
                      border: `2px solid ${color.fill}`,
                      animation: 'swatchRipple 1.4s ease-out infinite',
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {/* Circle */}
                <span
                  className="relative"
                  style={{
                    display: 'block',
                    width: 'clamp(32px, 5vw, 48px)',
                    height: 'clamp(32px, 5vw, 48px)',
                    borderRadius: '50%',
                    backgroundColor: color.fill,
                    border: isActive
                      ? `2.5px solid ${color.shadow}`
                      : '2px solid transparent',
                    boxShadow: isActive
                      ? `0 0 0 3px ${color.fill}88, 0 4px 18px ${color.shadow}66`
                      : '0 2px 8px rgba(0,0,0,0.10)',
                    animation: isActive
                      ? 'swatchBreathe 2.4s ease-in-out infinite'
                      : undefined,
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                />
                
                {/* Color name under circle - only show when active */}
                {isActive && (
                  <span
                    style={{
                      fontSize: '9px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 500,
                      color: '#000000',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      maxWidth: '60px',
                    }}
                  >
                    {colorName || product.node.title.split(' ')[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}