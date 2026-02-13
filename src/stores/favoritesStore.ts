import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShopifyProduct, MoneyV2 } from '@/lib/shopify';

export interface FavoriteItem {
    productId: string;
    product: ShopifyProduct;
    selectedVariant?: {
        id: string;
        title: string;
        price: MoneyV2;
        selectedOptions?: Array<{ name: string; value: string }>;
    };
    addedAt: number;
}

interface FavoritesStore {
    items: FavoriteItem[];
    isFavoritesOpen: boolean;
    addFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void;
    removeFavorite: (productId: string) => void;
    isFavorited: (productId: string) => boolean;
    setFavoritesOpen: (open: boolean) => void;
    clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            items: [],
            isFavoritesOpen: false,

            addFavorite: (item) => {
                const { items } = get();

                // Check if already favorited
                if (items.some((i) => i.productId === item.productId)) {
                    console.log('[Favorites] Product already favorited');
                    set({ isFavoritesOpen: true });
                    return;
                }

                console.log('[Favorites] Adding to favorites:', item);

                set({
                    items: [...items, { ...item, addedAt: Date.now() }],
                    isFavoritesOpen: true, // Auto-open drawer
                });
            },

            removeFavorite: (productId) => {
                const { items } = get();
                console.log('[Favorites] Removing from favorites:', productId);

                set({
                    items: items.filter((i) => i.productId !== productId),
                });
            },

            isFavorited: (productId) => {
                const { items } = get();
                return items.some((i) => i.productId === productId);
            },

            setFavoritesOpen: (open) => {
                set({ isFavoritesOpen: open });
            },

            clearFavorites: () => {
                set({ items: [] });
            },
        }),
        {
            name: 'favorites-storage',
            partialize: (state) => ({ items: state.items }), // Only persist items, not drawer state
        }
    )
);
