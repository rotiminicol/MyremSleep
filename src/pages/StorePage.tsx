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
      <div className="flex flex-col">
        <div className="order-2 md:order-1">
          <StoreFeatures />
        </div>
        <div className="order-1 md:order-2">
          <ProductGrid />
        </div>
      </div>
      <StoreFooter />
    </div>
  );
}
