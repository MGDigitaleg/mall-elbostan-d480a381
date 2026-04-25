// Spin & Win attempt history.
// - Local cache: localStorage (works offline / signed-out, last 20 attempts).
// - Cloud sync: when the user is signed in, attempts are mirrored into
//   `public.spin_history` so they survive across browsers and devices.

import { supabase } from "@/integrations/supabase/client";

export type SpinHistoryEntry = {
  id: string;
  at: string; // ISO timestamp
  won: boolean;
  prize_name_ar?: string | null;
  claim_code?: string | null;
  is_grand?: boolean;
  is_visitor?: boolean;
  expires_at?: string | null;
  /** Stable client-generated id used for cloud dedup on merge. */
  client_id?: string;
  /** True once this entry has been mirrored to the cloud for the current user. */
  synced?: boolean;
};

const KEY = "mb_spin_history_v1";
const MAX = 20;

/* ──────────────────────── Local store ──────────────────────── */

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

function writeLocal(items: SpinHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    // ignore quota errors
  }
}

export function clearSpinHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

/* ──────────────────────── Cloud sync ──────────────────────── */

type CloudRow = {
  id: string;
  client_id: string | null;
  created_at: string;
  won: boolean;
  prize_name_ar: string | null;
  claim_code: string | null;
  is_grand: boolean;
  is_visitor: boolean;
  expires_at: string | null;
};

function rowToEntry(r: CloudRow): SpinHistoryEntry {
  return {
    id: r.client_id || r.id,
    at: r.created_at,
    won: r.won,
    prize_name_ar: r.prize_name_ar,
    claim_code: r.claim_code,
    is_grand: r.is_grand,
    is_visitor: r.is_visitor,
    expires_at: r.expires_at,
    client_id: r.client_id || r.id,
    synced: true,
  };
}

async function getUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/** Push a single local entry to the cloud (no-op if not signed in). */
async function pushEntry(userId: string, entry: SpinHistoryEntry): Promise<boolean> {
  const payload = {
    user_id: userId,
    client_id: entry.client_id || entry.id,
    won: entry.won,
    prize_name_ar: entry.prize_name_ar ?? null,
    claim_code: entry.claim_code ?? null,
    is_grand: !!entry.is_grand,
    is_visitor: !!entry.is_visitor,
    expires_at: entry.expires_at ?? null,
    created_at: entry.at,
  };
  const { error } = await supabase
    .from("spin_history")
    .upsert(payload, { onConflict: "user_id,client_id", ignoreDuplicates: true });
  return !error;
}

/**
 * Merge local entries with cloud rows for the signed-in user.
 * - Pulls cloud rows.
 * - Pushes any local entry not yet in cloud.
 * - Returns the merged, de-duplicated, newest-first list and updates local cache.
 */
export async function syncSpinHistory(): Promise<SpinHistoryEntry[]> {
  const userId = await getUserId();
  if (!userId) return getSpinHistory();

  const local = getSpinHistory();

  // 1) Pull cloud
  const { data: cloud } = await supabase
    .from("spin_history")
    .select("id, client_id, created_at, won, prize_name_ar, claim_code, is_grand, is_visitor, expires_at")
    .order("created_at", { ascending: false })
    .limit(MAX);

  const cloudEntries: SpinHistoryEntry[] = (cloud || []).map(rowToEntry);
  const cloudIds = new Set(cloudEntries.map((e) => e.client_id || e.id));

  // 2) Push local-only entries
  const toPush = local.filter((e) => !cloudIds.has(e.client_id || e.id));
  await Promise.all(toPush.map((e) => pushEntry(userId, e)));

  // 3) Merge by client_id, newest-first
  const map = new Map<string, SpinHistoryEntry>();
  for (const e of [...cloudEntries, ...local]) {
    const key = e.client_id || e.id;
    const existing = map.get(key);
    if (!existing || new Date(e.at).getTime() > new Date(existing.at).getTime()) {
      map.set(key, { ...e, client_id: key, synced: cloudIds.has(key) || existing?.synced });
    }
  }
  const merged = Array.from(map.values())
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, MAX);

  writeLocal(merged);
  return merged;
}

/** Add a new attempt — saves locally and (if signed in) mirrors to cloud. */
export async function addSpinHistory(
  entry: Omit<SpinHistoryEntry, "id" | "at" | "client_id" | "synced">,
): Promise<SpinHistoryEntry> {
  const clientId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const full: SpinHistoryEntry = {
    id: clientId,
    client_id: clientId,
    at: new Date().toISOString(),
    synced: false,
    ...entry,
  };

  const next = [full, ...getSpinHistory()].slice(0, MAX);
  writeLocal(next);

  // Cloud mirror (best-effort, non-blocking for the UI).
  try {
    const userId = await getUserId();
    if (userId) {
      const ok = await pushEntry(userId, full);
      if (ok) {
        full.synced = true;
        writeLocal([full, ...getSpinHistory().filter((e) => (e.client_id || e.id) !== clientId)].slice(0, MAX));
      }
    }
  } catch {
    // non-fatal — local copy is already saved
  }

  return full;
}

/** Clear cloud history for the signed-in user (and the local cache). */
export async function clearSpinHistoryEverywhere(): Promise<void> {
  const userId = await getUserId();
  if (userId) {
    await supabase.from("spin_history").delete().eq("user_id", userId);
  }
  clearSpinHistory();
}
