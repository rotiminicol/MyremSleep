import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts, ShopifyProduct } from '@/lib/shopify';
import { MOCK_PRODUCTS } from '@/lib/mock-products';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

// Color hex mapping for search results
const COLOR_HEX: Record<string, string> = {
  'Winter Cloud': '#F5F5F7',
  'Desert Whisperer': '#E5DACE',
  'Buttermilk': '#FFF4D2',
  'Clay': '#D2C4B5',
  'Clay Blush': '#D9A891',
  'Clayblush Pink': '#D9A891',
  'Pebble Haze': '#A3A3A3',
  'Desert Sand': '#E2CA9D',
  'Cinnamon Bark': '#8B4513',
};

// Material and attribute keywords for search
const SEARCH_KEYWORDS = {
  materials: ['cotton', 'egyptian cotton', 'sateen', 'satin', 'silk', 'linen', 'bamboo'],
  colors: Object.keys(COLOR_HEX),
  productTypes: ['bedding', 'bundle', 'duvet', 'sheets', 'pillowcase', 'pillowcases'],
  attributes: ['thread count', '300', 'egyptian', 'soft', 'luxury', 'hotel', 'premium']
};

function extractColorFromTitle(title: string): string | null {
  const colorNames = Object.keys(COLOR_HEX);
  for (const color of colorNames) {
    if (title.toLowerCase().includes(color.toLowerCase())) return color;
  }
  return null;
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<ShopifyProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allProducts, setAllProducts] = useState<ShopifyProduct[]>([]);

  // Load products for search
  useEffect(() => {
    async function loadProducts() {
      try {
        console.log('Loading products from Shopify store...');
        const data = await fetchProducts(50);
        console.log('Shopify API response:', data);
        
        if (data && data.length > 0) {
          console.log(`Successfully loaded ${data.length} products from Shopify`);
          setAllProducts(data);
        } else {
          console.warn('No products returned from Shopify API');
          setAllProducts([]);
        }
      } catch (error) {
        console.error('Failed to load products from Shopify API:', error);
        setAllProducts([]);
      }
    }
    loadProducts();
  }, []);

  // Search functionality
  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const searchQuery = query.toLowerCase().trim();
    
    const filtered = allProducts.filter(product => {
      const title = product.node.title.toLowerCase();
      const description = product.node.description?.toLowerCase() || '';
      const productType = product.node.productType?.toLowerCase() || '';
      const handle = product.node.handle.toLowerCase();
      
      // Check color matches
      const colorName = extractColorFromTitle(product.node.title);
      const colorMatch = colorName && colorName.toLowerCase().includes(searchQuery);
      
      // Check material matches
      const materialMatch = SEARCH_KEYWORDS.materials.some(mat => 
        mat.includes(searchQuery) || searchQuery.includes(mat)
      ) && (title.includes(searchQuery) || description.includes(searchQuery));
      
      // Check general text matches
      const textMatch = title.includes(searchQuery) || 
                       description.includes(searchQuery) || 
                       productType.includes(searchQuery) || 
                       handle.includes(searchQuery);
      
      // Check variant options
      const variantMatch = product.node.variants.edges.some(variant => 
        variant.node.title.toLowerCase().includes(searchQuery) ||
        variant.node.selectedOptions.some(option => 
          option.value.toLowerCase().includes(searchQuery)
        )
      );
      
      return colorMatch || materialMatch || textMatch || variantMatch;
    });
    
    setSearchResults(filtered);
    setIsSearching(false);
  }, [query, allProducts]);

  const handlePopularSearchClick = (term: string) => {
    // Check if there are any results for this term
    const searchQuery = term.toLowerCase().trim();
    const filtered = allProducts.filter(product => {
      const title = product.node.title.toLowerCase();
      const description = product.node.description?.toLowerCase() || '';
      const productType = product.node.productType?.toLowerCase() || '';
      const handle = product.node.handle.toLowerCase();
      
      // Check color matches
      const colorName = extractColorFromTitle(product.node.title);
      const colorMatch = colorName && colorName.toLowerCase().includes(searchQuery);
      
      // Check material matches
      const materialMatch = SEARCH_KEYWORDS.materials.some(mat => 
        mat.includes(searchQuery) || searchQuery.includes(mat)
      ) && (title.includes(searchQuery) || description.includes(searchQuery));
      
      // Check general text matches
      const textMatch = title.includes(searchQuery) || 
                       description.includes(searchQuery) || 
                       productType.includes(searchQuery) || 
                       handle.includes(searchQuery);
      
      // Check variant options
      const variantMatch = product.node.variants.edges.some(variant => 
        variant.node.title.toLowerCase().includes(searchQuery) ||
        variant.node.selectedOptions.some(option => 
          option.value.toLowerCase().includes(searchQuery)
        )
      );
      
      return colorMatch || materialMatch || textMatch || variantMatch;
    });
    
    if (filtered.length > 0) {
      window.location.href = `/search?q=${encodeURIComponent(term)}`;
    }
    // If no results, do nothing - stay on current page
  };

  const popularSearches = [
    'Winter Cloud',
    'Desert Whisperer',
    'Buttermilk',
    'Clay Blush',
    'Pebble Haze'
  ];

  if (isSearching) {
    return (
      <div className="min-h-screen bg-[#f2e9dc]">
        <StoreNavbar />
        <div className="flex items-center justify-center py-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
        <StoreFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2e9dc]">
      <StoreNavbar />
      
      <main className="max-w-[1400px] mx-auto px-6 py-16">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            Search Results
          </h1>
          {query && (
            <p className="text-lg text-gray-600">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
            </p>
          )}
        </div>

        {/* Search Results */}
        {query && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {searchResults.map((product, index) => {
              const colorName = extractColorFromTitle(product.node.title);
              const colorHex = colorName ? COLOR_HEX[colorName] : null;
              const image = product.node.images.edges[0]?.node;
              
              return (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/product/${product.node.handle}`} className="group block">
                    <div className="relative aspect-[3/4] bg-[#EBE7E0] overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-700 mb-4">
                      {image && (
                        <img
                          src={image.url}
                          alt={image.altText || product.node.title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                      )}
                      {colorHex && (
                        <div className="absolute top-4 right-4">
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                            style={{ backgroundColor: colorHex }}
                            title={colorName}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 font-serif">
                        {product.node.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.node.productType} • {colorName || 'Various Colors'}
                      </p>
                      <p className="text-lg font-medium text-gray-900">
                        £{parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.node.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {query && searchResults.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-serif text-gray-900 mb-4">
                No products found
              </h2>
              <p className="text-gray-600 mb-8">
                We couldn't find any products matching "{query}". Try searching for different keywords or browse our popular searches below.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Try searching for:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularSearches.map((term) => (
                    <Link
                      key={term}
                      to={`/search?q=${encodeURIComponent(term)}`}
                      className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popular Searches (when no query) */}
        {!query && (
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-900 mb-8">Popular Searches</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  to={`/search?q=${encodeURIComponent(term)}`}
                  className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <h3 className="font-medium text-gray-900 mb-2">{term}</h3>
                  <p className="text-sm text-gray-500">Explore {term.toLowerCase()}</p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Colors</h3>
                <div className="space-y-3">
                  {Object.entries(COLOR_HEX).slice(0, 4).map(([color, hex]) => (
                    <Link
                      key={color}
                      to={`/search?q=${encodeURIComponent(color)}`}
                      className="flex items-center gap-3 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <div 
                        className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0" 
                        style={{ backgroundColor: hex }} 
                      />
                      {color}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Materials</h3>
                <div className="space-y-3">
                  {SEARCH_KEYWORDS.materials.slice(0, 4).map((material) => (
                    <Link
                      key={material}
                      to={`/search?q=${encodeURIComponent(material)}`}
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {material}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Products</h3>
                <div className="space-y-3">
                  {SEARCH_KEYWORDS.productTypes.slice(0, 4).map((type) => (
                    <Link
                      key={type}
                      to={`/search?q=${encodeURIComponent(type)}`}
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Attributes</h3>
                <div className="space-y-3">
                  {['300 Thread Count', 'Hotel Quality', 'OEKO-TEX', 'Egyptian Cotton'].map((attr) => (
                    <Link
                      key={attr}
                      to={`/search?q=${encodeURIComponent(attr)}`}
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {attr}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
