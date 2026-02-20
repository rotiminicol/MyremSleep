import { ShopifyProduct } from './shopify';

export const MOCK_PRODUCTS: ShopifyProduct[] = [
    {
        node: {
            id: 'gid://shopify/Product/1',
            title: 'Midnight Silk Pillowcase',
            handle: 'midnight-silk-pillowcase',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '45.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/midnight-silk.png',
                            altText: 'Midnight Silk Pillowcase',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-white',
                            title: 'Double / White',
                            price: {
                                amount: '45.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [
                                { name: 'Size', value: 'Double' },
                                { name: 'Color', value: 'White' }
                            ],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-navy',
                            title: 'Double / Navy',
                            price: {
                                amount: '45.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [
                                { name: 'Size', value: 'Double' },
                                { name: 'Color', value: 'Winter Cloud' }
                            ],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-desert',
                            title: 'Double / Desert Whisperer',
                            price: {
                                amount: '45.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [
                                { name: 'Size', value: 'Double' },
                                { name: 'Color', value: 'Desert Whisperer' }
                            ],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-buttermilk',
                            title: 'King / Buttermilk',
                            price: {
                                amount: '55.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [
                                { name: 'Size', value: 'King' },
                                { name: 'Color', value: 'Buttermilk' }
                            ],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Winter Cloud', 'Desert Whisperer', 'Buttermilk', 'Clay', 'Clay Blush', 'Pebble Haze', 'Desert Sand', 'Cinnamon Bark'] }
            ],
            description: ''
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/2',
            title: 'Linen Duvet Set - Grounding Clay',
            description: 'Woven from premium European flax, our linen duvet set offers breathability and a grounding aesthetic. Pre-washed for incredible softness.',
            handle: 'linen-duvet-set-clay',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '120.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/linen-duvet-clay.png',
                            altText: 'Linen Duvet Set - Grounding Clay',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/2-double',
                            title: 'Double',
                            price: {
                                amount: '120.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/2-king',
                            title: 'King',
                            price: {
                                amount: '140.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }],
                        },
                    },
                ],
            },
            options: [{ name: 'Size', values: ['Double', 'King'] }],
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/3',
            title: 'Bamboo Sheet Set - Pebble Grey',
            description: 'Silky-smooth and naturally cooling. Our bamboo sheets are sustainably sourced and designed for those who value both comfort and the planet.',
            handle: 'bamboo-sheet-set-grey',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '85.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/bamboo-sheets-grey.png',
                            altText: 'Bamboo Sheet Set - Pebble Grey',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/3-double',
                            title: 'Double',
                            price: {
                                amount: '85.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/3-king',
                            title: 'King',
                            price: {
                                amount: '105.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }],
                        },
                    },
                ],
            },
            options: [{ name: 'Size', values: ['Double', 'King'] }],
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/4',
            title: 'Weighted Sleep Mask - Deep Indigo',
            description: 'Gently applying pressure to key points around the eyes to promote deep relaxation. Made with premium velvet and micro-glass beads.',
            handle: 'weighted-sleep-mask-indigo',
            productType: 'Accessories',
            priceRange: {
                minVariantPrice: {
                    amount: '35.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/sleep-mask-indigo.png',
                            altText: 'Weighted Sleep Mask - Deep Indigo',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/4',
                            title: 'Default',
                            price: {
                                amount: '35.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Title', value: 'Default' }],
                        },
                    },
                ],
            },
            options: [{ name: 'Title', values: ['Default'] }],
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/5',
            title: 'Cotton Quilt - Sandstone',
            description: 'A versatile layer for all seasons. Our sandstone cotton quilt features intricate stitching and a warm, grounding tone.',
            handle: 'cotton-quilt-sandstone',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '150.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/cotton-quilt-sandstone.png',
                            altText: 'Cotton Quilt - Sandstone',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/5-double',
                            title: 'Double',
                            price: {
                                amount: '150.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/5-king',
                            title: 'King',
                            price: {
                                amount: '180.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }],
                        },
                    },
                ],
            },
            options: [{ name: 'Size', values: ['Double', 'King'] }],
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/6',
            title: 'Lavender Scented Eye Pillow',
            description: 'The final touch to your wind-down ritual. Filled with dried organic lavender and flaxseeds for a calming, weighted sensation.',
            handle: 'lavender-eye-pillow',
            productType: 'Accessories',
            priceRange: {
                minVariantPrice: {
                    amount: '25.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/lavender-eye-pillow.png',
                            altText: 'Lavender Scented Eye Pillow',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/6',
                            title: 'Default',
                            price: {
                                amount: '25.00',
                                currencyCode: 'GBP',
                            },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Title', value: 'Default' }],
                        },
                    },
                ],
            },
            options: [{ name: 'Title', values: ['Default'] }],
        },
    },
];
