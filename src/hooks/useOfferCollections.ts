import { useCallback, useEffect, useState } from "react";

/**
 * Local-only collections for offers (favorites + compare list).
 * Stored in localStorage, synced across tabs via the `storage` event.
 */

const FAV_KEY = "mall:offer-favorites";
const CMP_KEY = "mall:offer-compare";
export const COMPARE_MAX = 4;

function readSet(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeSet(key: string, ids: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
    // Same-tab notification (storage event only fires on other tabs)
    window.dispatchEvent(new CustomEvent("mall:offer-collections-changed", { detail: { key } }));
  } catch {
    /* ignore */
  }
}

export function useOfferCollections() {
  const [favorites, setFavorites] = useState<string[]>(() => readSet(FAV_KEY));
  const [compare, setCompare] = useState<string[]>(() => readSet(CMP_KEY));

  useEffect(() => {
    const sync = () => {
      setFavorites(readSet(FAV_KEY));
      setCompare(readSet(CMP_KEY));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("mall:offer-collections-changed", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("mall:offer-collections-changed", sync as EventListener);
    };
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    const next = readSet(FAV_KEY);
    const idx = next.indexOf(id);
    if (idx >= 0) next.splice(idx, 1);
    else next.unshift(id);
    writeSet(FAV_KEY, next);
    setFavorites(next);
  }, []);

  const toggleCompare = useCallback((id: string): { ok: boolean; reason?: "limit" } => {
    const next = readSet(CMP_KEY);
    const idx = next.indexOf(id);
    if (idx >= 0) {
      next.splice(idx, 1);
    } else {
      if (next.length >= COMPARE_MAX) return { ok: false, reason: "limit" };
      next.push(id);
    }
    writeSet(CMP_KEY, next);
    setCompare(next);
    return { ok: true };
  }, []);

  const clearFavorites = useCallback(() => {
    writeSet(FAV_KEY, []);
    setFavorites([]);
  }, []);

  const clearCompare = useCallback(() => {
    writeSet(CMP_KEY, []);
    setCompare([]);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);
  const isCompared = useCallback((id: string) => compare.includes(id), [compare]);

  return {
    favorites,
    compare,
    isFavorite,
    isCompared,
    toggleFavorite,
    toggleCompare,
    clearFavorites,
    clearCompare,
  };
}
