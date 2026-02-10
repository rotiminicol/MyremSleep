import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreHero } from '@/components/store/StoreHero';
import { StoreFeatures } from '@/components/store/StoreFeatures';
import { ProductGrid } from '@/components/store/ProductGrid';
import { StoreFooter } from '@/components/store/StoreFooter';
import { StoreOfferPopup } from '@/components/store/StoreOfferPopup';

export default function StorePage() {
  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      <StoreOfferPopup />
      <StoreNavbar />
      <StoreHero />
      <StoreFeatures />
      <ProductGrid />
      <StoreFooter />
    </div>
  );
}
