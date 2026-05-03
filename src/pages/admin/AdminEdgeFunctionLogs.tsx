import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowRight,
  Activity,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  PlayCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const FUNCTIONS = [
  { name: "og-image", label: "OG Image", testPath: "/og-image?title=Test" },
  { name: "ping-indexing", label: "Ping IndexNow", testPath: "/ping-indexing", method: "OPTIONS" as const },
  { name: "robots", label: "robots.txt", testPath: "/robots" },
  { name: "rss", label: "RSS Feed", testPath: "/rss" },
  { name: "sitemap", label: "Sitemap", testPath: "/sitemap" },
  { name: "spin", label: "Spin & Win", testPath: "/spin", method: "OPTIONS" as const },
  { name: "verify-claim", label: "Verify Claim", testPath: "/verify-claim", method: "OPTIONS" as const },
];

const PROJECT_REF = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const FN_BASE = `https://${PROJECT_REF}.supabase.co/functions/v1`;

interface LogRow {
  id: string;
  function_name: string;
  status: string;
  status_code: number | null;
  duration_ms: number | null;
  method: string | null;
  path: string | null;
  request_summary: any;
  error_message: string | null;
  error_stack: string | null;
  created_at: string;
}

interface HealthState {
  status: "idle" | "checking" | "ok" | "error";
  ms?: number;
  code?: number;
  error?: string;
}

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString("ar-EG", {
    dateStyle: "short",
    timeStyle: "medium",
    hour12: false,
  });

const AdminEdgeFunctionLogs = () => {
  const { loading } = useRequireAdmin();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterFn, setFilterFn] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [health, setHealth] = useState<Record<string, HealthState>>({});
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadLogs = async () => {
    setRefreshing(true);
    try {
      let q = supabase.from("edge_function_logs").select("*").order("created_at", { ascending: false }).limit(200);
      if (filterFn !== "all") q = q.eq("function_name", filterFn);
      if (filterStatus !== "all") q = q.eq("status", filterStatus);
      const { data, error } = await q;
      if (error) throw error;
      setLogs((data ?? []) as LogRow[]);
    } catch (e: any) {
      toast.error(`فشل تحميل السجلات: ${e.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, filterFn, filterStatus]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(loadLogs, 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, filterFn, filterStatus]);

  const checkHealth = async (fn: typeof FUNCTIONS[number]) => {
    setHealth((h) => ({ ...h, [fn.name]: { status: "checking" } }));
    const start = performance.now();
    try {
      const res = await fetch(`${FN_BASE}${fn.testPath}`, {
        method: fn.method ?? "GET",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      const ms = Math.round(performance.now() - start);
      // Consume body
      try { await res.text(); } catch {}
      setHealth((h) => ({
        ...h,
        [fn.name]: {
          status: res.status >= 500 ? "error" : "ok",
          ms,
          code: res.status,
        },
      }));
    } catch (e: any) {
      const ms = Math.round(performance.now() - start);
      setHealth((h) => ({ ...h, [fn.name]: { status: "error", ms, error: String(e?.message ?? e) } }));
    }
  };

  const checkAll = async () => {
    await Promise.all(FUNCTIONS.map(checkHealth));
    setTimeout(loadLogs, 800);
  };

  const stats = useMemo(() => {
    const byFn: Record<string, { total: number; errors: number; avgMs: number }> = {};
    for (const r of logs) {
      const b = (byFn[r.function_name] ||= { total: 0, errors: 0, avgMs: 0 });
      b.total += 1;
      if (r.status === "error") b.errors += 1;
      if (r.duration_ms) b.avgMs += r.duration_ms;
    }
    Object.values(byFn).forEach((b) => (b.avgMs = b.total ? Math.round(b.avgMs / b.total) : 0));
    return byFn;
  }, [logs]);

  const toggle = (id: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">سجلات وتشخيص Edge Functions</h1>
          </div>
          <Link to="/admin">
            <Button variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4 ml-1" /> رجوع
            </Button>
          </Link>
        </div>
      </header>

      <main className="container py-10 space-y-8">
        {/* Health checks */}
        <section className="card-premium p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">فحص صحة الدوال</h2>
              <p className="text-sm text-muted-foreground">استدعاء فعلي لكل دالة لقياس زمن الاستجابة وحالة الرد</p>
            </div>
            <Button onClick={checkAll} size="sm">
              <PlayCircle className="w-4 h-4 ml-2" /> فحص الكل
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FUNCTIONS.map((fn) => {
              const h = health[fn.name] ?? { status: "idle" as const };
              const s = stats[fn.name];
              return (
                <div key={fn.name} className="p-4 rounded-lg border border-border bg-card/40 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-foreground truncate">{fn.label}</div>
                      <code className="text-xs text-muted-foreground" dir="ltr">{fn.name}</code>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => checkHealth(fn)} disabled={h.status === "checking"}>
                      {h.status === "checking" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {h.status === "ok" && (
                      <Badge variant="outline" className="border-green-600/40 text-green-700 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3 ml-1" /> {h.code} · {h.ms}ms
                      </Badge>
                    )}
                    {h.status === "error" && (
                      <Badge variant="destructive">
                        <AlertTriangle className="w-3 h-3 ml-1" /> {h.code ?? "ERR"} · {h.ms ?? "-"}ms
                      </Badge>
                    )}
                    {h.status === "idle" && <span className="text-muted-foreground">لم يتم الفحص</span>}
                    {h.status === "checking" && <span className="text-muted-foreground">جارٍ الفحص…</span>}
                  </div>

                  {s && (
                    <div className="text-xs text-muted-foreground border-t border-border/50 pt-2 mt-2 flex justify-between">
                      <span>آخر {s.total} طلب</span>
                      <span className={s.errors > 0 ? "text-destructive" : ""}>
                        {s.errors} خطأ · متوسط {s.avgMs}ms
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Filters + logs */}
        <section className="card-premium p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">سجل الاستدعاءات (آخر 200)</h2>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterFn} onValueChange={setFilterFn}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="الدالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الدوال</SelectItem>
                  {FUNCTIONS.map((f) => (
                    <SelectItem key={f.name} value={f.name}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الحالات</SelectItem>
                  <SelectItem value="success">ناجحة</SelectItem>
                  <SelectItem value="error">أخطاء</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh((v) => !v)}
              >
                تحديث تلقائي {autoRefresh ? "·مفعل" : ""}
              </Button>
              <Button variant="outline" size="sm" onClick={loadLogs} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 ml-1 ${refreshing ? "animate-spin" : ""}`} /> تحديث
              </Button>
            </div>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              لا توجد سجلات بعد. شغّل فحص صحة أو انتظر استدعاءً للدوال.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((row) => {
                const isOpen = expanded.has(row.id);
                const isError = row.status === "error";
                return (
                  <div
                    key={row.id}
                    className={`rounded-lg border transition ${
                      isError
                        ? "border-destructive/40 bg-destructive/5"
                        : "border-border bg-card/30"
                    }`}
                  >
                    <button
                      onClick={() => toggle(row.id)}
                      className="w-full flex items-center gap-3 p-3 text-right"
                    >
                      <Badge variant={isError ? "destructive" : "outline"} className="shrink-0">
                        {isError ? "خطأ" : "نجاح"}
                      </Badge>
                      <code className="text-sm font-medium text-foreground shrink-0" dir="ltr">
                        {row.function_name}
                      </code>
                      <span className="text-xs text-muted-foreground shrink-0" dir="ltr">
                        {row.method} · {row.status_code ?? "-"} · {row.duration_ms ?? "-"}ms
                      </span>
                      <span className="text-xs text-muted-foreground flex-1 truncate text-left" dir="ltr">
                        {row.error_message || row.path || ""}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">{fmtTime(row.created_at)}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </button>

                    {isOpen && (
                      <div className="px-3 pb-3 space-y-2 text-xs border-t border-border/50 pt-3" dir="ltr">
                        <div>
                          <div className="text-muted-foreground mb-1">Request summary</div>
                          <pre className="bg-muted/40 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(row.request_summary ?? {}, null, 2)}
                          </pre>
                        </div>
                        {row.error_message && (
                          <div>
                            <div className="text-destructive mb-1">Error</div>
                            <pre className="bg-destructive/10 text-destructive p-2 rounded overflow-auto max-h-40">
                              {row.error_message}
                            </pre>
                          </div>
                        )}
                        {row.error_stack && (
                          <div>
                            <div className="text-muted-foreground mb-1">Stack</div>
                            <pre className="bg-muted/40 p-2 rounded overflow-auto max-h-60 text-[11px]">
                              {row.error_stack}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminEdgeFunctionLogs;
