import { useEffect, useMemo, useState } from "react";
import { History, Trophy, Clock, Trash2, Copy, Check, Cloud, CloudOff, LogIn, LogOut, Filter, Crown, ShieldCheck, Sparkles, AlertTriangle, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  getSpinHistory,
  clearSpinHistoryEverywhere,
  syncSpinHistory,
  type SpinHistoryEntry,
} from "@/lib/spinHistory";
import { useToast } from "@/hooks/use-toast";

type Props = {
  refreshKey?: number; // bump to force re-read after a new spin
};

type FilterKey = "all" | "won" | "grand" | "visitor";

const SOON_THRESHOLD_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

type ExpiryState = {
  status: "none" | "ok" | "soon" | "expired";
  remainingMs: number;
  label: string;
};

function getExpiryState(entry: SpinHistoryEntry): ExpiryState {
  if (!entry.won || !entry.expires_at) {
    return { status: "none", remainingMs: 0, label: "" };
  }
  const remaining = new Date(entry.expires_at).getTime() - Date.now();
  if (Number.isNaN(remaining)) return { status: "none", remainingMs: 0, label: "" };
  if (remaining <= 0) return { status: "expired", remainingMs: remaining, label: "انتهت الصلاحية" };

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const label =
    days >= 1
      ? `تنتهي خلال ${days} ${days === 1 ? "يوم" : "أيام"}`
      : `تنتهي خلال ${Math.max(1, hours)} ${hours === 1 ? "ساعة" : "ساعات"}`;

  return {
    status: remaining <= SOON_THRESHOLD_MS ? "soon" : "ok",
    remainingMs: remaining,
    label,
  };
}

export const SpinHistoryPanel = ({ refreshKey = 0 }: Props) => {
  const { toast } = useToast();
  const [items, setItems] = useState<SpinHistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  // Track auth state and sync on changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email ?? null;
      setUserEmail(email);
      if (session?.user) {
        setSyncing(true);
        syncSpinHistory()
          .then(setItems)
          .finally(() => setSyncing(false));
      } else {
        setItems(getSpinHistory());
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user?.email ?? null;
      setUserEmail(email);
      if (data.session?.user) {
        setSyncing(true);
        syncSpinHistory()
          .then(setItems)
          .finally(() => setSyncing(false));
      } else {
        setItems(getSpinHistory());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Refresh when a new spin is recorded
  useEffect(() => {
    if (refreshKey === 0) return;
    if (userEmail) {
      setSyncing(true);
      syncSpinHistory().then(setItems).finally(() => setSyncing(false));
    } else {
      setItems(getSpinHistory());
    }
  }, [refreshKey, userEmail]);

  const copy = (entry: SpinHistoryEntry) => {
    if (!entry.claim_code) return;
    navigator.clipboard.writeText(entry.claim_code);
    setCopiedId(entry.id);
    toast({ title: "تم نسخ الرمز" });
    setTimeout(() => setCopiedId(null), 1800);
  };

  const onClear = async () => {
    if (!confirm("هل تريد مسح سجل المحاولات؟")) return;
    await clearSpinHistoryEverywhere();
    setItems([]);
    toast({ title: "تم مسح سجل المحاولات" });
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "تم تسجيل الخروج" });
  };

  // Counts per filter (computed from full list, not the filtered view)
  const counts = useMemo(() => ({
    all: items.length,
    won: items.filter((i) => i.won).length,
    grand: items.filter((i) => i.is_grand).length,
    visitor: items.filter((i) => i.is_visitor).length,
  }), [items]);

  const filteredItems = useMemo(() => {
    switch (filter) {
      case "won": return items.filter((i) => i.won);
      case "grand": return items.filter((i) => i.is_grand);
      case "visitor": return items.filter((i) => i.is_visitor);
      default: return items;
    }
  }, [items, filter]);

  const filterTabs: { key: FilterKey; label: string; icon: typeof Sparkles; count: number }[] = [
    { key: "all", label: "الكل", icon: Sparkles, count: counts.all },
    { key: "won", label: "الفائزة", icon: Trophy, count: counts.won },
    { key: "grand", label: "الجوائز الكبرى", icon: Crown, count: counts.grand },
    { key: "visitor", label: "زوار الفرع", icon: ShieldCheck, count: counts.visitor },
  ];

  // Expiry summary (computed from full list)
  const expirySummary = useMemo(() => {
    let expired = 0;
    let soon = 0;
    let nextSoonMs = Infinity;
    for (const it of items) {
      const s = getExpiryState(it);
      if (s.status === "expired") expired += 1;
      else if (s.status === "soon") {
        soon += 1;
        if (s.remainingMs < nextSoonMs) nextSoonMs = s.remainingMs;
      }
    }
    return { expired, soon, nextSoonMs };
  }, [items]);

  // Surface a one-time toast when expiring/expired prizes are present
  useEffect(() => {
    if (items.length === 0) return;
    if (expirySummary.expired === 0 && expirySummary.soon === 0) return;
    const sigKey = "mb_spin_expiry_alerted_v1";
    const sig = `${expirySummary.expired}|${expirySummary.soon}|${new Date().toDateString()}`;
    try {
      if (typeof window !== "undefined" && localStorage.getItem(sigKey) === sig) return;
      if (typeof window !== "undefined") localStorage.setItem(sigKey, sig);
    } catch { /* ignore */ }

    if (expirySummary.expired > 0) {
      toast({
        title: "جوائز انتهت صلاحيتها",
        description: `لديك ${expirySummary.expired} جائزة لم تعد قابلة للاستلام.`,
        variant: "destructive",
      });
    } else if (expirySummary.soon > 0) {
      toast({
        title: "جوائز على وشك الانتهاء",
        description: `سارع باستلام ${expirySummary.soon} جائزة قبل انتهاء صلاحيتها.`,
      });
    }
  }, [expirySummary.expired, expirySummary.soon, items.length, toast]);

  // Show the panel even if empty when signed in (to surface sync state)
  if (items.length === 0 && !userEmail) return null;

  return (
    <div dir="rtl" className="mt-10 max-w-3xl mx-auto card-premium p-5 md:p-6 text-right">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <History className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">سجل محاولاتك</h3>
            <p className="text-[11px] text-muted-foreground">
              {userEmail
                ? `مزامن مع حسابك (${userEmail}) — يظهر على كل أجهزتك`
                : `آخر ${items.length} محاولة محفوظة على هذا الجهاز فقط`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {userEmail ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
              <Cloud className="w-3 h-3" />
              {syncing ? "مزامنة..." : "مزامن"}
            </span>
          ) : (
            <Link
              to="/spin-win/account"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-3 h-3" />
              سجّل لمزامنة السجل
            </Link>
          )}
          {items.length > 0 && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              مسح
            </button>
          )}
          {userEmail && (
            <button
              onClick={onSignOut}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
          <CloudOff className="w-4 h-4" />
          لا توجد محاولات بعد — جرّب العجلة وستظهر هنا تلقائياً.
        </div>
      ) : (
        <>
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 -mx-1 px-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground shrink-0 ml-1">
              <Filter className="w-3 h-3" />
              تصفية:
            </span>
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const active = filter === tab.key;
              const disabled = tab.count === 0 && tab.key !== "all";
              return (
                <button
                  key={tab.key}
                  onClick={() => !disabled && setFilter(tab.key)}
                  disabled={disabled}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : disabled
                        ? "bg-muted/40 text-muted-foreground/50 cursor-not-allowed"
                        : "bg-secondary/60 text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[16px] px-1 rounded-full text-[9px] font-extrabold ${
                      active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-card text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
              <CloudOff className="w-4 h-4" />
              لا توجد محاولات تطابق هذا الفلتر.
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredItems.map((it) => {
                const date = new Date(it.at).toLocaleString("ar-EG", {
                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                });
                const tone = it.is_grand
                  ? "bg-navy/10 border-navy/30"
                  : it.is_visitor
                    ? "bg-orange/10 border-orange/30"
                    : it.won
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/40 border-border";
                return (
                  <li key={it.id} className={`flex items-center gap-3 p-3 rounded-xl border ${tone}`}>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card shrink-0">
                      <Trophy className={`h-4 w-4 ${it.won ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {it.won ? (it.prize_name_ar || "جائزة") : "بدون جائزة"}
                        {it.is_grand && <span className="mr-1 text-[10px] font-bold text-primary">• كبرى</span>}
                        {it.is_visitor && <span className="mr-1 text-[10px] font-bold text-orange">• زائر فرع</span>}
                      </p>
                      <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {date}
                      </p>
                    </div>
                    {it.claim_code && (
                      <button
                        onClick={() => copy(it)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-card border border-border text-[11px] font-mono font-bold text-foreground hover:bg-primary/10 transition-colors"
                        title="نسخ رمز الاستلام"
                      >
                        {copiedId === it.id ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                        {it.claim_code}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
