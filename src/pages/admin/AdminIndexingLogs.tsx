import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRequireAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, CheckCircle2, XCircle, Send, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AdminIndexingLogs() {
  const { loading } = useRequireAdmin();
  const queryClient = useQueryClient();
  const [pinging, setPinging] = useState(false);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["indexing-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("indexing_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const handlePing = useCallback(async () => {
    setPinging(true);
    try {
      const { data, error } = await supabase.functions.invoke("ping-indexing", {
        method: "POST",
        body: { source: "manual" },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(`تم إرسال ${data.urlsSubmitted} صفحة لمحركات البحث`);
      } else {
        toast.info(data?.error ?? "يرجى إعداد مفتاح IndexNow أولاً");
      }
      queryClient.invalidateQueries({ queryKey: ["indexing-logs"] });
    } catch {
      toast.error("فشل إرسال الطلب");
    } finally {
      setPinging(false);
    }
  }, [queryClient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="container flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowRight className="h-4 w-4 ml-1" />
                لوحة التحكم
              </Button>
            </Link>
            <h1 className="text-lg font-bold text-gradient-blue">سجل IndexNow</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="gap-1.5"
              disabled={pinging}
              onClick={handlePing}
            >
              <Send className={`h-3.5 w-3.5 ${pinging ? "animate-pulse" : ""}`} />
              {pinging ? "جاري الإرسال..." : "إرسال Ping الآن"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">إجمالي الطلبات</p>
            <p className="text-2xl font-bold text-foreground">{logs?.length ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">ناجحة</p>
            <p className="text-2xl font-bold text-emerald-400">
              {logs?.filter((l) => l.success).length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">فاشلة</p>
            <p className="text-2xl font-bold text-red-400">
              {logs?.filter((l) => !l.success).length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-xs text-muted-foreground mb-1">آخر طلب</p>
            <p className="text-sm font-bold text-foreground">
              {logs?.[0]
                ? new Date(logs[0].created_at).toLocaleString("ar-EG", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
        </div>

        {/* Logs table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">التوقيت</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">المصدر</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">الصفحات</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">الحالة</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">النتائج</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                      جاري التحميل...
                    </td>
                  </tr>
                ) : !logs || logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      لا توجد سجلات بعد
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    const results = (log.results ?? []) as { endpoint: string; status: number | string }[];
                    return (
                      <tr key={log.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-foreground">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {new Date(log.created_at).toLocaleString("ar-EG", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={log.source === "cron" ? "secondary" : "outline"}>
                            {log.source === "cron" ? "مجدول" : log.source === "manual" ? "يدوي" : log.source}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-foreground font-medium">
                          {log.urls_submitted}
                        </td>
                        <td className="px-4 py-3">
                          {log.success ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" /> نجاح
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400">
                              <XCircle className="h-4 w-4" /> فشل
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {results.map((r, i) => {
                              const host = new URL(r.endpoint).hostname.replace("www.", "").split(".")[0];
                              const ok = typeof r.status === "number" && r.status >= 200 && r.status < 300;
                              return (
                                <Badge
                                  key={i}
                                  variant={ok ? "default" : "destructive"}
                                  className="text-[0.65rem]"
                                >
                                  {host}: {r.status}
                                </Badge>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                          {log.error_message ?? "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
