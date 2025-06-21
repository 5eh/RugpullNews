import type { Metadata } from "next";

interface ArticleData {
  id: number;
  creator: string;
  title: string;
  link: string;
  isodate: string;
  content: string;
  contentsnippet: string;
  risk_level: string;
  rugpull_score: number;
  red_flags: string;
  our_analysis: string;
  summary_analysis: string;
  banner_image: string;
}

interface ProcessedArticleData {
  id: string;
  title: string;
  creator: string;
  publishDate: string;
  originalLink: string;
  content: string;
  contentSnippet: string;
  riskLevel: string;
  rugPullScore: number;
  redFlags: string[];
  analysis: string;
  bannerImage?: string;
}

// Define the layout props interface
interface ArticleLayoutProps {
  params: { article: string };
  children: React.ReactNode;
}

// No direct database connection in layout component

// Function to fetch article data from the API
async function fetchArticleData(
  id: string,
): Promise<ProcessedArticleData | null> {
  try {
    const isLocalDev = process.env.NODE_ENV === "development";
    const apiUrl = isLocalDev
      ? `http://localhost:3000/api/get-article?id=${id}`
      : `https://rugpullnews.org/api/get-article?id=${id}`;

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article data: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.article) {
      throw new Error("Article data not found");
    }

    const rawArticle: ArticleData = data.article;

    // Parse red flags from string to array
    const redFlags = rawArticle.red_flags
      ? rawArticle.red_flags
          .split("\n")
          .filter((flag) => flag.trim().length > 0)
          .map((flag) => flag.replace(/^- /, "").trim())
      : [];

    return {
      id: rawArticle.id.toString(),
      title: rawArticle.title,
      creator: rawArticle.creator || "Unknown or Anon",
      publishDate: rawArticle.isodate,
      originalLink: rawArticle.link,
      content: rawArticle.content || rawArticle.contentsnippet || "",
      contentSnippet: rawArticle.contentsnippet || "",
      riskLevel: rawArticle.risk_level || "TBD",
      rugPullScore: rawArticle.rugpull_score || 0,
      redFlags,
      analysis: rawArticle.our_analysis || rawArticle.summary_analysis || "",
      bannerImage: rawArticle.banner_image,
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Generate metadata for the article page
export async function generateMetadata({
  params,
}: ArticleLayoutProps): Promise<Metadata> {
  // Get the article ID from the URL parameters
  const articleId = params.article;

  // Fetch article data
  const articleData = await fetchArticleData(articleId);

  // If no article data, return default metadata
  if (!articleData) {
    return {
      title: "Article Not Found | Rug Pull News",
      description: "The requested article could not be found.",
    };
  }

  // Create risk level text for SEO
  const riskText = articleData.riskLevel
    ? `Risk Level: ${articleData.riskLevel} | Rug Pull Score: ${articleData.rugPullScore}/10`
    : "";

  // Create description from content snippet or analysis
  const description =
    articleData.contentSnippet || articleData.analysis?.substring(0, 155) || "";

  // Generate keywords from title and red flags
  const keywords = [
    "crypto",
    "blockchain",
    "rugpull",
    "scam alert",
    "cryptocurrency",
    ...articleData.title.split(" ").filter((word) => word.length > 3),
    ...articleData.redFlags
      .slice(0, 5)
      .flatMap((flag) => flag.split(" ").filter((word) => word.length > 3)),
  ]
    .slice(0, 20)
    .join(", ");

  // Format date for metadata
  const formattedDate = new Date(articleData.publishDate).toISOString();

  // Use formatted date in OpenGraph metadata

  // Construct full URL for article
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rugpullnews.org";
  const articleUrl = `${siteUrl}/${articleId}`;

  // Create metadata base URL safely
  let metadataBaseUrl;
  try {
    metadataBaseUrl = new URL(siteUrl);
  } catch {
    metadataBaseUrl = new URL("https://rugpullnews.org");
  }

  return {
    title: `${articleData.title} | ${riskText} | Rug Pull News`,
    description: description,
    keywords: keywords,
    authors: [{ name: articleData.creator }],
    publisher: "Rug Pull News",
    openGraph: {
      title: articleData.title,
      description: description,
      url: articleUrl,
      siteName: "Rug Pull News",
      images: articleData.bannerImage ? [{ url: articleData.bannerImage }] : [],
      locale: "en_US",
      type: "article",
      publishedTime: formattedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: articleData.title,
      description: description,
      images: articleData.bannerImage ? [articleData.bannerImage] : [],
      creator: "@arthurlabsdao",
      site: "@arthurlabsdao",
    },
    alternates: {
      canonical: articleUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: metadataBaseUrl,
  };
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  return <>{children}</>;
}
