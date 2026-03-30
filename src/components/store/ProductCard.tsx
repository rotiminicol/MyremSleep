import { Link } from 'react-router-dom';
import { ShopifyProduct } from '@/lib/shopify';
import { COLOR_HEX, extractColorFromTitle } from '@/lib/product-colors';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
    product: ShopifyProduct;
    index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
    // Set Winter Cloud as default color, or find the first available color option
    const getDefaultColor = () => {
        const colorOption = product.node.options.find(option => 
            option.name.toLowerCase().includes('color') || option.name.toLowerCase().includes('colour')
        );
        
        if (colorOption && colorOption.values.includes('Winter Cloud')) {
            return 'Winter Cloud';
        }
        
        // Fallback to first variant's color or first available color
        const firstVariantColor = product.node.variants.edges[0]?.node.selectedOptions.find(opt => 
            opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
        )?.value;
        
        return firstVariantColor || (colorOption?.values[0]) || 'Default';
    };
    
    const [activeColor, setActiveColor] = useState(getDefaultColor());

    const image = product.node.images.edges[0]?.node;
    const price = product.node.priceRange.minVariantPrice;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
        >
            <Link to={`/product/${product.node.handle}?color=${encodeURIComponent(activeColor)}`} className="block">
                <div className="relative aspect-[3/4] bg-[#EBE7E0] overflow-hidden md:rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-700">
                    <img
                        src={image?.url}
                        alt={image?.altText || product.node.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center pb-6">
                        <button className="bg-white text-gray-900 py-2.5 px-6 text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-black hover:text-white transition-colors w-full max-w-[200px]">
                            View Product
                        </button>
                    </div>
                </div>

                <div className="mt-4 space-y-1 text-center">
                    <h3 className="text-sm font-medium text-gray-900 font-serif tracking-wide">
                        {product.node.title}
                    </h3>
                    <p className="text-xs text-gray-500 tracking-wider">
                        {parseInt(price.amount).toLocaleString('en-GB', {
                            style: 'currency',
                            currency: price.currencyCode,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
}
