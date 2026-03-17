const ESTIMATED_PIPELINE_SECONDS = 90;

export function estimateProgress(
  status: string,
  processingStartedAt: string | null,
): { progress: number; stage: string } {
  if (status === "pending") {
    return { progress: 5, stage: "queued" };
  }

  if (status === "published" || status === "duplicate") {
    return { progress: 100, stage: "published" };
  }

  if (status === "failed") {
    return { progress: 0, stage: "failed" };
  }

  if (!processingStartedAt) {
    return { progress: 10, stage: "onchain" };
  }

  const elapsed = (Date.now() - new Date(processingStartedAt).getTime()) / 1000;
  const ratio = Math.min(elapsed / ESTIMATED_PIPELINE_SECONDS, 0.95);

  let stage: string;
  if (ratio < 0.3) {
    stage = "onchain";
  } else if (ratio < 0.55) {
    stage = "community";
  } else {
    stage = "ai";
  }

  const progress = Math.round(10 + ratio * 85);

  return { progress, stage };
}
