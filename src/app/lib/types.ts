export interface Article {
  id: number;
  creator: string | null;
  title: string;
  link: string;
  pubdate: string | null;
  dc_creator: string | null;
  content: string | null;
  contentsnippet: string | null;
  guid: string;
  isodate: string;
  risk_level: string | null;
  rugpull_score: number | null;
  red_flags: string | null;
  our_analysis: string | null;
  summary_analysis: string | null;
  banner_image: string | null;
  article_type: string | null;
  investigated_address: string | null;
  investigated_chain: string | null;
  price_drop_pct: number | null;
}

export interface AllArticlesResponse {
  success: boolean;
  tables?: Array<{
    name: string;
    sampleData: Article[];
  }>;
  error?: string;
}

export interface GetArticleResponse {
  success: boolean;
  article?: Article;
  error?: string;
}

export interface UserSubmission {
  id: number;
  submission_type: "post" | "guide" | "investigation";
  title: string;
  content: string;
  creator?: string;
  link?: string;
  contentsnippet?: string;
  risk_level?: string;
  rugpull_score?: number;
  red_flags?: string;
  our_analysis?: string;
  summary_analysis?: string;
  banner_image?: string;
  isodate?: string;
  author_name?: string;
  category?: string;
  experience_level?: string;
  summary?: string;
  key_takeaways?: string;
  sections?: string;
  sources?: string;
  author_credentials?: string;
  contract_address?: string;
  chain?: string;
  user_analysis?: string;
  processing_error?: string;
  result_article_id?: number;
  status: "pending" | "processing" | "published" | "failed" | "duplicate" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at?: string;
  created_at: string;
}

export interface SubmissionStatusResponse {
  success: boolean;
  id?: number;
  status?: string;
  progress?: number;
  stage?: string;
  contract_address?: string;
  chain?: string;
  article_id?: number | null;
  error?: string;
  submitted_at?: string;
}
