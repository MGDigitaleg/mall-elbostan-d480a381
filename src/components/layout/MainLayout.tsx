/**
 * Legacy wrapper kept for backward-compatibility.
 * Header, Footer & WhatsAppFab are now rendered once in App.tsx,
 * so MainLayout simply passes children through.
 */
export function MainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
