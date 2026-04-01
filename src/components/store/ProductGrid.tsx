import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { extractColorFromTitle } from '@/lib/product-colors';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  // Tracks current image index per product  advances by 1 on each hover-in
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(20);
        if (data && data.length > 0) {
          setProducts(data);
        } else {
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

  const handleMouseEnter = (productId: string, imageCount: number) => {
    if (imageCount <= 1) return;
    setImageIndexes(prev => ({
      ...prev,
      [productId]: ((prev[productId] ?? 0) + 1) % imageCount,
    }));
  };

  if (loading) {
    return (
      <section style={{ padding: 'clamp(3rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 0' }}>
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const filteredProducts = products.filter(product => {
    const node = product.node;
    const combined = (node.title + ' ' + node.handle.replace(/-/g, ' ')).toLowerCase();
    return !combined.includes('pebble haze');
  });

  const displayProducts = filteredProducts.slice(0, 6);

  return (
    <section style={{ padding: 'clamp(3rem, 8vw, 0rem) clamp(1rem, 4vw, 1.5rem) clamp(3.5rem, 8vw, 7rem)' }}>

      {/* Section label */}
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.625rem',
          letterSpacing: '0.2rem',
          textTransform: 'uppercase',
          color: '#8A7E74',
          marginBottom: '2.5rem',
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
        }}
      >
        Six colourways
      </p>

      {/* Grid  2 cols on mobile, 3 cols on sm+ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.5rem',
          maxWidth: '90rem',
          margin: '0 auto',
        }}
        className="sm:grid-cols-3 sm:gap-3"
      >
        {displayProducts.map((product, idx) => {
          const node = product.node;
          const images = node.images.edges.map(e => e.node);
          const currentIndex = imageIndexes[node.id] ?? 0;
          const currentImage = images[currentIndex] ?? images[0];
          const colorName = extractColorFromTitle(node.title, node.handle);

          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.07 }}
              viewport={{ once: true }}
              className="product-card"
              style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onMouseEnter={() => handleMouseEnter(node.id, images.length)}
            >
              <Link
                to={`/product/${node.handle}`}
                style={{ display: 'block', width: '100%', height: '100%' }}
              >
                {currentImage ? (
                  <motion.img
                    key={currentImage.url}
                    src={currentImage.url}
                    alt={currentImage.altText || node.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      position: 'absolute',
                      inset: 0,
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#E8E4DE' }} />
                )}

                <span
                  className="colour-label"
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    left: '0.75rem',
                    fontSize: '0.5rem',
                    letterSpacing: '0.12rem',
                    textTransform: 'uppercase',
                    color: '#FFFFFF',
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 400,
                    pointerEvents: 'none',
                    transition: 'opacity 0.3s',
                    zIndex: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.125rem',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  {colorName || node.title}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <Link
          to="/product/sateen-bedding-set-winter-cloud"
          style={{
            display: 'inline-block',
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.625rem',
            fontWeight: 400,
            letterSpacing: '0.18rem',
            textTransform: 'uppercase',
            color: '#2C2824',
            textDecoration: 'none',
            padding: '0.9rem 2.5rem',
            border: '0.0625rem solid #2C2824',
            transition: 'all 0.35s ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = '#2C2824';
            (e.currentTarget as HTMLAnchorElement).style.color = '#FAF8F5';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            (e.currentTarget as HTMLAnchorElement).style.color = '#2C2824';
          }}
        >
          Shop the set
        </Link>
      </div>

      <style>{`
        /* Mobile: 3/4 ratio */
        .product-card {
          aspect-ratio: 3/4;
        }

        /* Desktop: shorter cards */
        @media (min-width: 640px) {
          .product-card {
            aspect-ratio: 4/5;
          }
          .sm\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
          .sm\\:gap-3 { gap: 0.75rem !important; }
          .colour-label { opacity: 0 !important; }
          a:hover .colour-label { opacity: 1 !important; }
        }

        @media (max-width: 639px) {
          .colour-label { opacity: 1 !important; }
        }
      `}</style>
    </section>
  );
}