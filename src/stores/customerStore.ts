import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createCustomer,
  createAccessToken,
  deleteAccessToken,
  fetchCustomer,
  updateCustomer,
  type ShopifyCustomer,
} from '@/lib/shopify-customer';

interface CustomerStore {
  // State
  accessToken: string | null;
  expiresAt: string | null;
  customer: ShopifyCustomer | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  signup: (input: { email: string; password: string; firstName: string; lastName: string }) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
  updateProfile: (input: { firstName?: string; lastName?: string; phone?: string }) => Promise<boolean>;
  clearError: () => void;
  isLoggedIn: () => boolean;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,
      customer: null,
      isLoading: false,
      error: null,

      signup: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const result = await createCustomer(input);
          if (!result.success) {
            set({ error: result.error, isLoading: false });
            return false;
          }
          // Auto-login after signup
          const tokenResult = await createAccessToken(input.email, input.password);
          if ('error' in tokenResult) {
            // Account created but couldn't auto-login (might need email verification)
            set({ error: 'Account created! Please log in.', isLoading: false });
            return true;
          }
          const customer = await fetchCustomer(tokenResult.accessToken);
          set({
            accessToken: tokenResult.accessToken,
            expiresAt: tokenResult.expiresAt,
            customer,
            isLoading: false,
          });
          return true;
        } catch (err) {
          set({ error: 'Something went wrong. Please try again.', isLoading: false });
          return false;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const tokenResult = await createAccessToken(email, password);
          if ('error' in tokenResult) {
            set({ error: tokenResult.error, isLoading: false });
            return false;
          }
          const customer = await fetchCustomer(tokenResult.accessToken);
          set({
            accessToken: tokenResult.accessToken,
            expiresAt: tokenResult.expiresAt,
            customer,
            isLoading: false,
          });
          return true;
        } catch (err) {
          set({ error: 'Something went wrong. Please try again.', isLoading: false });
          return false;
        }
      },

      logout: async () => {
        const { accessToken } = get();
        if (accessToken) {
          try {
            await deleteAccessToken(accessToken);
          } catch {
            // Ignore errors during logout
          }
        }
        set({ accessToken: null, expiresAt: null, customer: null, error: null });
      },

      refreshCustomer: async () => {
        const { accessToken } = get();
        if (!accessToken) return;

        // Check if token is expired
        const { expiresAt } = get();
        if (expiresAt && new Date(expiresAt) < new Date()) {
          set({ accessToken: null, expiresAt: null, customer: null });
          return;
        }

        try {
          const customer = await fetchCustomer(accessToken);
          if (!customer) {
            // Token is invalid
            set({ accessToken: null, expiresAt: null, customer: null });
            return;
          }
          set({ customer });
        } catch {
          // Token might be expired
          set({ accessToken: null, expiresAt: null, customer: null });
        }
      },

      updateProfile: async (input) => {
        const { accessToken } = get();
        if (!accessToken) return false;

        set({ isLoading: true, error: null });
        try {
          const result = await updateCustomer(accessToken, input);
          if (!result.success) {
            set({ error: result.error, isLoading: false });
            return false;
          }
          // Refresh customer data
          const customer = await fetchCustomer(accessToken);
          set({ customer, isLoading: false });
          return true;
        } catch {
          set({ error: 'Failed to update profile.', isLoading: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      isLoggedIn: () => {
        const { accessToken, expiresAt } = get();
        if (!accessToken) return false;
        if (expiresAt && new Date(expiresAt) < new Date()) return false;
        return true;
      },
    }),
    {
      name: 'shopify-customer',
      partialize: (state) => ({
        accessToken: state.accessToken,
        expiresAt: state.expiresAt,
        customer: state.customer,
      }),
    }
  )
);
