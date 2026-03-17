import { MetadataRoute } from "next";
import { queryRows } from "@/app/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rugpullnews.org";

interface ArticleRow {
  id: number;
  isodate: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/education`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/education/identify-scams`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/education/exit-scams`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/education/report-scams`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/submit-post`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/sponsors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  let articlePages: MetadataRoute.Sitemap = [];

  try {
    const articles = await queryRows<ArticleRow>(
      `SELECT id, isodate FROM articles WHERE published = true ORDER BY isodate DESC`,
    );

    articlePages = articles.map((article) => ({
      url: `${SITE_URL}/article/${article.id}`,
      lastModified: new Date(article.isodate),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
  } catch (err) {
    console.error("Sitemap: failed to fetch articles", err);
  }

  return [...staticPages, ...articlePages];
}
