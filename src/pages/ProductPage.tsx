import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { storefrontApiRequest, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { ReviewsSection } from '@/components/ReviewsSection';
import { WriteReviewDrawer } from '@/components/WriteReviewDrawer';
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
  Leaf,
  X,
  ArrowRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const COLOR_MAP: Record<string, string> = {
  'Winter Cloud': '/products/midnight-silk.png',
  'Desert Whisperer': '/products/linen-duvet-clay.png',
  'Buttermilk': '/products/cotton-quilt-sandstone.png',
  'Clay': '/products/bamboo-sheets-grey.png',
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
  'Clay': '#D2C4B5',
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

const COLOR_DESCRIPTIONS: Record<string, { title: string; subtitle: string; description: string }> = {
  'Winter Cloud': {
    title: 'Crisp white. Soft glow. Always polished.',
    subtitle: 'Winter Cloud',
    description: 'A bright, clean white with a hotel-fresh finish. In sateen it looks luminous (never flat) and makes every room feel lighter.'
  },
  'Buttermilk': {
    title: 'Warm cream. Quiet luxury.',
    subtitle: 'Buttermilk',
    description: 'A creamy off-white with a gentle warmth. Sateen makes it look rich and smooth—like classic white, upgraded.'
  },
  'Desert Whisperer': {
    title: 'Sun-washed nude. Calm, not sweet.',
    subtitle: 'Desert Whisperer',
    description: 'A blush-sand neutral that warms a room without stealing focus. Sateen adds a refined, clean sheen.'
  },
  'Desert Sand': {
    title: 'The anchor neutral. Effortlessly styled.',
    subtitle: 'Desert Sand',
    description: 'A modern beige with balance and depth—made for layering. Always looks intentional, even on low-effort days.'
  },
  'Clay Blush': {
    title: 'Muted blush. Modern and grown.',
    subtitle: 'Clayblush Pink',
    description: 'A dusty rose-clay neutral—soft, earthy, quietly romantic. In sateen it reads smooth and elevated, not shiny.'
  },
  'Pebble Haze': {
    title: 'Cool grey. Clean calm.',
    subtitle: 'Pebble Haze',
    description: 'A mid-grey with an architectural feel. Sateen gives it depth and softness—minimal, but never cold.'
  },
  'Cinnamon Bark': {
    title: 'Deep brown. Grounded. Inviting.',
    subtitle: 'Cinnamon Bark',
    description: 'A rich, earthy brown that makes the room feel intentional. Sateen adds a soft sheen and tailored drape.'
  },
  'Clay': {
    title: 'Soft clay. Lightly sun-warmed. Calm and clean.',
    subtitle: 'Clay',
    description: 'A pale clay with no pink in it—just a quiet warmth that feels natural and modern. It brightens the room without turning cold.'
  }
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
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProduct['node']['variants']['edges'][0]['node'] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [customColorImage, setCustomColorImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
  const [sizeDrawerPage, setSizeDrawerPage] = useState<1 | 2>(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);

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

          const colorParam = searchParams.get('color');
          let defaultOptions: Record<string, string> = {};
          
          const firstVariant = productData.variants.edges[0]?.node;
          if (firstVariant) {
            setSelectedVariant(firstVariant);
            firstVariant.selectedOptions.forEach((opt: { name: string; value: string }) => {
              defaultOptions[opt.name] = opt.value;
            });
          }

          if (colorParam) {
            const colorOption = productData.options.find(option => 
              option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour')
            );
            if (colorOption && colorOption.values.includes(colorParam)) {
              defaultOptions[colorOption.name] = colorParam;
            }
          }
          
          setSelectedOptions(defaultOptions);

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
          const mockProduct = MOCK_PRODUCTS.find(p => p.node.handle === handle);
          if (mockProduct) {
            setProduct(mockProduct.node);
            
            const colorParam = searchParams.get('color');
            let defaultOptions: Record<string, string> = {};
            
            const firstVariant = mockProduct.node.variants.edges[0]?.node;
            if (firstVariant) {
              setSelectedVariant(firstVariant);
              firstVariant.selectedOptions.forEach((opt: { name: string; value: string }) => {
                defaultOptions[opt.name] = opt.value;
              });
            }
            
            if (colorParam) {
              const colorOption = mockProduct.node.options.find(option => 
                option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour')
              );
              if (colorOption && colorOption.values.includes(colorParam)) {
                defaultOptions[colorOption.name] = colorParam;
              }
            }
            
            setSelectedOptions(defaultOptions);
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
  }, [handle, searchParams]);

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

  useEffect(() => {
    if (!product) return;
    
    const selectedColor = Object.entries(selectedOptions).find(([key]) => 
      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
    )?.[1];
    
    if (selectedColor && COLOR_MAP[selectedColor]) {
      setCustomColorImage(COLOR_MAP[selectedColor]);
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

  const handleOpenSizeDrawer = () => {
    setSizeDrawerPage(1);
    setOpenDrawer('size');
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

      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-4">
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to store
        </Link>
      </div>

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
          </div>

          {/* Right: Product Info */}
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                <span>REMsleep</span>
                <span>—</span>
                <span>Sateen Bundle Set</span>
              </div>

              <div className="flex items-baseline justify-between gap-4">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight leading-none">
                  {(() => {
                    const selectedColor = Object.entries(selectedOptions).find(([key]) => 
                      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
                    )?.[1];
                    
                    if (selectedColor && COLOR_DESCRIPTIONS[selectedColor]) {
                      return COLOR_DESCRIPTIONS[selectedColor].title;
                    }
                    return 'Please select a color';
                  })()}
                </h1>
                <p className="text-lg font-sans text-gray-950 font-medium">
                  {selectedVariant?.price.amount} {selectedVariant?.price.currencyCode === 'GBP' ? '£' : selectedVariant?.price.currencyCode}
                </p>
              </div>

              <div className="text-sm text-gray-500 font-sans space-y-2">
                <div className="font-medium">The essentials</div>
                <div className="space-y-1 text-xs">
                  <div>• Material: 100% Egyptian cotton</div>
                  <div>• Weave: Sateen</div>
                  <div>• Thread count: 300</div>
                  <div>• Includes: Duvet cover + fitted sheet + 4 pillowcases (2 Oxford + 2 plain)</div>
                  <div>• Certification: OEKO-TEX® Standard 100</div>
                </div>
                <div className="pt-2 text-xs">
                  This is your "exhale" bedding, woven for a clean drape and a smooth hand-feel. It looks crisp. It feels indulgent — no extras needed.
                </div>
              </div>
            </div>

            {/* Dynamic Options */}
            {product.options.map((option) => {
              const isColor = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');

              return (
                <div key={option.name} className="space-y-4 pt-4 border-t border-[#e0dbd5] first:border-t-0 first:pt-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em]">{option.name}</h3>
                    {option.name.toLowerCase().includes('size') && (
                      <button 
                        onClick={handleOpenSizeDrawer}
                        className="text-[11px] text-gray-500 hover:text-gray-900 underline underline-offset-4 decoration-gray-300 font-medium tracking-wide"
                      >
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

            {/* Color Description */}
            {(() => {
              const selectedColor = Object.entries(selectedOptions).find(([key]) => 
                key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
              )?.[1];
              
              if (selectedColor && COLOR_DESCRIPTIONS[selectedColor]) {
                const colorDesc = COLOR_DESCRIPTIONS[selectedColor];
                return (
                  <div className="pt-4 border-t border-[#e0dbd5] animate-in fade-in duration-300">
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">{colorDesc.subtitle}</div>
                      <p className="text-xs text-gray-600 leading-relaxed">{colorDesc.description}</p>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || isCartLoading || !Object.entries(selectedOptions).find(([key]) => 
                  key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
                )}
                className="flex-1 h-16 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50"
              >
                {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (!Object.entries(selectedOptions).find(([key]) => 
                  key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
                ) ? 'Please select a color' : (!selectedVariant?.availableForSale ? 'Out of Stock' : 'Add to Cart'))}
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
            </div>

            {/* Product Accordions */}
            <div className="pt-8 space-y-4">
              <button
                onClick={() => setOpenDrawer(' Why You Will Love It')}
                className="w-full flex items-center justify-between py-4 group border-b border-[#e0dbd5]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">Why You Will Love It</span>
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => setOpenDrawer('care')}
                className="w-full flex items-center justify-between py-4 group border-b border-[#e0dbd5]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">Care</span>
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => setOpenDrawer('specifications')}
                className="w-full flex items-center justify-between py-4 group border-b border-[#e0dbd5]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">Specifications +</span>
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => setOpenDrawer('returns')}
                className="w-full flex items-center justify-between py-4 group border-b border-[#e0dbd5]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">Return and Delivery +</span>
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
              
              <button
                onClick={() => setOpenDrawer('reviews')}
                className="w-full flex items-center justify-between py-4 group"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">REVIEWS +</span>
                <Plus className="w-4 h-4 text-gray-400" />
              </button>
            </div>

          </div>
        </div>

        {/* You Might Also Like Section */}
        <section className="mt-8 py-12 px-4 md:px-0">
          <div className="flex gap-10 border-b border-[#e0dbd5] mb-8">
            <button className="text-sm font-bold uppercase tracking-[0.1em] text-gray-900 pb-4 border-b-2 border-gray-900 -mb-[2px]">
              You might also like
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

        <ReviewsSection
        reviewPage={reviewPage}
        setReviewPage={setReviewPage}
        reviewFilter={reviewFilter}
        setReviewFilter={setReviewFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        reviewDrawerOpen={reviewDrawerOpen}
        setReviewDrawerOpen={setReviewDrawerOpen}
      />
      
      </main>

      {/* Drawer */}
      <AnimatePresence>
        {openDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setOpenDrawer(null)}
            />
            
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto scrollbar-hide"
            >
              <div className="p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-6">
                  {/* Back button — only shown on size drawer page 2 */}
                  {openDrawer === 'size' && sizeDrawerPage === 2 ? (
                    <button
                      onClick={() => setSizeDrawerPage(1)}
                      className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>
                  ) : (
                    <h2 className="text-lg font-serif text-gray-900">
                      {openDrawer === ' Why You Will Love It' && ' Why You Will Love It'}
                      {openDrawer === 'care' && 'Care'}
                      {openDrawer === 'specifications' && 'Specifications'}
                      {openDrawer === 'size' && 'Size Guide'}
                      {openDrawer === 'Return and Delivery' && 'Return and Delivery'}
                    </h2>
                  )}
                  <button
                    onClick={() => setOpenDrawer(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="space-y-6">
                  {openDrawer === ' Why You Will Love It' && (
                    <div className="space-y-8">
                      {/* Main statement */}
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          Everything that meets your skin should feel right. We focus on Fabric, Finish and Function—so your bedroom feels calm not cluttered. Our Bedding bundles gives you the hotel-feel comfort, effortlessly. Our 100% cotton 300 thread count sateen bundle brings a smooth, breathable finish and a subtle sheen—so your bed looks instantly considered, every night.
                        </p>
                      </div>

                      {/* What's included */}
                      <div className="space-y-4 pt-2 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Each set includes</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          A fitted sheet, duvet cover, and four pillowcases (2 Oxford + 2 plain).
                        </p>
                      </div>

                      {/* Key features */}
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Why you'll love it</h4>
                        <ul className="space-y-3">
                          {[
                            '100% Egyptian cotton · 300 thread count sateen weave',
                            'Bundle set = effortless styling (no overthinking, no add-ons)',
                            'Four pillowcases included: 2 Oxford (framed, elevated look) + 2 plain (everyday rotation)',
                            'Tonal colours that make layering easy',
                            'Certified: OEKO-TEX® 100',
                            'Made to last and gets softer with every wash'
                          ].map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {openDrawer === 'care' && (
                    <div className="space-y-8">
                      {/* Main care statement */}
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          REMsleep sateen is made to live with you. A little intention keeps it crisp, smooth, and softly luminous.
                        </p>
                      </div>

                      {/* Three rules of longevity */}
                      <div className="space-y-4 pt-2 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">We follow these three rules of longevity</h4>
                        <ul className="space-y-3">
                          {[
                            'Protect sheen: wash inside out',
                            'Reduce friction: gentle cycles, light loads',
                            'Use lower heat: cool washes, low drying temps'
                          ].map((rule) => (
                            <li key={rule} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                      

                      {/* Wash instructions */}
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Wash (the calm setting wins)</h4>
                        <ul className="space-y-3">
                          {[
                            '30°C for most washes (best for softness + sheen)',
                            '40°C when you need a deeper clean',
                            'Choose gentle cycle + low spin, and do not overfill drum'
                          ].map((instruction) => (
                            <li key={instruction} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                              {instruction}
                            </li>
                          ))}
                        </ul>
                        <p className="text-sm text-gray-600 italic leading-relaxed pt-2">
                          Pro tip: duvet covers and pillowcases inside out—that is where sateen glow is protected
                        </p>
                      </div>

                      {/* Dry instructions */}
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Dry (drape is made here)</h4>
                        <ul className="space-y-3">
                          {[
                            'Line dry where possible. If tumble drying: low heat, and remove slightly damp and let air dry',
                            'Avoid abrasion',
                            'Keep sateen away from rough contact where you can, as rough surfaces can reduce sheen.'
                          ].map((instruction) => (
                            <li key={instruction} className="flex items-start gap-3 text-sm text-gray-600">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Optional finishing */}
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Optional finishing</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Steam to revive drape, or iron moderate heat while slightly damp for extra crispness.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {openDrawer === 'specifications' && (
                    <div className="space-y-8">
                      {/* Material specifications */}
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900">Material</h4>
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          100% Egyptian cotton
                        </p>
                      </div>
                      
                      {/* Weave specifications */}
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Weave</h4>
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          Sateen
                        </p>
                      </div>
                      
                      {/* Thread count */}
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Thread Count</h4>
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          300
                        </p>
                      </div>
                      
                      {/* Finish and feel */}
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Finish / Feel</h4>
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          Smooth, softly luminous, elegant drape
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {openDrawer === 'returns' && (
                    <div className="space-y-8">
                      {/* Main return statement */}
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          Changed your mind? No problem. We accept returns on unused, unwashed, and undamaged bedding for a full refund within 30 days of delivery. Items must be returned in their original packaging, with all tags and labels attached. Please see our Returns Policy for full details.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {openDrawer === 'reviews' && (
                    <div className="space-y-8">
                      {/* Reviews placeholder */}
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                          Customer reviews coming soon. Be the first to share your experience with REMsleep bedding.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* SIZE DRAWER — Page 1: Guide */}
                  {openDrawer === 'size' && sizeDrawerPage === 1 && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="size-page-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                      >
                       
                        {/* Hero statement */}
                        <div className="space-y-2">
                          <h3 className="font-serif text-2xl text-gray-900 leading-snug">
                            A fitted sheet that stays put — even on deeper mattresses.
                          </h3>
                        </div>

                        {/* Intro paragraph */}
                        <div className="space-y-4 text-sm text-gray-600 font-sans leading-relaxed">
                          <p>
                            A bed should look finished, not fussy. REMsleep is made for real life: sleep, slow mornings, and the occasional full-day reset.
                          </p>
                          <p>
                            Our fitted sheet is designed to keep the bed looking made — with less shifting, less bunching, and no corner slip.
                          </p>
                        </div>

                        {/* How sizing works */}
                        <div className="space-y-3 pt-2 border-t border-[#e0dbd5]">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">How sizing works</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Choose the size that matches your mattress. The cut is shaped to sit neatly, with corners designed to stay anchored.
                          </p>
                        </div>

                        {/* Deep-mattress elastic */}
                        <div className="space-y-3 border-t border-[#e0dbd5]">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">
                            Deep-mattress elastic <span className="text-gray-400 font-normal normal-case tracking-normal">(the part you feel, quietly)</span>
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Our fitted sheet uses elastic designed for deeper mattresses, so it tucks in cleanly and stays there. Expect sharper corners, a smoother surface, and less re-tucking.
                          </p>
                        </div>

                        {/* Why it stays put */}
                        <div className="space-y-4 border-t border-[#e0dbd5]">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Why it stays put</h4>
                          <ul className="space-y-2.5">
                            {[
                              'Hugs the corners with a tighter fit',
                              'Holds position with strong, deep-mattress elastic',
                              'Stays smooth for a cleaner, more intentional finish',
                            ].map((point) => (
                              <li key={point} className="flex items-start gap-3 text-sm text-gray-600">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-gray-500 italic pt-1">
                            Using a topper? Choose your size based on your overall mattress depth for the most secure hold.
                          </p>
                        </div>

                        {/* CTA to page 2 */}
                        <div className="pt-4">
                          <button
                            onClick={() => setSizeDrawerPage(2)}
                            className="w-full flex items-center justify-between py-4 px-5 bg-[#2D2D2D] hover:bg-black text-white transition-colors group"
                          >
                            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">View measurements</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}

                  {/* SIZE DRAWER — Page 2: Measurements Chart */}
                  {openDrawer === 'size' && sizeDrawerPage === 2 && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="size-page-2"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-5"
                      >
                        {/* Section label */}
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Measurements</p>

                        {/* Bordered grid table matching reference style */}
                        <div className="border border-gray-200 overflow-hidden">
                          <table className="w-full text-center border-collapse">
                            <thead>
                              <tr>
                                <th className="border border-gray-200 px-2 py-3 text-[10px] font-normal text-gray-500 text-center leading-tight w-[22%]">
                                  UK SIZE (cm)
                                </th>
                                <th className="border border-gray-200 px-2 py-3 text-[10px] font-normal text-gray-500 text-center leading-tight">
                                  Duvet<br />Cover
                                </th>
                                <th className="border border-gray-200 px-2 py-3 text-[10px] font-normal text-gray-500 text-center leading-tight">
                                  Fitted Sheet
                                </th>
                                <th className="border border-gray-200 px-2 py-3 text-[10px] font-normal text-gray-500 text-center leading-tight">
                                  Oxford<br />Pillowcase
                                </th>
                                <th className="border border-gray-200 px-2 py-3 text-[10px] font-normal text-gray-500 text-center leading-tight">
                                  Regular<br />Pillowcase
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { size: 'Single',  duvet: '140×200', fitted: '90×190×40',  oxford: '50×75\n+5cm', regular: '50×75' },
                                { size: 'Double',  duvet: '200×200', fitted: '135×190×40', oxford: '50×75\n+5cm', regular: '50×75' },
                                { size: 'King',    duvet: '225×220', fitted: '150×200×40', oxford: '50×75\n+5cm', regular: '50×75' },
                              ].map((row) => (
                                <tr key={row.size} className="hover:bg-[#faf8f6] transition-colors">
                                  <td className="border border-gray-200 px-2 py-3 text-[11px] text-gray-700 text-center">{row.size}</td>
                                  <td className="border border-gray-200 px-2 py-3 text-[11px] text-gray-700 text-center">{row.duvet}</td>
                                  <td className="border border-gray-200 px-2 py-3 text-[11px] text-gray-700 text-center">{row.fitted}</td>
                                  <td className="border border-gray-200 px-2 py-3 text-[11px] text-gray-700 text-center whitespace-pre-line">{row.oxford}</td>
                                  <td className="border border-gray-200 px-2 py-3 text-[11px] text-gray-700 text-center">{row.regular}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Footnote */}
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          All measurements are approximate. Minor variation may occur due to production tolerances. Oxford pillowcase border allowance (+5cm) not included in dimensions shown.
                        </p>

                        {/* Back to guide link */}
                        <button
                          onClick={() => setSizeDrawerPage(1)}
                          className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500 hover:text-gray-900 transition-colors pt-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Back to size guide
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Write Review Drawer */}
      <WriteReviewDrawer 
        open={reviewDrawerOpen} 
        onClose={() => setReviewDrawerOpen(false)} 
      />

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