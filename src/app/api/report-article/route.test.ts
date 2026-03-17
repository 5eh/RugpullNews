import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/db", () => ({
  query: vi.fn(),
}));

vi.mock("@/app/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
  getClientIp: vi.fn(() => "1.2.3.4"),
  RATE_LIMITS: { reportArticle: { maxRequests: 5, windowMs: 900000 } },
}));

import { POST } from "./route";
import { query } from "@/app/lib/db";

const mockQuery = vi.mocked(query);

function makeRequest(body: object): Request {
  return new Request("http://localhost/api/report-article", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/report-article", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when article_id missing", async () => {
    const res = await POST(makeRequest({ report_type: "inaccuracy", description: "test" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-integer article_id", async () => {
    const res = await POST(makeRequest({ article_id: "abc", report_type: "inaccuracy", description: "test" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid report_type", async () => {
    const res = await POST(makeRequest({ article_id: 1, report_type: "spam", description: "test" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({
      article_id: 1,
      report_type: "inaccuracy",
      description: "test",
      reporter_email: "not-an-email",
    }));
    expect(res.status).toBe(400);
  });

  it("succeeds with valid data", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1, command: "INSERT", oid: 0, fields: [] });
    const res = await POST(makeRequest({
      article_id: 1,
      report_type: "inaccuracy",
      description: "Something is wrong",
    }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("succeeds with valid email", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1, command: "INSERT", oid: 0, fields: [] });
    const res = await POST(makeRequest({
      article_id: 5,
      report_type: "misleading",
      description: "Misleading content",
      reporter_email: "user@example.com",
    }));
    expect(res.status).toBe(200);
  });

  it("returns 500 on db error", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB error"));
    const res = await POST(makeRequest({
      article_id: 1,
      report_type: "inaccuracy",
      description: "test",
    }));
    expect(res.status).toBe(500);
  });
});
