"""
Claude AI Processor for RugPull News.
Generates risk assessments, SEO titles, and detailed analysis
using on-chain intelligence data from chain_intel.
"""

import json
import logging
import anthropic
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL

logger = logging.getLogger(__name__)

client = None


def get_client():
    global client
    if client is None:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    return client


# ──────────────────────────────────────────────
# Article analysis prompt (for RSS-sourced articles)
# ──────────────────────────────────────────────
ARTICLE_ANALYSIS_PROMPT = """You are a senior crypto security analyst for RugPull News, a trusted scam detection platform protecting millions of crypto users.

Your analysis must be ACCURATE and FAIR. Never misrepresent a legitimate project as a scam. Compare claims to evidence. If the article is about a real incident, say so clearly. If it's about a legitimate project with no red flags, score it low.

Analyze this article and produce a JSON response with these exact fields:

- "risk_level": One of "LOW RISK", "MEDIUM RISK", or "HIGH RISK"
- "rugpull_score": Integer 0-100
- "red_flags": Array of specific, evidence-based warning signs found in the article. Empty array if none.
- "our_analysis": 2-4 paragraph analysis in third person for a news audience. Include what happened, who is involved, what the evidence shows, and implications for investors. Be balanced - if a project appears legitimate, say so.
- "summary_analysis": 1-2 sentence summary for article cards (max 200 chars)
- "seo_title": SEO-optimized title (max 80 chars). Factual and compelling.

Scoring guide:
- 0-15: Legitimate news, no scam indicators, positive ecosystem development
- 16-30: Minor concerns worth monitoring, or general crypto risk reporting
- 31-50: Multiple warning signs, readers should exercise caution
- 51-70: Serious red flags, strong evidence of fraudulent behavior
- 71-85: Confirmed scam with substantial evidence
- 86-100: Confirmed rug pull / exit scam with on-chain proof

Article title: {title}
Article content: {content}
Source: {source}

Respond ONLY with valid JSON, no markdown code fences."""


# ──────────────────────────────────────────────
# Token analysis prompt (with on-chain intelligence)
# ──────────────────────────────────────────────
TOKEN_ANALYSIS_PROMPT = """You are a senior blockchain security analyst for RugPull News, a scam detection platform.

You have been given REAL on-chain intelligence data scraped from blockchain explorers, DEX aggregators, and security audit APIs. This is factual data, not speculation.

Analyze this token/project and produce a JSON response with these exact fields:

- "risk_level": One of "LOW RISK", "MEDIUM RISK", or "HIGH RISK"
- "rugpull_score": Integer 0-100 (based on the EVIDENCE, not speculation)
- "red_flags": Array of specific, evidence-backed warning signs. Reference the actual data.
- "our_analysis": 3-5 paragraph detailed analysis covering:
  1. Project overview and claims
  2. On-chain evidence (contract verification, holder distribution, liquidity)
  3. Security audit findings (honeypot, taxes, owner privileges)
  4. Trading pattern analysis
  5. Overall assessment comparing the project's claims to on-chain reality
- "summary_analysis": 2-3 sentence summary (max 300 chars)
- "seo_title": Factual SEO title (max 80 chars)

CRITICAL RULES:
- Base your scoring on the ON-CHAIN DATA, not just the project's marketing
- A verified contract with good distribution and locked liquidity should score LOW
- An unverified contract with concentrated holders and honeypot flags should score HIGH
- If data is missing or errored, note that uncertainty and don't over-penalize
- Compare what the project SAYS to what the blockchain SHOWS

Project info:
{project_info}

On-chain intelligence data:
{onchain_data}

Respond ONLY with valid JSON, no markdown code fences."""


def _parse_response(response_text):
    """Parse Claude's JSON response, handling potential markdown fences."""
    text = response_text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    return json.loads(text)


def process_article(article):
    """
    Send article content to Claude for risk analysis.
    Returns enriched article data.
    """
    if not ANTHROPIC_API_KEY:
        logger.error("ANTHROPIC_API_KEY not set - skipping AI processing")
        return {
            **article,
            "risk_level": "MEDIUM RISK",
            "rugpull_score": 0,
            "red_flags": json.dumps(["AI analysis unavailable"]),
            "our_analysis": article.get("content", "")[:500],
            "summary_analysis": article.get("contentsnippet", "")[:200],
        }

    content = article.get("content", "")[:6000]
    title = article.get("title", "Untitled")
    source = article.get("source_feed", "Unknown")

    try:
        api = get_client()
        message = api.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=2000,
            messages=[
                {
                    "role": "user",
                    "content": ARTICLE_ANALYSIS_PROMPT.format(
                        title=title, content=content, source=source
                    ),
                }
            ],
        )

        analysis = _parse_response(message.content[0].text)

        enriched = {
            **article,
            "title": analysis.get("seo_title", title),
            "risk_level": analysis.get("risk_level", "MEDIUM RISK"),
            "rugpull_score": int(analysis.get("rugpull_score", 0)),
            "red_flags": json.dumps(analysis.get("red_flags", [])),
            "our_analysis": analysis.get("our_analysis", ""),
            "summary_analysis": analysis.get("summary_analysis", "")[:200],
        }

        logger.info(
            f"Processed: '{title[:50]}' -> score={enriched['rugpull_score']}, "
            f"risk={enriched['risk_level']}"
        )
        return enriched

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Claude response as JSON: {e}")
    except Exception as e:
        logger.error(f"Claude API error: {e}")

    return {
        **article,
        "risk_level": "MEDIUM RISK",
        "rugpull_score": 0,
        "red_flags": json.dumps(["AI processing failed"]),
        "our_analysis": content[:500],
        "summary_analysis": article.get("contentsnippet", "")[:200],
    }


def analyze_token_submission(submission, onchain_data=None):
    """
    Analyze a user-submitted token/project using Claude + on-chain intelligence.
    This is the heavy-duty analysis path using all available chain_intel data.
    """
    if not ANTHROPIC_API_KEY:
        logger.error("ANTHROPIC_API_KEY not set")
        return None

    project_info = (
        f"Title: {submission.get('title', '')}\n"
        f"Content: {submission.get('content', '')}\n"
        f"Link: {submission.get('link', '')}\n"
        f"Submitted risk level: {submission.get('risk_level', 'Unknown')}"
    )

    onchain_str = json.dumps(onchain_data, indent=2, default=str) if onchain_data else "No on-chain data available"

    try:
        api = get_client()
        message = api.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=3000,
            messages=[
                {
                    "role": "user",
                    "content": TOKEN_ANALYSIS_PROMPT.format(
                        project_info=project_info,
                        onchain_data=onchain_str,
                    ),
                }
            ],
        )

        return _parse_response(message.content[0].text)

    except Exception as e:
        logger.error(f"Token analysis error: {e}")
        return None


# ──────────────────────────────────────────────
# Deep investigation prompt (for crashed-token investigations)
# ──────────────────────────────────────────────
INVESTIGATION_PROMPT = """You are an investigative blockchain journalist for RugPull News.

You are writing a formal, fact-based news article about a token that experienced a significant price crash. Your article will be read by thousands of crypto investors seeking accurate information to protect their assets.

EDITORIAL STANDARDS — STRICTLY ENFORCED:
- Report ONLY verifiable facts. Clearly distinguish between confirmed facts and allegations.
- Use precise language: "allegedly", "according to community reports", "on-chain data shows"
- NEVER declare something a scam without hard evidence. Use "exhibits characteristics consistent with" instead.
- If community claims contradict on-chain data, note the discrepancy explicitly.
- If data is missing or inconclusive, say so. Uncertainty is more honest than false certainty.
- Write in third person, formal news tone. No sensationalism, no clickbait.
- Every claim must be traceable to a data source (on-chain, community post, API data).

You have been provided:
1. PRICE CRASH DATA — how the token was detected (which API, what % drop)
2. ON-CHAIN INTELLIGENCE — contract verification, holder distribution, liquidity, honeypot checks, wallet analysis
3. COMMUNITY INTELLIGENCE — scraped posts from Reddit, X/Twitter, and crypto forums with specific claims

Produce a JSON response with these exact fields:

- "title": Formal news headline (max 100 chars). Factual, not sensational. Example: "XYZ Token Loses 85% in 24 Hours as Liquidity Removed from Uniswap Pool"
- "risk_level": One of "LOW RISK", "MEDIUM RISK", or "HIGH RISK"
- "rugpull_score": Integer 0-100 based STRICTLY on evidence:
    0-20: Price drop likely market-driven, no fraud indicators
    21-40: Some concerns but inconclusive evidence
    41-60: Multiple red flags, probable intentional manipulation
    61-80: Strong evidence of fraudulent activity
    81-100: Confirmed rug pull with irrefutable on-chain proof (honeypot + liquidity removal + fund extraction)

- "red_flags": Array of specific, evidence-backed findings. Each flag should reference the data source.
  Example: "Contract is not verified on Etherscan (source: on-chain)", "Top wallet holds 47% of supply (source: holder analysis)"

- "our_analysis": A 4-6 paragraph investigative article following this structure:
    Paragraph 1 — THE EVENT: What happened, when, how severe the price drop was, current trading status.
    Paragraph 2 — ON-CHAIN EVIDENCE: What the blockchain data reveals — contract verification, holder concentration, liquidity status, honeypot results, creator wallet behavior. Cite specific numbers.
    Paragraph 3 — COMMUNITY RESPONSE: What affected users and crypto community members are reporting. Include specific claims from posts, noting they are community allegations. Reference where claims were found (Reddit, X, etc.)
    Paragraph 4 — SECURITY ANALYSIS: Technical assessment — tax rates, proxy contract risks, comparison of project claims vs on-chain reality.
    Paragraph 5 — CONTEXT & IMPLICATIONS: How this fits into broader patterns. Similar incidents. What investors should watch for.
    Paragraph 6 — STATUS & ADVISORY: Current status of the token/project. What affected users can do. Standard DYOR disclaimer.

- "summary_analysis": 2-3 sentence summary for article cards (max 280 chars). Must include the % price drop and key finding.

- "seo_title": SEO-optimized title variant (max 80 chars). Include token name and key fact.

- "banner_image_keyword": Single keyword for fallback image selection: "hack", "scam", "exploit", "regulation", "defi", "nft", "bitcoin", "ethereum", or "default"

TOKEN CRASH DATA:
Name: {token_name}
Symbol: {token_symbol}
Chain: {chain}
Contract: {contract_address}
Price: ${price_usd}
24h Change: {price_change_24h}%
Market Cap: ${market_cap_usd}
Detection Source: {detection_source}

ON-CHAIN INTELLIGENCE:
{onchain_data}

COMMUNITY INTELLIGENCE:
Posts found: {community_posts_count}
Sentiment: {community_sentiment}
Key claims from community:
{community_claims}

Selected community posts:
{community_posts}

Respond ONLY with valid JSON, no markdown code fences."""


def investigate_crashed_token(crash_data, onchain_data, community_report):
    """
    Generate a full investigative article for a crashed token.
    This is the highest-quality analysis path — used for tokens detected
    by the losers discovery pipeline.

    Args:
        crash_data: dict with token_name, symbol, chain, contract_address,
                    price_usd, price_change_24h, market_cap_usd, source
        onchain_data: dict from chain_intel.full_token_analysis()
        community_report: dict from community_scraper.scrape_community()

    Returns:
        dict with title, risk_level, rugpull_score, red_flags, our_analysis,
        summary_analysis, seo_title, banner_image_keyword
    """
    if not ANTHROPIC_API_KEY:
        logger.error("ANTHROPIC_API_KEY not set — cannot generate investigation article")
        return _fallback_investigation(crash_data, onchain_data, community_report)

    # Format on-chain data (trim to fit context)
    onchain_str = json.dumps(onchain_data, indent=2, default=str) if onchain_data else "On-chain analysis unavailable"
    if len(onchain_str) > 8000:
        # Keep the most important fields
        trimmed = {
            "risk_score": onchain_data.get("risk_score"),
            "risk_level": onchain_data.get("risk_level"),
            "all_flags": onchain_data.get("all_flags", []),
            "token_info": onchain_data.get("token_info", {}),
            "holders": {
                "top1_percentage": onchain_data.get("holders", {}).get("top1_percentage"),
                "top10_percentage": onchain_data.get("holders", {}).get("top10_percentage"),
                "flags": onchain_data.get("holders", {}).get("flags", []),
            },
            "dex": onchain_data.get("dex", {}),
            "security": onchain_data.get("security", {}),
            "creator_wallet": onchain_data.get("creator_wallet", {}),
        }
        onchain_str = json.dumps(trimmed, indent=2, default=str)

    # Format community data
    community_claims = ""
    community_posts_text = ""
    posts_count = 0
    sentiment = "No community data available"

    if community_report:
        posts_count = community_report.get("total_posts_found", 0)
        sentiment = community_report.get("sentiment_summary", "Unknown")

        claims = community_report.get("key_claims", [])
        community_claims = "\n".join(f"- {c}" for c in claims[:15]) or "No specific claims extracted"

        posts = community_report.get("posts", [])
        post_lines = []
        for p in posts[:8]:  # Top 8 posts for context
            source_label = f"[{p.get('source', '?')}/{p.get('subreddit', '')}]"
            title_part = f" {p['title']}" if p.get("title") else ""
            body_part = p.get("body", "")[:300]
            score_part = f" (score: {p['score']})" if p.get("score") else ""
            post_lines.append(f"{source_label}{title_part}: {body_part}{score_part}")
        community_posts_text = "\n\n".join(post_lines) or "No community posts available"

    try:
        api = get_client()
        message = api.messages.create(
            model=CLAUDE_MODEL,
            max_tokens=4000,
            messages=[
                {
                    "role": "user",
                    "content": INVESTIGATION_PROMPT.format(
                        token_name=crash_data.get("name", "Unknown"),
                        token_symbol=crash_data.get("symbol", "???"),
                        chain=crash_data.get("chain", "unknown"),
                        contract_address=crash_data.get("contract_address", ""),
                        price_usd=f"{crash_data.get('price_usd', 0):.8f}",
                        price_change_24h=f"{crash_data.get('price_change_24h', 0):.1f}",
                        market_cap_usd=f"{crash_data.get('market_cap_usd', 0):,.0f}",
                        detection_source=crash_data.get("source", "unknown"),
                        onchain_data=onchain_str,
                        community_posts_count=posts_count,
                        community_sentiment=sentiment,
                        community_claims=community_claims,
                        community_posts=community_posts_text,
                    ),
                }
            ],
        )

        result = _parse_response(message.content[0].text)
        logger.info(
            f"Investigation complete: '{crash_data.get('symbol')}' -> "
            f"score={result.get('rugpull_score')}, risk={result.get('risk_level')}"
        )
        return result

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse investigation response: {e}")
    except Exception as e:
        logger.error(f"Investigation API error: {e}")

    return _fallback_investigation(crash_data, onchain_data, community_report)


def _fallback_investigation(crash_data, onchain_data, community_report):
    """
    Generate a basic investigation article without Claude API.
    Used when ANTHROPIC_API_KEY is not set or API call fails.
    Still produces a usable article from the raw data.
    """
    symbol = crash_data.get("symbol", "???")
    name = crash_data.get("name", "Unknown Token")
    pct = crash_data.get("price_change_24h", 0)
    chain = crash_data.get("chain", "unknown")
    address = crash_data.get("contract_address", "")
    mcap = crash_data.get("market_cap_usd", 0)

    # Build flags from on-chain data
    flags = []
    if onchain_data:
        flags = list(onchain_data.get("all_flags", []))

    # ── Composite risk scoring ──
    # The score must weigh ALL evidence: price crash + on-chain + liquidity + holders
    score = 0

    # Factor 1: Price crash severity (0-35 points)
    # A 60% drop is the detection floor, 100% is max
    crash_abs = abs(pct)
    if crash_abs >= 95:
        score += 35
        flags.insert(0, f"Catastrophic price collapse: {pct:.1f}% in 24 hours")
    elif crash_abs >= 80:
        score += 28
        flags.insert(0, f"Severe price crash: {pct:.1f}% in 24 hours")
    elif crash_abs >= 60:
        score += 20
        flags.insert(0, f"Major price decline: {pct:.1f}% in 24 hours")
    elif crash_abs >= 40:
        score += 12
        flags.insert(0, f"Significant price decline: {pct:.1f}% in 24 hours")

    # Factor 2: On-chain flags from chain_intel (0-30 points)
    onchain_score = onchain_data.get("risk_score", 0) if onchain_data else 0
    score += min(int(onchain_score * 0.3), 30)

    # Factor 3: Liquidity (0-20 points)
    if onchain_data and onchain_data.get("dex"):
        liq = onchain_data["dex"].get("liquidity_usd", 0) or 0
        if liq < 1000:
            score += 20
            if f"Near-zero liquidity" not in " ".join(flags):
                flags.append(f"Near-zero liquidity: ${liq:,.0f}")
        elif liq < 5000:
            score += 15
            if f"Extremely low liquidity" not in " ".join(flags):
                flags.append(f"Extremely low liquidity: ${liq:,.0f}")
        elif liq < 10000:
            score += 10
            if f"Very low liquidity" not in " ".join(flags):
                flags.append(f"Very low liquidity: ${liq:,.0f}")
        elif liq < 50000:
            score += 5

    # Factor 4: Honeypot / security (0-25 points)
    if onchain_data and onchain_data.get("security"):
        sec = onchain_data["security"]
        if sec.get("is_honeypot"):
            score += 25
        elif not sec.get("is_open_source"):
            score += 10
        sell_tax = sec.get("sell_tax", 0) or 0
        if sell_tax > 50:
            score += 15
        elif sell_tax > 10:
            score += 8

    # Factor 5: Low holder count signals concentration risk
    if onchain_data and onchain_data.get("security"):
        holders = onchain_data["security"].get("total_holders", 0) or 0
        if 0 < holders < 100:
            score += 10
        elif 0 < holders < 500:
            score += 5

    # Factor 6: Low market cap = easier to manipulate
    if mcap < 50000:
        score += 5
    if mcap < 10000:
        score += 5

    score = min(score, 100)

    if score >= 65:
        risk_level = "HIGH RISK"
    elif score >= 35:
        risk_level = "MEDIUM RISK"
    else:
        risk_level = "LOW RISK"

    # Build analysis paragraphs
    paragraphs = []

    paragraphs.append(
        f"{name} ({symbol}) experienced a significant price decline of {pct:.1f}% "
        f"within a 24-hour period on the {chain.title()} network. The token, trading at "
        f"contract address {address[:10]}...{address[-6:]}, was flagged by automated "
        f"monitoring systems for investigation. At the time of detection, the token's "
        f"market capitalization stood at approximately ${mcap:,.0f}."
    )

    if onchain_data and onchain_data.get("security"):
        sec = onchain_data["security"]
        honeypot_status = "confirmed as a honeypot" if sec.get("is_honeypot") else "not flagged as a honeypot"
        verified = "verified" if sec.get("is_open_source") else "not verified"
        paragraphs.append(
            f"On-chain analysis reveals the contract source code is {verified}. "
            f"Security scanning through Honeypot.is indicates the token is {honeypot_status}. "
            f"Buy tax is reported at {sec.get('buy_tax', 0)}% and sell tax at {sec.get('sell_tax', 0)}%. "
            f"The token has approximately {sec.get('total_holders', 'unknown')} holders."
        )

    if onchain_data and onchain_data.get("dex"):
        dex = onchain_data["dex"]
        paragraphs.append(
            f"DEX trading data shows ${dex.get('liquidity_usd', 0):,.0f} in liquidity "
            f"with ${dex.get('volume_24h', 0):,.0f} in 24-hour volume. "
            f"The token is trading on {dex.get('dex', 'unknown DEX')} with "
            f"{dex.get('buys_24h', 0)} buy transactions and {dex.get('sells_24h', 0)} "
            f"sell transactions in the last 24 hours."
        )

    if community_report and community_report.get("total_posts_found", 0) > 0:
        count = community_report["total_posts_found"]
        sentiment = community_report.get("sentiment_summary", "mixed")
        claims = community_report.get("key_claims", [])
        claim_text = "; ".join(claims[:3]) if claims else "no specific claims verified"
        paragraphs.append(
            f"Community monitoring identified {count} posts discussing this token "
            f"across social platforms. Overall sentiment is {sentiment.lower()}. "
            f"Notable community claims include: {claim_text}. "
            f"These claims have not been independently verified by RugPull News."
        )

    paragraphs.append(
        f"Investors are advised to exercise extreme caution with this token. "
        f"The significant price decline warrants careful examination of all available "
        f"evidence before making any trading decisions. RugPull News will continue "
        f"monitoring this situation for further developments. This analysis is for "
        f"informational purposes only and does not constitute financial advice."
    )

    if flags:
        flags_str = "; ".join(flags[:5])
    else:
        flags_str = f"Significant 24h price decline of {pct:.1f}%"

    return {
        "title": f"{name} ({symbol}) Drops {abs(pct):.0f}% in 24 Hours — Investigation Report",
        "risk_level": risk_level,
        "rugpull_score": score,
        "red_flags": flags[:10] if flags else [f"Price dropped {pct:.1f}% in 24 hours"],
        "our_analysis": "\n\n".join(paragraphs),
        "summary_analysis": f"{symbol} lost {abs(pct):.0f}% in 24h on {chain.title()}. {flags_str[:150]}",
        "seo_title": f"{symbol} Token Crashes {abs(pct):.0f}% — Rug Pull Investigation",
        "banner_image_keyword": "scam",
    }


# ──────────────────────────────────────────────
# User-submitted investigation (wraps investigate_crashed_token)
# ──────────────────────────────────────────────
USER_ANALYSIS_ADDENDUM = """

USER-SUBMITTED ANALYSIS:
A community member flagged this contract for investigation and provided the following context.
Evaluate their claims critically — verify against the on-chain evidence above.
If their observations are supported by the data, incorporate them into your analysis.
If they contradict the evidence, note the discrepancy and explain why the data tells a different story.
Do NOT accept user claims at face value. Your article must be evidence-based.

Community member's analysis:
{user_analysis}
"""


def investigate_user_submission(address, chain, user_analysis, onchain_data, community_report, creator="Community Member"):
    """
    Generate an investigation article from a user-submitted contract address.
    Wraps investigate_crashed_token() but incorporates user-provided analysis.

    Unlike rugcheck_pipeline which discovers crashed tokens, this is triggered
    by a user submission — so we build crash_data from the on-chain/DEX data
    rather than from CMC losers lists.
    """
    # Build crash_data from on-chain findings (since user submissions aren't from CMC)
    token_name = "Unknown Token"
    token_symbol = "???"
    price_usd = 0
    price_change = 0
    market_cap = 0

    if onchain_data:
        # Try to get token name from various sources
        token_info = onchain_data.get("token_info", {})
        security = onchain_data.get("security", {})
        dex = onchain_data.get("dex", {})

        token_name = security.get("token_name") or token_info.get("token_name") or "Unknown Token"
        price_change = dex.get("price_change_24h", 0) or 0
        market_cap = dex.get("liquidity_usd", 0) or 0  # approximate

    crash_data = {
        "name": token_name,
        "symbol": token_symbol,
        "chain": chain,
        "contract_address": address,
        "price_usd": price_usd,
        "price_change_24h": price_change,
        "market_cap_usd": market_cap,
        "source": f"community submission by {creator}",
    }

    # If user provided analysis, inject it into the community report
    if user_analysis and user_analysis.strip():
        if not community_report:
            community_report = {
                "total_posts_found": 0,
                "posts": [],
                "key_claims": [],
                "sentiment_summary": "User-submitted investigation",
                "sources_scraped": [],
            }
        # Append user analysis as a community post
        community_report["posts"].insert(0, {
            "source": "user_submission",
            "subreddit": "direct",
            "title": f"Investigation request by {creator}",
            "body": user_analysis[:1500],
            "author": creator,
            "url": "",
            "score": 0,
            "timestamp": "",
            "claims": [],
        })
        community_report["total_posts_found"] += 1

    # Call the main investigation function
    return investigate_crashed_token(crash_data, onchain_data, community_report)
