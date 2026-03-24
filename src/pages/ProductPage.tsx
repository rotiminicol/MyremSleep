import { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { storefrontApiRequest, ShopifyProduct, fetchProducts } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { ReviewsSection } from '@/components/ReviewsSection';
import { WriteReviewDrawer } from '@/components/WriteReviewDrawer';
import { useUserCart } from '@/stores/userCartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCurrency } from '@/hooks/useCurrency';
import { useProductReviews, useAllReviews } from '@/hooks/useProductReviews';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Plus,
  Minus,
  X,
  ArrowRight,
  Star,
  ShieldCheck,
  RotateCcw,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const COLOR_HEX: Record<string, { fill: string; shadow: string }> = {
  'Winter Cloud': { fill: '#F5F5F7', shadow: '#d0d0d4' },
  'Desert Whisperer': { fill: '#E5DACE', shadow: '#c0b8ac' },
  'Buttermilk': { fill: '#FFF4D2', shadow: '#e0d4a0' },
  'Clay': { fill: '#D2C4B5', shadow: '#a89c8e' },
  'Clay Blush': { fill: '#D9A891', shadow: '#b07a63' },
  'Clayblush Pink': { fill: '#D9A891', shadow: '#b07a63' },
  'Pebble Haze': { fill: '#A3A3A3', shadow: '#787878' },
  'Desert Sand': { fill: '#E2CA9D', shadow: '#c0a870' },
  'Cinnamon Bark': { fill: '#8B4513', shadow: '#5a2c0a' },
};

function extractColorFromTitle(title: string, handle: string = ''): string | null {
  const combined = (title + ' ' + handle.replace(/-/g, ' ')).toLowerCase();

  if (combined.includes('desert whisperer')) return 'Desert Whisperer';
  if (combined.includes('buttermilk')) return 'Buttermilk';
  if (combined.includes('clay blush') || combined.includes('clayblush')) return 'Clay Blush';
  if (combined.includes('pebble haze')) return 'Pebble Haze';
  if (combined.includes('cinnamon bark')) return 'Cinnamon Bark';
  if (combined.includes('desert sand')) return 'Desert Sand';
  if (combined.includes('clay') && !combined.includes('blush')) return 'Clay';
  if (combined.includes('winter cloud')) return 'Winter Cloud';

  if (title.toLowerCase() === 'sateen bedding set' || handle === 'sateen-bedding-set') {
    return 'Winter Cloud';
  }
  return null;
}

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
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
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProduct['node']['variants']['edges'][0]['node'] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  const { data: reviewsStatsData } = useAllReviews(1, 1000);
  const allReviews = reviewsStatsData?.reviews || [];
  const totalCount = reviewsStatsData?.total_count || allReviews.length || 0;
  const averageRating = allReviews.length > 0
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : '0';

  const { data: reviewsData, isLoading: isReviewsLoading } = useProductReviews(handle || '', 1, 10);
  const reviews = reviewsData?.reviews || [];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  };

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      setLoading(true);
      setSelectedImageIndex(0);
      try {
        const [productData, allProductsData] = await Promise.all([
          storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle }),
          fetchProducts(20),
        ]);

        const shopifyProduct = productData?.data?.productByHandle;

        if (shopifyProduct) {
          setProduct(shopifyProduct);
          setAllProducts(allProductsData || []);

          let defaultOptions: Record<string, string> = {};
          const firstVariant = shopifyProduct.variants.edges[0]?.node;
          if (firstVariant) {
            setSelectedVariant(firstVariant);
            firstVariant.selectedOptions.forEach((opt: { name: string; value: string }) => {
              defaultOptions[opt.name] = opt.value;
            });
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
            `, { productId: shopifyProduct.id });
            if (recs?.data?.productRecommendations?.length > 0) {
              setRecommendedProducts(recs.data.productRecommendations.map((p: any) => ({ node: p })));
            } else {
              setRecommendedProducts(allProductsData?.filter((p: ShopifyProduct) => p.node.handle !== handle).slice(0, 4) || []);
            }
          } catch {
            setRecommendedProducts(allProductsData?.filter((p: ShopifyProduct) => p.node.handle !== handle).slice(0, 4) || []);
          }
        } else {
          const mockProduct = MOCK_PRODUCTS.find(p => p.node.handle === handle);
          if (mockProduct) {
            setProduct(mockProduct.node);
            const firstVariant = mockProduct.node.variants.edges[0]?.node;
            if (firstVariant) {
              setSelectedVariant(firstVariant);
              let defaultOptions: Record<string, string> = {};
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

  useEffect(() => {
    if (!product) return;
    const matchingVariant = product.variants.edges.find((v) =>
      v.node.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    );
    if (matchingVariant) setSelectedVariant(matchingVariant.node);
  }, [selectedOptions, product]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionName]: value }));
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
    const total = product.images.edges.length;
    setSelectedImageIndex(prev => prev > 0 ? prev - 1 : total - 1);
  };

  const handleNextImage = () => {
    if (!product) return;
    const total = product.images.edges.length;
    setSelectedImageIndex(prev => prev < total - 1 ? prev + 1 : 0);
  };

  const currentColorName = product ? extractColorFromTitle(product.title, handle || '') : null;
  const currentColor = currentColorName ? COLOR_HEX[currentColorName] : null;

  const handleColorNavigation = (targetHandle: string) => {
    if (targetHandle === handle) return;
    const target = allProducts.find(p => p.node.handle === targetHandle);
    if (target) {
      setProduct(target.node);
      setSelectedImageIndex(0);
      const firstVariant = target.node.variants?.edges[0]?.node;
      if (firstVariant) {
        setSelectedVariant(firstVariant);
        const opts: Record<string, string> = {};
        firstVariant.selectedOptions.forEach((o: { name: string; value: string }) => {
          opts[o.name] = o.value;
        });
        setSelectedOptions(opts);
      }
      navigate(`/product/${targetHandle}`, { replace: true });
    } else {
      navigate(`/product/${targetHandle}`);
    }
  };

  const [selectedSize, setSelectedSize] = useState<string>('Double');
  const sizes = ['Double', 'King'];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EDE8]">
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
      <div className="min-h-screen bg-[#F2EDE8]">
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
  const hasMultipleImages = images.length > 1;
  const currentImage = images[selectedImageIndex]?.node;

  return (
    <div className="min-h-screen bg-[#F2EDE8]">
      {/* Swatch keyframes */}
      <style>{`
        @keyframes swatchBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.09); }
        }
        @keyframes swatchRipple {
          0%   { transform: scale(1);    opacity: 0.65; }
          100% { transform: scale(1.85); opacity: 0; }
        }
      `}</style>

      <StoreNavbar hideOnScroll />

      <main className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] min-h-[90vh]">

          {/* ── LEFT: Gallery — full-bleed image, circular arrows, bottom thumbnails ── */}
          <div className="relative lg:h-screen lg:sticky lg:top-0">
            <div className="relative w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex + (currentImage?.url || '')}
                  src={currentImage?.url || ''}
                  alt={currentImage?.altText || product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                  draggable={false}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -50) {
                      handleNextImage();
                    } else if (offset.x > 50) {
                      handlePreviousImage();
                    }
                  }}
                />
              </AnimatePresence>

              {hasMultipleImages && (
                <>
                  {/* Bottom thumbnail strip */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 px-6 w-full justify-center overflow-x-auto no-scrollbar">
                    {images.slice(0, 4).map((image, idx) => {
                      const isActive = selectedImageIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={cn(
                            "w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden transition-all shadow-sm flex-shrink-0 bg-[#d1c6ba]",
                            isActive
                              ? "opacity-100 shadow-md scale-[1.02]"
                              : "opacity-60 hover:opacity-90 active:scale-95"
                          )}
                        >
                          <img src={image.node.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col justify-start py-10 px-8 lg:px-12 xl:px-14 overflow-y-auto lg:max-h-[100vh] bg-[#F2EDE8] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            <h1 className="text-[32px] md:text-[38px] leading-tight text-gray-900 font-bold tracking-tight mb-2">
              Sateen Bedding Set
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                  const ratingValue = parseFloat(averageRating || '0');
                  const isFull = i + 1 <= Math.floor(ratingValue);
                  const isPartial = !isFull && i < ratingValue;

                  return (
                    <div key={i} className="relative">
                      <Star className="w-5 h-5 text-gray-200 fill-gray-200 border-none" strokeWidth={0} />
                      {(isFull || isPartial) && (
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ width: isFull ? '100%' : `${(ratingValue % 1) * 100}%` }}
                        >
                          <Star className="w-5 h-5 fill-yellow-500 text-yellow-500 border-none" strokeWidth={0} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-[14px] text-gray-600 font-medium">
                {averageRating} · <button
                  onClick={() => {
                    const el = document.getElementById('reviews-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="underline underline-offset-4 decoration-gray-300 hover:text-gray-900 transition-colors"
                >
                  {totalCount} reviews
                </button>
              </span>
            </div>

            <p className="text-[28px] font-bold text-gray-900 mb-2">
              {formatPrice(parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount || '0'))}
            </p>

            <div className="h-px bg-[#e0dbd5] mb-8" />

            <div className="space-y-8">
              {/* ── Colour swatches ── */}
              {allProducts.length > 1 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8e8e8e]">
                      Colour
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5 mb-4">
                    {allProducts.map((p) => {
                      const colorName = extractColorFromTitle(p.node.title, p.node.handle);
                      const color = colorName ? COLOR_HEX[colorName] : { fill: '#ccc', shadow: '#999' };
                      const isActive = p.node.handle === handle;

                      return (
                        <button
                          key={p.node.id}
                          onClick={() => !isActive && handleColorNavigation(p.node.handle)}
                          title={colorName || p.node.title}
                          className={cn(
                            "w-11 h-11 rounded-full border-2 transition-all p-0.5",
                            isActive ? "border-gray-900" : "border-transparent hover:border-gray-300"
                          )}
                        >
                          <span
                            className="block w-full h-full rounded-full"
                            style={{ backgroundColor: color.fill, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-900 tracking-wide">{currentColorName}</p>
                    <p className="text-[13px] text-gray-500 leading-relaxed max-w-[440px]">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Size selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8e8e8e]">Size</span>
                  <button
                    onClick={() => { setSizeDrawerPage(1); setOpenDrawer('size'); }}
                    className="text-[12px] text-gray-600 hover:text-gray-900 underline underline-offset-4 decoration-gray-300 transition-colors"
                  >
                    Size guide
                  </button>
                </div>
                <div className="flex gap-4">
                  <div className="flex-[4] flex gap-2">
                    {sizes.map((size) => {
                      const sizeOptionName = product.options.find(o => o.name.toLowerCase().includes('size'))?.name || 'Size';
                      const isSelected = selectedOptions[sizeOptionName] === size || selectedSize === size;
                      return (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          handleOptionChange(sizeOptionName, size);
                        }}
                        className={cn(
                          "flex-1 py-4 text-[13px] font-bold tracking-[0.2em] uppercase transition-all border rounded-sm",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-[#e0dbd5] text-gray-900 hover:border-gray-400 bg-white"
                        )}
                      >
                        {size}
                      </button>
                    )})}
                  </div>
                  <div className="flex-1 max-w-[64px]" />
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#8e8e8e]">Quantity</span>
                  <span className={cn(
                    "text-[11px] font-bold uppercase tracking-widest",
                    selectedVariant?.availableForSale === false ? "text-red-500" : "text-[#8e8e8e]"
                  )}>
                    {selectedVariant?.availableForSale === false ? 'Out of stock' : 'In stock'}
                  </span>
                </div>
                <div className="flex items-center w-full max-w-[160px] h-14 border border-[#e0dbd5] rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-14 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center text-[15px] font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-14 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart + Favourite */}
              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!selectedVariant?.availableForSale || isCartLoading}
                    className="flex-[4] h-16 bg-primary hover:bg-opacity-90 text-white rounded-sm text-[13px] font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50"
                  >
                    {isCartLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      !selectedVariant?.availableForSale ? 'Out of Stock' : 'Add to Cart'
                    )}
                  </Button>
                  <button
                    onClick={handleToggleFavorite}
                    className="flex-1 max-w-[64px] h-16 flex items-center justify-center border border-[#e0dbd5] hover:bg-white rounded-sm transition-all bg-transparent group"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all text-[#333333]",
                        product && isFavorited(product.id) ? "fill-red-500 text-red-500" : "group-hover:text-red-400"
                      )}
                      strokeWidth={1}
                    />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 pt-8 border-t border-[#e0dbd5] opacity-50">
                  <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-900">
                    <Star className="w-3.5 h-3.5 fill-gray-900" strokeWidth={0} /> OEKO-TEX Certified
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-900">
                    <RotateCcw className="w-3.5 h-3.5" /> Free Returns
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-900">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#e0dbd5] my-6" />

            {/* Accordions */}
            <div className="space-y-0">
              {[
                { id: 'essentials', label: 'THE ESSENTIALS' },
                { id: 'why-it-works', label: 'WHY IT WORKS' },
                { id: 'care', label: 'Care' },
                { id: 'specifications', label: 'Specifications ' },
                { id: 'returns', label: 'Return and Delivery ' },
                { id: 'reviews', label: 'REVIEWS ' },
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

            <div className="h-8 md:h-8 mb-20 md:mb-0" />
          </div>
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F2EDE8] border-t border-[#e0dbd5] px-6 py-4 z-50 flex items-stretch justify-between gap-6 shadow-[0_-12px_45px_rgba(0,0,0,0.12)] h-[100px]">
        <div className="flex flex-col justify-between py-1">
          <div className="flex flex-col">
            <span className="text-[24px] font-bold text-gray-900 leading-none">
              {formatPrice(parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount || '0') * quantity)}
            </span>
          </div>

          <div className="flex items-center border border-[#e0dbd5] h-9 bg-[#F2EDE8] rounded-sm overflow-hidden min-w-[100px] w-fit font-sans">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="flex-1 h-full px-4 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-[#e0dbd5]"
            >
              <Minus className="w-3 h-3 text-gray-500" />
            </button>
            <span className="px-3 text-center text-[13px] font-bold text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="flex-1 h-full px-4 flex items-center justify-center hover:bg-gray-100 transition-colors border-l border-[#e0dbd5]"
            >
              <Plus className="w-3 h-3 text-gray-500" />
            </button>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant?.availableForSale || isCartLoading}
          className="h-full px-8 bg-primary text-white rounded-sm text-[13px] font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50 flex-1 max-w-[200px]"
        >
          {isCartLoading ? <Loader2 className="h-6 w-6 animate-spin text-white" /> : (
            !selectedVariant?.availableForSale ? 'Out of Stock' : 'Add to Cart'
          )}
        </Button>
      </div>

      {/* Reviews section */}
      <div id="reviews-section" className="bg-[#F2EDE8]">
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

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="bg-[#F2EDE8] py-16">
          <div className="max-w-[1400px] mx-auto px-6">
            <h2 className="text-2xl font-serif text-gray-900 text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {recommendedProducts.slice(0, 4).map((rec, idx) => (
                <Link key={rec.node.id} to={`/product/${rec.node.handle}`} className="group block">
                  <div className="relative aspect-[3/4] bg-[#EBE7E0] overflow-hidden md:rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-700">
                    <img
                      src={rec.node.images.edges[0]?.node.url}
                      alt={rec.node.images.edges[0]?.node.altText || rec.node.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 space-y-1 text-center">
                    <h3 className="text-sm font-medium text-gray-900 font-serif tracking-wide">{rec.node.title}</h3>
                    <p className="text-xs text-gray-500 tracking-wider">
                      {formatPrice(parseFloat(rec.node.priceRange.minVariantPrice.amount))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

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
              className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-[#F2EDE8] shadow-2xl z-50 overflow-y-auto scrollbar-hide"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  {openDrawer !== 'size' && (
                    <h2 className="text-lg font-serif text-gray-900">
                      {openDrawer === 'essentials' && 'THE ESSENTIALS'}
                      {openDrawer === 'why-it-works' && 'WHY IT WORKS'}
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

                <div className="space-y-6">
                  {openDrawer === 'essentials' && (
                    <div className="space-y-8">
                      <div className="space-y-6">
                        {[
                          { label: 'Material', content: '100% long-staple Egyptian cotton, selected for a longer, finer fibre that produces exceptional softness, natural breathability and the durability to age well rather than wear out.' },
                          { label: 'Construction', content: 'Sateen weave, crafted by specialist textile manufacturers with generations of expertise in fine cotton. Woven so the fabric drapes cleanly, catches light softly and feels distinct from standard percale or cotton blends.' },
                          { label: 'Thread count', content: '300, the point at which softness, breathability and longevity meet. Not inflated for marketing. Chosen because it performs.' },
                          { label: 'What\'s included', content: 'Duvet cover, fitted sheet, 2 Oxford pillowcases and 2 plain pillowcases. Everything needed to make the room feel complete, in one set.' },
                          { label: 'Certification', content: 'Produced at an OEKO-TEX® Standard 100 certified facility, independently tested and verified free from harmful substances.' },
                        ].map((item) => (
                          <div key={item.label} className="space-y-2 pb-4 border-b border-[#e0dbd5] last:border-0 last:pb-0">
                            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900">{item.label}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {openDrawer === 'why-it-works' && (
                    <div className="space-y-8">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Egyptian cotton sateen sits differently to standard cotton. The longer the fibre, the smoother and more consistent the weave, which is why long-staple Egyptian cotton is the preferred choice for premium bedding. At 300 thread count, the fabric has enough density to feel considered without sacrificing breathability. The sateen finish means it drapes cleanly and resists the washed-out look that lower-quality white bedding develops over time.
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed pt-4 border-t border-[#e0dbd5]">
                        REMsleep Sateen Bundle Sets are designed to be lived with. They do not need careful handling or precise styling to look good. They settle naturally and hold their finish, wash after wash.
                      </p>
                    </div>
                  )}

                  {openDrawer === 'care' && (
                    <div className="space-y-8">
                      <p className="text-sm text-gray-600 leading-relaxed">REMsleep sateen is made to live with you. A little intention keeps it crisp, smooth, and softly luminous.</p>
                      <div className="space-y-4 pt-2 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Three Rules Of Longevity</h4>
                        <ul className="space-y-3">
                          {['Protect sheen: wash inside out', 'Reduce friction: gentle cycles, light loads', 'Use lower heat: cool washes, low drying temps'].map((r) => (
                            <li key={r} className="flex items-start gap-3 text-sm text-gray-600"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Wash</h4>
                        <ul className="space-y-3">
                          {['30°C for most washes (best for softness + sheen)', '40°C when you need a deeper clean', 'Choose gentle cycle + low spin, and do not overfill drum'].map((i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{i}</li>
                          ))}
                        </ul>
                        <p className="text-sm text-gray-600 italic leading-relaxed pt-2">Pro tip: duvet covers and pillowcases inside out—that is where sateen glow is protected</p>
                      </div>
                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Dry</h4>
                        <ul className="space-y-3">
                          {['Line dry where possible. If tumble drying: low heat, and remove slightly damp and let air dry', 'Avoid abrasion', 'Keep sateen away from rough contact where you can, as rough surfaces can reduce sheen.'].map((i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600"><span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />{i}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4 border-t border-[#e0dbd5]">
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
                        <div key={label} className="space-y-1 border-t border-[#e0dbd5] pt-6 first:border-t-0 first:pt-0">
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
                            {reviews.length > 0 ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-3xl font-serif text-gray-900">{averageRating}</span>
                                  <div className="flex gap-0.5 ml-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= Math.round(Number(averageRating)) ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="1.5">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wide">Based on {totalCount} review{totalCount !== 1 ? 's' : ''}</p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 font-sans italic">No reviews yet.</p>
                            )}
                          </div>
                          <button onClick={() => { setOpenDrawer(null); setReviewDrawerOpen(true); }}
                            className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary border-b border-primary pb-0.5 hover:opacity-60 transition-opacity">
                            Write a Review
                          </button>
                        </div>
                      </div>
                      <div className="border-t border-[#e0dbd5]" />
                      <div className="space-y-10">
                        {isReviewsLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          </div>
                        ) : reviews.length > 0 ? (
                          reviews.slice(0, 5).map((rev) => (
                            <div key={rev.id} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill={s <= rev.rating ? "#1a1a1a" : "none"} stroke="#1a1a1a" strokeWidth="1.5">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-[10px] text-gray-400">{formatDate(rev.created_at)}</span>
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">{rev.title}</h4>
                                <p className="text-[13px] text-gray-600 leading-relaxed">{rev.body}</p>
                              </div>
                              <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">{rev.reviewer?.name || 'Anonymous'}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 font-sans italic py-4">No reviews yet — be the first to share your experience.</p>
                        )}
                      </div>
                      <div className="sticky bottom-0 py-6 border-t border-[#e0dbd5] bg-[#F2EDE8]">
                        <button className="w-full bg-gray-900 text-white py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all" onClick={() => setOpenDrawer(null)}>
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'size' && (
                    <div className="space-y-6">
                      <div className="flex gap-8 border-b border-[#e0dbd5] mb-6">
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
                            <div className="border border-[#e0dbd5] overflow-hidden">
                              <table className="w-full text-center border-collapse">
                                <thead className="bg-[#e8dfd3]">
                                  <tr>
                                    {['Size', 'Duvet Cover', 'Fitted Sheet', 'Oxford Case', 'Regular Case'].map(h => (
                                      <th key={h} className="border border-[#e0dbd5] px-3 py-4 text-[9px] font-bold text-gray-900 uppercase tracking-widest">{h}</th>
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
                                      <td className="border border-[#e0dbd5] px-3 py-5 text-[11px] font-medium text-gray-900 text-left">{row.size}</td>
                                      <td className="border border-[#e0dbd5] px-3 py-5 text-[11px] text-gray-600">{row.duvet}</td>
                                      <td className="border border-[#e0dbd5] px-3 py-5 text-[11px] text-gray-600">{row.fitted}</td>
                                      <td className="border border-[#e0dbd5] px-3 py-5 text-[11px] text-gray-600">{row.oxford}</td>
                                      <td className="border border-[#e0dbd5] px-3 py-5 text-[11px] text-gray-600">{row.regular}</td>
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
                            <div className="space-y-3 pt-2 border-t border-[#e0dbd5]">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">How sizing works</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">Choose the size that matches your mattress. The cut is shaped to sit neatly, with corners designed to stay anchored.</p>
                            </div>
                            <div className="space-y-3 border-t border-[#e0dbd5]">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Deep-mattress elastic</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">Our fitted sheet uses elastic designed for deeper mattresses, so it tucks in cleanly and stays there. Expect sharper corners, a smoother surface, and less re-tucking.</p>
                            </div>
                            <div className="space-y-4 border-t border-[#e0dbd5]">
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