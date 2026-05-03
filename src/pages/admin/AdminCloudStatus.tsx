import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cloud, RefreshCw, CheckCircle2, XCircle, Loader2, Database, Lock, FolderOpen, Zap, Activity } from "lucide-react";

const PROJECT_REF = "wrheltmgquyqqhscrpds";
const PROJECT_URL = `https://${PROJECT_REF}.supabase.co`;
const EDGE_FUNCTIONS = ["og-image", "ping-indexing", "robots", "rss", "sitemap", "spin", "verify-claim"];

type Status = "checking" | "ok" | "error";

interface Check {
  label: string;
  status: Status;
  detail?: string;
  latency?: number;
}

const StatusDot = ({ status }: { status: Status }) => {
  if (status === "checking") return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
  if (status === "ok") return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  return <XCircle className="w-4 h-4 text-red-500" />;
};

const AdminCloudStatus = () => {
  const { loading: authLoading } = useRequireAdmin();
  const [db, setDb] = useState<Check>({ label: "قاعدة البيانات", status: "checking" });
  const [auth, setAuth] = useState<Check>({ label: "المصادقة", status: "checking" });
  const [storage, setStorage] = useState<Check>({ label: "التخزين", status: "checking" });
  const [fns, setFns] = useState<Record<string, Check>>(
    Object.fromEntries(EDGE_FUNCTIONS.map(n => [n, { label: n, status: "checking" }]))
  );
  const [events, setEvents] = useState<any[]>([]);
  const [auditEvents, setAuditEvents] = useState<any[]>([]);

  const checkAll = async () => {
    setDb({ label: "قاعدة البيانات", status: "checking" });
    setAuth({ label: "المصادقة", status: "checking" });
    setStorage({ label: "التخزين", status: "checking" });
    setFns(Object.fromEntries(EDGE_FUNCTIONS.map(n => [n, { label: n, status: "checking" }])));

    // DB
    const t1 = performance.now();
    const { error: dbErr } = await supabase.from("stores").select("id", { count: "exact", head: true }).limit(1);
    setDb({ label: "قاعدة البيانات", status: dbErr ? "error" : "ok", detail: dbErr?.message, latency: Math.round(performance.now() - t1) });

    // Auth
    const t2 = performance.now();
    const { data: sess, error: aErr } = await supabase.auth.getSession();
    setAuth({
      label: "المصادقة",
      status: aErr ? "error" : "ok",
      detail: aErr?.message ?? (sess.session ? `جلسة نشطة: ${sess.session.user.email}` : "خدمة المصادقة تعمل"),
      latency: Math.round(performance.now() - t2),
    });

    // Storage
    const t3 = performance.now();
    const { data: buckets, error: sErr } = await supabase.storage.listBuckets();
    setStorage({
      label: "التخزين",
      status: sErr ? "error" : "ok",
      detail: sErr?.message ?? `${buckets?.length ?? 0} حاوية`,
      latency: Math.round(performance.now() - t3),
    });

    // Edge functions: HEAD/GET ping
    EDGE_FUNCTIONS.forEach(async (name) => {
      const t = performance.now();
      try {
        const res = await fetch(`${PROJECT_URL}/functions/v1/${name}`, { method: "GET" });
        setFns(prev => ({
          ...prev,
          [name]: {
            label: name,
            status: res.status < 500 ? "ok" : "error",
            detail: `HTTP ${res.status}`,
            latency: Math.round(performance.now() - t),
          },
        }));
      } catch (e: any) {
        setFns(prev => ({ ...prev, [name]: { label: name, status: "error", detail: e?.message } }));
      }
    });
  };

  const loadEvents = async () => {
    const [edge, audit] = await Promise.all([
      (supabase as any).from("edge_function_logs").select("*").order("created_at", { ascending: false }).limit(20),
      (supabase as any).from("audit_logs").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setEvents(edge.data ?? []);
    setAuditEvents(audit.data ?? []);
  };

  useEffect(() => {
    if (!authLoading) { checkAll(); loadEvents(); }
  }, [authLoading]);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  const fnList = Object.values(fns);
  const allOk = db.status === "ok" && auth.status === "ok" && storage.status === "ok" && fnList.every(f => f.status === "ok");
  const anyChecking = [db, auth, storage, ...fnList].some(c => c.status === "checking");

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-gradient-blue">حالة Lovable Cloud</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { checkAll(); loadEvents(); }}>
              <RefreshCw className="w-4 h-4 ml-1" /> فحص
            </Button>
            <Link to="/admin"><Button variant="ghost" size="sm"><ArrowRight className="w-4 h-4 ml-1" /> رجوع</Button></Link>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Project info */}
        <section className="card-premium p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">مول البستان · Lovable Cloud</h2>
              <p className="text-xs text-muted-foreground font-mono mt-1" dir="ltr">{PROJECT_URL}</p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${anyChecking ? 'bg-muted text-muted-foreground' : allOk ? 'bg-emerald-500/15 text-emerald-600' : 'bg-red-500/15 text-red-600'}`}>
              {anyChecking ? "جاري الفحص..." : allOk ? "كل الخدمات تعمل" : "توجد مشاكل"}
            </div>
          </div>
        </section>

        {/* Core services */}
        <section>
          <h3 className="text-lg font-bold text-foreground mb-4">الخدمات الأساسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Database, c: db },
              { icon: Lock, c: auth },
              { icon: FolderOpen, c: storage },
            ].map(({ icon: Icon, c }) => (
              <div key={c.label} className="card-premium p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <StatusDot status={c.status} />
                </div>
                <div className="font-bold text-foreground">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.detail ?? "—"}</div>
                {c.latency !== undefined && (
                  <div className="text-[10px] text-muted-foreground mt-2 font-mono" dir="ltr">{c.latency} ms</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Edge functions */}
        <section>
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Edge Functions
          </h3>
          <div className="card-premium overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-xs">
                <tr>
                  <th className="p-2 text-right">الدالة</th>
                  <th className="p-2 text-right">الحالة</th>
                  <th className="p-2 text-right">الاستجابة</th>
                  <th className="p-2 text-right">الزمن</th>
                </tr>
              </thead>
              <tbody>
                {fnList.map(f => (
                  <tr key={f.label} className="border-t border-border/50">
                    <td className="p-2 font-mono text-xs" dir="ltr">{f.label}</td>
                    <td className="p-2"><StatusDot status={f.status} /></td>
                    <td className="p-2 text-xs text-muted-foreground">{f.detail ?? "—"}</td>
                    <td className="p-2 text-xs font-mono text-muted-foreground" dir="ltr">{f.latency !== undefined ? `${f.latency} ms` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent events */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> آخر استدعاءات Edge Functions
            </h3>
            <div className="card-premium overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-2 text-right">الوقت</th>
                    <th className="p-2 text-right">الدالة</th>
                    <th className="p-2 text-right">الحالة</th>
                    <th className="p-2 text-right">المدة</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(e => (
                    <tr key={e.id} className="border-t border-border/50">
                      <td className="p-2 text-muted-foreground" dir="ltr">{new Date(e.created_at).toLocaleTimeString()}</td>
                      <td className="p-2 font-mono" dir="ltr">{e.function_name}</td>
                      <td className="p-2"><span className={`px-2 py-0.5 rounded ${e.status === 'success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>{e.status}</span></td>
                      <td className="p-2 font-mono text-muted-foreground" dir="ltr">{e.duration_ms ?? "—"} ms</td>
                    </tr>
                  ))}
                  {events.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-muted-foreground">لا توجد أحداث</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> آخر تغييرات قاعدة البيانات
            </h3>
            <div className="card-premium overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-2 text-right">الوقت</th>
                    <th className="p-2 text-right">الجدول</th>
                    <th className="p-2 text-right">العملية</th>
                  </tr>
                </thead>
                <tbody>
                  {auditEvents.map(a => (
                    <tr key={a.id} className="border-t border-border/50">
                      <td className="p-2 text-muted-foreground" dir="ltr">{new Date(a.created_at).toLocaleTimeString()}</td>
                      <td className="p-2 font-mono" dir="ltr">{a.table_name}</td>
                      <td className="p-2"><span className={`px-2 py-0.5 rounded ${a.action === 'INSERT' ? 'bg-emerald-500/10 text-emerald-600' : a.action === 'DELETE' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>{a.action}</span></td>
                    </tr>
                  ))}
                  {auditEvents.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-muted-foreground">لا توجد تغييرات</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminCloudStatus;
