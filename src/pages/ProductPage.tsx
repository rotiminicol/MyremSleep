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
  const [isAutoSlideshow, setIsAutoSlideshow] = useState(false);
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
      
      // Enable auto-slideshow for Cinnamon Bark and Clay Blush
      if (selectedColor === 'Cinnamon Bark' || selectedColor === 'Clay Blush') {
        setIsAutoSlideshow(true);
        // Find the starting index for the specific color's images
        if (selectedColor === 'Cinnamon Bark') {
          setSelectedImageIndex(1); // Start with first cinnamon image (index 1)
        } else if (selectedColor === 'Clay Blush') {
          // Find the first Clay Blush image index
          const clayBlushStartIndex = product.images.edges.findIndex(img => 
            img.node.altText?.includes('Clay Blush Product Image 1')
          );
          setSelectedImageIndex(clayBlushStartIndex >= 0 ? clayBlushStartIndex : 6); // Default to index 6 if not found
        }
      } else {
        setIsAutoSlideshow(false);
        setSelectedImageIndex(0);
      }
    }
  }, [selectedOptions, product]);

  // Auto-slideshow effect for Cinnamon Bark and Clay Blush
  useEffect(() => {
    if (!isAutoSlideshow || !product) return;

    const selectedColor = Object.entries(selectedOptions).find(([key]) =>
      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
    )?.[1];

    let colorImages: typeof product.images.edges = [];
    
    if (selectedColor === 'Cinnamon Bark') {
      colorImages = product.images.edges.slice(1, 5); // Cinnamon images at indices 1-4
    } else if (selectedColor === 'Clay Blush') {
      colorImages = product.images.edges.slice(6, 9); // Clay Blush images at indices 6-8
    }

    if (colorImages.length === 0) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((prevIndex) => {
        if (selectedColor === 'Cinnamon Bark') {
          const currentColorIndex = prevIndex - 1;
          const nextColorIndex = (currentColorIndex + 1) % colorImages.length;
          return nextColorIndex + 1;
        } else if (selectedColor === 'Clay Blush') {
          const currentColorIndex = prevIndex - 6;
          const nextColorIndex = (currentColorIndex + 1) % colorImages.length;
          return nextColorIndex + 6;
        }
        return prevIndex;
      });
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoSlideshow, product, selectedOptions]);

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
            Back to home
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
          Back to home
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
                  src={(() => {
                    const selectedColor = Object.entries(selectedOptions).find(([key]) =>
                      key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
                    )?.[1];
                    
                    if ((selectedColor === 'Cinnamon Bark' || selectedColor === 'Clay Blush') && selectedImageIndex > 0) {
                      return product.images.edges[selectedImageIndex]?.node.url;
                    }
                    
                    return customColorImage || currentImage?.url;
                  })()}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation Arrows - Only show if not auto-slideshow */}
              {!isAutoSlideshow && (
                <>
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
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-6 right-6 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold tracking-widest text-gray-900">
                {(() => {
                  const selectedColor = Object.entries(selectedOptions).find(([key]) =>
                    key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
                  )?.[1];
                  
                  if (selectedColor === 'Cinnamon Bark' && isAutoSlideshow) {
                    const cinnamonImages = images.slice(1, 5);
                    const currentCinnamonIndex = selectedImageIndex - 1;
                    return `${currentCinnamonIndex + 1} / ${cinnamonImages.length}`;
                  } else if (selectedColor === 'Clay Blush' && isAutoSlideshow) {
                    const clayBlushImages = images.slice(6, 9);
                    const currentClayBlushIndex = selectedImageIndex - 6;
                    return `${currentClayBlushIndex + 1} / ${clayBlushImages.length}`;
                  }
                  
                  return `${selectedImageIndex + 1} / ${images.length}`;
                })()}
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

              {/* Title, Color Description, and Price with Divider */}
              <div className="relative pb-6">
                <div className="grid grid-cols-[1fr_auto] gap-4 items-baseline">
                  <h1 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight leading-none">
                    {(() => {
                      const selectedColor = Object.entries(selectedOptions).find(([key]) =>
                        key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
                      )?.[1];

                      if (selectedColor && COLOR_DESCRIPTIONS[selectedColor]) {
                        return COLOR_DESCRIPTIONS[selectedColor].title;
                      }
                      return product.title;
                    })()}
                  </h1>
                  <p className="text-lg text-gray-950 font-medium whitespace-nowrap">
                    {formatPrice(parseFloat(selectedVariant?.price.amount || '0'))}
                  </p>
                </div>

                {/* Color Description - directly under title */}
                {(() => {
                  const selectedColor = Object.entries(selectedOptions).find(([key]) =>
                    key.toLowerCase().includes('color') || key.toLowerCase().includes('colour')
                  )?.[1];

                  if (selectedColor && COLOR_DESCRIPTIONS[selectedColor]) {
                    const colorDesc = COLOR_DESCRIPTIONS[selectedColor];
                    return (
                      <div className="mt-2 text-sm text-gray-600 leading-relaxed">
                        {colorDesc.description}
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Divider Line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#e0dbd5]" />
              </div>

              {/* Product Details */}
              <div className="text-sm text-gray-500 space-y-4 pt-2">
                <div className="font-medium text-gray-900">The essentials</div>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>• Material: 100% Egyptian cotton</div>
                  <div>• Weave: Sateen</div>
                  <div>• Thread count: 300</div>
                  <div>• Includes: Duvet cover + fitted sheet + 4 pillowcases (2 Oxford + 2 plain)</div>
                  <div>• Certification: OEKO-TEX® Standard 100</div>
                </div>
                <div className="pt-2 text-xs text-gray-600 italic">
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

            {/* Product Accordions */}
            <div className="pt-8 space-y-4">
              <button
                onClick={() => setOpenDrawer('why-you-will-love-it')}
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
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#f5f1ed] shadow-xl z-50 overflow-y-auto scrollbar-hide"
            >
              <div className="p-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between mb-6">
                  {openDrawer === 'size' ? null : (
                    <h2 className="text-lg font-serif text-gray-900">
                      {openDrawer === 'why-you-will-love-it' && 'Why You Will Love It'}
                      {openDrawer === 'care' && 'Care'}
                      {openDrawer === 'specifications' && 'Specifications'}
                      {openDrawer === 'returns' && 'Return and Delivery'}
                      {openDrawer === 'reviews' && 'Reviews'}
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
                  {openDrawer === 'why-you-will-love-it' && (
                    <div className="space-y-8">
                      {/* Main statement */}
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Everything that meets your skin should feel right. We focus on Fabric, Finish and Function—so your bedroom feels calm not cluttered. Our Bedding bundles gives you the hotel-feel comfort, effortlessly. Our 100% cotton 300 thread count sateen bundle brings a smooth, breathable finish and a subtle sheen—so your bed looks instantly considered, every night.
                        </p>
                      </div>

                      {/* What's included */}
                      <div className="space-y-4 pt-2 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Each Set Includes</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          A fitted sheet, duvet cover, and four pillowcases (2 Oxford + 2 plain).
                        </p>
                      </div>

                      {/* Key features */}
                      <div className="space-y-4">
                        <ul className="space-y-3">
                          {[
                            '100% Egyptian cotton · 300 thread count sateen weave',
                            'Bundle set = effortless styling (no overthinking, no add-ons)',
                            'Four pillowcases included: 2 Oxford (framed, elevated look) + 2 plain (everyday rotation)',
                            'Tonal colours that make layering easy',
                            'Certified: OEKO-TEX® 100',
                            'Made to last and gets softer with every wash'
                          ].map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed">
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
                        <p className="text-sm text-gray-600 leading-relaxed">
                          REMsleep sateen is made to live with you. A little intention keeps it crisp, smooth, and softly luminous.
                        </p>
                      </div>

                      {/* Three rules of longevity */}
                      <div className="space-y-4 pt-2 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">We Follow These Three Rules Of Longevity</h4>
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
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Wash</h4>
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
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Dry (Drape Is Made Here)</h4>
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
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Optional Finishing</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Steam to revive drape, or iron moderate heat while slightly damp for extra crispness.
                        </p>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'specifications' && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900">Material</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          100% Egyptian cotton
                        </p>
                      </div>

                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Weave</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Sateen
                        </p>
                      </div>

                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Thread Count</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          300
                        </p>
                      </div>

                      <div className="space-y-4 border-t border-[#e0dbd5]">
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Finish / Feel</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Smooth, softly luminous, elegant drape
                        </p>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'returns' && (
                    <div className="space-y-8">
                      {/* Write Review Action */}
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Changed your mind? No problem. We accept returns on unused, unwashed, and undamaged bedding for a full refund within 30 days of delivery. Items must be returned in their original packaging, with all tags and labels attached. Please see our <Link to="/help" className="underline hover:text-gray-900 transition-colors">Returns Policy</Link> for full details.
                        </p>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'reviews' && (
                    <div className="space-y-8 pb-8 bg-[#f5f1ed]">
                      {/* Review Summary */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-3xl font-serif text-gray-900">4.9</span>
                              <div className="flex gap-0.5 ml-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= 4 ? "#2D2D2D" : "none"} stroke="#2D2D2D" strokeWidth="1.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-[11px] text-gray-500 tracking-wide uppercase">Based on 128 Reviews</p>
                          </div>
                          <button
                            onClick={() => {
                              setOpenDrawer(null);
                              setReviewDrawerOpen(true);
                            }}
                            className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 border-b border-gray-900 pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors"
                          >
                            Write a Review
                          </button>
                        </div>

                        {/* Rating Breakdown (simplified) */}
                        <div className="space-y-2 pt-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-gray-900 w-3">{rating}</span>
                              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gray-900"
                                  style={{ width: `${rating === 5 ? 92 : rating === 4 ? 6 : 2}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-gray-400 w-8 text-right">
                                {rating === 5 ? '92%' : rating === 4 ? '6%' : '2%'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#e0dbd5]" />

                      {/* Mock Reviews List */}
                      <div className="space-y-10">
                        {[
                          {
                            name: "Sarah M.",
                            date: "Feb 12, 2026",
                            rating: 5,
                            headline: "Unbelievable comfort, it truly stays put!",
                            text: "I was skeptical about the 'stays put' claim, but this fitted sheet is a game changer. No more waking up with the sheet bunched up under me. The fabric is incredibly soft and has a lovely subtle sheen."
                          },
                          {
                            name: "James T.",
                            date: "Jan 28, 2026",
                            rating: 5,
                            headline: "Premium feel, worth every penny.",
                            text: "The quality is evident as soon as you open the box. The tailoring is precise, and the 300TC sateen feels much more luxurious than other high-count sheets I've tried. Highly recommend the bundle."
                          },
                          {
                            name: "Elena R.",
                            date: "Jan 15, 2026",
                            rating: 4,
                            headline: "Beautiful color, very smooth.",
                            text: "The Winter Cloud color is exactly what I was looking for. The sateen finish is very smooth and cool to the touch. Docked one star only because shipping took a day longer than expected, but the product itself is perfect."
                          }
                        ].map((rev, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= rev.rating ? "#2D2D2D" : "none"} stroke="#2D2D2D" strokeWidth="1.5">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-[10px] text-gray-400">{rev.date}</span>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{rev.headline}</h4>
                              <p className="text-[13px] text-gray-600 leading-relaxed">{rev.text}</p>
                            </div>
                            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-widest pt-1">{rev.name}</p>
                          </div>
                        ))}
                      </div>

                      <div className="sticky bottom-0 z-20 flex-shrink-0 py-6 border-t border-[#e0dbd5] bg-[#f5f1ed]/95 backdrop-blur-md">
                        <button className="w-full bg-white border border-gray-200 text-gray-900 py-4 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all transform active:scale-[0.99]"
                          onClick={() => setOpenDrawer(null)}
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </div>
                  )}

                  {openDrawer === 'size' && (
                    <div className="space-y-6">
                      {/* Tabs Navigation */}
                      <div className="flex gap-8 border-b border-[#e0dbd5] mb-6">
                        <button
                          onClick={() => setSizeDrawerPage(1)}
                          className={cn(
                            "pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                            sizeDrawerPage === 1 ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                          )}
                        >
                          Measurements
                          {sizeDrawerPage === 1 && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900"
                            />
                          )}
                        </button>
                        <button
                          onClick={() => setSizeDrawerPage(2)}
                          className={cn(
                            "pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                            sizeDrawerPage === 2 ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
                          )}
                        >
                          Details
                          {sizeDrawerPage === 2 && (
                            <motion.div
                              layoutId="activeTab"
                              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900"
                            />
                          )}
                        </button>
                      </div>

                      <AnimatePresence mode="wait">
                        {sizeDrawerPage === 1 ? (
                          <motion.div
                            key="size-tab-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-5"
                          >
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-900">Measurements (cm)</p>

                            <div className="border border-[#e0dbd5] overflow-hidden bg-white">
                              <table className="w-full text-center border-collapse">
                                <thead className="bg-[#faf8f6]">
                                  <tr>
                                    <th className="border border-[#e0dbd5] px-4 py-5 text-[10px] font-bold text-gray-900 text-left uppercase tracking-widest w-[25%]">
                                      Size
                                    </th>
                                    <th className="border border-[#e0dbd5] px-4 py-5 text-[10px] font-bold text-gray-900 text-center uppercase tracking-widest">
                                      Duvet<br />Cover
                                    </th>
                                    <th className="border border-[#e0dbd5] px-4 py-5 text-[10px] font-bold text-gray-900 text-center uppercase tracking-widest">
                                      Fitted<br />Sheet
                                    </th>
                                    <th className="border border-[#e0dbd5] px-4 py-5 text-[10px] font-bold text-gray-900 text-center uppercase tracking-widest">
                                      Oxford<br />Case
                                    </th>
                                    <th className="border border-[#e0dbd5] px-4 py-5 text-[10px] font-bold text-gray-900 text-center uppercase tracking-widest">
                                      Regular<br />Case
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e0dbd5]">
                                  {[
                                    { size: 'Single', duvet: '140×200', fitted: '90×190×40', oxford: '50×75', regular: '50×75' },
                                    { size: 'Double', duvet: '200×200', fitted: '135×190×40', oxford: '50×75', regular: '50×75' },
                                    { size: 'King', duvet: '225×220', fitted: '150×200×40', oxford: '50×75', regular: '50×75' },
                                  ].map((row) => (
                                    <tr key={row.size} className="hover:bg-[#faf8f6] transition-colors group">
                                      <td className="border border-[#e0dbd5] px-4 py-6 text-[12px] font-medium text-gray-900 text-left">{row.size}</td>
                                      <td className="border border-[#e0dbd5] px-4 py-6 text-[12px] text-gray-600">{row.duvet}</td>
                                      <td className="border border-[#e0dbd5] px-4 py-6 text-[12px] text-gray-600">{row.fitted}</td>
                                      <td className="border border-[#e0dbd5] px-4 py-6 text-[12px] text-gray-600">{row.oxford}</td>
                                      <td className="border border-[#e0dbd5] px-4 py-6 text-[12px] text-gray-600">{row.regular}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <p className="text-[11px] text-gray-400 leading-relaxed">
                              All measurements are approximate. Oxford pillowcase border (+5cm) not included in total dimensions.
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="size-tab-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                          >
                            <div className="space-y-2">
                              <h3 className="font-serif text-2xl text-gray-900 leading-snug">
                                A fitted sheet that stays put — even on deeper mattresses.
                              </h3>
                            </div>

                            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                              <p>
                                A bed should look finished, not fussy. REMsleep is made for real life: sleep, slow mornings, and the occasional full-day reset.
                              </p>
                              <p>
                                Our fitted sheet is designed to keep the bed looking made — with less shifting, less bunching, and no corner slip.
                              </p>
                            </div>

                            <div className="space-y-3 pt-2 border-t border-[#e0dbd5]">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">How sizing works</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                Choose the size that matches your mattress. The cut is shaped to sit neatly, with corners designed to stay anchored.
                              </p>
                            </div>

                            <div className="space-y-3 border-t border-[#e0dbd5]">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">
                                Deep-mattress elastic <span className="text-gray-400 font-normal normal-case tracking-normal">(the part you feel, quietly)</span>
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                Our fitted sheet uses elastic designed for deeper mattresses, so it tucks in cleanly and stays there. Expect sharper corners, a smoother surface, and less re-tucking.
                              </p>
                            </div>

                            <div className="space-y-4 border-t border-[#e0dbd5]">
                              <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-900 pt-4">Why You'll Love It</h4>
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

      {/* Write Review Drawer */}
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