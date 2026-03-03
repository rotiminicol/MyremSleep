import { useCurrencyStore } from '@/stores/currencyStore';

// Hook for components to easily display converted prices
export function useCurrency() {
  const { selectedCurrency, convertPrice, formatPrice } = useCurrencyStore();
  
  return {
    selectedCurrency,
    convertPrice,
    formatPrice,
    // Helper function to format price from a string amount
    formatPriceFromString: (priceString: string) => {
      const price = parseFloat(priceString.replace(/[^\d.-]/g, ''));
      return formatPrice(price);
    },
    // Helper to convert and format price in one step
    displayPrice: (priceInGBP: number) => formatPrice(priceInGBP),
  };
}
