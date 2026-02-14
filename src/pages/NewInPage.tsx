import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { ProductCard } from '@/components/store/ProductCard';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NewInPage() {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { hash } = useLocation();
    const navigate = useNavigate();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await fetchProducts(20);
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

    const sections = [
        { id: 'latest-arrivals', title: 'Latest Arrivals', items: products.slice(0, 4) },
        { id: 'seasonal-collection', title: 'Seasonal Collection', items: products.slice(4, 8) },
        { id: 'featured-sets', title: 'Featured Sets', items: products.slice(8, 12) },
        { id: 'best-sellers', title: 'Best Sellers', items: products.slice(1, 4) },
        { id: 'limited-edition', title: 'Limited Edition', items: products.slice(2, 6) },
    ];

    // Handle scroll to hash
    useEffect(() => {
        if (!loading && hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [hash, loading]);

    const activeId = hash.replace('#', '') || 'latest-arrivals';

    return (
        <div className="min-h-screen bg-[#f5f1ed] flex flex-col overflow-x-hidden">
            <StoreNavbar />

            <main className="flex-grow pt-24 pb-16 flex flex-col">
                <div className="text-center mb-12 px-6">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        New In
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto font-sans font-light">
                        Explore our latest offerings through our curated collections.
                    </p>
                </div>

                {/* Sub-navigation Tabs */}
                <div className="flex justify-center border-b border-gray-200 mb-12 px-6 sticky top-24 bg-[#f5f1ed] z-10 py-4">
                    <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar scroll-smooth">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => navigate(`#${section.id}`)}
                                className={`text-sm md:text-base whitespace-nowrap pb-2 relative transition-colors ${activeId === section.id ? 'text-gray-900 font-medium' : 'text-gray-500 hover:text-gray-700 font-light'
                                    }`}
                            >
                                {section.title}
                                {activeId === section.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 flex-grow">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8"
                    >
                        {sections.map((section) => (
                            <section
                                key={section.id}
                                id={section.id}
                                className="min-w-full px-6 md:px-12 snap-center flex flex-col items-center"
                            >
                                <div className="max-w-[1400px] w-full">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                                        {section.items.map((product, index) => (
                                            <ProductCard
                                                key={`${section.id}-${product.node.id}`}
                                                product={product}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>

            <StoreFooter />

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
