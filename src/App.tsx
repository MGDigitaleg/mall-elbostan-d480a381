import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useParams, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { useGA4 } from "@/hooks/useGA4";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";


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
const SpinClaim = lazy(() => import("./pages/SpinClaim"));
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
const Countdown = lazy(() => import("./pages/Countdown"));
const DowntownDirectory = lazy(() => import("./pages/DowntownDirectory"));
const DowntownMerchantDetail = lazy(() => import("./pages/DowntownMerchantDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ── Kasr Zero pages ── */
const KzHome = lazy(() => import("./pages/kz/KzHome"));
const KzCart = lazy(() => import("./pages/kz/KzCart"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDowntownMerchants = lazy(() => import("./pages/admin/AdminDowntownMerchants"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminTenantAssets = lazy(() => import("./pages/admin/AdminTenantAssets"));
const AdminKzProducts = lazy(() => import("./pages/admin/AdminKzProducts"));
const AdminSpinHub = lazy(() => import("./pages/admin/AdminSpinHub"));
const AdminVisitorTokens = lazy(() => import("./pages/admin/AdminVisitorTokens"));
const AdminLogoAudit = lazy(() => import("./pages/admin/AdminLogoAudit"));



// Wrapper components for lazy-loaded admin named exports
const AdminStores = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminStores })));
const AdminUnits = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminUnits })));
const AdminEvents = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminEvents })));
const AdminRewards = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminRewards })));
const AdminDeals = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminDeals })));
const AdminJobs = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminJobs })));
const AdminBlog = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminBlog })));
const AdminFaqs = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminFaqs })));
const AdminProducts = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminProducts })));
const AdminProductCategories = lazy(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminProductCategories })));
const AdminCompetitionStores = lazy(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminCompetitionStores })));
const AdminStorePrizes = lazy(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminStorePrizes })));
const AdminSpinWinners = lazy(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminSpinWinners })));
const AdminSpinReports = lazy(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminSpinReports })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — avoid refetch on mobile back-nav
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function GA4Init() { useGA4(); return null; }

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Routes that should NOT show the public header/footer/widgets */
const adminPaths = ["/admin"];
const immersivePaths = ["/market-echo", "/countdown"];

/** Pages with a full-bleed dark hero — header overlaps, no top padding */
const darkHeroPages = ["/", "/downtown-branch", "/new-cairo-branch", "/opening-day", "/market-echo"];

function PageFallback() {
  return (
    <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

/** Redirect /kz/products/:slug → /products/:slug */
function KzSlugRedirect() {
  const params = useParams();
  return <Navigate to={`/products/${params.slug}`} replace />;
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
      <main className={showChrome ? (hasDarkHero ? "flex-1 min-h-[calc(100vh-660px)]" : "flex-1 pt-[56px] md:pt-[64px] xl:pt-[68px] min-h-[calc(100vh-660px)]") : "flex-1"}>
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
            <Route path="/spin-win/claim" element={<SpinClaim />} />
            <Route path="/spin-win/claim/:code" element={<SpinClaim />} />
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
            <Route path="/countdown" element={<Countdown />} />

            {/* Kasr Zero */}
            <Route path="/kz" element={<KzHome />} />
            <Route path="/kz/products" element={<Navigate to="/products?shop_name=kasr-zero" replace />} />
            <Route path="/kz/products/:slug" element={<KzSlugRedirect />} />
            <Route path="/kz/category/:slug" element={<Navigate to="/products?shop_name=kasr-zero" replace />} />
            <Route path="/kz/search" element={<Navigate to="/products" replace />} />
            <Route path="/kz/cart" element={<KzCart />} />

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
            <Route path="/admin/kz-products" element={<AdminKzProducts />} />
            <Route path="/admin/spin-system" element={<AdminSpinHub />} />
            <Route path="/admin/visitor-tokens" element={<AdminVisitorTokens />} />
            <Route path="/admin/logo-audit" element={<AdminLogoAudit />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {showChrome && <Footer />}
      {showChrome && <MobileBottomNav />}
    </>
  );
}

import { KzCartProvider } from "@/hooks/useKzCart";
import { ThemeProvider } from "@/hooks/useTheme";

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <KzCartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GA4Init />
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-background">
              <AppLayout />
            </div>
          </BrowserRouter>
        </KzCartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
