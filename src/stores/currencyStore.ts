import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Exchange rates (relative to GBP as base currency)
// These would typically come from an API, but for now we'll use static rates
const EXCHANGE_RATES: Record<string, number> = {
  GBP: 1, // Base currency
  USD: 1.27,
  EUR: 1.16,
  NGN: 1901.45,
  JPY: 189.23,
  CNY: 9.03,
  AUD: 1.93,
  CAD: 1.73,
  CHF: 1.11,
  INR: 105.89,
  BRL: 6.31,
  RUB: 115.43,
  KRW: 1698.76,
  MXN: 21.89,
  SGD: 1.71,
  HKD: 9.91,
  NOK: 13.45,
  NZD: 2.08,
  ZAR: 23.67,
  TRY: 38.92,
  SEK: 13.23,
  DKK: 8.53,
  PLN: 5.01,
  THB: 45.67,
  IDR: 19456.78,
  HUF: 445.32,
  CZK: 28.91,
  ILS: 4.63,
  CLP: 1205.67,
  PHP: 71.23,
  AED: 4.67,
  COP: 4832.12,
  SAR: 4.79,
  MYR: 5.98,
  RON: 5.89,
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
}

const defaultCurrency: Currency = {
  code: 'GBP',
  symbol: '£',
  flag: 'https://flagcdn.com/w20/gb.png',
  name: 'British Pound'
};

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      selectedCurrency: defaultCurrency,
      exchangeRates: EXCHANGE_RATES,

      setSelectedCurrency: (currency: Currency) => {
        set({ selectedCurrency: currency });
      },

      convertPrice: (priceInGBP: number): number => {
        const { selectedCurrency, exchangeRates } = get();
        const rate = exchangeRates[selectedCurrency.code] || 1;
        return priceInGBP * rate;
      },

      formatPrice: (priceInGBP: number): string => {
        const { selectedCurrency, convertPrice } = get();
        const convertedPrice = convertPrice(priceInGBP);
        
        // Format based on currency
        switch (selectedCurrency.code) {
          case 'JPY':
          case 'KRW':
            // No decimal places for these currencies
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(0)}`;
          case 'IDR':
            // No decimal places for Indonesian Rupiah
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
          case 'EUR':
          case 'GBP':
          case 'USD':
          case 'AUD':
          case 'CAD':
          case 'CHF':
          case 'NZD':
          case 'SGD':
          case 'HKD':
          case 'NOK':
          case 'SEK':
          case 'DKK':
          case 'PLN':
          case 'CZK':
          case 'HUF':
          case 'RON':
          case 'BRL':
          case 'RUB':
          case 'TRY':
          case 'THB':
          case 'MYR':
          case 'MXN':
          case 'CLP':
          case 'COP':
          case 'ZAR':
            // 2 decimal places
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
          case 'INR':
          case 'AED':
          case 'SAR':
            // 2 decimal places
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
          case 'CNY':
            // 2 decimal places
            return `¥${convertedPrice.toFixed(2)}`;
          case 'NGN':
            // 2 decimal places with comma separators
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
          case 'ILS':
            // 2 decimal places
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
          case 'PHP':
            // 2 decimal places
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
          default:
            return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
        }
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ selectedCurrency: state.selectedCurrency }),
    }
  )
);
