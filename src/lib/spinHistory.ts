// Local-only Spin & Win attempt history (per browser).
// Stored in localStorage — does not include sensitive data (no full phone, no email).

export type SpinHistoryEntry = {
  id: string;
  at: string; // ISO timestamp
  won: boolean;
  prize_name_ar?: string | null;
  claim_code?: string | null;
  is_grand?: boolean;
  is_visitor?: boolean;
  expires_at?: string | null;
};

const KEY = "mb_spin_history_v1";
const MAX = 20;

export function getSpinHistory(): SpinHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addSpinHistory(entry: Omit<SpinHistoryEntry, "id" | "at">): SpinHistoryEntry {
  const full: SpinHistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    ...entry,
  };
  if (typeof window === "undefined") return full;
  try {
    const prev = getSpinHistory();
    const next = [full, ...prev].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  return full;
}

export function clearSpinHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
