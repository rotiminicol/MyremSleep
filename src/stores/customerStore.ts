import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import { clearAllCartStores } from '@/stores/userCartStore';

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  created_at: string;
  updated_at: string;
}

interface CustomerStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  signup: (input: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<boolean>;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (input: { firstName?: string; lastName?: string; phone?: string }) => Promise<boolean>;
  updateAddress: (input: { address_line1?: string; address_line2?: string; city?: string; province?: string; zip?: string; country?: string }) => Promise<boolean>;
  clearError: () => void;
  isLoggedIn: () => boolean;
  initialize: () => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (data) set({ profile: data as UserProfile });
        } else {
          set({ profile: null });
        }
      },

      signup: async (input) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email: input.email,
            password: input.password,
            options: {
              data: {
                first_name: input.firstName,
                last_name: input.lastName,
                phone: input.phone || '',
              },
            },
          });

          if (error) {
            set({ error: error.message, isLoading: false });
            return false;
          }

          if (data.user) {
            // Wait a moment for the trigger to create the profile
            await new Promise(r => setTimeout(r, 500));
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            set({ profile: profile as UserProfile, isLoading: false });
          }
          return true;
        } catch (err) {
          set({ error: 'Something went wrong. Please try again.', isLoading: false });
          return false;
        }
      },

      login: async (email, password, rememberMe = false) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ 
            email, 
            password,
            options: {
              // Set session to persist if remember me is checked
              // By default, Supabase sessions persist, but we can be explicit
            }
          });

          if (error) {
            set({ error: error.message, isLoading: false });
            return false;
          }

          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
            set({ profile: profile as UserProfile, isLoading: false });
          }
          return true;
        } catch (err) {
          set({ error: 'Something went wrong. Please try again.', isLoading: false });
          return false;
        }
      },

      logout: async () => {
        const { profile } = get();
        
        // Clear user-specific cart storage before logout
        if (profile?.id) {
          localStorage.removeItem(`shopify-cart-${profile.id}`);
        }
        
        // Clear guest cart as well
        localStorage.removeItem('shopify-cart-guest');
        
        // Clear all cart store instances
        clearAllCartStores();
        
        await supabase.auth.signOut();
        set({ profile: null, error: null });
      },

      refreshProfile: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          set({ profile: null });
          return;
        }
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) set({ profile: data as UserProfile });
        else set({ profile: null });
      },

      updateProfile: async (input) => {
        const { profile } = get();
        if (!profile) return false;

        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              first_name: input.firstName ?? profile.first_name,
              last_name: input.lastName ?? profile.last_name,
              phone: input.phone ?? profile.phone,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

          if (error) {
            set({ error: error.message, isLoading: false });
            return false;
          }

          await get().refreshProfile();
          set({ isLoading: false });
          return true;
        } catch {
          set({ error: 'Failed to update profile.', isLoading: false });
          return false;
        }
      },

      updateAddress: async (input) => {
        const { profile } = get();
        if (!profile) return false;

        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('profiles')
            .update({
              ...input,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id);

          if (error) {
            set({ error: error.message, isLoading: false });
            return false;
          }

          await get().refreshProfile();
          set({ isLoading: false });
          return true;
        } catch {
          set({ error: 'Failed to update address.', isLoading: false });
          return false;
        }
      },

      clearError: () => set({ error: null }),

      isLoggedIn: () => {
        return !!get().profile;
      },
    }),
    {
      name: 'remsleep-customer',
      partialize: (state) => ({
        profile: state.profile,
      }),
    }
  )
);
