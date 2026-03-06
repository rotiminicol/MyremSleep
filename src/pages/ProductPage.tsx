import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { storefrontApiRequest, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { ReviewsSection } from '@/components/ReviewsSection';
import { WriteReviewDrawer } from '@/components/WriteReviewDrawer';
import { useUserCart } from '@/stores/userCartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Minus,
  X,
  ArrowRight,
  Star
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
  'Clay Blush': '/clayblush.png',
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

const COLOR_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  'Winter Cloud': {
    title: 'Winter Cloud — Crisp white. Soft glow. Always polished.',
    description: 'A bright, clean white with a hotel-fresh finish. In sateen it looks luminous (never flat) and makes every room feel lighter.'
  },
  'Buttermilk': {
    title: 'Buttermilk — Warm cream. Quiet luxury.',
    description: 'A creamy off-white with a gentle warmth. Sateen makes it look rich and smooth—like classic white, upgraded.'
  },
  'Desert Whisperer': {
    title: 'Desert Whisperer — Sun-washed nude. Calm, not sweet.',
    description: 'A blush-sand neutral that warms a room without stealing focus. Sateen adds a refined, clean sheen.'
  },
  'Desert Sand': {
    title: 'Desert Sand — The anchor neutral. Effortlessly styled.',
    description: 'A modern beige with balance and depth—made for layering. Always looks intentional, even on low-effort days.'
  },
  'Clay Blush': {
    title: 'Clayblush Pink — Muted blush. Modern and grown.',
    description: 'A dusty rose-clay neutral—soft, earthy, quietly romantic. In sateen it reads smooth and elevated, not shiny.'
  },
  'Pebble Haze': {
    title: 'Pebble Haze — Cool grey. Clean calm.',
    description: 'A mid-grey with an architectural feel. Sateen gives it depth and softness—minimal, but never cold.'
  },
  'Cinnamon Bark': {
    title: 'Cinnamon Bark — Deep brown. Grounded. Inviting.',
    description: 'A rich, earthy brown that makes the room feel intentional. Sateen adds a soft sheen and tailored drape.'
  },
  'Clay': {
    title: 'Clay — Soft clay. Lightly sun-warmed. Calm and clean.',
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

const COLORS_WITH_MULTIPLE_IMAGES = ['Cinnamon Bark', 'Clay Blush'];

const COLOR_IMAGE_RANGES: Record<string, { start: number; end: number; count: number }> = {
  'Cinnamon Bark': { start: 1, end: 5, count: 5 },
  'Clay Blush': { start: 6, end: 8, count: 3 },
};

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

  const { addItem, isLoading: isCartLoading } = useUserCart();
  const { addFavorite, removeFavorite, isFavorited } = useFavoritesStore();
  const { formatPrice } = useCurrency();

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
                  id title handle
                  priceRange { minVariantPrice { amount currencyCode } }
                  images(first: 1) { edges { node { url altText } } }
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
      v.node.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    );
    if (matchingVariant) setSelectedVariant(matchingVariant.node);
  }, [selectedOptions, product]);

  useEffect(() => {
    if (!product) return;
    const selectedColor = Object.entries(selectedOptions).find(([key]) =>
      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
    )?.[1];
    if (selectedColor && COLOR_MAP[selectedColor]) {
      setCustomColorImage(COLOR_MAP[selectedColor]);
      if (selectedColor === 'Cinnamon Bark') setSelectedImageIndex(1);
      else if (selectedColor === 'Clay Blush') setSelectedImageIndex(6);
      else setSelectedImageIndex(0);
    }
  }, [selectedOptions, product]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
    if (optionName.toLowerCase().includes('color') || optionName.toLowerCase().includes('colour')) {
      setCustomColorImage(COLOR_MAP[value] || null);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;
    const productWrapper: ShopifyProduct = { node: product };
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
    const productWrapper: ShopifyProduct = { node: product };
    if (isFavorited(product.id)) {
      removeFavorite(product.id);
      toast.success('Removed from favorites', { position: 'top-center' });
    } else {
      addFavorite({
        productId: product.id,
        product: productWrapper,
        selectedVariant: { id: selectedVariant.id, title: selectedVariant.title, price: selectedVariant.price },
      });
      toast.success('Added to favorites', { description: product.title, position: 'top-center' });
    }
  };

  const handlePreviousImage = () => {
    if (!product) return;
    const selectedColor = Object.entries(selectedOptions).find(([key]) =>
      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
    )?.[1];
    if (selectedColor && COLORS_WITH_MULTIPLE_IMAGES.includes(selectedColor)) {
      const range = COLOR_IMAGE_RANGES[selectedColor];
      setSelectedImageIndex(prev => prev > range.start ? prev - 1 : range.end);
    } else {
      setSelectedImageIndex(prev => prev > 0 ? prev - 1 : product.images.edges.length - 1);
    }
  };

  const handleNextImage = () => {
    if (!product) return;
    const selectedColor = Object.entries(selectedOptions).find(([key]) =>
      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
    )?.[1];
    if (selectedColor && COLORS_WITH_MULTIPLE_IMAGES.includes(selectedColor)) {
      const range = COLOR_IMAGE_RANGES[selectedColor];
      setSelectedImageIndex(prev => prev < range.end ? prev + 1 : range.start);
    } else {
      setSelectedImageIndex(prev => prev < product.images.edges.length - 1 ? prev + 1 : 0);
    }
  };

  const getVisibleImages = () => {
    if (!product) return [];
    const selectedColor = Object.entries(selectedOptions).find(([key]) =>
      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
    )?.[1];
    if (selectedColor && COLORS_WITH_MULTIPLE_IMAGES.includes(selectedColor)) {
      const range = COLOR_IMAGE_RANGES[selectedColor];
      return product.images.edges.slice(range.start, range.end + 1);
    }
    return [product.images.edges[0]];
  };

  const getCurrentImageSrc = () => {
    if (!product) return '';
    const selectedColor = Object.entries(selectedOptions).find(([key]) =>
      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
    )?.[1];
    if (selectedColor && COLORS_WITH_MULTIPLE_IMAGES.includes(selectedColor)) {
      return product.images.edges[selectedImageIndex]?.node.url;
    }
    if (selectedColor && COLOR_MAP[selectedColor]) return COLOR_MAP[selectedColor];
    return product.images.edges[0]?.node.url;
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
          <Link to="/store" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-4 w-4" />Back to home
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const images = product.images.edges;
  const visibleImages = getVisibleImages();
  const selectedColor = Object.entries(selectedOptions).find(([key]) =>
    key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
  )?.[1];
  const hasMultipleImages = selectedColor && COLORS_WITH_MULTIPLE_IMAGES.includes(selectedColor);

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      <StoreNavbar hideOnScroll />



      <main className="max-w-[1600px] mx-auto">
        {/* Main Product Grid — image left, info right, NO outer padding so image bleeds full */}
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-[90vh]">

          {/* ── LEFT: Gallery ── */}
          <div className="relative bg-[#f0ede8] flex flex-col">
            {/* Thumbnails — vertical strip on the left edge */}
            {hasMultipleImages && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
                {visibleImages.map((image, idx) => {
                  const actualIndex = selectedColor === 'Cinnamon Bark' ? idx + 1 : idx + 6;
                  return (
                    <button
                      key={actualIndex}
                      onClick={() => setSelectedImageIndex(actualIndex)}
                      className={cn(
                        "w-14 h-14 overflow-hidden border-2 transition-all bg-white",
                        selectedImageIndex === actualIndex
                          ? "border-gray-900 opacity-100"
                          : "border-white/60 opacity-50 hover:opacity-80 hover:border-gray-300"
                      )}
                    >
                      <img src={image.node.url} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Main image — true full fill, no crop, no distort */}
            <div className="relative w-full lg:h-screen overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex + (getCurrentImageSrc() || '')}
                  src={getCurrentImageSrc()}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                  style={{ objectFit: 'fill', display: 'block' }}
                />
              </AnimatePresence>

              {/* Arrow navigation */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-20 bottom-8 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-gray-900 transition-all shadow-sm backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute left-32 bottom-8 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-gray-900 transition-all shadow-sm backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  {/* Counter */}
                  <div className="absolute bottom-8 right-6 text-[10px] font-bold tracking-widest text-white/80 uppercase">
                    {selectedColor === 'Cinnamon Bark'
                      ? `${selectedImageIndex} / 5`
                      : `${selectedImageIndex - 5} / 3`}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col justify-start py-10 px-8 lg:px-12 xl:px-14 overflow-y-auto lg:max-h-[100vh] bg-[#f5f1ed] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* Brand + Category label */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-5">
              <span>REMsleep</span>
              <span>—</span>
              <span>Sateen Bundle Set</span>
            </div>

            {/* Color-driven title */}
            <h1 className="font-serif text-[26px] md:text-[30px] leading-tight text-gray-900 tracking-tight">
              {selectedColor && COLOR_DESCRIPTIONS[selectedColor]
                ? COLOR_DESCRIPTIONS[selectedColor].title
                : product.title}
            </h1>

            {/* Price — directly under title */}
            <p className="text-[20px] font-medium text-gray-900 mt-3">
              {formatPrice(parseFloat(selectedVariant?.price.amount || '0'))}
            </p>

            {/* Color description */}
            {selectedColor && COLOR_DESCRIPTIONS[selectedColor] && (
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                {COLOR_DESCRIPTIONS[selectedColor].description}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-[#e0dbd5] my-6" />

            {/* The essentials */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900 mb-3">The essentials</p>
              {[
                'Material: 100% Egyptian cotton',
                'Weave: Sateen',
                'Thread count: 300',
                'Includes: Duvet cover + fitted sheet + 4 pillowcases (2 Oxford + 2 plain)',
                'Certification: OEKO-TEX® Standard 100',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-[12px] text-gray-600 leading-relaxed">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
              <p className="text-[12px] text-gray-500 italic pt-2 leading-relaxed">
                This is your "exhale" bedding, woven for a clean drape and a smooth hand-feel. It looks crisp. It feels indulgent — no extras needed.
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e0dbd5] my-6" />

            {/* Options — Size first, then Color */}
            <div className="space-y-6">
              {/* Render non-color options first (Size), then color */}
              {[
                ...product.options.filter(o => !o.name.toLowerCase().includes('color') && !o.name.toLowerCase().includes('colour')),
                ...product.options.filter(o => o.name.toLowerCase().includes('color') || o.name.toLowerCase().includes('colour')),
              ].map((option) => {
                const isColor = option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour');
                return (
                  <div key={option.name}>
                    {/* Option label row */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">{option.name}</span>
                      {option.name.toLowerCase().includes('size') && (
                        <button
                          onClick={() => { setSizeDrawerPage(1); setOpenDrawer('size'); }}
                          className="text-[11px] text-gray-500 hover:text-gray-900 underline underline-offset-4 decoration-gray-300 transition-colors"
                        >
                          Size guide
                        </button>
                      )}
                    </div>

                    {isColor ? (
                      /* Color swatches — rectangular like original */
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const isSelected = selectedOptions[option.name] === value;
                          return (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.name, value)}
                              title={value}
                              className={cn(
                                "h-8 w-11 border-2 transition-all relative",
                                isSelected
                                  ? "border-gray-900 ring-1 ring-gray-900 ring-offset-2"
                                  : "border-gray-200 hover:border-gray-400"
                              )}
                              style={{ backgroundColor: COLOR_HEX[value] || '#ccc' }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      /* Size buttons */
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const isSelected = selectedOptions[option.name] === value;
                          return (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.name, value)}
                              className={cn(
                                "px-5 py-2.5 text-[12px] font-medium tracking-wide transition-all border",
                                isSelected
                                  ? "border-gray-900 bg-gray-900 text-white"
                                  : "border-[#e0dbd5] text-gray-500 hover:border-gray-400 hover:text-gray-900 bg-transparent"
                              )}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e0dbd5] my-6" />

            {/* Add to Cart + Favourite */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale || isCartLoading}
                className="flex-1 h-16 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50"
              >
                {isCartLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  !selectedVariant?.availableForSale ? 'Out of Stock' : 'Add to Cart'
                )}
              </Button>
              <button
                onClick={handleToggleFavorite}
                className="h-16 w-16 flex items-center justify-center border border-[#e0dbd5] hover:bg-[#ede9e3] transition-all bg-transparent"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-all",
                    product && isFavorited(product.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
                  )}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-[#e0dbd5] my-6" />

            {/* Accordions */}
            <div className="space-y-0">
              {[
                { id: 'why-you-will-love-it', label: 'Why You Will Love It' },
                { id: 'care', label: 'Care' },
                { id: 'specifications', label: 'Specifications +' },
                { id: 'returns', label: 'Return and Delivery +' },
                { id: 'reviews', label: 'REVIEWS +' },
              ].map((item, i, arr) => (
                <button
                  key={item.id}
                  onClick={() => setOpenDrawer(item.id)}
                  className={cn(
                    "w-full flex items-center justify-between py-4 group transition-colors",
                    i < arr.length - 1 && "border-b border-[#e0dbd5]"
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">
                    {item.label}
                  </span>
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition-colors" />
                </button>
              ))}
            </div>

            {/* Bottom spacer */}
            <div className="h-8" />
          </div>
        </div>
      </main>

      {/* Reviews section below the fold */}
      <div className="bg-[#f5f1ed]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 lg:px-16">
          <ReviewsSection
            productHandle={handle || ''}
            reviewPage={reviewPage}
            setReviewPage={setReviewPage}
            reviewFilter={reviewFilter}
            setReviewFilter={setReviewFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            reviewDrawerOpen={reviewDrawerOpen}
            setReviewDrawerOpen={setReviewDrawerOpen}
          />
        </div>
      </div>

      {/* ── DRAWER ── */}
      <AnimatePresence>
        {openDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
              onClick={() => setOpenDrawer(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white shadow-2xl z-50 overflow-y-auto scrollbar-hide"
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  {openDrawer !== 'size' && (
                    <h2 className="text-lg font-serif text-gray-900">
                      {openDrawer === 'why-you-will-love-it' && 'Why You Will Love It'}
                      {openDrawer === 'care' && 'Care'}
                      {openDrawer === 'specifications' && 'Specifications'}
                      {openDrawer === 'returns' && 'Return and Delivery'}
                      {openDrawer === 'reviews' && 'Reviews'}
                    </h2>
                  )}
                  <button onClick={() => setOpenDrawer(null)} className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Drawer content — identical to original */}
                <div className="space-y-6">
                  {openDrawer === 'why-you-will-love-it' && (
                    <div className="space-y-8">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Everything that meets your skin should feel right. We focus on Fabric, Finish and Function—so your bedroom feels calm not cluttered. Our Bedding bundles gives you the hotel-feel comfort, effortlessly. Our 100% cotton 300 thread count sateen bundle brings a smooth, breathable finish and a subtle sheen—so your bed looks instantly considered, every night.
                      </p>
                      <div className="space-y-4 pt-2 border-t border-gray-100">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Each Set Includes</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">A fitted sheet, duvet cover, and four pillowcases (2 Oxford + 2 plain).</p>
                      </div>
                      <div className="space-y-4">
                        <ul className="space-y-3">
                          {[
                            '100% Egyptian cotton · 300 thread count sateen weave',
                            'Bundle set = effortless styling (no overthinking, no add-ons)',
                            'Four pillowcases included: 2 Oxford (framed, elevated look) + 2 plain (everyday rotation)',
                            'Tonal colours that make layering easy',
                            'Certified: OEKO-TEX® 100',
                            'Made to last and gets softer with every wash',
                          ].map((f) => (
                            <li key={f} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'care' && (
                    <div className="space-y-8">
                      <p className="text-sm text-gray-600 leading-relaxed">REMsleep sateen is made to live with you. A little intention keeps it crisp, smooth, and softly luminous.</p>
                      <div className="space-y-4 pt-2 border-t border-gray-100">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Three Rules Of Longevity</h4>
                        <ul className="space-y-3">
                          {['Protect sheen: wash inside out', 'Reduce friction: gentle cycles, light loads', 'Use lower heat: cool washes, low drying temps'].map((r) => (
                            <li key={r} className="flex items-start gap-3 text-sm text-gray-600"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4 border-t border-gray-100">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Wash</h4>
                        <ul className="space-y-3">
                          {['30°C for most washes (best for softness + sheen)', '40°C when you need a deeper clean', 'Choose gentle cycle + low spin, and do not overfill drum'].map((i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{i}</li>
                          ))}
                        </ul>
                        <p className="text-sm text-gray-600 italic leading-relaxed pt-2">Pro tip: duvet covers and pillowcases inside out—that is where sateen glow is protected</p>
                      </div>
                      <div className="space-y-4 border-t border-gray-100">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Dry</h4>
                        <ul className="space-y-3">
                          {['Line dry where possible. If tumble drying: low heat, and remove slightly damp and let air dry', 'Avoid abrasion', 'Keep sateen away from rough contact where you can, as rough surfaces can reduce sheen.'].map((i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{i}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4 border-t border-gray-100">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Optional Finishing</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">Steam to revive drape, or iron moderate heat while slightly damp for extra crispness.</p>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'specifications' && (
                    <div className="space-y-8">
                      {[
                        { label: 'Material', value: '100% Egyptian cotton' },
                        { label: 'Weave', value: 'Sateen' },
                        { label: 'Thread Count', value: '300' },
                        { label: 'Finish / Feel', value: 'Smooth, softly luminous, elegant drape' },
                      ].map(({ label, value }) => (
                        <div key={label} className="space-y-1 border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
                          <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900">{label}</h4>
                          <p className="text-sm text-gray-600">{value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {openDrawer === 'returns' && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Changed your mind? No problem. We accept returns on unused, unwashed, and undamaged bedding for a full refund within 30 days of delivery. Items must be returned in their original packaging, with all tags and labels attached. Please see our{' '}
                      <Link to="/help" className="underline hover:text-gray-900 transition-colors">Returns Policy</Link> for full details.
                    </p>
                  )}

                  {openDrawer === 'reviews' && (
                    <div className="space-y-8 pb-8">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-serif text-gray-900">4.9</span>
                              <div className="flex gap-0.5 ml-1">
                                {[1,2,3,4,5].map(s => (
                                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= 4 ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="1.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wide">Based on 128 reviews</p>
                          </div>
                          <button onClick={() => { setOpenDrawer(null); setReviewDrawerOpen(true); }}
                            className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 border-b border-gray-900 pb-0.5 hover:opacity-60 transition-opacity">
                            Write a Review
                          </button>
                        </div>
                        <div className="space-y-2 pt-2">
                          {[5, 4, 3, 2, 1].map(r => (
                            <div key={r} className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-gray-700 w-3">{r}</span>
                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-900" style={{ width: `${r === 5 ? 92 : r === 4 ? 6 : 2}%` }} />
                              </div>
                              <span className="text-[10px] text-gray-400 w-8 text-right">{r === 5 ? '92%' : r === 4 ? '6%' : '2%'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-gray-100" />
                      <div className="space-y-10">
                        {[
                          { name: "Sarah M.", date: "Feb 12, 2026", rating: 5, headline: "Unbelievable comfort, it truly stays put!", text: "I was skeptical about the 'stays put' claim, but this fitted sheet is a game changer. No more waking up with the sheet bunched up under me. The fabric is incredibly soft and has a lovely subtle sheen." },
                          { name: "James T.", date: "Jan 28, 2026", rating: 5, headline: "Premium feel, worth every penny.", text: "The quality is evident as soon as you open the box. The tailoring is precise, and the 300TC sateen feels much more luxurious than other high-count sheets I've tried. Highly recommend the bundle." },
                          { name: "Elena R.", date: "Jan 15, 2026", rating: 4, headline: "Beautiful color, very smooth.", text: "The Winter Cloud color is exactly what I was looking for. The sateen finish is very smooth and cool to the touch. Docked one star only because shipping took a day longer than expected, but the product itself is perfect." },
                        ].map((rev, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= rev.rating ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="1.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-400">{rev.date}</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">{rev.headline}</h4>
                              <p className="text-[13px] text-gray-600 leading-relaxed">{rev.text}</p>
                            </div>
                            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{rev.name}</p>
                          </div>
                        ))}
                      </div>
                      <div className="sticky bottom-0 py-6 border-t border-gray-100 bg-white">
                        <button className="w-full bg-gray-900 text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all" onClick={() => setOpenDrawer(null)}>
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'size' && (
                    <div className="space-y-6">
                      <div className="flex gap-8 border-b border-gray-100 mb-6">
                        {[{ page: 1 as const, label: 'Measurements' }, { page: 2 as const, label: 'Details' }].map(tab => (
                          <button key={tab.page} onClick={() => setSizeDrawerPage(tab.page)}
                            className={cn("pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                              sizeDrawerPage === tab.page ? "text-gray-900" : "text-gray-400 hover:text-gray-600")}>
                            {tab.label}
                            {sizeDrawerPage === tab.page && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900" />}
                          </button>
                        ))}
                      </div>
                      <AnimatePresence mode="wait">
                        {sizeDrawerPage === 1 ? (
                          <motion.div key="t1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Measurements (cm)</p>
                            <div className="border border-gray-100 overflow-hidden">
                              <table className="w-full text-center border-collapse">
                                <thead className="bg-gray-50">
                                  <tr>
                                    {['Size', 'Duvet Cover', 'Fitted Sheet', 'Oxford Case', 'Regular Case'].map(h => (
                                      <th key={h} className="border border-gray-100 px-3 py-4 text-[9px] font-bold text-gray-900 uppercase tracking-widest">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {[
                                    { size: 'Single', duvet: '140×200', fitted: '90×190×40', oxford: '50×75', regular: '50×75' },
                                    { size: 'Double', duvet: '200×200', fitted: '135×190×40', oxford: '50×75', regular: '50×75' },
                                    { size: 'King', duvet: '225×220', fitted: '150×200×40', oxford: '50×75', regular: '50×75' },
                                  ].map(row => (
                                    <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                                      <td className="border border-gray-100 px-3 py-5 text-[11px] font-medium text-gray-900 text-left">{row.size}</td>
                                      <td className="border border-gray-100 px-3 py-5 text-[11px] text-gray-600">{row.duvet}</td>
                                      <td className="border border-gray-100 px-3 py-5 text-[11px] text-gray-600">{row.fitted}</td>
                                      <td className="border border-gray-100 px-3 py-5 text-[11px] text-gray-600">{row.oxford}</td>
                                      <td className="border border-gray-100 px-3 py-5 text-[11px] text-gray-600">{row.regular}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed">All measurements are approximate. Oxford pillowcase border (+5cm) not included in total dimensions.</p>
                          </motion.div>
                        ) : (
                          <motion.div key="t2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-8">
                            <h3 className="font-serif text-2xl text-gray-900 leading-snug">A fitted sheet that stays put — even on deeper mattresses.</h3>
                            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                              <p>A bed should look finished, not fussy. REMsleep is made for real life: sleep, slow mornings, and the occasional full-day reset.</p>
                              <p>Our fitted sheet is designed to keep the bed looking made — with less shifting, less bunching, and no corner slip.</p>
                            </div>
                            <div className="space-y-3 pt-2 border-t border-gray-100">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">How sizing works</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">Choose the size that matches your mattress. The cut is shaped to sit neatly, with corners designed to stay anchored.</p>
                            </div>
                            <div className="space-y-3 border-t border-gray-100">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Deep-mattress elastic</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">Our fitted sheet uses elastic designed for deeper mattresses, so it tucks in cleanly and stays there. Expect sharper corners, a smoother surface, and less re-tucking.</p>
                            </div>
                            <div className="space-y-4 border-t border-gray-100">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Why You'll Love It</h4>
                              <ul className="space-y-2.5">
                                {['Hugs the corners with a tighter fit', 'Holds position with strong, deep-mattress elastic', 'Stays smooth for a cleaner, more intentional finish'].map(p => (
                                  <li key={p} className="flex items-start gap-3 text-sm text-gray-600"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{p}</li>
                                ))}
                              </ul>
                              <p className="text-xs text-gray-400 italic pt-1">Using a topper? Choose your size based on your overall mattress depth for the most secure hold.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WriteReviewDrawer
        open={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        productId={product?.id || ''}
        productHandle={handle || ''}
      />

      <StoreFooter />
    </div>
  );
}