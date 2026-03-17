import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/db", () => ({
  queryRows: vi.fn(),
}));

import { GET } from "./route";
import { queryRows } from "@/app/lib/db";

const mockQueryRows = vi.mocked(queryRows);

function makeRequest(params = ""): Request {
  return new Request(`http://localhost/api/all-articles${params}`);
}

describe("GET /api/all-articles", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns articles on success", async () => {
    const articles = [{ id: 1, title: "Test" }];
    mockQueryRows.mockResolvedValueOnce(articles);
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.tables[0].sampleData).toEqual(articles);
  });

  it("caps limit at 50", async () => {
    mockQueryRows.mockResolvedValueOnce([]);
    await GET(makeRequest("?limit=200"));
    expect(mockQueryRows).toHaveBeenCalledWith(
      expect.any(String),
      [50, 0],
    );
  });

  it("uses default page 1 and limit 50", async () => {
    mockQueryRows.mockResolvedValueOnce([]);
    await GET(makeRequest());
    expect(mockQueryRows).toHaveBeenCalledWith(
      expect.any(String),
      [50, 0],
    );
  });

  it("returns 500 on db error", async () => {
    mockQueryRows.mockRejectedValueOnce(new Error("DB error"));
    const res = await GET(makeRequest());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});
