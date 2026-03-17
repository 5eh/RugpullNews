// --- Sanitization ---

const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch]);
}

export function sanitize(value: unknown, maxLength: number): string {
  if (value === null || value === undefined) return "";
  const str = String(value).trim();
  if (str.length === 0) return "";
  return str.slice(0, maxLength);
}

// --- Validation ---

export interface ValidationError {
  field: string;
  message: string;
}

export function validateRequired(
  fields: Record<string, unknown>,
  requiredKeys: string[],
): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const key of requiredKeys) {
    const val = fields[key];
    if (val === null || val === undefined || String(val).trim() === "") {
      errors.push({ field: key, message: `${key} is required` });
    }
  }
  return errors;
}

export function validateEnum(
  value: unknown,
  field: string,
  allowed: readonly string[],
): ValidationError | null {
  if (!allowed.includes(String(value))) {
    return { field, message: `${field} must be one of: ${allowed.join(", ")}` };
  }
  return null;
}

export function validateNumericId(
  value: unknown,
  field: string,
): { parsed: number; error: null } | { parsed: null; error: ValidationError } {
  const num = Number(value);
  if (!value || isNaN(num) || !Number.isInteger(num) || num < 1) {
    return {
      parsed: null,
      error: { field, message: `${field} must be a positive integer` },
    };
  }
  return { parsed: num, error: null };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- API Response Helpers ---

export function apiError(
  userMessage: string,
  status: number,
  internalError?: unknown,
): Response {
  if (internalError) {
    console.error(`[API Error ${status}]`, internalError);
  }
  return Response.json({ success: false, error: userMessage }, { status });
}

export function apiSuccess(data?: Record<string, unknown>, message?: string): Response {
  return Response.json({ success: true, ...data, ...(message ? { message } : {}) });
}
