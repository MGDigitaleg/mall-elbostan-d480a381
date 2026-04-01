import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { useGA4 } from "@/hooks/useGA4";

import Index from "./pages/Index";
import About from "./pages/About";
import NewCairoBranch from "./pages/NewCairoBranch";
import Stores from "./pages/Stores";
import StoreDetail from "./pages/StoreDetail";
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
import { AdminStores, AdminUnits, AdminEvents, AdminRewards, AdminDeals, AdminJobs, AdminBlog, AdminFaqs } from "./pages/admin/AdminPages";

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
      <main className={!isAdmin ? "flex-1 pt-11 md:pt-12" : "flex-1"}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/new-cairo-branch" element={<NewCairoBranch />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:slug" element={<StoreDetail />} />
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
        <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,hsl(var(--background)),hsl(210_34%_97%))]">
          <AppLayout />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
