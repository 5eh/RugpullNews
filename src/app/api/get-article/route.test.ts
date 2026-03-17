import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/app/lib/db", () => ({
  queryOne: vi.fn(),
}));

import { GET } from "./route";
import { queryOne } from "@/app/lib/db";

const mockQueryOne = vi.mocked(queryOne);

function makeRequest(id: string | null): Request {
  const url = id
    ? `http://localhost/api/get-article?id=${id}`
    : "http://localhost/api/get-article";
  return new Request(url);
}

describe("GET /api/get-article", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when id is missing", async () => {
    const res = await GET(makeRequest(null));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("returns 400 when id is not a positive integer", async () => {
    const res = await GET(makeRequest("abc"));
    expect(res.status).toBe(400);
  });

  it("returns 400 for id = 0", async () => {
    const res = await GET(makeRequest("0"));
    expect(res.status).toBe(400);
  });

  it("returns 404 when article not found", async () => {
    mockQueryOne.mockResolvedValueOnce(null);
    const res = await GET(makeRequest("99"));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  it("returns article on success", async () => {
    const article = { id: 1, title: "Test Article", isodate: "2024-01-01" };
    mockQueryOne.mockResolvedValueOnce(article);
    const res = await GET(makeRequest("1"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.article).toEqual(article);
  });

  it("returns 500 on db error", async () => {
    mockQueryOne.mockRejectedValueOnce(new Error("DB down"));
    const res = await GET(makeRequest("1"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
  });
});
