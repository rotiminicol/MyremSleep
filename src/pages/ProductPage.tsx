import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storefrontApiRequest, ShopifyProduct } from '@/lib/shopify';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { useCartStore } from '@/stores/cartStore';
import { Loader2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProduct['node']['variants']['edges'][0]['node'] | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);

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
      <StoreNavbar />

      <main className="max-w-[1400px] mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/store"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to store
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-[#e8e3dc] overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-[#e8e3dc] overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex
                        ? 'border-gray-800'
                        : 'border-transparent hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img.node.url}
                      alt={img.node.altText || `${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-medium text-gray-900 mb-4">
                {product.title}
              </h1>
              <p className="text-xl text-gray-800">
                {selectedVariant?.price.currencyCode}{' '}
                {parseFloat(selectedVariant?.price.amount || '0').toFixed(2)}
              </p>
            </div>

            {/* Options */}
            {product.options.map((option) => (
              <div key={option.name}>
                <h3 className="text-sm font-medium text-gray-800 mb-3 tracking-wide">
                  {option.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleOptionChange(option.name, value)}
                      className={`px-4 py-2 text-sm border transition-colors ${
                        selectedOptions[option.name] === value
                          ? 'border-gray-800 bg-gray-900 text-white'
                          : 'border-gray-300 text-gray-800 hover:border-gray-500'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-3 tracking-wide">
                Quantity
              </h3>
              <div className="inline-flex items-center border border-gray-300">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale || isCartLoading}
              className="w-full bg-gray-900 text-white py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCartLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : !selectedVariant?.availableForSale ? (
                'Out of Stock'
              ) : (
                'Add to Cart'
              )}
            </button>

            {/* Description */}
            {product.description && (
              <div className="pt-8 border-t border-[#e0dbd5]">
                <h3 className="text-sm font-medium text-gray-800 mb-4 tracking-wide">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
