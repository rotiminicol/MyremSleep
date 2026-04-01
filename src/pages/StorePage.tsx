import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreHero } from '@/components/store/StoreHero';
import { ProductGrid } from '@/components/store/ProductGrid';
import { StoreFooter } from '@/components/store/StoreFooter';
import { StoreBelief } from '@/components/store/StoreBelief';
import { StoreCraft } from '@/components/store/StoreCraft';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#F2EDE8]">
      <StoreNavbar />
      <StoreHero />
      <StoreBelief />
      <ProductGrid />
      <StoreCraft />
      <StoreFooter />
    </div>
  );
}
