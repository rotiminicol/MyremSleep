import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/TermsPage";
import FaqPage from "./pages/FaqPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import PrivacyPage from "./pages/PrivacyPage";
import StorePage from "./pages/StorePage";
import ProductPage from "./pages/ProductPage";
import BlogPage from "./pages/BlogPage";
import AllPostsPage from "./pages/AllPostsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ShopPage from "./pages/ShopPage";
import NewInPage from "./pages/NewInPage";
import AboutPage from "./pages/AboutPage";
import OurStoryPage from "./pages/OurStoryPage";
import AboutRemsleepPage from "./pages/AboutRemsleepPage";
import CoreValuesPage from "./pages/CoreValuesPage";
import MaterialsPage from "./pages/MaterialsPage";
import QualityPromisePage from "./pages/QualityPromisePage";
import SustainabilityPage from "./pages/SustainabilityPage";
import ContactPage from "./pages/ContactPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import CheckoutPage from "./pages/CheckoutPage";
import { FacebookPixel } from "./components/FacebookPixel";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { CookieConsent } from "./components/CookieConsent";
import { StoreOfferPopup } from "./components/store/StoreOfferPopup";
import { useCartSync } from "./hooks/useCartSync";

const queryClient = new QueryClient();

function CartSyncProvider({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FacebookPixel />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CookieConsent />
        <StoreOfferPopup />
        <GoogleAnalytics />
        <CartSyncProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/all" element={<AllPostsPage />} />
            <Route path="/blog/:blogHandle/:articleHandle" element={<BlogDetailPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/new-in" element={<NewInPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/about-remsleep" element={<AboutRemsleepPage />} />
            <Route path="/core-values" element={<CoreValuesPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/quality-promise" element={<QualityPromisePage />} />
            <Route path="/sustainability" element={<SustainabilityPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CartSyncProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
