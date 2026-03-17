#!/usr/bin/env python3
"""
RugCheck Pipeline — Automated Crashed Token Investigation

This is the main entry point for the daily "crashed token investigation" workflow.

Pipeline:
  1. DISCOVER — Find tokens that crashed 60%+ in 24h via CMC, Moralis, GeckoTerminal
  2. FILTER — Skip already-investigated addresses, dust tokens, known stablecoins
  3. ON-CHAIN — Run full_token_analysis() on each address (Etherscan, DexScreener, Honeypot.is)
  4. COMMUNITY — Scrape Reddit, X, BitcoinTalk for relevant community posts
  5. INVESTIGATE — Send all evidence to Claude for formal investigative article generation
  6. PUBLISH — Insert article into PostgreSQL, ready for frontend display

Quality over quantity: MAX_INVESTIGATIONS_PER_RUN defaults to 5.
Each investigation is thorough — on-chain + community + AI synthesis.

Usage:
  python3 rugcheck_pipeline.py                    # standard run
  python3 rugcheck_pipeline.py --threshold -40    # investigate 40%+ drops
  python3 rugcheck_pipeline.py --max 3            # limit to 3 investigations
  python3 rugcheck_pipeline.py --dry-run          # discover only, don't publish

Cron (runs 2x daily, offset from RSS scraper):
  0 8,20 * * * cd /app/scripts && python3 rugcheck_pipeline.py >> /var/log/rugcheck.log 2>&1
"""

import sys
import os
import json
import logging
import argparse
import hashlib
from datetime import datetime
from dataclasses import asdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import MAX_INVESTIGATIONS_PER_RUN, CRASH_THRESHOLD_PCT
from db.queries import is_address_investigated, insert_investigation_article, log_scrape
from scraper.losers_discovery import discover_all_losers, CrashedToken
from scraper.chain_intel import full_token_analysis
from scraper.community_scraper import scrape_community
from ai.claude_processor import investigate_crashed_token

# Fallback images by keyword (same set as enrich_articles.py)
FALLBACK_IMAGES = {
    "hack": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "exploit": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "scam": "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
    "regulation": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "defi": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    "nft": "https://images.unsplash.com/photo-1646463910745-0ce050e1132f?w=800&q=80",
    "bitcoin": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    "ethereum": "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    "default": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("rugcheck")


def generate_guid(address, chain):
    """Generate a unique article GUID from contract address + chain."""
    raw = f"rugcheck:{chain}:{address.lower()}:{datetime.utcnow().strftime('%Y-%m-%d')}"
    return f"rugcheck-{hashlib.sha256(raw.encode()).hexdigest()[:16]}"


def investigate_token(token: CrashedToken, dry_run=False):
    """
    Run the full investigation pipeline for a single token.
    Returns True if an article was published, False otherwise.
    """
    symbol = token.symbol
    name = token.name
    address = token.contract_address
    chain = token.chain
    logger.info(f"{'[DRY RUN] ' if dry_run else ''}Investigating {symbol} ({name}) on {chain}")
    logger.info(f"  Address: {address}")
    logger.info(f"  24h change: {token.price_change_24h:.1f}% | MCap: ${token.market_cap_usd:,.0f}")

    if dry_run:
        return False

    # Check if already investigated today
    if is_address_investigated(address):
        logger.info(f"  Skipping — already investigated: {address[:16]}...")
        return False

    # ── Step 1: On-Chain Intelligence ──
    logger.info(f"  [1/3] Running on-chain analysis...")
    onchain_report = None
    try:
        # Map chain names to what chain_intel expects
        chain_map = {
            "ethereum": "ethereum", "bsc": "bsc", "polygon": "polygon",
            "arbitrum": "ethereum",  # Use Etherscan for Arbitrum tokens
            "base": "ethereum",
            "avalanche": "ethereum",
        }
        analysis_chain = chain_map.get(chain, "ethereum")
        onchain_report = full_token_analysis(address, analysis_chain)
        flag_count = len(onchain_report.get("all_flags", []))
        logger.info(f"  On-chain: score={onchain_report.get('risk_score', '?')}, {flag_count} flags")
    except Exception as e:
        logger.error(f"  On-chain analysis failed: {e}")

    # ── Step 2: Community Intelligence ──
    logger.info(f"  [2/3] Scraping community sentiment...")
    community_report = None
    try:
        community_data = scrape_community(name, symbol, address)
        # Convert to dict for storage and Claude
        community_report = {
            "token_name": community_data.token_name,
            "token_symbol": community_data.token_symbol,
            "contract_address": community_data.contract_address,
            "total_posts_found": community_data.total_posts_found,
            "posts": community_data.posts,
            "key_claims": community_data.key_claims,
            "sentiment_summary": community_data.sentiment_summary,
            "sources_scraped": community_data.sources_scraped,
        }
        logger.info(f"  Community: {community_report['total_posts_found']} posts, sentiment: {community_report['sentiment_summary'][:50]}")
    except Exception as e:
        logger.error(f"  Community scraping failed: {e}")

    # ── Step 3: AI Investigation Article ──
    logger.info(f"  [3/3] Generating investigation article...")
    crash_data = {
        "name": name,
        "symbol": symbol,
        "chain": chain,
        "contract_address": address,
        "price_usd": token.price_usd,
        "price_change_24h": token.price_change_24h,
        "market_cap_usd": token.market_cap_usd,
        "source": token.source,
    }

    try:
        article = investigate_crashed_token(crash_data, onchain_report, community_report)
    except Exception as e:
        logger.error(f"  AI investigation failed: {e}")
        return False

    if not article:
        logger.error(f"  No article generated for {symbol}")
        return False

    # ── Step 4: Publish to Database ──
    guid = generate_guid(address, chain)

    # Select banner image
    img_keyword = article.get("banner_image_keyword", "scam")
    banner = FALLBACK_IMAGES.get(img_keyword, FALLBACK_IMAGES["default"])

    # Explorer link for the token
    explorer_links = {
        "ethereum": f"https://etherscan.io/token/{address}",
        "bsc": f"https://bscscan.com/token/{address}",
        "polygon": f"https://polygonscan.com/token/{address}",
    }
    explorer_link = explorer_links.get(chain, f"https://etherscan.io/token/{address}")

    red_flags = article.get("red_flags", [])
    if isinstance(red_flags, list):
        red_flags = json.dumps(red_flags)

    article_record = {
        "title": article.get("title", f"{symbol} Crash Investigation"),
        "link": explorer_link,
        "our_analysis": article.get("our_analysis", ""),
        "summary_analysis": article.get("summary_analysis", "")[:280],
        "guid": guid,
        "risk_level": article.get("risk_level", "MEDIUM RISK"),
        "rugpull_score": int(article.get("rugpull_score", 0)),
        "red_flags": red_flags,
        "banner_image": banner,
        "investigated_address": address,
        "investigated_chain": chain,
        "price_drop_pct": token.price_change_24h,
        "market_cap_at_detection": token.market_cap_usd,
        "community_sentiment": json.dumps(community_report) if community_report else None,
        "onchain_data": json.dumps(onchain_report, default=str) if onchain_report else None,
    }

    try:
        insert_investigation_article(article_record)
        log_scrape(guid, None, article_record["title"])
        logger.info(f"  PUBLISHED: \"{article_record['title'][:60]}...\"")
        logger.info(f"  Score: {article_record['rugpull_score']}/100, Risk: {article_record['risk_level']}")
        return True
    except Exception as e:
        logger.error(f"  Database insert failed: {e}")
        return False


def run_pipeline(threshold_pct=None, max_investigations=None, dry_run=False):
    """
    Run the full rugcheck pipeline.

    1. Discover crashed tokens across all APIs
    2. Filter and rank by severity
    3. Investigate top N tokens
    4. Publish articles
    """
    threshold = threshold_pct or CRASH_THRESHOLD_PCT
    max_inv = max_investigations or MAX_INVESTIGATIONS_PER_RUN

    logger.info("=" * 70)
    logger.info("RugCheck Pipeline Starting")
    logger.info(f"  Threshold: {threshold}% | Max investigations: {max_inv} | Dry run: {dry_run}")
    logger.info("=" * 70)

    start_time = datetime.utcnow()

    # Step 1: Discover
    logger.info("[DISCOVER] Finding crashed tokens...")
    crashed_tokens = discover_all_losers(threshold_pct=threshold)

    if not crashed_tokens:
        logger.info("No tokens meeting crash threshold found. Pipeline complete.")
        return

    logger.info(f"[DISCOVER] Found {len(crashed_tokens)} candidates")

    # Step 2: Filter already-investigated
    candidates = []
    for token in crashed_tokens:
        if is_address_investigated(token.contract_address):
            logger.debug(f"  Skipping already-investigated: {token.symbol}")
            continue
        candidates.append(token)

    if not candidates:
        logger.info("All discovered tokens already investigated. Pipeline complete.")
        return

    logger.info(f"[FILTER] {len(candidates)} new tokens to investigate (filtered {len(crashed_tokens) - len(candidates)} duplicates)")

    # Step 3: Investigate top N
    to_investigate = candidates[:max_inv]
    logger.info(f"[INVESTIGATE] Processing top {len(to_investigate)} tokens:")
    for i, t in enumerate(to_investigate, 1):
        logger.info(f"  {i}. {t.symbol:10s} {t.price_change_24h:+7.1f}% | ${t.market_cap_usd:>12,.0f} | {t.chain} | via {t.source}")

    published = 0
    for i, token in enumerate(to_investigate, 1):
        logger.info(f"\n{'─'*50}")
        logger.info(f"Investigation {i}/{len(to_investigate)}")
        logger.info(f"{'─'*50}")

        success = investigate_token(token, dry_run=dry_run)
        if success:
            published += 1

    elapsed = (datetime.utcnow() - start_time).total_seconds()
    logger.info(f"\n{'='*70}")
    logger.info(f"RugCheck Pipeline Complete")
    logger.info(f"  Discovered: {len(crashed_tokens)} crashed tokens")
    logger.info(f"  New candidates: {len(candidates)}")
    logger.info(f"  Investigated: {len(to_investigate)}")
    logger.info(f"  Published: {published}")
    logger.info(f"  Duration: {elapsed:.1f}s")
    logger.info(f"{'='*70}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RugCheck Pipeline — Crashed Token Investigation")
    parser.add_argument("--threshold", type=float, default=None,
                        help=f"Minimum 24h price drop %% to investigate (default: {CRASH_THRESHOLD_PCT})")
    parser.add_argument("--max", type=int, default=None,
                        help=f"Maximum investigations per run (default: {MAX_INVESTIGATIONS_PER_RUN})")
    parser.add_argument("--dry-run", action="store_true",
                        help="Discover and display candidates without investigating")
    args = parser.parse_args()

    env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if not os.environ.get("DATABASE_URL") and not os.path.exists(env_file):
        logger.error("DATABASE_URL not set. Copy .env.example to .env and configure it.")
        sys.exit(1)

    run_pipeline(
        threshold_pct=args.threshold,
        max_investigations=args.max,
        dry_run=args.dry_run,
    )
