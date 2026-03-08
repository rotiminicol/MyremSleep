import { useEffect } from 'react';
import { useUserCart } from '@/stores/userCartStore';

export function useCartSync() {
  const syncCart = useUserCart().syncCart;

  useEffect(() => {
    syncCart();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncCart();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncCart]);
}
