import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,hsl(var(--background)),hsl(210_34%_97%))]">
      <Header />
      <main className="flex-1 pt-13 md:pt-14">{children}</main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
