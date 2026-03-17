import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/db", () => ({
  query: vi.fn(),
}));

vi.mock("@/app/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
  getClientIp: vi.fn(() => "1.2.3.4"),
  RATE_LIMITS: { submitGuide: { maxRequests: 2, windowMs: 3600000 } },
}));

import { POST } from "./route";
import { query } from "@/app/lib/db";

const mockQuery = vi.mocked(query);

function makeRequest(body: object, ip = "1.2.3.4"): Request {
  return new Request("http://localhost/api/submit-guide", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  title: "How to Identify Rug Pulls",
  content: "A comprehensive guide...",
  author_name: "Alice",
  category: "Identifying Scams",
  experience_level: "Beginner",
};

describe("POST /api/submit-guide", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when title missing", async () => {
    const res = await POST(makeRequest({ content: "some content" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when content missing", async () => {
    const res = await POST(makeRequest({ title: "Some Title" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid category", async () => {
    const res = await POST(makeRequest({ ...validBody, category: "Hacking" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid experience_level", async () => {
    const res = await POST(makeRequest({ ...validBody, experience_level: "Expert" }));
    expect(res.status).toBe(400);
  });

  it("succeeds with valid data", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1, command: "INSERT", oid: 0, fields: [] });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("returns 500 on db error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB error"));
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(500);
  });
});
