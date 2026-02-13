import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storefrontApiRequest, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { useCartStore } from '@/stores/cartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Truck,
  Clock,
  Gift,
  RotateCcw,
  MessageCircle,
  Plus,
  Minus,
  Globe,
  ShieldCheck,
  Leaf
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const COLOR_MAP: Record<string, string> = {
  'Winter Cloud': '/products/midnight-silk.png',
  'Desert Whisperer': '/products/linen-duvet-clay.png',
  'Buttermilk': '/products/cotton-quilt-sandstone.png',
  'Sandstone Drift': '/products/bamboo-sheets-grey.png',
  'Clay Blush': '/products/lavender-eye-pillow.png',
  'Pebble Haze': '/products/sleep-mask-indigo.png',
  'Desert Sand': '/products/midnight-silk.png',
  'Cinnamon Bark': '/products/linen-duvet-clay.png',
  'Chelsea': '/products/midnight-silk.png',
  'Navy': '/products/midnight-silk.png',
  'White': '/products/bamboo-sheets-grey.png',
  'Sand': '/products/cotton-quilt-sandstone.png',
  'Slate': '/products/bamboo-sheets-grey.png',
};

const COLOR_HEX: Record<string, string> = {
  'Winter Cloud': '#F5F5F7',
  'Desert Whisperer': '#E5DACE',
  'Buttermilk': '#FFF4D2',
  'Sandstone Drift': '#D2C4B5',
  'Clay Blush': '#D9A891',
  'Pebble Haze': '#A3A3A3',
  'Desert Sand': '#E2CA9D',
  'Cinnamon Bark': '#8B4513',
  'Chelsea': '#2D3B4E',
  'Navy': '#1B263B',
  'White': '#FFFFFF',
  'Sand': '#D2B48C',
  'Slate': '#4A5568',
};

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProduct['node']['variants']['edges'][0]['node'] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customColorImage, setCustomColorImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addItem, isLoading: isCartLoading } = useCartStore();
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesStore();

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;

      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        const productData = data?.data?.productByHandle;

        if (productData) {
          setProduct(productData);

          // Set default variant
          const firstVariant = productData.variants.edges[0]?.node;
          if (firstVariant) {
            setSelectedVariant(firstVariant);

            // Set default options
            const defaultOptions: Record<string, string> = {};
            firstVariant.selectedOptions.forEach((opt: { name: string; value: string }) => {
              defaultOptions[opt.name] = opt.value;
            });
            setSelectedOptions(defaultOptions);
          }

          // Fetch recommendations
          try {
            const recs = await storefrontApiRequest(`
              query GetRecommendations($productId: ID!) {
                productRecommendations(productId: $productId) {
                  id
                  title
                  handle
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            `, { productId: productData.id });

            if (recs?.data?.productRecommendations) {
              setRecommendedProducts(recs.data.productRecommendations.map((p: any) => ({ node: p })));
            } else {
              setRecommendedProducts(MOCK_PRODUCTS.slice(0, 4));
            }
          } catch (e) {
            setRecommendedProducts(MOCK_PRODUCTS.slice(0, 4));
          }
        } else {
          // Check MOCK_PRODUCTS
          const mockProduct = MOCK_PRODUCTS.find(p => p.node.handle === handle);
          if (mockProduct) {
            setProduct(mockProduct.node);
            const firstVariant = mockProduct.node.variants.edges[0]?.node;
            if (firstVariant) {
              setSelectedVariant(firstVariant);
              const defaultOptions: Record<string, string> = {};
              firstVariant.selectedOptions.forEach((opt: { name: string; value: string }) => {
                defaultOptions[opt.name] = opt.value;
              });
              setSelectedOptions(defaultOptions);
            }
            setRecommendedProducts(MOCK_PRODUCTS.filter(p => p.node.handle !== handle).slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [handle]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product) return;

    const matchingVariant = product.variants.edges.find((v) =>
      v.node.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant.node);
    }
  }, [selectedOptions, product]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));

    if (optionName.toLowerCase().includes('color') || optionName.toLowerCase().includes('colour')) {
      if (COLOR_MAP[value]) {
        setCustomColorImage(COLOR_MAP[value]);
      } else {
        setCustomColorImage(null);
        // Fallback to searching in product images by alt text if possible, 
        // but for now we'll just keep the current or first image
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    const productWrapper: ShopifyProduct = {
      node: product,
    };

    await addItem({
      product: productWrapper,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    });

    toast.success('Added to cart', {
      description: `${product.title} × ${quantity}`,
      position: 'top-center',
    });
  };

  const handleToggleFavorite = () => {
    if (!product || !selectedVariant) return;

    const productWrapper: ShopifyProduct = {
      node: product,
    };

    const isCurrentlyFavorited = isFavorited(product.id);

    if (isCurrentlyFavorited) {
      removeFavorite(product.id);
      toast.success('Removed from favorites', {
        position: 'top-center',
      });
    } else {
      addFavorite({
        productId: product.id,
        product: productWrapper,
        selectedVariant: {
          id: selectedVariant.id,
          title: selectedVariant.title,
          price: selectedVariant.price,
        },
      });
      toast.success('Added to favorites', {
        description: product.title,
        position: 'top-center',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1ed]">
        <StoreNavbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
        <StoreFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f1ed]">
        <StoreNavbar />
        <div className="max-w-[1400px] mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-medium text-gray-800 mb-4">Product not found</h1>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const images = product.images.edges;
  const currentImage = images[selectedImageIndex]?.node;

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      <StoreNavbar hideOnScroll />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-4 pb-12">
        {/* Top Content: Gallery and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16 items-start">

          {/* Left: Product Gallery */}
          <div className="space-y-6 lg:sticky lg:top-8 max-w-[550px]">
            <div className="relative aspect-[4/5] bg-white overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={customColorImage || selectedImageIndex}
                  src={customColorImage || currentImage?.url}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/90 text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/90 text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-6 right-6 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest text-gray-900">
                {selectedImageIndex + 1} / {images.length}
              </div>
            </div>

            <p className="text-[13px] text-gray-600 font-sans italic opacity-80">
              {product.description || "Soft, organic cotton woven with a lustrous finish"}
            </p>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                <span>Bedding</span>
                <span>—</span>
                <span>Sateen Collection</span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight leading-none">
                  {product.title}
                </h1>
                <p className="text-lg font-sans text-gray-950 font-medium">
                  {selectedVariant?.price.amount} {selectedVariant?.price.currencyCode === 'GBP' ? '£' : selectedVariant?.price.currencyCode}
                </p>
              </div>

              <p className="text-sm text-gray-500 font-sans">
                Chelsea — Deep navy with white piping detail
              </p>
            </div>

            {/* Dynamic Options */}
            {product.options.map((option) => {
              const isColor = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');

              return (
                <div key={option.name} className="space-y-4 pt-4 border-t border-[#e0dbd5] first:border-t-0 first:pt-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em]">{option.name}</h3>
                    {option.name.toLowerCase().includes('size') && (
                      <button className="text-[11px] text-gray-500 hover:text-gray-900 underline underline-offset-4 decoration-gray-300 font-medium tracking-wide">
                        Size guide
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {option.values.map((value) => {
                      const isSelected = selectedOptions[option.name] === value;

                      if (isColor) {
                        return (
                          <button
                            key={value}
                            onClick={() => handleOptionChange(option.name, value)}
                            className={cn(
                              "h-8 w-11 border transition-all relative group",
                              isSelected ? "border-gray-900 ring-1 ring-gray-900 ring-offset-2" : "border-gray-200 hover:border-gray-400"
                            )}
                            title={value}
                          >
                            <div
                              className="w-full h-full"
                              style={{ backgroundColor: COLOR_HEX[value] || value.toLowerCase().replace(' ', '') }}
                            />
                          </button>
                        );
                      }

                      return (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={cn(
                            "text-[12px] font-medium tracking-wide transition-all border px-4 py-2",
                            isSelected
                              ? "text-gray-900 font-bold border-gray-900 bg-gray-50/50"
                              : "text-gray-400 border-transparent hover:text-gray-900"
                          )}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || isCartLoading}
                className="flex-1 h-16 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50"
              >
                {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (!selectedVariant?.availableForSale ? 'Out of Stock' : 'Add to Cart')}
              </Button>
              <Button
                onClick={handleToggleFavorite}
                variant="outline"
                className="h-16 w-16 bg-white border border-[#e0dbd5] hover:bg-[#F8F5F2] rounded-none transition-all flex items-center justify-center group"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    product && isFavorited(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 group-hover:text-red-400"
                  )}
                  strokeWidth={1.5}
                />
              </Button>
            </div>

            {/* Info Cards List */}
            <div className="space-y-[1px] bg-[#e0dbd5] border-y border-[#e0dbd5]">
              <InfoItem icon={<Clock className="w-4 h-4" />} text="Estimated delivery: 12-13 February" />
              <InfoItem icon={<Truck className="w-4 h-4" />} text="Free shipping over £100" />
              <InfoItem icon={<Gift className="w-4 h-4" />} text="Complimentary gift wrapping" />
              <InfoItem icon={<RotateCcw className="w-4 h-4" />} text="30-day returns" />
              <InfoItem icon={<MessageCircle className="w-4 h-4" />} text="Need assistance?" />
            </div>

            {/* Product Accordions */}
            <div className="pt-8 space-y-4">
              <Accordion title="Details" defaultOpen>
                <p className="text-sm leading-relaxed text-gray-600 font-sans">
                  Crafted from premium long-staple organic cotton, our sateen weave offers a luxuriously smooth feel and a subtle, sophisticated sheen. Designed for ultimate comfort and temperature regulation.
                </p>
              </Accordion>
              <div className="h-[1px] bg-[#e0dbd5]" />
              <Accordion title="Care">
                <p className="text-sm leading-relaxed text-gray-600 font-sans">
                  Machine wash cold on a gentle cycle. Use mild detergent. Tumble dry on low or line dry for best results. Iron on low heat if desired.
                </p>
              </Accordion>
              <div className="h-[1px] bg-[#e0dbd5]" />
              <Accordion title="Quality and impact">
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <ImpactSmallItem icon={<ShieldCheck />} title="GOTS certified" />
                  <ImpactSmallItem icon={<Leaf />} title="100% organic cotton" />
                  <ImpactSmallItem icon={<Globe />} title="Ethically Made" />
                </div>
              </Accordion>
            </div>

            {/* Related Products Grid (Vertical/Sidebar style as in image 1) */}
            <div className="pt-16 space-y-8">
              <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em]">Related products</h3>
              <div className="grid grid-cols-2 gap-4">
                {recommendedProducts.slice(0, 2).map(({ node: rec }) => (
                  <Link
                    key={rec.id}
                    to={`/product/${rec.handle}`}
                    className="space-y-3 group"
                  >
                    <div className="aspect-square bg-white overflow-hidden">
                      {rec.images.edges[0] && (
                        <img
                          src={rec.images.edges[0].node.url}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <h4 className="text-[11px] font-bold uppercase tracking-tight text-gray-900 line-clamp-1">{rec.title}</h4>
                    <p className="text-[11px] text-gray-500">
                      {rec.priceRange.minVariantPrice.amount} {rec.priceRange.minVariantPrice.currencyCode === 'GBP' ? '£' : rec.priceRange.minVariantPrice.currencyCode}
                    </p>
                    <button className="w-full py-2 border border-gray-900 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all">
                      Select size
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quality and Impact Section (Horizontal) */}
        <section className="mt-20 pt-12 border-t border-[#e0dbd5]">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900 mb-12 px-4">Quality and impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 max-w-[1200px] mx-auto pb-12">
            <ImpactCard
              icon={<ShieldCheck className="w-8 h-8" strokeWidth={1} />}
              title="GOTS certified"
              linkText="Explore certifications"
            />
            <ImpactCard
              icon={<Leaf className="w-8 h-8" strokeWidth={1} />}
              title="100% organic cotton"
              linkText="Explore materials"
            />
            <ImpactCard
              icon={<Globe className="w-8 h-8" strokeWidth={1} />}
              title="Made in Portugal"
              linkText="Explore traceability"
            />
          </div>
        </section>

        {/* You Might Also Like Section */}
        <section className="mt-8 py-12 px-4 md:px-0">
          <div className="flex gap-10 border-b border-[#e0dbd5] mb-8">
            <button className="text-sm font-bold uppercase tracking-[0.1em] text-gray-900 pb-4 border-b-2 border-gray-900 -mb-[2px]">
              You might also like
            </button>
            <button className="text-sm font-bold uppercase tracking-[0.1em] text-gray-400 pb-4 hover:text-gray-600 transition-colors">
              Recently viewed
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {recommendedProducts.map(({ node: rec }) => (
              <Link
                key={rec.id}
                to={`/product/${rec.handle}`}
                className="space-y-4 group cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="aspect-[3/4] bg-white overflow-hidden relative">
                  {rec.images.edges[0] && (
                    <img
                      src={rec.images.edges[0].node.url}
                      alt={rec.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                </div>
                <div className="space-y-1">
                  <h4 className="text-[13px] font-sans text-gray-900 group-hover:underline decoration-gray-300 underline-offset-4">
                    {rec.title}
                  </h4>
                  <p className="text-[12px] text-gray-500 font-sans tracking-tight">
                    {rec.priceRange.minVariantPrice.amount} {rec.priceRange.minVariantPrice.currencyCode === 'GBP' ? '£' : rec.priceRange.minVariantPrice.currencyCode}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}

// Helper Components
function InfoItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 bg-[#f5f1ed] hover:bg-[#F8F5F2] transition-colors group">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 group-hover:text-gray-900 transition-colors">{icon}</span>
        <span className="text-[12px] text-gray-700 font-sans">{text}</span>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 group"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">{title}</span>
        {isOpen ? <Minus className="w-4 h-4 text-gray-400" /> : <Plus className="w-4 h-4 text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="pb-4 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ImpactSmallItem({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <div className="p-3 bg-white border border-gray-100 rounded-lg text-gray-400">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">{title}</span>
    </div>
  );
}

function ImpactCard({ icon, title, linkText }: { icon: React.ReactNode, title: string, linkText: string }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="text-gray-900">{icon}</div>
      <div className="space-y-4">
        <h4 className="text-[13px] font-bold uppercase tracking-[0.1em] text-gray-900">{title}</h4>
        <button className="text-[12px] text-gray-500 hover:text-gray-900 underline underline-offset-8 decoration-gray-300 transition-colors">
          {linkText}
        </button>
      </div>
    </div>
  );
}
