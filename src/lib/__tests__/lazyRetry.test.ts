import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { lazyRetry } from "@/lib/lazyRetry";

describe("lazyRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves immediately when the import succeeds on first try", async () => {
    const mod = { default: () => "ok" };
    const factory = vi.fn().mockResolvedValue(mod);

    const result = lazyRetry(factory, 2, 100);
    await expect(result).resolves.toBe(mod);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("retries on failure and resolves when a subsequent attempt succeeds", async () => {
    const mod = { default: () => "ok" };
    const factory = vi
      .fn()
      .mockRejectedValueOnce(new Error("network error"))
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValue(mod);

    const promise = lazyRetry(factory, 3, 50);

    // Advance through retry delays
    await vi.advanceTimersByTimeAsync(50);
    await vi.advanceTimersByTimeAsync(50);

    await expect(promise).resolves.toBe(mod);
    expect(factory).toHaveBeenCalledTimes(3);
  });

  it("rejects after all retries are exhausted and reload already happened", async () => {
    // Simulate that reload already happened once
    sessionStorage.setItem("lazyRetryReload", "1");

    const err = new Error("Failed to fetch dynamically imported module");
    const factory = vi.fn().mockRejectedValue(err);

    const promise = lazyRetry(factory, 0, 50);

    await expect(promise).rejects.toThrow("Failed to fetch dynamically imported module");
    expect(factory).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem("lazyRetryReload")).toBeNull();
  });
});
