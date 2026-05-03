import { lazy, Suspense, useEffect } from "react";
import { LazyErrorBoundary } from "@/components/LazyErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useParams, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { useGA4 } from "@/hooks/useGA4";
import { lazyRetry } from "@/lib/lazyRetry";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { MobileBottomNav } from "./components/layout/MobileBottomNav";

/* ── Lazy-loaded pages with retry for resilience ── */
const Index = lazy(() => lazyRetry(() => import("./pages/Index")));
const About = lazy(() => lazyRetry(() => import("./pages/About")));
const NewCairoBranch = lazy(() => lazyRetry(() => import("./pages/NewCairoBranch")));
const DowntownBranch = lazy(() => lazyRetry(() => import("./pages/DowntownBranch")));
const Stores = lazy(() => lazyRetry(() => import("./pages/Stores")));
const StoreDetail = lazy(() => lazyRetry(() => import("./pages/StoreDetail")));
const Products = lazy(() => lazyRetry(() => import("./pages/Products")));
const ProductDetail = lazy(() => lazyRetry(() => import("./pages/ProductDetail")));
const JoinMarketplace = lazy(() => lazyRetry(() => import("./pages/JoinMarketplace")));
const InteractiveMap = lazy(() => lazyRetry(() => import("./pages/InteractiveMap")));
const Leasing = lazy(() => lazyRetry(() => import("./pages/Leasing")));
const SpinWin = lazy(() => lazyRetry(() => import("./pages/SpinWin")));
const SpinAccount = lazy(() => lazyRetry(() => import("./pages/SpinAccount")));
const SpinClaim = lazy(() => lazyRetry(() => import("./pages/SpinClaim")));
const OpeningDay = lazy(() => lazyRetry(() => import("./pages/OpeningDay")));
const DailyDeals = lazy(() => lazyRetry(() => import("./pages/DailyDeals")));
const OfferDetail = lazy(() => lazyRetry(() => import("./pages/OfferDetail")));
const Careers = lazy(() => lazyRetry(() => import("./pages/Careers")));
const Blog = lazy(() => lazyRetry(() => import("./pages/Blog")));
const BlogPost = lazy(() => lazyRetry(() => import("./pages/BlogPost")));
const Contact = lazy(() => lazyRetry(() => import("./pages/Contact")));
const FAQ = lazy(() => lazyRetry(() => import("./pages/FAQ")));
const Privacy = lazy(() => lazyRetry(() => import("./pages/Privacy")));
const Terms = lazy(() => lazyRetry(() => import("./pages/Terms")));
const RewardTerms = lazy(() => lazyRetry(() => import("./pages/RewardTerms")));
const MarketEcho = lazy(() => lazyRetry(() => import("./pages/MarketEcho")));
const Countdown = lazy(() => lazyRetry(() => import("./pages/Countdown")));
const DowntownDirectory = lazy(() => lazyRetry(() => import("./pages/DowntownDirectory")));
const DeviceCategory = lazy(() => lazyRetry(() => import("./pages/DeviceCategory")));
const DevicePage = lazy(() => lazyRetry(() => import("./pages/DevicePage")));
const DowntownMerchantDetail = lazy(() => lazyRetry(() => import("./pages/DowntownMerchantDetail")));
const TechPlanet = lazy(() => lazyRetry(() => import("./pages/TechPlanet")));
const Sitemap = lazy(() => lazyRetry(() => import("./pages/Sitemap")));
const Rss = lazy(() => lazyRetry(() => import("./pages/Rss")));
const NotFound = lazy(() => lazyRetry(() => import("./pages/NotFound")));

/* ── Kasr Zero pages ── */
const KzHome = lazy(() => lazyRetry(() => import("./pages/kz/KzHome")));
const KzCart = lazy(() => lazyRetry(() => import("./pages/kz/KzCart")));

const AdminLogin = lazy(() => lazyRetry(() => import("./pages/admin/Login")));
const AdminDowntownMerchants = lazy(() => lazyRetry(() => import("./pages/admin/AdminDowntownMerchants")));
const AdminDashboard = lazy(() => lazyRetry(() => import("./pages/admin/Dashboard")));
const AdminLeads = lazy(() => lazyRetry(() => import("./pages/admin/AdminLeads")));
const AdminTenantAssets = lazy(() => lazyRetry(() => import("./pages/admin/AdminTenantAssets")));
const AdminKzProducts = lazy(() => lazyRetry(() => import("./pages/admin/AdminKzProducts")));
const AdminSpinHub = lazy(() => lazyRetry(() => import("./pages/admin/AdminSpinHub")));
const AdminVisitorTokens = lazy(() => lazyRetry(() => import("./pages/admin/AdminVisitorTokens")));
const AdminLogoAudit = lazy(() => lazyRetry(() => import("./pages/admin/AdminLogoAudit")));
const AdminSeoAudit = lazy(() => lazyRetry(() => import("./pages/admin/AdminSeoAudit")));
const AdminIndexingLogs = lazy(() => lazyRetry(() => import("./pages/admin/AdminIndexingLogs")));
const AdminSeoVerify = lazy(() => lazyRetry(() => import("./pages/admin/AdminSeoVerify")));
const AdminOgPreview = lazy(() => lazyRetry(() => import("./pages/admin/AdminOgPreview")));
const AdminTenantBranding = lazy(() => lazyRetry(() => import("./pages/admin/AdminTenantBranding")));
const AdminLaunchReadiness = lazy(() => lazyRetry(() => import("./pages/admin/AdminLaunchReadiness")));
const AdminContactSettings = lazy(() => lazyRetry(() => import("./pages/admin/AdminContactSettings")));
const AdminSocialOffers = lazy(() => lazyRetry(() => import("./pages/admin/AdminSocialOffers")));
const AdminBackup = lazy(() => lazyRetry(() => import("./pages/admin/AdminBackup")));

// Wrapper components for lazy-loaded admin named exports
const AdminStores = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminStores }))));
const AdminUnits = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminUnits }))));
const AdminEvents = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminEvents }))));
const AdminRewards = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminRewards }))));
const AdminDeals = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminDeals }))));
const AdminJobs = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminJobs }))));
const AdminBlog = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminBlog }))));
const AdminFaqs = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminFaqs }))));
const AdminProducts = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminProducts }))));
const AdminProductCategories = lazy(() => lazyRetry(() => import("./pages/admin/AdminPages").then(m => ({ default: m.AdminProductCategories }))));
const AdminCompetitionStores = lazy(() => lazyRetry(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminCompetitionStores }))));
const AdminStorePrizes = lazy(() => lazyRetry(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminStorePrizes }))));
const AdminSpinWinners = lazy(() => lazyRetry(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminSpinWinners }))));
const AdminSpinReports = lazy(() => lazyRetry(() => import("./pages/admin/AdminSpinSystem").then(m => ({ default: m.AdminSpinReports }))));


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
const darkHeroPages = ["/", "/downtown-branch", "/new-cairo-branch", "/opening-day", "/market-echo", "/tech-planet"];

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
        <LazyErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/new-cairo-branch" element={<NewCairoBranch />} />
            <Route path="/downtown-branch" element={<DowntownBranch />} />
            <Route path="/downtown-directory" element={<DowntownDirectory />} />
            <Route path="/downtown-directory/:slug" element={<DowntownMerchantDetail />} />
            <Route path="/devices/:slug" element={<DeviceCategory />} />
            <Route path="/devices/:pillar/:cluster" element={<DevicePage />} />
            <Route path="/devices/:pillar/:cluster/:longtail" element={<DevicePage />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/stores/:slug" element={<StoreDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:slug" element={<ProductDetail />} />
            <Route path="/join-marketplace" element={<JoinMarketplace />} />
            <Route path="/map" element={<InteractiveMap />} />
            <Route path="/leasing" element={<Leasing />} />
            <Route path="/spin-win" element={<SpinWin />} />
            <Route path="/spin-win/account" element={<SpinAccount />} />
            <Route path="/spin-win/claim" element={<SpinClaim />} />
            <Route path="/spin-win/claim/:code" element={<SpinClaim />} />
            <Route path="/opening-day" element={<OpeningDay />} />
            <Route path="/daily-deals" element={<DailyDeals />} />
            <Route path="/daily-deals/offer/:id" element={<OfferDetail />} />
            <Route path="/daily-deals/:id" element={<OfferDetail />} />
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
            <Route path="/tech-planet" element={<TechPlanet />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/rss" element={<Rss />} />

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
            <Route path="/admin/seo-audit" element={<AdminSeoAudit />} />
            <Route path="/admin/indexing-logs" element={<AdminIndexingLogs />} />
            <Route path="/admin/seo-verify" element={<AdminSeoVerify />} />
            <Route path="/admin/og-preview" element={<AdminOgPreview />} />
            <Route path="/admin/tenant-branding" element={<AdminTenantBranding />} />
            <Route path="/admin/launch-readiness" element={<AdminLaunchReadiness />} />
            <Route path="/admin/contact-settings" element={<AdminContactSettings />} />
            <Route path="/admin/social-offers" element={<AdminSocialOffers />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </LazyErrorBoundary>
      </main>
      {showChrome && <Footer />}
      {showChrome && <MobileBottomNav />}
    </>
  );
}

import { KzCartProvider } from "@/hooks/useKzCart";
import { ThemeProvider } from "@/hooks/useTheme";
import { SitePhoneProvider } from "@/hooks/useSitePhone";

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SitePhoneProvider>
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
        </SitePhoneProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
