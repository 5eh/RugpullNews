import { NextRequest } from "next/server";
import { queryOne } from "@/app/lib/db";
import { apiError, validateNumericId } from "@/app/lib/security";

interface SubmissionRow {
  id: number;
  status: string;
  contract_address: string;
  chain: string;
  processing_started_at: string | null;
  processing_error: string | null;
  result_article_id: number | null;
  submitted_at: string;
}

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

  // status === "processing" — estimate from elapsed time
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get("id");

    const result = validateNumericId(rawId, "id");
    if (result.error) {
      return apiError("Valid submission ID is required", 400);
    }

    const submission = await queryOne<SubmissionRow>(
      `SELECT id, status, contract_address, chain,
              processing_started_at, processing_error,
              result_article_id, submitted_at
       FROM user_submissions
       WHERE id = $1 AND submission_type = 'investigation'`,
      [result.parsed],
    );

    if (!submission) {
      return apiError("Submission not found", 404);
    }

    const { progress, stage } = estimateProgress(
      submission.status,
      submission.processing_started_at,
    );

    return Response.json(
      {
        success: true,
        id: submission.id,
        status: submission.status,
        progress,
        stage,
        contract_address: submission.contract_address,
        chain: submission.chain,
        article_id: submission.result_article_id,
        error: submission.processing_error,
        submitted_at: submission.submitted_at,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=5",
        },
      },
    );
  } catch (error) {
    return apiError("Failed to fetch submission status", 500, error);
  }
}
