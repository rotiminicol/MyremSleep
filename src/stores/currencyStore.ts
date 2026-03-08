import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

// Exchange rates (relative to GBP as base currency)
const EXCHANGE_RATES: Record<string, number> = {
  GBP: 1, USD: 1.27, EUR: 1.16, NGN: 1901.45, JPY: 189.23, CNY: 9.03,
  AUD: 1.93, CAD: 1.73, CHF: 1.11, INR: 105.89, BRL: 6.31, RUB: 115.43,
  KRW: 1698.76, MXN: 21.89, SGD: 1.71, HKD: 9.91, NOK: 13.45, NZD: 2.08,
  ZAR: 23.67, TRY: 38.92, SEK: 13.23, DKK: 8.53, PLN: 5.01, THB: 45.67,
  IDR: 19456.78, HUF: 445.32, CZK: 28.91, ILS: 4.63, CLP: 1205.67,
  PHP: 71.23, AED: 4.67, COP: 4832.12, SAR: 4.79, MYR: 5.98, RON: 5.89,
};

interface Currency {
  code: string;
  symbol: string;
  flag: string;
  name: string;
}

interface CurrencyStore {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  convertPrice: (priceInGBP: number) => number;
  formatPrice: (priceInGBP: number) => string;
  exchangeRates: Record<string, number>;
  loadFromProfile: () => Promise<void>;
}

const defaultCurrency: Currency = {
  code: 'GBP', symbol: '£',
  flag: 'https://flagcdn.com/w20/gb.png', name: 'British Pound'
};

// Known currency metadata for restoring from DB code
const CURRENCY_META: Record<string, Omit<Currency, 'code'>> = {
  GBP: { symbol: '£', flag: 'https://flagcdn.com/w20/gb.png', name: 'British Pound' },
  USD: { symbol: '$', flag: 'https://flagcdn.com/w20/us.png', name: 'US Dollar' },
  EUR: { symbol: '€', flag: 'https://flagcdn.com/w20/eu.png', name: 'Euro' },
  CAD: { symbol: 'CA$', flag: 'https://flagcdn.com/w20/ca.png', name: 'Canadian Dollar' },
  AUD: { symbol: 'A$', flag: 'https://flagcdn.com/w20/au.png', name: 'Australian Dollar' },
  NGN: { symbol: '₦', flag: 'https://flagcdn.com/w20/ng.png', name: 'Nigerian Naira' },
  JPY: { symbol: '¥', flag: 'https://flagcdn.com/w20/jp.png', name: 'Japanese Yen' },
  CNY: { symbol: '¥', flag: 'https://flagcdn.com/w20/cn.png', name: 'Chinese Yuan' },
  CHF: { symbol: 'CHF', flag: 'https://flagcdn.com/w20/ch.png', name: 'Swiss Franc' },
  INR: { symbol: '₹', flag: 'https://flagcdn.com/w20/in.png', name: 'Indian Rupee' },
  BRL: { symbol: 'R$', flag: 'https://flagcdn.com/w20/br.png', name: 'Brazilian Real' },
  KRW: { symbol: '₩', flag: 'https://flagcdn.com/w20/kr.png', name: 'South Korean Won' },
  MXN: { symbol: 'MX$', flag: 'https://flagcdn.com/w20/mx.png', name: 'Mexican Peso' },
  SGD: { symbol: 'S$', flag: 'https://flagcdn.com/w20/sg.png', name: 'Singapore Dollar' },
  HKD: { symbol: 'HK$', flag: 'https://flagcdn.com/w20/hk.png', name: 'Hong Kong Dollar' },
  NZD: { symbol: 'NZ$', flag: 'https://flagcdn.com/w20/nz.png', name: 'New Zealand Dollar' },
  ZAR: { symbol: 'R', flag: 'https://flagcdn.com/w20/za.png', name: 'South African Rand' },
  AED: { symbol: 'د.إ', flag: 'https://flagcdn.com/w20/ae.png', name: 'UAE Dirham' },
  SAR: { symbol: '﷼', flag: 'https://flagcdn.com/w20/sa.png', name: 'Saudi Riyal' },
};

async function saveCurrencyToProfile(code: string) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;
    await supabase.from('profiles').update({ preferred_currency: code }).eq('id', session.user.id);
  } catch (e) {
    console.error('[Currency] Failed to save preference:', e);
  }
}

export const useCurrencyStore = create<CurrencyStore>()(
  (set, get) => ({
    selectedCurrency: defaultCurrency,
    exchangeRates: EXCHANGE_RATES,

    setSelectedCurrency: (currency: Currency) => {
      set({ selectedCurrency: currency });
      saveCurrencyToProfile(currency.code);
    },

    loadFromProfile: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data } = await supabase
          .from('profiles')
          .select('preferred_currency')
          .eq('id', session.user.id)
          .single();
        if (data?.preferred_currency && data.preferred_currency !== get().selectedCurrency.code) {
          const code = data.preferred_currency as string;
          const meta = CURRENCY_META[code];
          if (meta) {
            set({ selectedCurrency: { code, ...meta } });
          }
        }
      } catch {
        // non-critical
      }
    },

    convertPrice: (priceInGBP: number): number => {
      const { selectedCurrency, exchangeRates } = get();
      const rate = exchangeRates[selectedCurrency.code] || 1;
      return priceInGBP * rate;
    },

    formatPrice: (priceInGBP: number): string => {
      const { selectedCurrency, convertPrice } = get();
      const convertedPrice = convertPrice(priceInGBP);
      switch (selectedCurrency.code) {
        case 'JPY': case 'KRW':
          return `${selectedCurrency.symbol}${convertedPrice.toFixed(0)}`;
        case 'IDR': case 'NGN':
          return `${selectedCurrency.symbol}${convertedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        default:
          return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
      }
    },
  })
);
