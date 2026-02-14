import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { ProductCard } from '@/components/store/ProductCard';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function ShopPage() {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await fetchProducts(20); // Fetch more for strict shop page
                if (data && data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts(MOCK_PRODUCTS);
                }
            } catch (error) {
                console.error('Failed to load products:', error);
                setProducts(MOCK_PRODUCTS);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    return (
        <div className="min-h-screen bg-[#f5f1ed] flex flex-col">
            <StoreNavbar />

            <main className="flex-grow pt-24 pb-16 px-6 max-w-[1400px] mx-auto w-full">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900">
                        All Products
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-sans font-light">
                        Discover our full range of sleep essentials, designed to transform your rest into a ritual.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                        {products.map((product, index) => (
                            <ProductCard key={product.node.id} product={product} index={index} />
                        ))}
                    </div>
                )}
            </main>

            <StoreFooter />
        </div>
    );
}
