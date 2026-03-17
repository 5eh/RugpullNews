import { vi } from "vitest";

export const query = vi.fn();
export const queryRows = vi.fn();
export const queryOne = vi.fn();
const pool = { query: vi.fn(), end: vi.fn() };
export default pool;
