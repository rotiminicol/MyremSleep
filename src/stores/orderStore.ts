import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderItem {
  productId: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  image?: string;
}

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  subtotal: number;
  shippingCost: number;
  tracking?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
}

interface OrderStore {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'date'>) => void;
  getOrderById: (id: string) => Order | undefined;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `REM-${new Date().getFullYear()}-${String(get().orders.length + 1).padStart(3, '0')}`,
          date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },

      clearOrders: () => {
        set({ orders: [] });
      },
    }),
    {
      name: 'order-storage',
    }
  )
);
