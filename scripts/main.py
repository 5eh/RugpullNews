#!/usr/bin/env python3
"""
RugPull News Daily Scraper & Analysis Engine

Pipeline:
  1. Fetch RSS feeds from enabled sources via Scrapling
  2. Deduplicate against scrape_log
  3. Process new articles through Claude for risk analysis
  4. Insert enriched articles into PostgreSQL
  5. Process pending user token submissions with on-chain intelligence

Usage: python3 main.py
Cron:  0 6 * * * cd /app/scripts && python3 main.py >> /var/log/scraper.log 2>&1
"""

import sys
import os
import re
import json
import logging
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config import MAX_ARTICLES_PER_RUN, ANTHROPIC_API_KEY
from db.queries import (
    get_enabled_sources,
    is_duplicate,
    log_scrape,
    insert_article,
    update_source_last_scraped,
    get_pending_token_submissions,
)
from scraper.rss_scraper import fetch_feed
from ai.claude_processor import process_article, analyze_token_submission

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("main")


# Regex to detect contract addresses in article content
CONTRACT_RE = re.compile(r"0x[a-fA-F0-9]{40}")


def extract_contract_addresses(text):
    """Pull any Ethereum-style contract addresses from text."""
    return list(set(CONTRACT_RE.findall(text or "")))


def run_scraper():
    """Main scraper pipeline."""
    logger.info("=== RugPull News Scraper Starting ===")
    start_time = datetime.utcnow()

    # Step 1: Load enabled sources
    sources = get_enabled_sources()
    logger.info(f"Found {len(sources)} enabled sources")

    if not sources:
        logger.warning("No enabled sources found. Run schema.sql to seed sources.")
        return

    # Step 2: Fetch all feeds and collect new articles
    new_articles = []
    for source in sources:
        entries = fetch_feed(source)
        for entry in entries:
            if not is_duplicate(entry["guid"]):
                entry["_source_id"] = source["id"]
                new_articles.append(entry)
        update_source_last_scraped(source["id"])

    logger.info(f"Found {len(new_articles)} new articles across all feeds")

    # Step 3: Cap per run
    if len(new_articles) > MAX_ARTICLES_PER_RUN:
        logger.info(f"Capping at {MAX_ARTICLES_PER_RUN} articles")
        new_articles = new_articles[:MAX_ARTICLES_PER_RUN]

    # Step 4: Process each article with Claude
    processed_count = 0
    for article in new_articles:
        source_id = article.pop("_source_id")
        try:
            # If article mentions contract addresses, try on-chain enrichment
            addresses = extract_contract_addresses(
                (article.get("content", "") + " " + article.get("title", ""))
            )
            if addresses:
                logger.info(f"Found {len(addresses)} contract address(es) in article")
                try:
                    from scraper.chain_intel import full_token_analysis
                    # Analyze first address found (most likely the main subject)
                    intel = full_token_analysis(addresses[0])
                    article["_onchain_intel"] = intel
                    # Merge flags into article for Claude
                    article["_onchain_flags"] = intel.get("all_flags", [])
                except Exception as e:
                    logger.warning(f"On-chain analysis failed: {e}")

            enriched = process_article(article)
            # Clean up internal keys before insert
            enriched.pop("_onchain_intel", None)
            enriched.pop("_onchain_flags", None)
            insert_article(enriched)
            log_scrape(article["guid"], source_id, article["title"])
            processed_count += 1
            logger.info(f"Inserted: {article['title'][:60]}...")
        except Exception as e:
            logger.error(f"Failed to process '{article.get('title', '?')[:40]}': {e}")

    # Step 5: Process pending token submissions with full on-chain analysis
    try:
        pending = get_pending_token_submissions()
        if pending:
            logger.info(f"Processing {len(pending)} pending token submissions")
            from scraper.chain_intel import full_token_analysis

            for submission in pending:
                sub = dict(submission)
                # Try to extract contract addresses from submission content
                addresses = extract_contract_addresses(
                    (sub.get("content", "") + " " + sub.get("link", ""))
                )
                onchain_data = None
                if addresses:
                    logger.info(f"Running chain intel on {addresses[0]}")
                    onchain_data = full_token_analysis(addresses[0])

                analysis = analyze_token_submission(sub, onchain_data)
                if analysis:
                    logger.info(
                        f"Analyzed submission '{sub.get('title', '?')[:40]}' -> "
                        f"score={analysis.get('rugpull_score', '?')}"
                    )
    except Exception as e:
        logger.error(f"Token submission processing error: {e}")

    elapsed = (datetime.utcnow() - start_time).total_seconds()
    logger.info(
        f"=== Scraper Complete: {processed_count}/{len(new_articles)} articles "
        f"in {elapsed:.1f}s ==="
    )


def run_rugcheck():
    """Run the crashed-token investigation pipeline after RSS scraping."""
    try:
        from rugcheck_pipeline import run_pipeline
        logger.info("=== Starting RugCheck Investigation Pipeline ===")
        run_pipeline()
    except Exception as e:
        logger.error(f"RugCheck pipeline error: {e}")


if __name__ == "__main__":
    env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    has_env_file = os.path.exists(env_file)

    if not os.environ.get("DATABASE_URL") and not has_env_file:
        logger.error("DATABASE_URL not set. Copy .env.example to .env and configure it.")
        sys.exit(1)

    run_scraper()

    # After RSS scraping, run the rugcheck pipeline to find & investigate crashed tokens
    run_rugcheck()
