import { MessageCircle } from "lucide-react";
import { OFFICIAL_WHATSAPP } from "@/lib/contactInfo";
import { trackWhatsappClick } from "@/lib/analytics";

export function WhatsAppFab() {
  const href = OFFICIAL_WHATSAPP ? `https://wa.me/${OFFICIAL_WHATSAPP}` : "https://wa.me/";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsappClick("fab")}
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg hover:scale-110 transition-transform"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
