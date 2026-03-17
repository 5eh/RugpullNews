import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https://images.unsplash.com https://www.ccn.com https://crypto.news; " +
    "media-src 'self'; " +
    "connect-src 'self' https://va.vercel-scripts.com; " +
    "frame-ancestors 'none';",
};

// Simple in-middleware rate limit using a Map (resets on cold start, which is fine for edge safety net)
const ipHits = new Map<string, { count: number; windowStart: number }>();
const GLOBAL_LIMIT = 120;
const GLOBAL_WINDOW_MS = 60_000;
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function pruneStaleEntries(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [ip, entry] of ipHits) {
    if (now - entry.windowStart > GLOBAL_WINDOW_MS) {
      ipHits.delete(ip);
    }
  }
}

function isGlobalRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneStaleEntries(now);

  const entry = ipHits.get(ip);

  if (!entry || now - entry.windowStart > GLOBAL_WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  if (entry.count > GLOBAL_LIMIT) {
    return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isGlobalRateLimited(ip)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const response = NextResponse.next();

  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|Logo.mp4).*)",
  ],
};
