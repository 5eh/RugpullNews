"""
Community Sentiment Scraper — gathers public discussions about specific tokens.

Uses Scrapling for stealth scraping of:
  1. Reddit (r/cryptocurrency, r/CryptoScams, r/CryptoMoonShots via old.reddit.com)
  2. X/Twitter (via Nitter instances for public access)
  3. BitcoinTalk forums
  4. Crypto-specific forums (CryptoCompare, etc.)

Returns structured community data: posts, sentiment indicators, and key claims.
Each post includes its source URL for verifiability.

Design principle: We scrape for FACTS and CLAIMS, not opinions.
Claude will later synthesize these into unbiased reporting.
"""

import logging
import re
import time
from dataclasses import dataclass, field
from urllib.parse import quote_plus

from scrapling.fetchers import Fetcher

logger = logging.getLogger(__name__)

FETCH_DELAY = 2.0  # seconds between requests to same domain
MAX_POSTS_PER_SOURCE = 15
MAX_POST_LENGTH = 1500


@dataclass
class CommunityPost:
    """A single community post or comment about a token."""
    source: str             # "reddit", "x", "bitcointalk", etc.
    subreddit: str          # subreddit or forum section
    title: str
    body: str               # post content (truncated)
    author: str
    url: str                # direct link for verification
    score: int              # upvotes/likes (0 if unavailable)
    timestamp: str          # ISO date or relative ("2 hours ago")
    claims: list = field(default_factory=list)   # extracted factual claims


@dataclass
class CommunityReport:
    """Aggregated community intelligence for a token."""
    token_name: str
    token_symbol: str
    contract_address: str
    total_posts_found: int
    posts: list             # list of CommunityPost dicts
    key_claims: list        # deduplicated factual claims across all posts
    sentiment_summary: str  # brief machine-readable sentiment note
    sources_scraped: list   # which sources were actually checked


def _fetch_page(url):
    """Fetch a page with Scrapling stealth headers."""
    try:
        page = Fetcher.get(url, stealthy_headers=True, timeout=20)
        if page.status == 200:
            return page
        logger.warning(f"Status {page.status} for {url}")
        return None
    except Exception as e:
        logger.error(f"Scrape error for {url}: {e}")
        return None


def _clean_text(text):
    """Clean scraped text: collapse whitespace, strip HTML artifacts."""
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = text.strip()
    return text[:MAX_POST_LENGTH]


def _extract_claims(text):
    """
    Extract verifiable factual claims from post text.
    Looks for specific patterns that indicate factual assertions.
    """
    claims = []
    text_lower = text.lower()

    # Dollar amounts stolen/lost
    for m in re.finditer(r'\$[\d,.]+\s*(?:million|billion|m|b|k)?\s*(?:stolen|lost|drained|taken|missing|gone|exit)', text_lower):
        claims.append(f"Financial loss claim: {m.group(0).strip()}")

    # Dev/team actions
    for m in re.finditer(r'(?:dev|team|founder|creator|deployer|owner)\s+(?:wallet\s+)?(?:dumped|sold|transferred|removed|withdrew|drained|ran|disappeared|vanished|deleted)', text_lower):
        claims.append(f"Team action claim: {m.group(0).strip()}")

    # Liquidity events
    for m in re.finditer(r'(?:liquidity|lp)\s+(?:pulled|removed|drained|unlocked|rugpull|rug)', text_lower):
        claims.append(f"Liquidity event claim: {m.group(0).strip()}")

    # Contract issues
    for m in re.finditer(r'(?:contract|token)\s+(?:is\s+)?(?:honeypot|unverified|malicious|scam|backdoor|blacklisted|paused|locked)', text_lower):
        claims.append(f"Contract issue claim: {m.group(0).strip()}")

    # Specific wallet/tx references (verifiable on-chain)
    for m in re.finditer(r'0x[a-fA-F0-9]{40}', text):
        claims.append(f"References address: {m.group(0)}")

    # Transaction hash references
    for m in re.finditer(r'0x[a-fA-F0-9]{64}', text):
        claims.append(f"References transaction: {m.group(0)}")

    return claims[:10]  # Cap at 10 claims per post


# ──────────────────────────────────────────────
# Reddit Scraping (via old.reddit.com — simpler HTML)
# ──────────────────────────────────────────────
REDDIT_SUBREDDITS = [
    "cryptocurrency",
    "CryptoScams",
    "CryptoMoonShots",
    "defi",
    "ethtrader",
]


def scrape_reddit(token_name, token_symbol, contract_address=""):
    """
    Search Reddit for posts mentioning this token.
    Uses old.reddit.com which has simpler HTML structure.
    """
    posts = []
    search_terms = [token_symbol]
    if token_name and token_name.lower() != token_symbol.lower():
        search_terms.append(token_name)

    for subreddit in REDDIT_SUBREDDITS:
        if len(posts) >= MAX_POSTS_PER_SOURCE:
            break

        for term in search_terms:
            if len(posts) >= MAX_POSTS_PER_SOURCE:
                break

            query = quote_plus(f"{term} scam OR rug OR rugpull OR hack OR exploit OR drain")
            url = f"https://old.reddit.com/r/{subreddit}/search?q={query}&restrict_sr=on&sort=new&t=month"
            logger.info(f"Scraping Reddit: r/{subreddit} for '{term}'")

            page = _fetch_page(url)
            if not page:
                time.sleep(FETCH_DELAY)
                continue

            body_text = page.body.decode("utf-8", errors="ignore")

            # Parse search results from old.reddit
            entries = page.css("div.search-result")
            if not entries:
                # Fallback: try link listing format
                entries = page.css("div.thing")

            for entry in entries[:8]:
                try:
                    # Title
                    title_el = entry.css("a.search-title") or entry.css("a.title")
                    title = _clean_text(title_el[0].text) if title_el else ""
                    if not title:
                        continue

                    # URL
                    link = ""
                    if title_el:
                        href = title_el[0].attrib.get("href", "")
                        if href.startswith("/"):
                            link = f"https://old.reddit.com{href}"
                        elif href.startswith("http"):
                            link = href

                    # Snippet/body
                    snippet_el = entry.css("div.search-result-body") or entry.css("div.md")
                    snippet = _clean_text(snippet_el[0].text) if snippet_el else ""

                    # Author
                    author_el = entry.css("a.author")
                    author = author_el[0].text if author_el else "unknown"

                    # Score
                    score_el = entry.css("span.search-score") or entry.css("div.score")
                    score_text = score_el[0].text if score_el else "0"
                    score = int(re.sub(r"[^\d-]", "", score_text) or 0)

                    # Time
                    time_el = entry.css("time")
                    timestamp = time_el[0].attrib.get("datetime", "") if time_el else ""

                    full_text = f"{title} {snippet}"
                    claims = _extract_claims(full_text)

                    posts.append(CommunityPost(
                        source="reddit",
                        subreddit=f"r/{subreddit}",
                        title=title,
                        body=snippet,
                        author=author,
                        url=link,
                        score=score,
                        timestamp=timestamp,
                        claims=claims,
                    ))
                except Exception as e:
                    logger.debug(f"Failed to parse Reddit entry: {e}")
                    continue

            time.sleep(FETCH_DELAY)

    logger.info(f"Reddit: found {len(posts)} posts about {token_symbol}")
    return posts


# ──────────────────────────────────────────────
# X/Twitter Scraping (via Nitter instances)
# ──────────────────────────────────────────────
# Public Nitter instances (no auth needed, rotate on failure)
NITTER_INSTANCES = [
    "https://nitter.net",
    "https://nitter.cz",
    "https://nitter.poast.org",
]


def scrape_x(token_name, token_symbol, contract_address=""):
    """
    Search X/Twitter for posts about this token via Nitter (public proxy).
    Falls back across multiple Nitter instances.
    """
    posts = []
    search_terms = [f"${token_symbol}"]
    if token_name and token_name.lower() != token_symbol.lower():
        search_terms.append(token_name)

    for instance in NITTER_INSTANCES:
        if posts:
            break  # Got results, stop trying instances

        for term in search_terms:
            query = quote_plus(f"{term} scam OR rug OR rugpull OR hack OR warning")
            url = f"{instance}/search?f=tweets&q={query}"
            logger.info(f"Scraping Nitter: {instance} for '{term}'")

            page = _fetch_page(url)
            if not page:
                time.sleep(FETCH_DELAY)
                continue

            # Parse Nitter tweet cards
            tweets = page.css("div.timeline-item")
            if not tweets:
                tweets = page.css("div.tweet-body")

            for tweet in tweets[:MAX_POSTS_PER_SOURCE]:
                try:
                    # Content
                    content_el = tweet.css("div.tweet-content") or tweet.css("div.tweet-body p")
                    content = _clean_text(content_el[0].text) if content_el else ""
                    if not content:
                        continue

                    # Author
                    author_el = tweet.css("a.username")
                    author = author_el[0].text.strip() if author_el else "unknown"

                    # Link
                    link_el = tweet.css("a.tweet-link") or tweet.css("span.tweet-date a")
                    tweet_path = link_el[0].attrib.get("href", "") if link_el else ""
                    tweet_url = f"https://x.com{tweet_path}" if tweet_path.startswith("/") else ""

                    # Timestamp
                    time_el = tweet.css("span.tweet-date a") or tweet.css("time")
                    timestamp = ""
                    if time_el:
                        timestamp = time_el[0].attrib.get("title", "") or time_el[0].text or ""

                    # Stats
                    stat_el = tweet.css("div.tweet-stat span.tweet-stat-num")
                    score = 0
                    if stat_el:
                        score = int(re.sub(r"[^\d]", "", stat_el[0].text) or 0)

                    claims = _extract_claims(content)

                    posts.append(CommunityPost(
                        source="x",
                        subreddit="twitter",
                        title="",  # tweets don't have titles
                        body=content,
                        author=author,
                        url=tweet_url,
                        score=score,
                        timestamp=timestamp,
                        claims=claims,
                    ))
                except Exception as e:
                    logger.debug(f"Failed to parse tweet: {e}")
                    continue

            time.sleep(FETCH_DELAY)
            if posts:
                break

    logger.info(f"X/Twitter: found {len(posts)} posts about {token_symbol}")
    return posts


# ──────────────────────────────────────────────
# BitcoinTalk Forum Scraping
# ──────────────────────────────────────────────
def scrape_bitcointalk(token_name, token_symbol):
    """Search BitcoinTalk forums for discussions about this token."""
    posts = []

    for term in [token_symbol, token_name]:
        if not term or len(posts) >= MAX_POSTS_PER_SOURCE:
            break

        query = quote_plus(f"{term}")
        url = f"https://bitcointalk.org/index.php?action=search2&search={query}&sort=date&subboard=67"
        logger.info(f"Scraping BitcoinTalk for '{term}'")

        page = _fetch_page(url)
        if not page:
            time.sleep(FETCH_DELAY)
            continue

        # Parse search results
        rows = page.css("table.bordercolor tr") or page.css("div.windowbg")
        for row in rows[:10]:
            try:
                link_el = row.css("a[href*='topic=']")
                if not link_el:
                    continue

                title = _clean_text(link_el[0].text)
                href = link_el[0].attrib.get("href", "")

                # Snippet
                body_el = row.css("div.smalltext") or row.css("td.windowbg2")
                snippet = _clean_text(body_el[0].text) if body_el else ""

                claims = _extract_claims(f"{title} {snippet}")

                posts.append(CommunityPost(
                    source="bitcointalk",
                    subreddit="altcoins",
                    title=title,
                    body=snippet,
                    author="",
                    url=href if href.startswith("http") else f"https://bitcointalk.org/{href}",
                    score=0,
                    timestamp="",
                    claims=claims,
                ))
            except Exception as e:
                logger.debug(f"Failed to parse BitcoinTalk entry: {e}")
                continue

        time.sleep(FETCH_DELAY)

    logger.info(f"BitcoinTalk: found {len(posts)} posts about {token_symbol}")
    return posts


# ──────────────────────────────────────────────
# Reddit JSON API (fallback — no auth needed for public subreddits)
# ──────────────────────────────────────────────
def scrape_reddit_json(token_name, token_symbol):
    """
    Fallback: Use Reddit's public JSON API (no auth needed).
    Rate limited to 10 req/min without auth.
    """
    posts = []
    import requests as http_requests

    for subreddit in ["cryptocurrency", "CryptoScams"]:
        if len(posts) >= MAX_POSTS_PER_SOURCE:
            break

        query = quote_plus(f"{token_symbol}")
        url = f"https://www.reddit.com/r/{subreddit}/search.json?q={query}&sort=new&t=month&restrict_sr=1&limit=10"

        try:
            resp = http_requests.get(url, headers={
                "User-Agent": "RugPullNews/1.0 (Research Bot)",
            }, timeout=15)

            if resp.status_code == 429:
                logger.warning("Reddit JSON API rate limited")
                time.sleep(5)
                continue

            if resp.status_code != 200:
                continue

            data = resp.json()
            children = data.get("data", {}).get("children", [])

            for child in children:
                post_data = child.get("data", {})
                title = post_data.get("title", "")
                selftext = post_data.get("selftext", "")[:MAX_POST_LENGTH]
                author = post_data.get("author", "unknown")
                permalink = post_data.get("permalink", "")
                score_val = post_data.get("score", 0)
                created_utc = post_data.get("created_utc", 0)

                full_text = f"{title} {selftext}"
                claims = _extract_claims(full_text)

                posts.append(CommunityPost(
                    source="reddit",
                    subreddit=f"r/{subreddit}",
                    title=title,
                    body=selftext[:500],
                    author=author,
                    url=f"https://reddit.com{permalink}" if permalink else "",
                    score=score_val,
                    timestamp=str(int(created_utc)) if created_utc else "",
                    claims=claims,
                ))
        except Exception as e:
            logger.error(f"Reddit JSON error for r/{subreddit}: {e}")

        time.sleep(2)

    logger.info(f"Reddit JSON: found {len(posts)} posts about {token_symbol}")
    return posts


# ──────────────────────────────────────────────
# Unified Community Scraper
# ──────────────────────────────────────────────
def scrape_community(token_name, token_symbol, contract_address=""):
    """
    Run all community scrapers and return a structured CommunityReport.
    Tries Scrapling-based scrapers first, falls back to JSON APIs.
    """
    logger.info(f"=== Community scrape: {token_symbol} ({token_name}) ===")

    all_posts = []
    sources_checked = []

    # 1. Reddit (Scrapling first, then JSON fallback)
    reddit_posts = scrape_reddit(token_name, token_symbol, contract_address)
    if not reddit_posts:
        reddit_posts = scrape_reddit_json(token_name, token_symbol)
    all_posts.extend(reddit_posts)
    sources_checked.append("reddit")

    # 2. X/Twitter via Nitter
    x_posts = scrape_x(token_name, token_symbol, contract_address)
    all_posts.extend(x_posts)
    sources_checked.append("x")

    # 3. BitcoinTalk
    btc_posts = scrape_bitcointalk(token_name, token_symbol)
    all_posts.extend(btc_posts)
    sources_checked.append("bitcointalk")

    # Deduplicate claims across all posts
    all_claims = []
    seen_claims = set()
    for post in all_posts:
        for claim in post.claims:
            claim_key = claim.lower().strip()
            if claim_key not in seen_claims:
                seen_claims.add(claim_key)
                all_claims.append(claim)

    # Simple sentiment indicator based on content
    negative_terms = 0
    total_content_length = 0
    for post in all_posts:
        content = f"{post.title} {post.body}".lower()
        total_content_length += len(content)
        for term in ["scam", "rug", "fraud", "stolen", "hack", "warning", "avoid", "fake", "ponzi", "honeypot"]:
            negative_terms += content.count(term)

    if not all_posts:
        sentiment = "No community discussion found"
    elif negative_terms > len(all_posts) * 3:
        sentiment = "Overwhelmingly negative — widespread scam allegations"
    elif negative_terms > len(all_posts):
        sentiment = "Predominantly negative — multiple scam reports"
    elif negative_terms > 0:
        sentiment = "Mixed — some concern raised by community members"
    else:
        sentiment = "Neutral or limited discussion"

    report = CommunityReport(
        token_name=token_name,
        token_symbol=token_symbol,
        contract_address=contract_address,
        total_posts_found=len(all_posts),
        posts=[{
            "source": p.source,
            "subreddit": p.subreddit,
            "title": p.title,
            "body": p.body,
            "author": p.author,
            "url": p.url,
            "score": p.score,
            "timestamp": p.timestamp,
            "claims": p.claims,
        } for p in all_posts],
        key_claims=all_claims,
        sentiment_summary=sentiment,
        sources_scraped=sources_checked,
    )

    logger.info(
        f"Community scrape complete: {len(all_posts)} posts, "
        f"{len(all_claims)} unique claims, sentiment: {sentiment}"
    )

    return report


if __name__ == "__main__":
    import sys, os, json
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

    # Test with a known token
    symbol = sys.argv[1] if len(sys.argv) > 1 else "SQUID"
    name = sys.argv[2] if len(sys.argv) > 2 else "Squid Game"

    report = scrape_community(name, symbol)
    print(f"\n{'='*80}")
    print(f"Community Report: {report.token_symbol} ({report.token_name})")
    print(f"Posts found: {report.total_posts_found}")
    print(f"Sentiment: {report.sentiment_summary}")
    print(f"Sources: {', '.join(report.sources_scraped)}")
    print(f"\nKey Claims ({len(report.key_claims)}):")
    for claim in report.key_claims[:10]:
        print(f"  - {claim}")
    print(f"\nPosts:")
    for p in report.posts[:5]:
        print(f"  [{p['source']}] {p['title'][:60]} | {p['body'][:100]}...")
