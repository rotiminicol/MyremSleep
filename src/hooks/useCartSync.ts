import { useEffect } from 'react';
import { useUserCart } from '@/stores/userCartStore';

export function useCartSync() {
  const { syncCart } = useUserCart();

  useEffect(() => {
    syncCart(); // Sync on initial page load

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncCart();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncCart]);
}
