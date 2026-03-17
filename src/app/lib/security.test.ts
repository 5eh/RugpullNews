import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  sanitize,
  validateRequired,
  validateEnum,
  validateNumericId,
  isValidEmail,
} from "./security";

describe("escapeHtml", () => {
  it("escapes & < > \" '", () => {
    expect(escapeHtml('a & b < c > d "e" \'f\'')).toBe(
      "a &amp; b &lt; c &gt; d &quot;e&quot; &#x27;f&#x27;"
    );
  });

  it("returns unchanged string when no special chars", () => {
    expect(escapeHtml("hello world")).toBe("hello world");
  });
});

describe("sanitize", () => {
  it("trims whitespace", () => {
    expect(sanitize("  <script>  ", 100)).toBe("<script>");
  });

  it("caps at maxLength", () => {
    expect(sanitize("hello world", 5)).toBe("hello");
  });

  it("returns empty string for null", () => {
    expect(sanitize(null, 100)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitize(undefined, 100)).toBe("");
  });
});

describe("validateRequired", () => {
  it("returns no errors when all fields present", () => {
    const errors = validateRequired({ name: "Alice", age: 25 }, ["name", "age"]);
    expect(errors).toHaveLength(0);
  });

  it("returns error for missing field", () => {
    const errors = validateRequired({ name: "" }, ["name"]);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("name");
  });

  it("returns error for null field", () => {
    const errors = validateRequired({ name: null }, ["name"]);
    expect(errors).toHaveLength(1);
  });
});

describe("validateEnum", () => {
  const allowed = ["a", "b", "c"] as const;

  it("returns null for valid value", () => {
    expect(validateEnum("a", "field", allowed)).toBeNull();
  });

  it("returns error for invalid value", () => {
    const err = validateEnum("d", "field", allowed);
    expect(err).not.toBeNull();
    expect(err?.field).toBe("field");
  });
});

describe("validateNumericId", () => {
  it("parses valid positive integer", () => {
    const result = validateNumericId("42", "id");
    expect(result.error).toBeNull();
    expect(result.parsed).toBe(42);
  });

  it("rejects zero", () => {
    const result = validateNumericId("0", "id");
    expect(result.parsed).toBeNull();
    expect(result.error).not.toBeNull();
  });

  it("rejects negative number", () => {
    const result = validateNumericId("-1", "id");
    expect(result.parsed).toBeNull();
  });

  it("rejects non-numeric string", () => {
    const result = validateNumericId("abc", "id");
    expect(result.parsed).toBeNull();
  });

  it("rejects null", () => {
    const result = validateNumericId(null, "id");
    expect(result.parsed).toBeNull();
  });
});

describe("isValidEmail", () => {
  it("accepts valid email", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("accepts subdomain email", () => {
    expect(isValidEmail("user@mail.example.co.uk")).toBe(true);
  });

  it("rejects missing @", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("rejects missing domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects spaces", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
  });
});
