import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/db", () => ({
  query: vi.fn(),
  queryOne: vi.fn(),
}));

vi.mock("@/app/lib/rate-limit", () => ({
  checkRateLimit: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
  getClientIp: vi.fn(() => "1.2.3.4"),
  RATE_LIMITS: { submitPost: { maxRequests: 3, windowMs: 3600000 } },
}));

import { POST } from "./route";
import { query, queryOne } from "@/app/lib/db";

const mockQuery = vi.mocked(query);
const mockQueryOne = vi.mocked(queryOne);

function makeRequest(body: object, ip = "127.0.0.1"): Request {
  return new Request("http://localhost/api/submit-post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/submit-post — legacy post", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when title missing", async () => {
    const res = await POST(makeRequest({ content: "some content" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when content missing", async () => {
    const res = await POST(makeRequest({ title: "Some Title" }));
    expect(res.status).toBe(400);
  });

  it("succeeds with title and content", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1, command: "INSERT", oid: 0, fields: [] });
    const res = await POST(makeRequest({ title: "Test Post", content: "Some content here" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});

describe("POST /api/submit-post — investigation", () => {
  beforeEach(() => vi.clearAllMocks());

  const validInvestigation = {
    contract_address: "0x1234567890123456789012345678901234abcdef",
    chain: "ethereum",
    user_analysis: "Looks suspicious",
  };

  it("returns 400 for invalid contract address", async () => {
    const res = await POST(makeRequest({ contract_address: "notanaddress", chain: "ethereum" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid chain", async () => {
    const res = await POST(makeRequest({ ...validInvestigation, chain: "solana" }));
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited by IP", async () => {
    // Simulate recent submission from same IP
    mockQueryOne.mockResolvedValueOnce({ id: 5 }); // recentSubmission found
    const res = await POST(makeRequest(validInvestigation, "1.2.3.4"));
    expect(res.status).toBe(429);
  });

  it("returns existing article id if address already investigated", async () => {
    mockQueryOne
      .mockResolvedValueOnce(null) // no recent submission
      .mockResolvedValueOnce({ id: 100 }); // existing article
    const res = await POST(makeRequest(validInvestigation, "5.6.7.8"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.existing_article_id).toBe(100);
  });

  it("returns submission_id for in-progress investigation", async () => {
    mockQueryOne
      .mockResolvedValueOnce(null)  // no recent submission
      .mockResolvedValueOnce(null)  // no existing article
      .mockResolvedValueOnce({ id: 42 }); // in-progress found
    const res = await POST(makeRequest(validInvestigation, "9.9.9.9"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.submission_id).toBe(42);
  });

  it("creates new submission for valid new investigation", async () => {
    mockQueryOne
      .mockResolvedValueOnce(null)  // no recent submission
      .mockResolvedValueOnce(null)  // no existing article
      .mockResolvedValueOnce(null); // no in-progress
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 99 }], rowCount: 1, command: "INSERT", oid: 0, fields: [] });
    const res = await POST(makeRequest(validInvestigation, "10.0.0.1"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.submission_id).toBe(99);
  });
});
