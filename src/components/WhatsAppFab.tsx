import { MessageCircle } from "lucide-react";

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg hover:scale-110 transition-transform"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
