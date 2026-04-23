/**
 * Wraps a dynamic import with retry logic for resilience against
 * transient network failures or dev-server restarts.
 *
 * After all retries are exhausted, forces a full page reload once
 * (guarded by sessionStorage) to recover from stale module graphs.
 */
export function lazyRetry<T extends { default: unknown }>(
  factory: () => Promise<T>,
  retries = 3,
  delay = 1500,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const attempt = (remaining: number) => {
      factory()
        .then(resolve)
        .catch((err: unknown) => {
          if (remaining > 0) {
            setTimeout(() => attempt(remaining - 1), delay);
          } else {
            // Last resort: reload page once to get a fresh module graph
            const key = "lazyRetryReload";
            if (!sessionStorage.getItem(key)) {
              sessionStorage.setItem(key, "1");
              window.location.reload();
            } else {
              sessionStorage.removeItem(key);
              reject(err);
            }
          }
        });
    };
    attempt(retries);
  });
}
