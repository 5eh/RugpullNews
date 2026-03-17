export function parseRedFlags(raw: string | null): string[] {
  if (!raw) return [];

  if (typeof raw !== "string") {
    return Array.isArray(raw) ? raw : [];
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // Fall through to newline parsing
    }
  }

  return trimmed
    .split("\n")
    .filter((flag) => flag.trim().length > 0)
    .map((flag) => flag.replace(/^- /, "").trim());
}

export function getRiskLevelClass(level?: string | null): string {
  const base = "text-xs px-2 py-1 rounded font-medium whitespace-nowrap";

  if (!level) return `text-gray-200 bg-gray-800/50 border border-gray-500/30 ${base}`;

  const levelUpper = level.toUpperCase();

  if (levelUpper.includes("HIGH")) {
    return `text-red-300 bg-red-900/20 border border-red-500/30 ${base}`;
  } else if (levelUpper.includes("MEDIUM")) {
    return `text-yellow-300 bg-yellow-900/20 border border-yellow-500/30 ${base}`;
  } else if (levelUpper.includes("LOW")) {
    return `text-green-300 bg-green-900/20 border border-green-500/30 ${base}`;
  }

  return `text-gray-200 bg-gray-800/50 border border-gray-500/30 ${base}`;
}

export function formatArticleDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "Unknown Date";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown Date";
  }
}

export function getRiskColor(level: string = ""): string {
  if (!level) return "text-gray-300";

  const riskLevel = level.toUpperCase();

  if (riskLevel.includes("HIGH")) {
    return "text-red-300 border border-red-500/30";
  } else if (riskLevel.includes("MEDIUM")) {
    return "text-yellow-300 border border-yellow-500/30";
  } else if (riskLevel.includes("LOW")) {
    return "text-green-300 border border-green-500/30";
  }

  return "text-gray-300 border border-gray-500/30";
}
