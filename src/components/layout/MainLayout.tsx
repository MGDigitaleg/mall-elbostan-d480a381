import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.08),transparent_30%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]">
      <Header />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
