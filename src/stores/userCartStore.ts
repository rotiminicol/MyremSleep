import { create } from 'zustand';
import { ShopifyProduct, storefrontApiRequest, normalizeShopifyCheckoutUrl } from '@/lib/shopify';
import { useCustomerStore } from '@/stores/customerStore';
import { supabase } from '@/integrations/supabase/client';

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
  loadFromDb: () => Promise<void>;
}

// ── Shopify GraphQL ──────────────────────────────────────────────

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
  return normalizeShopifyCheckoutUrl(checkoutUrl);
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
  cartId: string, item: CartItem
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId, lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });
  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) { console.error('Add line failed:', userErrors); return { success: false }; }
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const newLine = lines.find(
    (l: { node: { id: string; merchandise: { id: string } } }) => l.node.merchandise.id === item.variantId
  );
  return { success: true, lineId: newLine?.node?.id };
}

async function updateShopifyCartLine(
  cartId: string, lineId: string, quantity: number
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, { cartId, lines: [{ id: lineId, quantity }] });
  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) { console.error('Update line failed:', userErrors); return { success: false }; }
  return { success: true };
}

async function removeLineFromShopifyCart(
  cartId: string, lineId: string
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, { cartId, lineIds: [lineId] });
  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) { console.error('Remove line failed:', userErrors); return { success: false }; }
  return { success: true };
}

// ── Database persistence helpers ─────────────────────────────────

async function saveCartToDb(userId: string, state: { items: CartItem[]; cartId: string | null; checkoutUrl: string | null }) {
  if (userId === 'guest') return;
  try {
    await supabase.from('user_carts').upsert({
      user_id: userId,
      items: JSON.parse(JSON.stringify(state.items)), // ensure plain JSON
      cart_id: state.cartId,
      checkout_url: state.checkoutUrl,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (e) {
    console.error('[Cart] Failed to save to DB:', e);
  }
}

async function loadCartFromDb(userId: string): Promise<{ items: CartItem[]; cartId: string | null; checkoutUrl: string | null } | null> {
  if (userId === 'guest') return null;
  try {
    const { data, error } = await supabase
      .from('user_carts')
      .select('items, cart_id, checkout_url')
      .eq('user_id', userId)
      .single();
    if (error || !data) return null;
    return {
      items: (data.items as unknown as CartItem[]) || [],
      cartId: data.cart_id,
      checkoutUrl: data.checkout_url ? formatCheckoutUrl(data.checkout_url) : null,
    };
  } catch {
    return null;
  }
}

async function deleteCartFromDb(userId: string) {
  if (userId === 'guest') return;
  try {
    await supabase.from('user_carts').delete().eq('user_id', userId);
  } catch (e) {
    console.error('[Cart] Failed to delete from DB:', e);
  }
}

// ── Store factory ────────────────────────────────────────────────

const createUserCartStore = (userId: string) => {
  return create<UserCartStore>()(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      isCartOpen: false,

      loadFromDb: async () => {
        const dbCart = await loadCartFromDb(userId);
        if (dbCart) {
          set({ items: dbCart.items, cartId: dbCart.cartId, checkoutUrl: dbCart.checkoutUrl });
        }
      },

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        const isMockProduct = item.variantId.match(/^gid:\/\/shopify\/ProductVariant\/\d+-/);
        if (isMockProduct) {
          if (existingItem) {
            const newItems = items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i
            );
            set({ items: newItems, isCartOpen: true });
          } else {
            const newItems = [...items, { ...item, lineId: null }];
            set({ items: newItems, cartId: 'local-mock-cart', checkoutUrl: null, isCartOpen: true });
          }
          saveCartToDb(userId, get());
          return;
        }

        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              set({ cartId: result.cartId, checkoutUrl: result.checkoutUrl, items: [{ ...item, lineId: result.lineId }], isCartOpen: true });
            }
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) return;
            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              set({ items: get().items.map((i) => i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i), isCartOpen: true });
            } else if (result.cartNotFound) { clearCart(); }
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              set({ items: [...get().items, { ...item, lineId: result.lineId ?? null }], isCartOpen: true });
            } else if (result.cartNotFound) { clearCart(); }
          }
          saveCartToDb(userId, get());
        } catch (error) {
          console.error('Failed to add item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) { await get().removeItem(variantId); return; }
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item) return;

        const isMockProduct = cartId === 'local-mock-cart' || variantId.match(/^gid:\/\/shopify\/ProductVariant\/\d+-/);
        if (isMockProduct) {
          set({ items: items.map((i) => i.variantId === variantId ? { ...i, quantity } : i) });
          saveCartToDb(userId, get());
          return;
        }

        if (!item.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            set({ items: get().items.map((i) => i.variantId === variantId ? { ...i, quantity } : i) });
          } else if (result.cartNotFound) { clearCart(); }
          saveCartToDb(userId, get());
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
          newItems.length === 0 ? clearCart() : set({ items: newItems });
          saveCartToDb(userId, get());
          return;
        }

        if (!item.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const newItems = get().items.filter((i) => i.variantId !== variantId);
            newItems.length === 0 ? clearCart() : set({ items: newItems });
          } else if (result.cartNotFound) { clearCart(); }
          saveCartToDb(userId, get());
        } catch (error) {
          console.error('Failed to remove item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null, isCartOpen: false });
        deleteCartFromDb(userId);
      },

      getCheckoutUrl: () => {
        const current = get().checkoutUrl;
        return current ? formatCheckoutUrl(current) : null;
      },

      setCartOpen: (open: boolean) => set({ isCartOpen: open }),

      syncCart: async () => {
        const { cartId, isSyncing, clearCart, checkoutUrl } = get();
        if (!cartId || isSyncing || cartId === 'local-mock-cart') return;
        if (!cartId.startsWith('gid://shopify/Cart/')) { clearCart(); return; }

        set({ isSyncing: true });
        try {
          const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
          if (!data) return;
          const cart = data?.data?.cart;
          if (!cart || cart.totalQuantity === 0) { clearCart(); return; }
          if (cart.checkoutUrl) {
            const formattedCheckoutUrl = formatCheckoutUrl(cart.checkoutUrl);
            if (formattedCheckoutUrl !== checkoutUrl) {
              set({ checkoutUrl: formattedCheckoutUrl });
              saveCartToDb(userId, get());
            }
          }
        } catch (error) {
          if (isInvalidCartIdError(error)) { clearCart(); return; }
          console.error('Failed to sync cart with Shopify:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    })
  );
};

// ── Store instances ──────────────────────────────────────────────

const cartStores = new Map<string, ReturnType<typeof createUserCartStore>>();

// Track whether we've already merged guest cart for a given user
const mergedUsers = new Set<string>();

export const useUserCart = () => {
  const { profile } = useCustomerStore();
  const userId = profile?.id || 'guest';

  let cartStore = cartStores.get(userId);
  if (!cartStore) {
    cartStore = createUserCartStore(userId);
    cartStores.set(userId, cartStore);

    if (userId !== 'guest') {
      // Load user cart from DB, then merge any guest items
      const store = cartStore;
      store.getState().loadFromDb().then(async () => {
        if (mergedUsers.has(userId)) return;
        mergedUsers.add(userId);

        const guestStore = cartStores.get('guest');
        if (!guestStore) return;
        const guestItems = guestStore.getState().items;
        if (guestItems.length === 0) return;

        // Add each guest item into the user's cart
        for (const item of guestItems) {
          const { lineId, ...rest } = item;
          await store.getState().addItem(rest);
        }
        // Clear guest cart after merge
        guestStore.getState().clearCart();
      });
    }
  }

  return cartStore();
};

export const clearAllCartStores = () => {
  cartStores.clear();
  mergedUsers.clear();
};
