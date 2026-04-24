import { useState } from "react";
import { Copy, Check, AlertTriangle, X } from "lucide-react";

type Props = {
  missing: string[];
  extras: string[];
  duplicates: string[];
};

/**
 * Dev-only banner surfacing TechPlanet orbit/catalog mismatches inline in the UI
 * (in addition to the existing console group). Hidden in production builds.
 */
export const TechPlanetAuditBanner = ({ missing, extras, duplicates }: Props) => {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!import.meta.env.DEV) return null;
  if (dismissed) return null;
  if (!missing.length && !extras.length && !duplicates.length) return null;

  const report = [
    `[TechPlanet Audit]`,
    `Missing (${missing.length}): ${missing.join(", ") || "—"}`,
    `Extras  (${extras.length}): ${extras.join(", ") || "—"}`,
    `Dupes   (${duplicates.length}): ${duplicates.join(", ") || "—"}`,
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  const Row = ({ label, items, color }: { label: string; items: string[]; color: string }) => {
    if (!items.length) return null;
    return (
      <div className="flex flex-wrap items-start gap-1.5 text-[11px]" dir="ltr">
        <span className="font-mono font-semibold" style={{ color }}>
          {label} ({items.length}):
        </span>
        {items.map((s) => (
          <code
            key={s}
            className="rounded px-1.5 py-0.5 font-mono"
            style={{ background: "rgba(255,255,255,0.06)", color: "#E2E8F0", border: `1px solid ${color}33` }}
          >
            {s}
          </code>
        ))}
      </div>
    );
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative mx-auto mb-4 max-w-3xl rounded-xl border p-3"
      style={{
        background: "linear-gradient(135deg, rgba(252,211,77,0.08), rgba(7,19,38,0.7))",
        borderColor: "rgba(252,211,77,0.35)",
        boxShadow: "0 4px 16px rgba(7,19,38,0.4)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 font-arabic text-[12px] font-bold" style={{ color: "#FCD34D" }}>
          <AlertTriangle className="h-3.5 w-3.5" />
          فحص التطوير: تعارض بين الكوكب والكتالوج
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-mono transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(252,211,77,0.4)", color: "#FCD34D" }}
            aria-label="Copy audit report"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="inline-flex items-center justify-center rounded-md border p-1 transition-colors hover:bg-white/10"
            style={{ borderColor: "rgba(255,255,255,0.15)", color: "#94A3B8" }}
            aria-label="Dismiss banner"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="space-y-1.5">
        <Row label="Missing" items={missing} color="#F87171" />
        <Row label="Extras" items={extras} color="#FBBF24" />
        <Row label="Duplicates" items={duplicates} color="#A78BFA" />
      </div>
    </div>
  );
};
