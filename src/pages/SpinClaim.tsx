import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Loader2, ShieldCheck, AlertCircle, CheckCircle2, Clock, Store, Gift, ArrowLeft, Search, ScanLine, X } from "lucide-react";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

/**
 * Extract a claim code from a scanned QR payload.
 * Accepts: raw code (SP-XXXXXX or XXXX-XXXX-XXXX), full claim URL,
 * or JSON payload from the spin edge function (with claim_code field).
 */
function extractClaimCode(raw: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();

  // Try JSON payload (signed qr_data from the spin function)
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed?.claim_code === "string") return parsed.claim_code.toUpperCase();
    } catch {
      /* not JSON */
    }
  }

  // Try URL with /claim/<code>
  const urlMatch = trimmed.match(/\/claim\/([A-Z0-9-]+)/i);
  if (urlMatch) return urlMatch[1].toUpperCase();

  // Plain code — uppercase and strip whitespace
  return trimmed.toUpperCase();
}

type SessionInfo = {
  id: string;
  full_name: string;
  phone: string;
  claim_code: string;
  claim_status: "pending" | "redeemed" | "expired" | "cancelled";
  expires_at: string | null;
  created_at: string;
  prize: {
    name_ar: string;
    name_en: string | null;
    prize_type: string;
    image_url: string | null;
    redemption_rules_ar: string | null;
  } | null;
  store: { name_ar: string | null; unit_code: string | null } | null;
};

const STATUS_LABEL: Record<SessionInfo["claim_status"], string> = {
  pending: "بانتظار الاستلام",
  redeemed: "تم الاستلام",
  expired: "منتهي الصلاحية",
  cancelled: "ملغي",
};

const STATUS_TONE: Record<SessionInfo["claim_status"], string> = {
  pending: "bg-amber-50 text-amber-900 border-amber-200",
  redeemed: "bg-emerald-50 text-emerald-900 border-emerald-200",
  expired: "bg-rose-50 text-rose-900 border-rose-200",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const SpinClaim = () => {
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [authChecking, setAuthChecking] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [staffEmail, setStaffEmail] = useState<string | null>(null);

  const [searchCode, setSearchCode] = useState(code ?? "");
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  /* ── Verify staff session (admin role required for verify-claim) ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.user) {
        if (!cancelled) {
          setAuthChecking(false);
          setIsStaff(false);
        }
        return;
      }
      const { data: hasAdmin } = await supabase.rpc("has_role", {
        _user_id: authSession.user.id,
        _role: "admin",
      });
      if (cancelled) return;
      setIsStaff(Boolean(hasAdmin));
      setStaffEmail(authSession.user.email ?? null);
      setAuthChecking(false);
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Auto-lookup if URL has code ── */
  useEffect(() => {
    if (!authChecking && isStaff && code) {
      lookup(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecking, isStaff, code]);

  const lookup = async (rawCode: string) => {
    const trimmed = rawCode.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setSession(null);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("verify-claim", {
        body: { claim_code: trimmed, action: "verify" },
      });
      if (fnErr) throw fnErr;
      if (data?.error) {
        setError(data.error);
      } else {
        setSession(data.session as SessionInfo);
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setError("تعذّر التحقق من الرمز — حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    navigate(`/spin-win/claim/${searchCode.trim().toUpperCase()}`);
  };

  const handleScan = (results: IDetectedBarcode[]) => {
    if (!results || results.length === 0) return;
    const raw = results[0]?.rawValue;
    const extracted = extractClaimCode(raw ?? "");
    if (!extracted) {
      setScanError("تعذّر قراءة الرمز — حاول مرة أخرى");
      return;
    }
    setScannerOpen(false);
    setScanError(null);
    setSearchCode(extracted);
    toast({ title: "تم مسح الرمز", description: extracted });
    navigate(`/spin-win/claim/${extracted}`);
  };

  const handleRedeem = async () => {
    if (!session) return;
    setRedeeming(true);
    try {
      const { data, error: fnErr } = await supabase.functions.invoke("verify-claim", {
        body: { claim_code: session.claim_code, action: "redeem" },
      });
      if (fnErr) throw fnErr;
      if (data?.error) {
        toast({ title: "تعذّر الاستلام", description: data.error, variant: "destructive" });
        if (data.already_redeemed || data.error.includes("منتهية")) {
          await lookup(session.claim_code);
        }
      } else {
        toast({ title: "تم بنجاح", description: data.message ?? "تم تأكيد الاستلام" });
        await lookup(session.claim_code);
      }
    } catch (err) {
      console.error("Redeem error:", err);
      toast({ title: "خطأ", description: "حدث خطأ أثناء تأكيد الاستلام", variant: "destructive" });
    } finally {
      setRedeeming(false);
    }
  };

  /* ── Auth gate ── */
  if (authChecking) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!isStaff) {
    return (
      <MainLayout>
        <SEOHead title="بوابة الموظفين — مول البستان" description="صفحة مخصصة لموظفي الفرع للتحقق من جوائز Spin & Win." />
        <div className="container mx-auto max-w-md px-4 py-20">
          <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-extrabold text-foreground mb-2">بوابة الموظفين</h1>
            <p className="text-sm text-muted-foreground mb-6 leading-7">
              هذه الصفحة مخصّصة لموظفي مول البستان فقط. سجّل الدخول بحساب الفرع للمتابعة.
            </p>
            <Link to="/admin/login">
              <Button variant="cta" className="w-full">تسجيل دخول الموظفين</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  /* ── Staff view ── */
  return (
    <MainLayout>
      <SEOHead
        title="التحقق من جائزة Spin & Win — مول البستان"
        description="بوابة موظفي الفرع للتحقق من رموز الاستلام وتأكيد تسليم الجوائز."
      />
      <div className="container mx-auto max-w-2xl px-4 py-10 md:py-14">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-primary mb-1">
              بوابة الموظفين
            </p>
            <h1 className="text-2xl font-extrabold text-foreground">التحقق من جائزة Spin & Win</h1>
            {staffEmail && (
              <p className="mt-1 text-xs text-muted-foreground">مسجَّل دخول كـ {staffEmail}</p>
            )}
          </div>
          <Link
            to="/admin/spin-system"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            لوحة الأدمن
          </Link>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <Input
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            placeholder="رمز الاستلام (مثال: SP-A1B2C3)"
            className="flex-1 h-11 font-mono tracking-[0.1em]"
            dir="ltr"
          />
          <Button type="submit" variant="cta" className="h-11 px-5" disabled={loading}>
            <Search className="h-4 w-4 ml-1.5" />
            تحقق
          </Button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <Loader2 className="h-6 w-6 mx-auto text-primary animate-spin mb-3" />
            <p className="text-sm text-muted-foreground">جاري التحقق من الرمز...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-900 mb-1">رمز غير صالح</p>
              <p className="text-sm text-rose-800">{error}</p>
            </div>
          </div>
        )}

        {/* Session details */}
        {!loading && session && (
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {/* Status banner */}
            <div className={`border-b px-5 py-3 flex items-center justify-between ${STATUS_TONE[session.claim_status]}`}>
              <div className="flex items-center gap-2">
                {session.claim_status === "redeemed" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : session.claim_status === "expired" || session.claim_status === "cancelled" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                <span className="text-sm font-bold">{STATUS_LABEL[session.claim_status]}</span>
              </div>
              <span className="font-mono text-xs font-bold tracking-widest">{session.claim_code}</span>
            </div>

            <div className="p-6 space-y-5">
              {/* Prize */}
              {session.prize && (
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.68rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      الجائزة
                    </p>
                    <p className="text-base font-extrabold text-foreground">{session.prize.name_ar}</p>
                    {session.prize.redemption_rules_ar && (
                      <p className="mt-2 text-sm text-muted-foreground leading-6">
                        {session.prize.redemption_rules_ar}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Store */}
              {session.store?.name_ar && (
                <div className="rounded-xl bg-secondary/40 p-3 flex items-center gap-3">
                  <Store className="h-4 w-4 text-primary shrink-0" />
                  <div className="text-sm">
                    <span className="font-bold text-foreground">{session.store.name_ar}</span>
                    {session.store.unit_code && (
                      <span className="font-mono text-xs text-muted-foreground mr-2"> · {session.store.unit_code}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Winner info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="اسم الفائز" value={session.full_name} />
                <InfoRow label="رقم الهاتف" value={session.phone} mono />
                <InfoRow
                  label="تاريخ الفوز"
                  value={new Date(session.created_at).toLocaleString("ar-EG", {
                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                />
                <InfoRow
                  label="صالح حتى"
                  value={
                    session.expires_at
                      ? new Date(session.expires_at).toLocaleDateString("ar-EG", {
                          day: "numeric", month: "long", year: "numeric",
                        })
                      : "—"
                  }
                />
              </div>

              {/* Action */}
              {session.claim_status === "pending" && (
                <Button
                  variant="cta"
                  className="w-full h-12 text-base font-bold"
                  onClick={handleRedeem}
                  disabled={redeeming}
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin ml-2" />
                      جاري التأكيد...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 ml-2" />
                      تأكيد استلام الجائزة
                    </>
                  )}
                </Button>
              )}

              {session.claim_status === "redeemed" && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-700 mx-auto mb-1.5" />
                  <p className="text-sm font-bold text-emerald-900">تم تسليم هذه المكافأة بنجاح</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !session && !error && !code && (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Search className="h-6 w-6 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-sm text-muted-foreground">
              أدخل رمز الاستلام أو امسح كود QR من شاشة الفائز
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-secondary/30 p-3">
      <p className="text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <p className={`font-bold text-foreground text-sm ${mono ? "font-mono" : ""}`} dir={mono ? "ltr" : undefined}>
        {value}
      </p>
    </div>
  );
}

export default SpinClaim;
