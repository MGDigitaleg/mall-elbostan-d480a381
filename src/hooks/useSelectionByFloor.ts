import { useCallback, useEffect, useMemo, useState } from "react";
import { allMallUnits, type MallFloorId, type MallUnit } from "@/lib/mallFloorGeometry";

const STORAGE_KEY = "map-selection-by-floor";

type StoredMap = Partial<Record<MallFloorId, string>>;

function loadInitial(): StoredMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StoredMap;
    // Drop any stale entries whose unit no longer exists in the geometry.
    const valid: StoredMap = {};
    for (const [floorId, unitId] of Object.entries(parsed)) {
      if (typeof unitId === "string" && allMallUnits.some((u) => u.id === unitId && u.floor === floorId)) {
        valid[floorId as MallFloorId] = unitId;
      }
    }
    return valid;
  } catch {
    return {};
  }
}

/**
 * Persists a separate selected-unit per floor so users can switch floors
 * without losing context. Returning to a previously visited floor restores
 * the highlighted unit. Selections are persisted to localStorage and survive
 * page refreshes.
 */
export function useSelectionByFloor(currentFloor: MallFloorId) {
  const [selectionByFloor, setSelectionByFloor] = useState<StoredMap>(loadInitial);

  // Persist on every change.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selectionByFloor)); } catch { /* quota */ }
  }, [selectionByFloor]);

  const activeUnit = useMemo<MallUnit | null>(() => {
    const id = selectionByFloor[currentFloor];
    if (!id) return null;
    return allMallUnits.find((u) => u.id === id && u.floor === currentFloor) ?? null;
  }, [selectionByFloor, currentFloor]);

  /**
   * Update the selection. Passing a unit stores it under that unit's own
   * floor (so cross-floor navigation from search/recommendations writes to
   * the correct slot). Passing `null` clears only the current floor.
   */
  const setActiveUnit = useCallback((unit: MallUnit | null) => {
    setSelectionByFloor((prev) => {
      const next = { ...prev };
      if (unit) {
        next[unit.floor] = unit.id;
      } else {
        delete next[currentFloor];
      }
      return next;
    });
  }, [currentFloor]);

  /** Clear the selection for a specific floor (used when a unit is filtered out). */
  const clearFloorSelection = useCallback((floorId: MallFloorId) => {
    setSelectionByFloor((prev) => {
      if (!(floorId in prev)) return prev;
      const next = { ...prev };
      delete next[floorId];
      return next;
    });
  }, []);

  return { activeUnit, setActiveUnit, clearFloorSelection, selectionByFloor };
}
