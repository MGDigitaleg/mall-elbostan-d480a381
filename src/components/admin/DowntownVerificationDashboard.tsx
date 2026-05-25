import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ListChecks, AlertTriangle, AlertCircle, ExternalLink, Cpu, Store } from "lucide-react";
import { HIGH_PRIORITY_TECH, getPublicBadge } from "@/lib/downtownVerification";

export type Merchant = Record<string, unknown> & {
  id: string;
  name_ar: string;
  name_en?: string | null;
  verification_status?: string | null;
  tech_related?: boolean | null;
  current_status?: string | null;
  confidence_score?: number | null;
  show_verified_publicly?: boolean | null;
  last_manual_check_date?: string | null;
  confirmed_by_team_at?: string | null;
  category?: string | null;
};

const TONE: Record<string, string> = {
  green:  "bg-success/10 text-success border-success/20",
  amber:  "bg-amber-500/10 text-amber-600 border-amber-500/20",
  red:    "bg-destructive/10 text-destructive border-destructive/20",
  gray:   "bg-muted/40 text-muted-foreground border-border",
  blue:   "bg-primary/10 text-primary border-primary/20",
  purple: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

export function DowntownVerificationDashboard({
  merchants,
  onJump,
}: {
  merchants: Merchant[];
  onJump: (filter: { status?: string; tech?: boolean; current?: string }) => void;
}) {
  const stats = useMemo(() => {
    const s = {
      total: merchants.length,
      verified: 0,
      listed: 0,
      needs: 0,
      conflict: 0,
      external: 0,
      tech: 0,
      publiclyVerified: 0,
    };
    for (const m of merchants) {
      const st = m.verification_status ?? "";
      if (st === "VERIFIED_EXTERNAL" || st === "Verified") s.verified++;
      if (st === "LISTED_ONLY") s.listed++;
      if (st === "UNREVIEWED_LISTED_ONLY" || st === "Needs review" || m.current_status === "Needs Field Verification") s.needs++;
      if (st === "CONFLICT_CHECK" || st === "PARTIAL_EXTERNAL_MATCH") s.conflict++;
      if (st === "EXTERNAL_VERIFIED_NOT_ON_SITE_LIST" || st === "EXTERNAL_DIRECTORY_CANDIDATE") s.external++;
      if (m.tech_related) s.tech++;
      if (getPublicBadge(m)?.tone === "green") s.publiclyVerified++;
    }
    return s;
  }, [merchants]);

  const queues = useMemo(() => {
    const techPriority = merchants.filter(m =>
      HIGH_PRIORITY_TECH.some(name => (m.name_en ?? "").toLowerCase().includes(name.toLowerCase()))
      || HIGH_PRIORITY_TECH.includes(m.name_ar)
    );
    const needsVerification = merchants.filter(m =>
      m.verification_status === "UNREVIEWED_LISTED_ONLY" || m.current_status === "Needs Field Verification"
    );
    const conflicts = merchants.filter(m =>
      m.verification_status === "CONFLICT_CHECK" || m.verification_status === "PARTIAL_EXTERNAL_MATCH"
    );
    const externals = merchants.filter(m =>
      m.verification_status === "EXTERNAL_VERIFIED_NOT_ON_SITE_LIST" || m.verification_status === "EXTERNAL_DIRECTORY_CANDIDATE"
    );
    return { techPriority, needsVerification, conflicts, externals };
  }, [merchants]);

  const Kpi = ({ icon: Icon, label, value, tone, onClick }: { icon: typeof Store; label: string; value: number; tone: string; onClick?: () => void }) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`card-premium p-4 text-right transition-all ${onClick ? "hover:border-primary/30 hover:shadow-md cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${TONE[tone]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[1.4rem] font-bold text-foreground">{value}</span>
      </div>
      <p className="mt-2 text-[0.75rem] text-muted-foreground">{label}</p>
    </button>
  );

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <Kpi icon={Store}        label="إجمالي المحلات"        value={stats.total}    tone="gray"   />
        <Kpi icon={ShieldCheck}  label="موثّق خارجياً"          value={stats.verified} tone="green"  onClick={() => onJump({ status: "VERIFIED_EXTERNAL" })} />
        <Kpi icon={ListChecks}   label="مدرج فقط"               value={stats.listed}   tone="blue"   onClick={() => onJump({ status: "LISTED_ONLY" })} />
        <Kpi icon={AlertCircle}  label="يحتاج تحقق"              value={stats.needs}    tone="amber"  onClick={() => onJump({ status: "UNREVIEWED_LISTED_ONLY" })} />
        <Kpi icon={AlertTriangle} label="تعارض في البيانات"     value={stats.conflict} tone="red"    onClick={() => onJump({ status: "CONFLICT_CHECK" })} />
        <Kpi icon={ExternalLink} label="مرشحون خارجيون"          value={stats.external} tone="purple" onClick={() => onJump({ status: "EXTERNAL_DIRECTORY_CANDIDATE" })} />
        <Kpi icon={Cpu}          label="محلات تقنية"             value={stats.tech}     tone="blue"   onClick={() => onJump({ tech: true })} />
      </div>

      <div className="card-premium p-4">
        <p className="text-[0.82rem] font-bold text-foreground">
          الظهور العام كموثّق: <span className="text-success">{stats.publiclyVerified}</span>
          <span className="text-muted-foreground"> / {stats.total}</span>
        </p>
        <p className="mt-1 text-[0.72rem] text-muted-foreground">
          يحتاج المحل ليظهر كموثّق علناً: حالة VERIFIED_EXTERNAL + تفعيل العرض العام + تأكيد يدوي.
        </p>
      </div>

      {/* Queues */}
      <div className="grid gap-4 lg:grid-cols-2">
        <QueueBlock title="محلات تقنية ذات أولوية" tone="blue" items={queues.techPriority} />
        <QueueBlock title="بحاجة لتحقق يدوي / ميداني" tone="amber" items={queues.needsVerification} />
        <QueueBlock title="تعارض في البيانات" tone="red" items={queues.conflicts} />
        <QueueBlock title="مرشحون خارجيون غير مدرجين" tone="purple" items={queues.externals} />
      </div>
    </div>
  );
}

function QueueBlock({ title, tone, items }: { title: string; tone: string; items: Merchant[] }) {
  return (
    <div className="card-premium p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[0.85rem] font-bold text-foreground">{title}</h3>
        <Badge variant="outline" className={`text-[0.6rem] ${TONE[tone]}`}>{items.length}</Badge>
      </div>
      {items.length === 0 ? (
        <p className="text-[0.72rem] text-muted-foreground">لا توجد عناصر</p>
      ) : (
        <ul className="space-y-1.5 max-h-56 overflow-y-auto">
          {items.slice(0, 12).map(m => (
            <li key={m.id} className="flex items-center justify-between gap-2 rounded-md bg-secondary/40 px-2 py-1.5">
              <span className="truncate text-[0.78rem] text-foreground">{m.name_ar}</span>
              {m.confidence_score != null && (
                <span className="shrink-0 text-[0.65rem] text-muted-foreground">ثقة {m.confidence_score}/5</span>
              )}
            </li>
          ))}
          {items.length > 12 && (
            <li className="pt-1 text-center text-[0.65rem] text-muted-foreground">+{items.length - 12} المزيد</li>
          )}
        </ul>
      )}
    </div>
  );
}
