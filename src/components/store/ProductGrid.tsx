import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ProductGrid() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts(12);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = async (product: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });

    toast.success('Added to cart', {
      description: product.node.title,
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

  if (products.length === 0) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Headers */}
          <div className="flex flex-wrap gap-8 mb-12">
            <h2 className="text-sm text-gray-800 tracking-wide">New arrivals</h2>
            <h2 className="text-sm text-gray-500 tracking-wide">Best sellers</h2>
          </div>

          {/* Empty State */}
          <div className="text-center py-20 bg-white/50 rounded-lg">
            <p className="text-gray-600 text-lg mb-4">No products found</p>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Tell us what products you'd like to add to your store - describe the item and price.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Headers */}
        <div className="flex flex-wrap gap-8 mb-12">
          <h2 className="text-sm text-gray-800 tracking-wide">New arrivals</h2>
          <h2 className="text-sm text-gray-500 tracking-wide hover:text-gray-800 cursor-pointer transition-colors">
            Best sellers
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {products.map((product) => {
            const image = product.node.images.edges[0]?.node;
            const price = product.node.priceRange.minVariantPrice;

            return (
              <Link
                key={product.node.id}
                to={`/product/${product.node.handle}`}
                className="group block"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-[#e8e3dc] overflow-hidden">
                  {image ? (
                    <img
                      src={image.url}
                      alt={image.altText || product.node.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                  
                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={isCartLoading}
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 py-3 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white disabled:opacity-50"
                  >
                    {isCartLoading ? 'Adding...' : 'Quick Add'}
                  </button>
                </div>

                {/* Product Info */}
                <div className="py-4 px-2">
                  <h3 className="text-sm text-gray-800 mb-1 tracking-wide">
                    {product.node.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
