#!/usr/bin/env python3
"""
Investigation Worker — processes user-submitted contract investigations.

Modes:
  --worker                          Poll DB every 30s for pending submissions
  --submission-id N --address 0x..  Process a single submission directly

Pipeline per submission:
  1. Mark as 'processing'
  2. Dedup check (already published?)
  3. On-chain analysis via chain_intel
  4. Community scraping via community_scraper
  5. AI article generation via claude_processor
  6. Publish to articles table
  7. Update submission status → 'published'
"""

import sys
import os
import json
import logging
import argparse
import hashlib
import time
from datetime import datetime, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import MAX_INVESTIGATIONS_PER_RUN
from db.queries import (
    get_pending_investigations,
    update_submission_status,
    get_article_by_address,
    insert_investigation_article,
    log_scrape,
)
from scraper.chain_intel import full_token_analysis
from scraper.community_scraper import scrape_community
from ai.claude_processor import investigate_user_submission

FALLBACK_IMAGES = {
    "hack": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "exploit": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "scam": "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
    "regulation": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "defi": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    "ethereum": "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    "default": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
}

EXPLORER_LINKS = {
    "ethereum": "https://etherscan.io/token/{address}",
    "bsc": "https://bscscan.com/token/{address}",
    "polygon": "https://polygonscan.com/token/{address}",
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("investigate_submission")

WORKER_POLL_INTERVAL = 30  # seconds


def generate_guid(address, chain):
    """Generate a unique GUID for a user-submitted investigation."""
    raw = f"community:{chain}:{address.lower()}:{datetime.now(timezone.utc).strftime('%Y-%m-%d')}"
    return f"community-{hashlib.sha256(raw.encode()).hexdigest()[:16]}"


def process_submission(submission_id, address, chain, user_analysis="", creator="Community Member"):
    """
    Run the full investigation pipeline for a user-submitted contract.
    Returns the article ID if published, None otherwise.
    """
    logger.info(f"Processing submission #{submission_id}: {address} on {chain}")

    # Step 1: Mark as processing
    update_submission_status(submission_id, "processing")

    try:
        # Step 2: Dedup — check if already published
        existing = get_article_by_address(address)
        if existing:
            logger.info(f"  Already investigated: article #{existing['id']}")
            update_submission_status(submission_id, "duplicate", article_id=existing["id"])
            return existing["id"]

        # Step 3: On-chain analysis
        logger.info(f"  [1/3] Running on-chain analysis...")
        chain_map = {
            "ethereum": "ethereum", "bsc": "bsc", "polygon": "polygon",
            "arbitrum": "ethereum", "base": "ethereum", "avalanche": "ethereum",
        }
        analysis_chain = chain_map.get(chain, "ethereum")
        onchain_report = None
        try:
            onchain_report = full_token_analysis(address, analysis_chain)
            logger.info(f"  On-chain: score={onchain_report.get('risk_score', '?')}, {len(onchain_report.get('all_flags', []))} flags")
        except Exception as e:
            logger.error(f"  On-chain analysis error: {e}")

        # Step 4: Community scraping
        logger.info(f"  [2/3] Scraping community sentiment...")
        community_report = None
        token_name = "Unknown Token"
        token_symbol = "???"

        if onchain_report:
            token_name = (
                onchain_report.get("security", {}).get("token_name")
                or onchain_report.get("token_info", {}).get("token_name")
                or "Unknown Token"
            )

        try:
            community_data = scrape_community(token_name, token_symbol, address)
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
            logger.info(f"  Community: {community_report['total_posts_found']} posts")
        except Exception as e:
            logger.error(f"  Community scraping error: {e}")

        # Step 5: AI investigation article
        logger.info(f"  [3/3] Generating investigation article...")
        article = investigate_user_submission(
            address=address,
            chain=chain,
            user_analysis=user_analysis,
            onchain_data=onchain_report,
            community_report=community_report,
            creator=creator,
        )

        if not article:
            raise RuntimeError("Article generation returned None")

        # Step 6: Publish to articles table
        guid = generate_guid(address, chain)
        img_keyword = article.get("banner_image_keyword", "scam")
        banner = FALLBACK_IMAGES.get(img_keyword, FALLBACK_IMAGES["default"])
        explorer_link = EXPLORER_LINKS.get(chain, EXPLORER_LINKS["ethereum"]).format(address=address)

        red_flags = article.get("red_flags", [])
        if isinstance(red_flags, list):
            red_flags = json.dumps(red_flags)

        article_record = {
            "title": article.get("title", f"Community Investigation: {address[:16]}..."),
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
            "price_drop_pct": article.get("price_change_24h"),
            "market_cap_at_detection": article.get("market_cap_usd"),
            "community_sentiment": json.dumps(community_report) if community_report else None,
            "onchain_data": json.dumps(onchain_report, default=str) if onchain_report else None,
        }

        insert_investigation_article(article_record)
        log_scrape(guid, None, article_record["title"])

        # Get the inserted article's ID
        from db.connection import fetch_one
        inserted = fetch_one(
            "SELECT id FROM articles WHERE guid = %s", (guid,)
        )
        article_id = inserted["id"] if inserted else None

        # Step 7: Update submission → published
        if article_id:
            update_submission_status(submission_id, "published", article_id=article_id)
            logger.info(f"  PUBLISHED: article #{article_id} — \"{article_record['title'][:60]}\"")
            logger.info(f"  Score: {article_record['rugpull_score']}/100, Risk: {article_record['risk_level']}")
            return article_id
        else:
            update_submission_status(submission_id, "failed", error="Article inserted but ID not found")
            return None

    except Exception as e:
        logger.error(f"  FAILED: {e}")
        update_submission_status(submission_id, "failed", error=str(e))
        return None


def run_worker():
    """Poll the database for pending investigation submissions and process them."""
    logger.info("Investigation worker started (polling every %ds)", WORKER_POLL_INTERVAL)

    while True:
        try:
            pending = get_pending_investigations()
            if pending:
                logger.info(f"Found {len(pending)} pending investigations")
                for sub in pending:
                    process_submission(
                        submission_id=sub["id"],
                        address=sub["contract_address"],
                        chain=sub.get("chain", "ethereum"),
                        user_analysis=sub.get("user_analysis", ""),
                        creator=sub.get("creator", "Community Member"),
                    )
        except Exception as e:
            logger.error(f"Worker poll error: {e}")

        time.sleep(WORKER_POLL_INTERVAL)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Investigation Submission Worker")
    parser.add_argument("--worker", action="store_true", help="Run in worker mode (poll DB)")
    parser.add_argument("--submission-id", type=int, help="Process a specific submission")
    parser.add_argument("--address", type=str, help="Contract address (for direct mode)")
    parser.add_argument("--chain", type=str, default="ethereum", help="Blockchain (default: ethereum)")
    parser.add_argument("--user-analysis", type=str, default="", help="User's analysis text")
    args = parser.parse_args()

    if args.worker:
        run_worker()
    elif args.submission_id and args.address:
        process_submission(
            submission_id=args.submission_id,
            address=args.address,
            chain=args.chain,
            user_analysis=args.user_analysis,
        )
    else:
        parser.print_help()
        sys.exit(1)
