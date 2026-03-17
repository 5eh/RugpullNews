import { queryRows } from "@/app/lib/db";
import { Article } from "@/app/lib/types";
import { apiError, validateNumericId } from "@/app/lib/security";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawPage = searchParams.get("page") ?? "1";
    const rawLimit = searchParams.get("limit") ?? "50";

    const pageResult = validateNumericId(rawPage, "page");
    const page = pageResult.error ? 1 : pageResult.parsed;

    const limitResult = validateNumericId(rawLimit, "limit");
    let limit = limitResult.error ? 50 : limitResult.parsed;
    if (limit > 50) limit = 50;

    const offset = (page - 1) * limit;

    const articles = await queryRows<Article>(
      `SELECT id, creator, title, link, pubdate, dc_creator, content,
              contentsnippet, guid, isodate, risk_level, rugpull_score,
              red_flags, our_analysis, summary_analysis, banner_image,
              article_type, investigated_address, investigated_chain, price_drop_pct
       FROM articles
       WHERE published = true
       ORDER BY isodate DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    return Response.json(
      {
        success: true,
        tables: [
          {
            name: "rugpull_context",
            sampleData: articles,
          },
        ],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
        },
      },
    );
  } catch (error) {
    return apiError("Failed to fetch articles", 500, error);
  }
}
