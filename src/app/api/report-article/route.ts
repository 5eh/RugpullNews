import { query } from "@/app/lib/db";
import { sanitize, validateNumericId, validateEnum, isValidEmail, apiError, apiSuccess } from "@/app/lib/security";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/app/lib/rate-limit";

const VALID_REPORT_TYPES = [
  "inaccuracy",
  "misleading",
  "outdated",
  "missing_context",
  "other",
] as const;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`report:${ip}`, RATE_LIMITS.reportArticle);
    if (!allowed) {
      return apiError("Rate limit exceeded. Please try again later.", 429);
    }

    const body = await request.json();

    const idResult = validateNumericId(body.article_id, "article_id");
    if (idResult.error) {
      return apiError("Valid article_id is required", 400);
    }

    const report_type = sanitize(body.report_type, 30);
    const description = sanitize(body.description, 2000);
    const reporter_email = sanitize(body.reporter_email, 254);

    if (!report_type || !description) {
      return apiError("report_type and description are required", 400);
    }

    const typeError = validateEnum(report_type, "report_type", VALID_REPORT_TYPES);
    if (typeError) return apiError(typeError.message, 400);

    if (reporter_email && !isValidEmail(reporter_email)) {
      return apiError("Invalid email format", 400);
    }

    await query(
      `INSERT INTO article_reports (article_id, report_type, description, reporter_email)
       VALUES ($1, $2, $3, $4)`,
      [idResult.parsed, report_type, description, reporter_email || null],
    );

    return apiSuccess(undefined, "Report submitted. Thank you for helping us stay accurate.");
  } catch (error) {
    return apiError("Failed to submit report", 500, error);
  }
}
