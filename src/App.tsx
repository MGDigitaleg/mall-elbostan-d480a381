import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { useGA4 } from "@/hooks/useGA4";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { WhatsAppFab } from "./components/WhatsAppFab";

/* ── Lazy-loaded pages for code-splitting ── */
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const NewCairoBranch = lazy(() => import("./pages/NewCairoBranch"));
const DowntownBranch = lazy(() => import("./pages/DowntownBranch"));
const Stores = lazy(() => import("./pages/Stores"));
const StoreDetail = lazy(() => import("./pages/StoreDetail"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const JoinMarketplace = lazy(() => import("./pages/JoinMarketplace"));
const InteractiveMap = lazy(() => import("./pages/InteractiveMap"));
const Leasing = lazy(() => import("./pages/Leasing"));
const SpinWin = lazy(() => import("./pages/SpinWin"));
const OpeningDay = lazy(() => import("./pages/OpeningDay"));
const DailyDeals = lazy(() => import("./pages/DailyDeals"));
const Careers = lazy(() => import("./pages/Careers"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const RewardTerms = lazy(() => import("./pages/RewardTerms"));
const MarketEcho = lazy(() => import("./pages/MarketEcho"));
const DowntownDirectory = lazy(() => import("./pages/DowntownDirectory"));
const DowntownMerchantDetail = lazy(() => import("./pages/DowntownMerchantDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDowntownMerchants = lazy(() => import("./pages/admin/AdminDowntownMerchants"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminTenantAssets = lazy(() => import("./pages/admin/AdminTenantAssets"));

import { AdminStores, AdminUnits, AdminEvents, AdminRewards, AdminDeals, AdminJobs, AdminBlog, AdminFaqs, AdminProducts, AdminProductCategories } from "./pages/admin/AdminPages";
import { AdminCompetitionStores, AdminStorePrizes, AdminSpinWinners, AdminSpinReports } from "./pages/admin/AdminSpinSystem";

const queryClient = new QueryClient();

function GA4Init() { useGA4(); return null; }

/* Routes that should NOT show the public header/footer/widgets */
const adminPaths = ["/admin"];
const immersivePaths = ["/market-echo"];

/** Pages with a full-bleed dark hero — header overlaps, no top padding */
const darkHeroPages = ["/", "/downtown-branch", "/new-cairo-branch", "/opening-day", "/market-echo"];

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = adminPaths.some((p) => location.pathname.startsWith(p));
  const isImmersive = immersivePaths.some((p) => location.pathname === p);
  const hasDarkHero = darkHeroPages.some(
    (p) => (p === "/" ? location.pathname === "/" : location.pathname === p)
  );

  const showChrome = !isAdmin && !isImmersive;

  return (
    <>
      {showChrome && <Header />}
      <main className={showChrome ? (hasDarkHero ? "flex-1" : "flex-1 pt-[56px] md:pt-[64px] xl:pt-[68px]") : "flex-1"}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/new-cairo-branch" element={<NewCairoBranch />} />
            <Route path="/downtown-branch" element={<DowntownBranch />} />
            <Route path="/downtown-directory" element={<DowntownDirectory />} />
            <Route path="/downtown-directory/:slug" element={<DowntownMerchantDetail />} />
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
            <Route path="/market-echo" element={<MarketEcho />} />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/downtown-merchants" element={<AdminDowntownMerchants />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/tenant-assets" element={<AdminTenantAssets />} />

            <Route path="/admin/stores" element={<AdminStores />} />
            <Route path="/admin/units" element={<AdminUnits />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/rewards" element={<AdminRewards />} />
            <Route path="/admin/deals" element={<AdminDeals />} />
            <Route path="/admin/jobs" element={<AdminJobs />} />
            <Route path="/admin/blog" element={<AdminBlog />} />
            <Route path="/admin/faqs" element={<AdminFaqs />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/product-categories" element={<AdminProductCategories />} />
            <Route path="/admin/competition-stores" element={<AdminCompetitionStores />} />
            <Route path="/admin/store-prizes" element={<AdminStorePrizes />} />
            <Route path="/admin/spin-winners" element={<AdminSpinWinners />} />
            <Route path="/admin/spin-reports" element={<AdminSpinReports />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {showChrome && <Footer />}
      {showChrome && <WhatsAppFab />}
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
