import { useParams, Navigate } from "react-router-dom";
import Stores from "./Stores";

/**
 * Clean URL landing pages for category browsing.
 * Maps a URL-friendly slug to the canonical Arabic category label, then
 * renders the existing Stores page with the category preselected.
 *
 * Indexed in sitemap as /stores/category/<slug> with priority 0.7.
 */
const SLUG_TO_CATEGORY: Record<string, string> = {
  phones: "الهواتف والإكسسوارات",
  computers: "الكمبيوتر والأجهزة",
  gaming: "الألعاب والترفيه",
  networks: "الشبكات والأنظمة الأمنية",
  printing: "الطباعة والتصوير",
  maintenance: "الصيانة والدعم الفني",
  components: "المكونات والتجميع",
  screens: "الشاشات",
  "smart-home": "الأنظمة الذكية",
  office: "حلول المكاتب",
};

export default function StoresCategory() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? SLUG_TO_CATEGORY[slug] : undefined;

  if (!category) {
    return <Navigate to="/stores" replace />;
  }

  // Render Stores with category injected via window history so the existing
  // useSearchParams hook picks it up without changing the URL bar.
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("category") !== category) {
      params.set("category", category);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
  }

  return <Stores />;
}
