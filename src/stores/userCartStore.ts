import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, storefrontApiRequest, normalizeShopifyCheckoutUrl } from '@/lib/shopify';
import { useCustomerStore } from '@/stores/customerStore';

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface UserCartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  setCartOpen: (open: boolean) => void;
}

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity checkoutUrl }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set('channel', 'online_store');
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(
  userErrors: Array<{ field: string[] | null; message: string }>
): boolean {
  return userErrors.some(
    (e) =>
      e.message.toLowerCase().includes('cart not found') ||
      e.message.toLowerCase().includes('does not exist')
  );
}

function isInvalidCartIdError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('Variable $id of type ID! was provided invalid value');
}

async function createShopifyCart(
  item: CartItem
): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });

  if (data?.data?.cartCreate?.userErrors?.length > 0) {
    console.error('Cart creation failed:', data.data.cartCreate.userErrors);
    return null;
  }

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

async function addLineToShopifyCart(
  cartId: string,
  item: CartItem
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error('Add line failed:', userErrors);
    return { success: false };
  }

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find(
    (l: { node: { id: string; merchandise: { id: string } } }) =>
      l.node.merchandise.id === item.variantId
  );
  return { success: true, lineId: newLine?.node?.id };
}

async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error('Update line failed:', userErrors);
    return { success: false };
  }
  return { success: true };
}

async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) {
    console.error('Remove line failed:', userErrors);
    return { success: false };
  }
  return { success: true };
}

// Create a factory function to create user-specific cart stores
const createUserCartStore = (userId: string) => {
  return create<UserCartStore>()(
    persist(
      (set, get) => ({
        items: [],
        cartId: null,
        checkoutUrl: null,
        isLoading: false,
        isSyncing: false,
        isCartOpen: false,

        addItem: async (item) => {
          const { items, cartId, clearCart } = get();
          const existingItem = items.find((i) => i.variantId === item.variantId);

          console.log(`[Cart-${userId}] Adding item:`, item);

          // Check if this is a mock product
          const isMockProduct = item.variantId.match(/^gid:\/\/shopify\/ProductVariant\/\d+-/);

          if (isMockProduct) {
            console.log(`[Cart-${userId}] Mock product detected - using local-only cart mode`);
            if (existingItem) {
              const newQuantity = existingItem.quantity + item.quantity;
              set({
                items: items.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i
                ),
                isCartOpen: true,
              });
            } else {
              set({
                items: [...items, { ...item, lineId: null }],
                cartId: 'local-mock-cart',
                checkoutUrl: null,
                isCartOpen: true,
              });
            }
            return;
          }

          // Real Shopify products
          set({ isLoading: true });
          try {
            if (!cartId) {
              const result = await createShopifyCart({ ...item, lineId: null });
              if (result) {
                set({
                  cartId: result.cartId,
                  checkoutUrl: result.checkoutUrl,
                  items: [{ ...item, lineId: result.lineId }],
                  isCartOpen: true,
                });
              }
            } else if (existingItem) {
              const newQuantity = existingItem.quantity + item.quantity;
              if (!existingItem.lineId) return;
              const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
              if (result.success) {
                const currentItems = get().items;
                set({
                  items: currentItems.map((i) =>
                    i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i
                  ),
                  isCartOpen: true,
                });
              } else if (result.cartNotFound) {
                clearCart();
              }
            } else {
              const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
              if (result.success) {
                const currentItems = get().items;
                set({
                  items: [...currentItems, { ...item, lineId: result.lineId ?? null }],
                  isCartOpen: true,
                });
              } else if (result.cartNotFound) {
                clearCart();
              }
            }
          } catch (error) {
            console.error('Failed to add item:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        updateQuantity: async (variantId, quantity) => {
          if (quantity <= 0) {
            await get().removeItem(variantId);
            return;
          }

          const { items, cartId, clearCart } = get();
          const item = items.find((i) => i.variantId === variantId);
          if (!item) return;

          const isMockProduct = cartId === 'local-mock-cart' || variantId.match(/^gid:\/\/shopify\/ProductVariant\/\d+-/);

          if (isMockProduct) {
            set({
              items: items.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i
              ),
            });
            return;
          }

          if (!item.lineId || !cartId) return;

          set({ isLoading: true });
          try {
            const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
            if (result.success) {
              const currentItems = get().items;
              set({
                items: currentItems.map((i) =>
                  i.variantId === variantId ? { ...i, quantity } : i
                ),
              });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } catch (error) {
            console.error('Failed to update quantity:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        removeItem: async (variantId) => {
          const { items, cartId, clearCart } = get();
          const item = items.find((i) => i.variantId === variantId);
          if (!item) return;

          const isMockProduct = cartId === 'local-mock-cart' || variantId.match(/^gid:\/\/shopify\/ProductVariant\/\d+-/);

          if (isMockProduct) {
            const newItems = items.filter((i) => i.variantId !== variantId);
            if (newItems.length === 0) {
              clearCart();
            } else {
              set({ items: newItems });
            }
            return;
          }

          if (!item.lineId || !cartId) return;

          set({ isLoading: true });
          try {
            const result = await removeLineFromShopifyCart(cartId, item.lineId);
            if (result.success) {
              const currentItems = get().items;
              const newItems = currentItems.filter((i) => i.variantId !== variantId);
              newItems.length === 0 ? clearCart() : set({ items: newItems });
            } else if (result.cartNotFound) {
              clearCart();
            }
          } catch (error) {
            console.error('Failed to remove item:', error);
          } finally {
            set({ isLoading: false });
          }
        },

        clearCart: () => set({ items: [], cartId: null, checkoutUrl: null, isCartOpen: false }),
        getCheckoutUrl: () => get().checkoutUrl,
        setCartOpen: (open: boolean) => set({ isCartOpen: open }),

        syncCart: async () => {
          const { cartId, isSyncing, clearCart, checkoutUrl } = get();
          if (!cartId || isSyncing || cartId === 'local-mock-cart') return;

          if (!cartId.startsWith('gid://shopify/Cart/')) {
            clearCart();
            return;
          }

          set({ isSyncing: true });
          try {
            const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
            if (!data) return;

            const cart = data?.data?.cart;
            if (!cart || cart.totalQuantity === 0) {
              clearCart();
              return;
            }

            if (cart.checkoutUrl) {
              const formattedCheckoutUrl = formatCheckoutUrl(cart.checkoutUrl);
              if (formattedCheckoutUrl !== checkoutUrl) {
                set({ checkoutUrl: formattedCheckoutUrl });
              }
            }
          } catch (error) {
            if (isInvalidCartIdError(error)) {
              clearCart();
              return;
            }
            console.error('Failed to sync cart with Shopify:', error);
          } finally {
            set({ isSyncing: false });
          }
        },
      }),
      {
        name: `shopify-cart-${userId}`,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          items: state.items,
          cartId: state.cartId,
          checkoutUrl: state.checkoutUrl,
        }),
      }
    )
  );
};

// Store instances for different users
const cartStores = new Map<string, ReturnType<typeof createUserCartStore>>();

// Hook to get the current user's cart store
export const useUserCart = () => {
  const { profile, isLoggedIn } = useCustomerStore();
  const userId = profile?.id || 'guest';

  // Get or create store for this user
  let cartStore = cartStores.get(userId);
  if (!cartStore) {
    cartStore = createUserCartStore(userId);
    cartStores.set(userId, cartStore);
  }

  return cartStore();
};

// Clear all cart stores (useful for testing or cleanup)
export const clearAllCartStores = () => {
  cartStores.clear();
};
