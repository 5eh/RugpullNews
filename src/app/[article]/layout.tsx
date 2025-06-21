import type { Metadata } from "next";

// Define the Layout Props interface with params as a Promise
interface ArticleLayoutProps {
  params: Promise<{
    article: string;
  }>;
  children: React.ReactNode;
}

// Generate metadata for the article page
export async function generateMetadata(
  props: ArticleLayoutProps,
): Promise<Metadata> {
  try {
    // Await the params object to get the article ID
    const resolvedParams = await props.params;
    const articleId = resolvedParams.article;

    // Fetch article data from API
    const isLocalDev = process.env.NODE_ENV === "development";
    const apiUrl = isLocalDev
      ? `http://localhost:3000/api/get-article?id=${articleId}`
      : `https://rugpullnews.org/api/get-article?id=${articleId}`;

    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return {
        title: "Article Not Found | Rug Pull News",
        description: "The requested article could not be found.",
      };
    }

    const data = await response.json();

    if (!data.success || !data.article) {
      return {
        title: "Article Not Found | Rug Pull News",
        description: "The requested article could not be found.",
      };
    }

    const article = data.article;

    // Create risk level text for SEO
    const riskText = article.risk_level
      ? `Risk Level: ${article.risk_level} | Rug Pull Score: ${article.rugpull_score}/10`
      : "";

    // Create description from content snippet or analysis
    const description =
      article.contentsnippet ||
      (article.our_analysis && article.our_analysis.substring(0, 155)) ||
      (article.summary_analysis &&
        article.summary_analysis.substring(0, 155)) ||
      "Crypto project risk analysis by Rug Pull News";

    // Generate keywords from title and red flags
    const redFlagsArray = article.red_flags
      ? article.red_flags
          .split("\n")
          .filter((flag: string) => flag.trim().length > 0)
          .map((flag: string) => flag.replace(/^- /, "").trim())
      : [];

    const keywords = [
      "crypto",
      "blockchain",
      "rugpull",
      "scam alert",
      "cryptocurrency",
      ...article.title.split(" ").filter((word: string) => word.length > 3),
      ...redFlagsArray
        .slice(0, 5)
        .flatMap((flag: string) =>
          flag.split(" ").filter((word: string) => word.length > 3),
        ),
    ]
      .slice(0, 20)
      .join(", ");

    // Format date for metadata
    const formattedDate = article.isodate
      ? new Date(article.isodate).toISOString()
      : new Date().toISOString();

    // Construct full URL for article
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://rugpullnews.org";
    const articleUrl = `${siteUrl}/${articleId}`;

    // Create metadata base URL safely
    let metadataBaseUrl;
    try {
      metadataBaseUrl = new URL(siteUrl);
    } catch {
      metadataBaseUrl = new URL("https://rugpullnews.org");
    }

    return {
      title: `${article.title} | ${riskText} | Rug Pull News`,
      description: description,
      keywords: keywords,
      authors: [{ name: article.creator || "Rug Pull News" }],
      publisher: "Rug Pull News",
      openGraph: {
        title: article.title,
        description: description,
        url: articleUrl,
        siteName: "Rug Pull News",
        images: article.banner_image ? [{ url: article.banner_image }] : [],
        locale: "en_US",
        type: "article",
        publishedTime: formattedDate,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: description,
        images: article.banner_image ? [article.banner_image] : [],
        creator: "@rugpullnews",
        site: "@rugpullnews",
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
  } catch {
    // Fallback metadata if fetch fails
    return {
      title: "Rug Pull News | Crypto Project Analysis",
      description:
        "Get yourself educated on Web3 scams, let's make this wild west safer.",
    };
  }
}

export default async function ArticleLayout(props: ArticleLayoutProps) {
  // We don't need to use the params in the actual layout component
  // But we need to await them to match the type
  await props.params;

  return <>{props.children}</>;
}
