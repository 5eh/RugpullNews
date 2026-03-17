interface RateLimitEntry {
  timestamps: number[];
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const store = new Map<string, RateLimitEntry>();

// Auto-cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    const validTimestamps = entry.timestamps.filter(
      (ts) => now - ts < 60 * 60 * 1000, // Keep entries from the last hour max
    );
    if (validTimestamps.length === 0) {
      store.delete(key);
    } else {
      entry.timestamps = validTimestamps;
    }
  }
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; retryAfterMs: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };

  // Filter to only timestamps within the window
  entry.timestamps = entry.timestamps.filter(
    (ts) => now - ts < config.windowMs,
  );

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = config.windowMs - (now - oldestInWindow);
    return { allowed: false, retryAfterMs };
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return { allowed: true, retryAfterMs: 0 };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

export const RATE_LIMITS = {
  submitPost: { maxRequests: 3, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
  submitGuide: { maxRequests: 2, windowMs: 60 * 60 * 1000 } as RateLimitConfig,
  reportArticle: { maxRequests: 5, windowMs: 15 * 60 * 1000 } as RateLimitConfig,
  getPricesPost: { maxRequests: 10, windowMs: 60 * 1000 } as RateLimitConfig,
  global: { maxRequests: 120, windowMs: 60 * 1000 } as RateLimitConfig,
} as const;
