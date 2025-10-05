import { NextResponse } from "next/server";

interface Article {
  id: number;
  creator: string;
  title: string;
  link: string;
  pubdate: string;
  dc_creator: string;
  content: string;
  contentsnippet: string;
  guid: string;
  isodate: string;
  risk_level: string | null;
  rugpull_score: number;
  red_flags: string | null;
  our_analysis: string | null;
  summary_analysis: string | null;
  banner_image: string | null;
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Article ID is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      "https://n8n.arthurlabs.boxgeist.com/webhook/get-articles",
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status}`);
    }

    const articles: Article[] = await response.json();

    const article = articles.find((a) => String(a.id) === id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
