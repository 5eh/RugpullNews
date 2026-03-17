import { describe, it, expect } from "vitest";
import { parseRedFlags, getRiskLevelClass, formatArticleDate, getRiskColor } from "./utils";

describe("parseRedFlags", () => {
  it("returns empty array for null", () => {
    expect(parseRedFlags(null)).toEqual([]);
  });

  it("parses JSON array string", () => {
    const input = '["flag one", "flag two"]';
    expect(parseRedFlags(input)).toEqual(["flag one", "flag two"]);
  });

  it("parses newline-separated string", () => {
    const input = "flag one\nflag two\n- flag three";
    expect(parseRedFlags(input)).toEqual(["flag one", "flag two", "flag three"]);
  });

  it("returns empty array for empty string", () => {
    expect(parseRedFlags("")).toEqual([]);
  });

  it("handles malformed JSON by falling back to newline split", () => {
    const input = "[not valid json\nflag two";
    const result = parseRedFlags(input);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("getRiskLevelClass", () => {
  it("returns red classes for HIGH RISK", () => {
    const cls = getRiskLevelClass("HIGH RISK");
    expect(cls).toContain("text-red-300");
  });

  it("returns yellow classes for MEDIUM RISK", () => {
    const cls = getRiskLevelClass("MEDIUM RISK");
    expect(cls).toContain("text-yellow-300");
  });

  it("returns green classes for LOW RISK", () => {
    const cls = getRiskLevelClass("LOW RISK");
    expect(cls).toContain("text-green-300");
  });

  it("returns gray classes for null", () => {
    const cls = getRiskLevelClass(null);
    expect(cls).toContain("text-gray-200");
  });

  it("returns gray classes for unknown level", () => {
    const cls = getRiskLevelClass("UNKNOWN");
    expect(cls).toContain("text-gray-200");
  });
});

describe("formatArticleDate", () => {
  it("formats a valid ISO date", () => {
    const result = formatArticleDate("2024-01-15T00:00:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("2024");
  });

  it("returns Unknown Date for invalid input", () => {
    const result = formatArticleDate("not-a-date");
    expect(result).toBe("Unknown Date");
  });
});

describe("getRiskColor", () => {
  it("returns red class for HIGH RISK", () => {
    expect(getRiskColor("HIGH RISK")).toContain("text-red-300");
  });

  it("returns yellow class for MEDIUM", () => {
    expect(getRiskColor("MEDIUM")).toContain("text-yellow-300");
  });

  it("returns green class for LOW", () => {
    expect(getRiskColor("LOW")).toContain("text-green-300");
  });

  it("returns gray for empty string", () => {
    expect(getRiskColor("")).toBe("text-gray-300");
  });
});
