import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ShopifyProduct, MoneyV2 } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';

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
    syncFromDb: () => Promise<void>;
}

async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export const useFavoritesStore = create<FavoritesStore>()(
    persist(
        (set, get) => ({
            items: [],
            isFavoritesOpen: false,

            addFavorite: (item) => {
                const { items } = get();

                if (items.some((i) => i.productId === item.productId)) {
                    set({ isFavoritesOpen: true });
                    return;
                }

                const newItem = { ...item, addedAt: Date.now() };
                set({
                    items: [...items, newItem],
                    isFavoritesOpen: true,
                });

                // Persist to DB if logged in
                getSession().then(session => {
                    if (session?.user) {
                        supabase.from('user_favorites').insert({
                            user_id: session.user.id,
                            product_id: item.productId,
                            product_data: item.product as any,
                            variant_data: item.selectedVariant ? (item.selectedVariant as any) : null,
                        }).then(() => {});
                    }
                });
            },

            removeFavorite: (productId) => {
                const { items } = get();
                set({ items: items.filter((i) => i.productId !== productId) });

                // Remove from DB if logged in
                getSession().then(session => {
                    if (session?.user) {
                        supabase.from('user_favorites')
                            .delete()
                            .eq('user_id', session.user.id)
                            .eq('product_id', productId)
                            .then(() => {});
                    }
                });
            },

            isFavorited: (productId) => {
                return get().items.some((i) => i.productId === productId);
            },

            setFavoritesOpen: (open) => {
                set({ isFavoritesOpen: open });
            },

            clearFavorites: () => {
                set({ items: [] });
            },

            syncFromDb: async () => {
                const session = await getSession();
                if (!session?.user) return;

                const { data } = await supabase
                    .from('user_favorites')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: true });

                if (data && data.length > 0) {
                    const dbItems: FavoriteItem[] = data.map(row => ({
                        productId: row.product_id,
                        product: row.product_data as unknown as ShopifyProduct,
                        selectedVariant: row.variant_data as any,
                        addedAt: new Date(row.created_at).getTime(),
                    }));
                    set({ items: dbItems });
                }
            },
        }),
        {
            name: 'favorites-storage',
            partialize: (state) => ({ items: state.items }),
        }
    )
);
