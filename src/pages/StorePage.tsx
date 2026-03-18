import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreHero } from '@/components/store/StoreHero';
import { ProductGrid } from '@/components/store/ProductGrid';
import { StoreFooter } from '@/components/store/StoreFooter';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#f2e9dc]">
      <StoreNavbar />
      <StoreHero />
      <ProductGrid />
      <StoreFooter />
    </div>
  );
}
