import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight, Database, Loader2, RefreshCw, Search, Shield, Table as TableIcon } from "lucide-react";
import { toast } from "sonner";

interface TableInfo { table_name: string; row_count: number; has_rls: boolean; }
interface ColumnInfo { column_name: string; data_type: string; is_nullable: string; column_default: string | null; }
interface PolicyInfo { policy_name: string; cmd: string; roles: string[]; qual: string | null; with_check: string | null; }
interface AuditLog {
  id: string; table_name: string; action: string; row_id: string | null;
  actor_id: string | null; created_at: string; changed_columns: string[] | null;
  old_data: any; new_data: any;
}

const AdminDatabase = () => {
  const { loading: authLoading } = useRequireAdmin();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [policies, setPolicies] = useState<PolicyInfo[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [globalLogs, setGlobalLogs] = useState<AuditLog[]>([]);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const loadTables = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).rpc("admin_list_tables");
    if (error) { toast.error("تعذر تحميل الجداول: " + error.message); }
    else setTables(data ?? []);
    setLoading(false);
  };

  const loadGlobalLogs = async () => {
    const { data } = await (supabase as any)
      .from("audit_logs").select("*").order("created_at", { ascending: false }).limit(100);
    setGlobalLogs(data ?? []);
  };

  useEffect(() => { if (!authLoading) { loadTables(); loadGlobalLogs(); } }, [authLoading]);

  const openTable = async (name: string) => {
    setSelected(name);
    setTabLoading(true);
    const [c, p, r, l] = await Promise.all([
      (supabase as any).rpc("admin_list_columns", { p_table: name }),
      (supabase as any).rpc("admin_list_policies", { p_table: name }),
      (supabase as any).rpc("admin_browse_table", { p_table: name, p_limit: 100 }),
      (supabase as any).from("audit_logs").select("*").eq("table_name", name).order("created_at", { ascending: false }).limit(50),
    ]);
    setColumns(c.data ?? []);
    setPolicies(p.data ?? []);
    setRows(Array.isArray(r.data) ? r.data : []);
    setLogs(l.data ?? []);
    setTabLoading(false);
  };

  const filtered = useMemo(
    () => tables.filter(t => t.table_name.toLowerCase().includes(search.toLowerCase())),
    [tables, search]
  );

  const rowColumns = useMemo(() => rows[0] ? Object.keys(rows[0]) : [], [rows]);

  const fmtVal = (v: any) => {
    if (v === null || v === undefined) return <span className="text-muted-foreground/50">—</span>;
    if (typeof v === "object") return <code className="text-[11px] text-muted-foreground">{JSON.stringify(v).slice(0, 80)}</code>;
    const s = String(v);
    return s.length > 80 ? s.slice(0, 80) + "…" : s;
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-gradient-blue">قاعدة البيانات</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { loadTables(); loadGlobalLogs(); selected && openTable(selected); }}>
              <RefreshCw className="w-4 h-4 ml-1" /> تحديث
            </Button>
            <Link to="/admin"><Button variant="ghost" size="sm"><ArrowRight className="w-4 h-4 ml-1" /> رجوع</Button></Link>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {!selected ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-foreground">الجداول ({tables.length})</h2>
              <div className="relative ms-auto">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث..." className="pr-9 w-64" />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                {filtered.map(t => (
                  <button key={t.table_name} onClick={() => openTable(t.table_name)}
                    className="card-premium p-4 text-right hover:glow-blue transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <TableIcon className="w-4 h-4 text-primary" />
                      {t.has_rls && <Shield className="w-3.5 h-3.5 text-emerald-500" aria-label="RLS مفعّل" />}
                    </div>
                    <div className="font-bold text-foreground text-sm font-mono" dir="ltr">{t.table_name}</div>
                    <div className="text-xs text-muted-foreground mt-1">~{Math.max(0, t.row_count)} صف</div>
                  </button>
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold text-foreground mb-4">آخر التغييرات (كل الجداول)</h2>
            <div className="card-premium overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs">
                  <tr>
                    <th className="p-2 text-right">الوقت</th>
                    <th className="p-2 text-right">الجدول</th>
                    <th className="p-2 text-right">العملية</th>
                    <th className="p-2 text-right">المعرّف</th>
                    <th className="p-2 text-right">الأعمدة المتغيّرة</th>
                  </tr>
                </thead>
                <tbody>
                  {globalLogs.map(l => (
                    <tr key={l.id} className="border-t border-border/50 hover:bg-muted/20 cursor-pointer"
                      onClick={() => setExpandedLog(expandedLog === l.id ? null : l.id)}>
                      <td className="p-2 text-xs text-muted-foreground" dir="ltr">{new Date(l.created_at).toLocaleString()}</td>
                      <td className="p-2 font-mono text-xs" dir="ltr">{l.table_name}</td>
                      <td className="p-2"><span className={`text-xs px-2 py-0.5 rounded ${l.action === 'INSERT' ? 'bg-emerald-500/10 text-emerald-600' : l.action === 'DELETE' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>{l.action}</span></td>
                      <td className="p-2 text-xs font-mono text-muted-foreground" dir="ltr">{l.row_id?.slice(0, 8) ?? '—'}</td>
                      <td className="p-2 text-xs text-muted-foreground">{l.changed_columns?.join(", ") ?? '—'}</td>
                    </tr>
                  ))}
                  {globalLogs.length === 0 && <tr><td colSpan={5} className="p-4 text-center text-muted-foreground text-xs">لا توجد سجلات بعد</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
                <ArrowRight className="w-4 h-4 ml-1" /> كل الجداول
              </Button>
              <h2 className="text-2xl font-bold text-foreground font-mono" dir="ltr">{selected}</h2>
            </div>

            {tabLoading ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : (
              <Tabs defaultValue="columns">
                <TabsList>
                  <TabsTrigger value="columns">الحقول ({columns.length})</TabsTrigger>
                  <TabsTrigger value="rows">البيانات ({rows.length})</TabsTrigger>
                  <TabsTrigger value="policies">السياسات ({policies.length})</TabsTrigger>
                  <TabsTrigger value="logs">سجل التغييرات ({logs.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="columns" className="mt-4">
                  <div className="card-premium overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30 text-xs">
                        <tr>
                          <th className="p-2 text-right">الاسم</th>
                          <th className="p-2 text-right">النوع</th>
                          <th className="p-2 text-right">قابل للفراغ</th>
                          <th className="p-2 text-right">القيمة الافتراضية</th>
                        </tr>
                      </thead>
                      <tbody>
                        {columns.map(c => (
                          <tr key={c.column_name} className="border-t border-border/50">
                            <td className="p-2 font-mono text-xs" dir="ltr">{c.column_name}</td>
                            <td className="p-2 text-xs text-muted-foreground" dir="ltr">{c.data_type}</td>
                            <td className="p-2 text-xs">{c.is_nullable === 'YES' ? 'نعم' : 'لا'}</td>
                            <td className="p-2 text-xs text-muted-foreground font-mono" dir="ltr">{c.column_default ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="rows" className="mt-4">
                  <div className="card-premium overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/30">
                        <tr>{rowColumns.map(c => <th key={c} className="p-2 text-right whitespace-nowrap font-mono" dir="ltr">{c}</th>)}</tr>
                      </thead>
                      <tbody>
                        {rows.map((r, i) => (
                          <tr key={i} className="border-t border-border/50 hover:bg-muted/20">
                            {rowColumns.map(c => <td key={c} className="p-2 whitespace-nowrap" dir="ltr">{fmtVal(r[c])}</td>)}
                          </tr>
                        ))}
                        {rows.length === 0 && <tr><td colSpan={rowColumns.length || 1} className="p-4 text-center text-muted-foreground">لا توجد بيانات</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">عرض أول 100 صف فقط — للقراءة فقط.</p>
                </TabsContent>

                <TabsContent value="policies" className="mt-4">
                  <div className="space-y-2">
                    {policies.map(p => (
                      <div key={p.policy_name} className="card-premium p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold">{p.policy_name}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{p.cmd}</span>
                        </div>
                        {p.qual && <div className="text-xs"><span className="text-muted-foreground">USING:</span> <code dir="ltr" className="font-mono">{p.qual}</code></div>}
                        {p.with_check && <div className="text-xs mt-1"><span className="text-muted-foreground">WITH CHECK:</span> <code dir="ltr" className="font-mono">{p.with_check}</code></div>}
                      </div>
                    ))}
                    {policies.length === 0 && <p className="text-muted-foreground text-sm">لا توجد سياسات RLS لهذا الجدول.</p>}
                  </div>
                </TabsContent>

                <TabsContent value="logs" className="mt-4">
                  <div className="card-premium overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/30 text-xs">
                        <tr>
                          <th className="p-2 text-right">الوقت</th>
                          <th className="p-2 text-right">العملية</th>
                          <th className="p-2 text-right">المعرّف</th>
                          <th className="p-2 text-right">الأعمدة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map(l => (
                          <>
                            <tr key={l.id} className="border-t border-border/50 cursor-pointer hover:bg-muted/20"
                              onClick={() => setExpandedLog(expandedLog === l.id ? null : l.id)}>
                              <td className="p-2 text-xs text-muted-foreground" dir="ltr">{new Date(l.created_at).toLocaleString()}</td>
                              <td className="p-2"><span className={`text-xs px-2 py-0.5 rounded ${l.action === 'INSERT' ? 'bg-emerald-500/10 text-emerald-600' : l.action === 'DELETE' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'}`}>{l.action}</span></td>
                              <td className="p-2 text-xs font-mono" dir="ltr">{l.row_id?.slice(0, 8) ?? '—'}</td>
                              <td className="p-2 text-xs text-muted-foreground">{l.changed_columns?.join(", ") ?? '—'}</td>
                            </tr>
                            {expandedLog === l.id && (
                              <tr key={l.id + 'd'} className="bg-muted/10">
                                <td colSpan={4} className="p-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <div className="text-xs font-bold text-muted-foreground mb-1">قبل</div>
                                      <pre className="text-[10px] bg-background p-2 rounded overflow-x-auto" dir="ltr">{JSON.stringify(l.old_data, null, 2)}</pre>
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-muted-foreground mb-1">بعد</div>
                                      <pre className="text-[10px] bg-background p-2 rounded overflow-x-auto" dir="ltr">{JSON.stringify(l.new_data, null, 2)}</pre>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        ))}
                        {logs.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-muted-foreground text-xs">لا توجد تغييرات مسجلة</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDatabase;
