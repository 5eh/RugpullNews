import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/db", () => ({
  queryOne: vi.fn(),
}));

import { GET } from "./route";
import { queryOne } from "@/app/lib/db";
import type { NextRequest } from "next/server";

const mockQueryOne = vi.mocked(queryOne);

function makeRequest(id: string | null): NextRequest {
  const url = id
    ? `http://localhost/api/submission-status?id=${id}`
    : "http://localhost/api/submission-status";
  return new Request(url) as NextRequest;
}

describe("GET /api/submission-status", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 for missing id", async () => {
    const res = await GET(makeRequest(null));
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-numeric id", async () => {
    const res = await GET(makeRequest("abc"));
    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown submission", async () => {
    mockQueryOne.mockResolvedValueOnce(null);
    const res = await GET(makeRequest("999"));
    expect(res.status).toBe(404);
  });

  it("returns submission data with progress", async () => {
    mockQueryOne.mockResolvedValueOnce({
      id: 1,
      status: "pending",
      contract_address: "0xabc",
      chain: "ethereum",
      processing_started_at: null,
      processing_error: null,
      result_article_id: null,
      submitted_at: new Date().toISOString(),
    });
    const res = await GET(makeRequest("1"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.progress).toBe(5);
    expect(body.stage).toBe("queued");
  });

  it("returns 500 on db error", async () => {
    mockQueryOne.mockRejectedValueOnce(new Error("DB error"));
    const res = await GET(makeRequest("1"));
    expect(res.status).toBe(500);
  });
});
