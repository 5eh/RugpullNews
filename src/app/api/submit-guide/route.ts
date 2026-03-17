import { query } from "@/app/lib/db";
import { sanitize, validateEnum, apiError, apiSuccess } from "@/app/lib/security";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/app/lib/rate-limit";

const VALID_CATEGORIES = [
  "Introduction to Scams",
  "Identifying Scams",
  "Exiting Safely",
  "Reporting Scams",
  "Other",
] as const;

const VALID_EXPERIENCE_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All Levels",
] as const;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`submit-guide:${ip}`, RATE_LIMITS.submitGuide);
    if (!allowed) {
      return apiError("Rate limit exceeded. Please try again later.", 429);
    }

    const body = await request.json();

    const title = sanitize(body.title, 200);
    const content = sanitize(body.content, 100000);

    if (!title || !content) {
      return apiError("Title and content are required", 400);
    }

    const author_name = sanitize(body.author_name, 100);
    const category = sanitize(body.category, 50);
    const experience_level = sanitize(body.experience_level, 30);
    const summary = sanitize(body.summary, 500);
    const key_takeaways = sanitize(body.key_takeaways, 5000);
    const sections = sanitize(body.sections, 100000);
    const sources = sanitize(body.sources, 5000);
    const author_credentials = sanitize(body.author_credentials, 500);
    const submitted_at = sanitize(body.submitted_at, 50) || new Date().toISOString();

    if (category) {
      const catError = validateEnum(category, "category", VALID_CATEGORIES);
      if (catError) return apiError(catError.message, 400);
    }

    if (experience_level) {
      const expError = validateEnum(experience_level, "experience_level", VALID_EXPERIENCE_LEVELS);
      if (expError) return apiError(expError.message, 400);
    }

    await query(
      `INSERT INTO user_submissions
        (submission_type, title, content, author_name, category,
         experience_level, summary, key_takeaways, sections,
         sources, author_credentials, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        "guide", title, content, author_name, category,
        experience_level, summary, key_takeaways, sections,
        sources, author_credentials, submitted_at,
      ],
    );

    return apiSuccess(undefined, "Guide submitted for review");
  } catch (error) {
    return apiError("Failed to submit guide", 500, error);
  }
}
