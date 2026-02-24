import { ShopifyProduct } from './shopify';

export const MOCK_PRODUCTS: ShopifyProduct[] = [
    {
        node: {
            id: 'gid://shopify/Product/1',
            title: 'Winter Cloud',
            handle: 'winter-cloud',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/midnight-silk.png',
                            altText: 'Winter Cloud Sateen Bundle',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double',
                            title: 'Double',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Winter Cloud' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Winter Cloud' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Winter Cloud'] }
            ],
            description: 'A bright, clean white with a hotel-fresh finish. In sateen it looks luminous (never flat) and makes every room feel lighter.'
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/2',
            title: 'Buttermilk',
            handle: 'buttermilk',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/cotton-quilt-sandstone.png',
                            altText: 'Buttermilk Sateen Bundle',
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
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Buttermilk' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/2-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Buttermilk' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Buttermilk'] }
            ],
            description: 'A creamy off-white with a gentle warmth. Sateen makes it look rich and smooth—like classic white, upgraded.'
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/3',
            title: 'Desert Whisperer',
            handle: 'desert-whisperer',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/linen-duvet-clay.png',
                            altText: 'Desert Whisperer Sateen Bundle',
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
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Desert Whisperer' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/3-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Desert Whisperer' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Desert Whisperer'] }
            ],
            description: 'A blush-sand neutral that warms a room without stealing focus. Sateen adds a refined, clean sheen.'
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/4',
            title: 'Desert Sand',
            handle: 'desert-sand',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/midnight-silk.png',
                            altText: 'Desert Sand Sateen Bundle',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/4-double',
                            title: 'Double',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Desert Sand' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/4-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Desert Sand' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Desert Sand'] }
            ],
            description: 'A modern beige with balance and depth—made for layering. Always looks intentional, even on low-effort days.'
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/5',
            title: 'Clay Blush',
            handle: 'clay-blush',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/lavender-eye-pillow.png',
                            altText: 'Clay Blush Sateen Bundle',
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
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Clay Blush' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/5-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Clay Blush' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Clay Blush'] }
            ],
            description: 'A dusty rose-clay neutral—soft, earthy, quietly romantic. In sateen it reads smooth and elevated, not shiny.'
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/6',
            title: 'Pebble Haze',
            handle: 'pebble-haze',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/sleep-mask-indigo.png',
                            altText: 'Pebble Haze Sateen Bundle',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/6-double',
                            title: 'Double',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Pebble Haze' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/6-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Pebble Haze' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Pebble Haze'] }
            ],
            description: 'A mid-grey with an architectural feel. Sateen gives it depth and softness—minimal, but never cold.'
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/7',
            title: 'Cinnamon Bark',
            handle: 'cinnamon-bark',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/linen-duvet-clay.png',
                            altText: 'Cinnamon Bark Sateen Bundle',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/7-double',
                            title: 'Double',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Cinnamon Bark' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/7-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Cinnamon Bark' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Cinnamon Bark'] }
            ],
            description: 'A rich, earthy brown that makes the room feel intentional. Sateen adds a soft sheen and tailored drape.'
        },
    },
    {
        node: {
            id: 'gid://shopify/Product/8',
            title: 'Clay',
            handle: 'clay',
            productType: 'Bedding',
            priceRange: {
                minVariantPrice: {
                    amount: '180.00',
                    currencyCode: 'GBP',
                },
            },
            images: {
                edges: [
                    {
                        node: {
                            url: '/products/bamboo-sheets-grey.png',
                            altText: 'Clay Sateen Bundle',
                        },
                    },
                ],
            },
            variants: {
                edges: [
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/8-double',
                            title: 'Double',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Clay' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/8-king',
                            title: 'King',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Clay' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Clay'] }
            ],
            description: 'A pale clay with no pink in it—just a quiet warmth that feels natural and modern. It brightens the room without turning cold.'
        },
    },
];
