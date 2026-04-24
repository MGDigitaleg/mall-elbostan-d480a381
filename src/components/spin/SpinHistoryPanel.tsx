import { useEffect, useState } from "react";
import { History, Trophy, Clock, Trash2, Copy, Check } from "lucide-react";
import { getSpinHistory, clearSpinHistory, type SpinHistoryEntry } from "@/lib/spinHistory";
import { useToast } from "@/hooks/use-toast";

type Props = {
  refreshKey?: number; // bump to force re-read after a new spin
};

export const SpinHistoryPanel = ({ refreshKey = 0 }: Props) => {
  const { toast } = useToast();
  const [items, setItems] = useState<SpinHistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setItems(getSpinHistory());
  }, [refreshKey]);

  if (items.length === 0) return null;

  const copy = (entry: SpinHistoryEntry) => {
    if (!entry.claim_code) return;
    navigator.clipboard.writeText(entry.claim_code);
    setCopiedId(entry.id);
    toast({ title: "تم نسخ الرمز" });
    setTimeout(() => setCopiedId(null), 1800);
  };

  const onClear = () => {
    clearSpinHistory();
    setItems([]);
    toast({ title: "تم مسح سجل المحاولات" });
  };

  return (
    <div dir="rtl" className="mt-10 max-w-3xl mx-auto card-premium p-5 md:p-6 text-right">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <History className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">سجل محاولاتك</h3>
            <p className="text-[11px] text-muted-foreground">آخر {items.length} محاولة محفوظة على هذا الجهاز</p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          مسح السجل
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((it) => {
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
    </div>
  );
};
