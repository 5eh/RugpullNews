import { queryOne } from "@/app/lib/db";
import { Article } from "@/app/lib/types";
import { apiError, validateNumericId } from "@/app/lib/security";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawId = searchParams.get("id");

  const result = validateNumericId(rawId, "id");
  if (result.error) {
    return apiError("Valid article ID is required", 400);
  }

  try {
    const article = await queryOne<Article>(
      `SELECT id, creator, title, link, pubdate, dc_creator, content,
              contentsnippet, guid, isodate, risk_level, rugpull_score,
              red_flags, our_analysis, summary_analysis, banner_image,
              article_type, investigated_address, investigated_chain, price_drop_pct
       FROM articles
       WHERE id = $1 AND published = true`,
      [result.parsed],
    );

    if (!article) {
      return apiError("Article not found", 404);
    }

    return Response.json(
      { success: true, article },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      },
    );
  } catch (error) {
    return apiError("Failed to fetch article", 500, error);
  }
}
