import { useState, useMemo } from "react";
import { useRequireAdmin } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertTriangle, XCircle, Search, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TenantLogo } from "@/components/TenantLogo";
import {
  TENANT_LOGO_REGISTRY,
  registryStats,
  type LogoVerification,
  type TenantLogoEntry,
} from "@/lib/tenantLogoRegistry";

const STATUS_CONFIG: Record<LogoVerification, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  verified: { label: "رسمي", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  sourced: { label: "مصدر خارجي", color: "bg-sky-500/15 text-sky-400 border-sky-500/30", icon: CheckCircle2 },
  generated: { label: "مؤقت (AI)", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: AlertTriangle },
  missing: { label: "مفقود", color: "bg-red-500/15 text-red-400 border-red-500/30", icon: XCircle },
};

type FilterKey = "all" | LogoVerification;

const AdminLogoAudit = () => {
  useRequireAdmin();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list: TenantLogoEntry[] = TENANT_LOGO_REGISTRY;
    if (filter !== "all") list = list.filter((t) => t.verified === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.displayNameAr.includes(q) ||
          (t.displayNameEn?.toLowerCase().includes(q)) ||
          t.slug.includes(q)
      );
    }
    return list;
  }, [filter, search]);

  const filterButtons: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "الكل", count: registryStats.total },
    { key: "verified", label: "رسمي", count: registryStats.verified },
    { key: "sourced", label: "مصدر خارجي", count: registryStats.sourced },
    { key: "generated", label: "مؤقت", count: registryStats.generated },
    { key: "missing", label: "مفقود", count: registryStats.missing },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">تدقيق لوجوهات المتاجر</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {registryStats.verified + registryStats.sourced} من {registryStats.total} شعار تم التحقق منه
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              لوحة التحكم
              <ArrowRight className="mr-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "رسمي", value: registryStats.verified, cls: "text-emerald-400" },
            { label: "مصدر خارجي", value: registryStats.sourced, cls: "text-sky-400" },
            { label: "مؤقت (AI)", value: registryStats.generated, cls: "text-amber-400" },
            { label: "مفقود", value: registryStats.missing, cls: "text-red-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className={`text-2xl font-bold ${s.cls}`}>{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Filter className="mt-1.5 h-4 w-4 text-muted-foreground" />
            {filterButtons.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
          <div className="relative sm:mr-auto sm:w-56">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">الشعار</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">المتجر</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">الحالة</th>
                  <th className="hidden px-4 py-3 text-right font-medium text-muted-foreground md:table-cell">المصدر</th>
                  <th className="hidden px-4 py-3 text-right font-medium text-muted-foreground lg:table-cell">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const cfg = STATUS_CONFIG[t.verified];
                  const Icon = cfg.icon;
                  return (
                    <tr key={t.slug} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <TenantLogo src={t.logoPath} alt={t.displayNameAr} size="sm" rounded="lg" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{t.displayNameAr}</p>
                        {t.displayNameEn && (
                          <p className="text-xs text-muted-foreground">{t.displayNameEn}</p>
                        )}
                        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/60">{t.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`gap-1 ${cfg.color}`}>
                          <Icon className="h-3 w-3" />
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        {t.officialSite ? (
                          <a
                            href={t.officialSite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            {new URL(t.officialSite).hostname}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {t.notes || "—"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                      لا توجد نتائج
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          عرض {filtered.length} من {registryStats.total} تينانت
        </p>
      </div>
    </div>
  );
};

export default AdminLogoAudit;
