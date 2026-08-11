interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function setCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    cachedAt: Date.now(),
  };

  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch (err) {
    // localStorage can fail (quota exceeded, private browsing, etc.)
    // Caching is a nice-to-have, not critical — fail silently
    console.warn("Failed to write cache:", err);
  }
}

export function getCache<T>(key: string, ttlMs: number = DEFAULT_TTL_MS): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const isExpired = Date.now() - entry.cachedAt > ttlMs;

    if (isExpired) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (err) {
    console.warn("Failed to read cache:", err);
    return null;
  }
}

export function clearCache(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn("Failed to clear cache:", err);
  }
}
