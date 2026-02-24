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
                    // Winter Cloud variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-winter-cloud',
                            title: 'Double / Winter Cloud',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Winter Cloud' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-winter-cloud',
                            title: 'King / Winter Cloud',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Winter Cloud' }],
                        },
                    },
                    // Desert Whisperer variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-desert-whisperer',
                            title: 'Double / Desert Whisperer',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Desert Whisperer' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-desert-whisperer',
                            title: 'King / Desert Whisperer',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Desert Whisperer' }],
                        },
                    },
                    // Buttermilk variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-buttermilk',
                            title: 'Double / Buttermilk',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Buttermilk' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-buttermilk',
                            title: 'King / Buttermilk',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Buttermilk' }],
                        },
                    },
                    // Clay variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-clay',
                            title: 'Double / Clay',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Clay' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-clay',
                            title: 'King / Clay',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Clay' }],
                        },
                    },
                    // Clay Blush variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-clay-blush',
                            title: 'Double / Clay Blush',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Clay Blush' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-clay-blush',
                            title: 'King / Clay Blush',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Clay Blush' }],
                        },
                    },
                    // Pebble Haze variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-pebble-haze',
                            title: 'Double / Pebble Haze',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Pebble Haze' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-pebble-haze',
                            title: 'King / Pebble Haze',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Pebble Haze' }],
                        },
                    },
                    // Desert Sand variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-desert-sand',
                            title: 'Double / Desert Sand',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Desert Sand' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-desert-sand',
                            title: 'King / Desert Sand',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Desert Sand' }],
                        },
                    },
                    // Cinnamon Bark variants
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-double-cinnamon-bark',
                            title: 'Double / Cinnamon Bark',
                            price: { amount: '180.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'Double' }, { name: 'Color', value: 'Cinnamon Bark' }],
                        },
                    },
                    {
                        node: {
                            id: 'gid://shopify/ProductVariant/1-king-cinnamon-bark',
                            title: 'King / Cinnamon Bark',
                            price: { amount: '210.00', currencyCode: 'GBP' },
                            availableForSale: true,
                            selectedOptions: [{ name: 'Size', value: 'King' }, { name: 'Color', value: 'Cinnamon Bark' }],
                        },
                    },
                ],
            },
            options: [
                { name: 'Size', values: ['Double', 'King'] },
                { name: 'Color', values: ['Winter Cloud', 'Desert Whisperer', 'Buttermilk', 'Clay', 'Clay Blush', 'Pebble Haze', 'Desert Sand', 'Cinnamon Bark'] }
            ],
            description: 'A bright, clean white with a hotel-fresh finish. In sateen it looks luminous (never flat) and makes every room feel lighter.'
        },
    },
];
