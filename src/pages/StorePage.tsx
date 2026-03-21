import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreHero } from '@/components/store/StoreHero';
import { ProductGrid } from '@/components/store/ProductGrid';
import { StoreFooter } from '@/components/store/StoreFooter';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#F2EDE8]">
      <StoreNavbar />
      <StoreHero />
      <ProductGrid />
      <StoreFooter />
    </div>
  );
}
