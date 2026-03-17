import { describe, it, expect } from "vitest";
import { formatPrice, formatChange } from "./formatters";

describe("formatPrice", () => {
  it("formats price >= 1000 with commas and 2 decimals", () => {
    expect(formatPrice(95432.5)).toBe("$95,432.50");
  });

  it("formats price >= 1 with 2 decimals", () => {
    expect(formatPrice(2.5)).toBe("$2.50");
  });

  it("formats price < 1 with 4 decimals", () => {
    expect(formatPrice(0.0042)).toBe("$0.0042");
  });
});

describe("formatChange", () => {
  it("shows upward arrow for positive change", () => {
    expect(formatChange(2.45)).toBe("↑2.45%");
  });

  it("shows downward arrow for negative change", () => {
    expect(formatChange(-1.23)).toBe("↓1.23%");
  });

  it("shows upward arrow for zero change", () => {
    expect(formatChange(0)).toBe("↑0.00%");
  });
});
