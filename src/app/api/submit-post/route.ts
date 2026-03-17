import { query, queryOne } from "@/app/lib/db";
import { sanitize, apiError, apiSuccess } from "@/app/lib/security";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/app/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Route: if contract_address is present, handle as investigation
    if (body.contract_address) {
      return handleInvestigation(body, request);
    }

    // Legacy post submission — rate-limit this path too
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`submit-post:${ip}`, RATE_LIMITS.submitPost);
    if (!allowed) {
      return apiError("Rate limit exceeded. Please try again later.", 429);
    }

    return handleLegacyPost(body);
  } catch (error) {
    return apiError("Failed to process submission", 500, error);
  }
}

async function handleLegacyPost(body: Record<string, unknown>) {
  const title = sanitize(body.title, 300);
  const content = sanitize(body.content, 50000);

  if (!title || !content) {
    return apiError("Title and content are required", 400);
  }

  const creator = sanitize(body.creator, 100);
  const link = sanitize(body.link, 2000);
  const contentsnippet = sanitize(body.contentsnippet, 500);
  const risk_level = sanitize(body.risk_level, 50);
  const rugpull_score = Number(body.rugpull_score) || 0;
  const red_flags = sanitize(body.red_flags, 5000);
  const our_analysis = sanitize(body.our_analysis, 50000);
  const summary_analysis = sanitize(body.summary_analysis, 1000);
  const banner_image = sanitize(body.banner_image, 2000);
  const isodate = sanitize(body.isodate, 50);

  await query(
    `INSERT INTO user_submissions
      (submission_type, title, content, creator, link, contentsnippet,
       risk_level, rugpull_score, red_flags, our_analysis,
       summary_analysis, banner_image, isodate)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [
      "post", title, content, creator, link, contentsnippet,
      risk_level, rugpull_score, red_flags, our_analysis,
      summary_analysis, banner_image, isodate,
    ],
  );

  return apiSuccess(undefined, "Post submitted for review");
}

async function handleInvestigation(body: Record<string, unknown>, request: Request) {
  const contractAddress = String(body.contract_address ?? "").trim();
  const chain = String(body.chain ?? "ethereum").trim().toLowerCase();
  const userAnalysis = sanitize(body.user_analysis, 2000);
  const creator = sanitize(body.creator, 50) || "Community Member";

  // 1. Validate contract address
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    return apiError("Invalid contract address. Must be 0x followed by 40 hex characters.", 400);
  }

  const validChains = ["ethereum", "bsc", "polygon", "arbitrum", "base", "avalanche"] as const;
  if (!validChains.includes(chain as typeof validChains[number])) {
    return apiError(`Chain must be one of: ${validChains.join(", ")}`, 400);
  }

  // 2. Rate limiting: in-memory check first (prevents DB flooding), then DB check
  const ip = getClientIp(request);
  const { allowed } = checkRateLimit(`investigation:${ip}`, RATE_LIMITS.submitPost);
  if (!allowed) {
    return apiError("Rate limit exceeded. Please try again later.", 429);
  }

  const recentSubmission = await queryOne(
    `SELECT id FROM user_submissions
     WHERE submitter_ip = $1
       AND submitted_at > NOW() - INTERVAL '1 hour'
       AND submission_type = 'investigation'`,
    [ip],
  );

  if (recentSubmission) {
    return apiError("Rate limit: 1 investigation per hour. Please try again later.", 429);
  }

  // 3. Dedup level 1: check if address already has a published article
  const existingArticle = await queryOne<{ id: number }>(
    `SELECT id FROM articles
     WHERE investigated_address = $1 AND published = true`,
    [contractAddress.toLowerCase()],
  );

  if (existingArticle) {
    return apiSuccess(
      { existing_article_id: existingArticle.id },
      "This contract has already been investigated.",
    );
  }

  // 4. Dedup level 2: check if investigation is already in progress
  const inProgress = await queryOne<{ id: number }>(
    `SELECT id FROM user_submissions
     WHERE contract_address = $1
       AND status IN ('pending', 'processing')
       AND submission_type = 'investigation'`,
    [contractAddress.toLowerCase()],
  );

  if (inProgress) {
    return apiSuccess(
      { submission_id: inProgress.id },
      "Investigation already in progress.",
    );
  }

  // 5. Insert new investigation submission
  const result = await query(
    `INSERT INTO user_submissions
      (submission_type, title, content, contract_address, chain,
       user_analysis, creator, submitter_ip, status)
     VALUES ('investigation', $1, $2, $3, $4, $5, $6, $7, 'pending')
     RETURNING id`,
    [
      `Investigation: ${contractAddress.slice(0, 10)}...${contractAddress.slice(-6)}`,
      userAnalysis || `Community investigation request for ${contractAddress}`,
      contractAddress.toLowerCase(),
      chain,
      userAnalysis,
      creator,
      ip,
    ],
  );

  const submissionId = result.rows[0]?.id;

  return apiSuccess(
    { submission_id: submissionId },
    "Investigation queued. Your contract will be analyzed shortly.",
  );
}
