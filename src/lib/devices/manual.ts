/**
 * Manual (hero) device entries — re-exports the hand-written catalog
 * from the legacy `deviceCatalog.ts` file. These take priority over
 * generated entries on slug collisions.
 */
import { deviceCatalog } from "../deviceCatalog";
import type { DeviceEntry } from "./types";

export const manualCatalog: Record<string, DeviceEntry> = deviceCatalog as unknown as Record<string, DeviceEntry>;
