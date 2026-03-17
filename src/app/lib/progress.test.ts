import { describe, it, expect } from "vitest";
import { estimateProgress } from "./progress";

describe("estimateProgress", () => {
  it("returns 5% for pending status", () => {
    const result = estimateProgress("pending", null);
    expect(result.progress).toBe(5);
    expect(result.stage).toBe("queued");
  });

  it("returns 100% for published status", () => {
    const result = estimateProgress("published", null);
    expect(result.progress).toBe(100);
    expect(result.stage).toBe("published");
  });

  it("returns 100% for duplicate status", () => {
    const result = estimateProgress("duplicate", null);
    expect(result.progress).toBe(100);
  });

  it("returns 0% for failed status", () => {
    const result = estimateProgress("failed", null);
    expect(result.progress).toBe(0);
    expect(result.stage).toBe("failed");
  });

  it("returns 10% for processing with no start time", () => {
    const result = estimateProgress("processing", null);
    expect(result.progress).toBe(10);
    expect(result.stage).toBe("onchain");
  });

  it("returns onchain stage at start of processing", () => {
    const now = new Date().toISOString();
    const result = estimateProgress("processing", now);
    expect(result.stage).toBe("onchain");
    expect(result.progress).toBeGreaterThanOrEqual(10);
    expect(result.progress).toBeLessThan(100);
  });

  it("returns ai stage near end of pipeline", () => {
    // Started 80 seconds ago (just past the 55% mark of 90s pipeline)
    const started = new Date(Date.now() - 80_000).toISOString();
    const result = estimateProgress("processing", started);
    expect(result.stage).toBe("ai");
  });

  it("caps progress at 95 for long-running processing", () => {
    // Started 10 minutes ago
    const started = new Date(Date.now() - 600_000).toISOString();
    const result = estimateProgress("processing", started);
    expect(result.progress).toBeLessThanOrEqual(95);
  });
});
