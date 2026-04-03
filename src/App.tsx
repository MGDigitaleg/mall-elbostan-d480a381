import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { useGA4 } from "@/hooks/useGA4";

import Index from "./pages/Index";
import About from "./pages/About";
import NewCairoBranch from "./pages/NewCairoBranch";
import DowntownBranch from "./pages/DowntownBranch";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import JoinMarketplace from "./pages/JoinMarketplace";
import InteractiveMap from "./pages/InteractiveMap";
import Leasing from "./pages/Leasing";
import SpinWin from "./pages/SpinWin";
import OpeningDay from "./pages/OpeningDay";
import DailyDeals from "./pages/DailyDeals";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RewardTerms from "./pages/RewardTerms";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminTenantAssets from "./pages/admin/AdminTenantAssets";
import { AdminStores, AdminUnits, AdminEvents, AdminRewards, AdminDeals, AdminJobs, AdminBlog, AdminFaqs, AdminProducts, AdminProductCategories } from "./pages/admin/AdminPages";
import { AdminCompetitionStores, AdminStorePrizes, AdminSpinWinners, AdminSpinReports } from "./pages/admin/AdminSpinSystem";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { WhatsAppFab } from "./components/WhatsAppFab";

const queryClient = new QueryClient();

function GA4Init() { useGA4(); return null; }

/* Routes that should NOT show the public header/footer */
const adminPaths = ["/admin"];

function AppLayout() {
  const location = useLocation();
  const isAdmin = adminPaths.some((p) => location.pathname.startsWith(p));

  return (
    <>
      {!isAdmin && <Header />}
      <main className={!isAdmin ? "flex-1 pt-[56px] md:pt-[64px] xl:pt-[68px]" : "flex-1"}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/new-cairo-branch" element={<NewCairoBranch />} />
          <Route path="/downtown-branch" element={<DowntownBranch />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:slug" element={<StoreDetail />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/join-marketplace" element={<JoinMarketplace />} />
          <Route path="/map" element={<InteractiveMap />} />
          <Route path="/leasing" element={<Leasing />} />
          <Route path="/spin-win" element={<SpinWin />} />
          <Route path="/opening-day" element={<OpeningDay />} />
          <Route path="/daily-deals" element={<DailyDeals />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/reward-terms" element={<RewardTerms />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/stores" element={<AdminStores />} />
          <Route path="/admin/units" element={<AdminUnits />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          <Route path="/admin/deals" element={<AdminDeals />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/faqs" element={<AdminFaqs />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/tenant-assets" element={<AdminTenantAssets />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/product-categories" element={<AdminProductCategories />} />
          <Route path="/admin/competition-stores" element={<AdminCompetitionStores />} />
          <Route path="/admin/store-prizes" element={<AdminStorePrizes />} />
          <Route path="/admin/spin-winners" element={<AdminSpinWinners />} />
          <Route path="/admin/spin-reports" element={<AdminSpinReports />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFab />}
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GA4Init />
        <div className="min-h-screen flex flex-col bg-background">
          <AppLayout />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
