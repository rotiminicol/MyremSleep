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
import { FacebookPixel } from "./components/FacebookPixel";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
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
        <GoogleAnalytics />
        <CartSyncProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/product/:handle" element={<ProductPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/all" element={<AllPostsPage />} />
            <Route path="/blog/:blogHandle/:articleHandle" element={<BlogDetailPage />} />
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
