import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// ─────────────────────────────────────────────────────────────────────────────
// Mock useAuth so we can flip roles per-test.
// ─────────────────────────────────────────────────────────────────────────────
const authState: {
  user: { id: string; email: string } | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
} = {
  user: { id: "u1", email: "u@example.com" },
  loading: false,
  isAdmin: true,
  isEditor: false,
};

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    ...authState,
    roles: [
      ...(authState.isAdmin ? ["admin"] : []),
      ...(authState.isEditor ? ["editor"] : []),
    ],
    canManageContent: authState.isAdmin || authState.isEditor,
    signOut: vi.fn(),
  }),
  useRequireAdmin: () => ({
    ...authState,
    canManageContent: authState.isAdmin || authState.isEditor,
    signOut: vi.fn(),
  }),
  useRequireContentAccess: () => ({
    ...authState,
    roles: [
      ...(authState.isAdmin ? ["admin"] : []),
      ...(authState.isEditor ? ["editor"] : []),
    ],
    canManageContent: authState.isAdmin || authState.isEditor,
    signOut: vi.fn(),
  }),
}));

// CampaignStatusBadge calls useCampaignStatus -> useQuery, which needs a QueryClientProvider.
// Mock the underlying hook to short-circuit it in tests.
vi.mock("@/hooks/useCampaignStatus", () => ({
  useCampaignStatus: () => ({ data: null, isLoading: false, error: null }),
}));

import AdminDashboard from "@/pages/admin/Dashboard";

function renderUI(ui: React.ReactElement) {
  return render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>
  );
}

function getJsonLdScripts(): HTMLScriptElement[] {
  return Array.from(
    document.head.querySelectorAll('script[type="application/ld+json"]')
  ) as HTMLScriptElement[];
}

describe("Admin pages — SEO & permission posture", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
    authState.user = { id: "u1", email: "u@example.com" };
    authState.loading = false;
    authState.isAdmin = true;
    authState.isEditor = false;
  });

  it("Dashboard emits no public BreadcrumbList or generic JSON-LD", async () => {
    renderUI(<AdminDashboard />);
    await waitFor(() => {
      expect(screen.queryByText("المحتوى")).toBeInTheDocument();
    });

    const scripts = getJsonLdScripts();
    const types = scripts.map((s) => {
      try { return JSON.parse(s.textContent || "{}")["@type"]; } catch { return null; }
    });

    expect(types).not.toContain("BreadcrumbList");
    expect(types).not.toContain("Organization");
    expect(types).not.toContain("WebSite");
    expect(types).not.toContain("ShoppingCenter");

    // No canonical leakage either
    const canonical = document.head.querySelector('link[rel="canonical"]');
    expect(canonical).toBeNull();
  });

  it("Dashboard hides admin-only sections (System / Operations / SEO) for editor role", async () => {
    authState.isAdmin = false;
    authState.isEditor = true;

    renderUI(<AdminDashboard />);

    await waitFor(() => {
      // Editor sees content + spin groups
      expect(screen.getByText("المحتوى")).toBeInTheDocument();
    });

    // Admin-only group labels MUST NOT render for editor
    expect(screen.queryByText("النظام والبنية التحتية")).toBeNull();
    expect(screen.queryByText("العمليات")).toBeNull();
    expect(screen.queryByText("SEO والفهرسة")).toBeNull();

    // Specific admin-only items hidden
    expect(screen.queryByText("النسخ الاحتياطية")).toBeNull();
    expect(screen.queryByText("قاعدة البيانات")).toBeNull();
    expect(screen.queryByText("العملاء المحتملون")).toBeNull();
    expect(screen.queryByText("إعدادات التواصل")).toBeNull();
    expect(screen.queryByText("تدقيق SEO")).toBeNull();
    expect(screen.queryByText("جاهزية الإطلاق")).toBeNull();

    // Editor-allowed items still visible
    expect(screen.getByText("المتاجر")).toBeInTheDocument();
    expect(screen.getByText("المدونة")).toBeInTheDocument();
  });

  it("Dashboard exposes admin-only sections to admin role", async () => {
    authState.isAdmin = true;
    authState.isEditor = false;

    renderUI(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("النظام والبنية التحتية")).toBeInTheDocument();
    });
    expect(screen.getByText("العمليات")).toBeInTheDocument();
    expect(screen.getByText("SEO والفهرسة")).toBeInTheDocument();
    expect(screen.getByText("النسخ الاحتياطية")).toBeInTheDocument();
    expect(screen.getByText("إعدادات التواصل")).toBeInTheDocument();
  });

  it("Dashboard renders nothing meaningful when user has no roles", () => {
    authState.isAdmin = false;
    authState.isEditor = false;

    const { container } = renderUI(<AdminDashboard />);
    // useRequireContentAccess returns null UI when canManageContent is false
    expect(container.textContent).toBe("");
    // And of course no SEO scripts
    expect(getJsonLdScripts()).toHaveLength(0);
  });
});
