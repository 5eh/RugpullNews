import json
from datetime import datetime
import psycopg2.extras
from db.connection import execute, fetch_all, fetch_one


def get_enabled_sources():
    """Get all enabled RSS feed sources."""
    return fetch_all("SELECT * FROM scrape_sources WHERE enabled = TRUE")


def is_duplicate(guid):
    """Check if an article with this guid has already been scraped."""
    row = fetch_one("SELECT id FROM scrape_log WHERE guid = %s", (guid,))
    return row is not None


def log_scrape(guid, source_id, title):
    """Log a scraped article for deduplication."""
    execute(
        "INSERT INTO scrape_log (guid, source_id, title) VALUES (%s, %s, %s) ON CONFLICT (guid) DO NOTHING",
        (guid, source_id, title),
    )


def insert_article(article_data):
    """Insert a processed article into the articles table."""
    execute(
        """INSERT INTO articles
            (creator, title, link, pubdate, dc_creator, content, contentsnippet,
             guid, isodate, risk_level, rugpull_score, red_flags,
             our_analysis, summary_analysis, banner_image,
             source_feed, scraped_at, processed, published)
           VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, TRUE, TRUE)
           ON CONFLICT (guid) DO NOTHING""",
        (
            article_data.get("creator", "RugPull News"),
            article_data["title"],
            article_data.get("link", ""),
            article_data.get("pubdate", ""),
            article_data.get("dc_creator", ""),
            article_data.get("content", ""),
            article_data.get("contentsnippet", ""),
            article_data["guid"],
            article_data.get("isodate", datetime.utcnow().isoformat()),
            article_data.get("risk_level"),
            article_data.get("rugpull_score", 0),
            json.dumps(article_data.get("red_flags", [])) if isinstance(article_data.get("red_flags"), list) else article_data.get("red_flags"),
            article_data.get("our_analysis"),
            article_data.get("summary_analysis"),
            article_data.get("banner_image", ""),
            article_data.get("source_feed", ""),
            datetime.utcnow().isoformat(),
        ),
    )


def update_source_last_scraped(source_id):
    """Update the last_scraped timestamp for a source."""
    execute(
        "UPDATE scrape_sources SET last_scraped = NOW() WHERE id = %s",
        (source_id,),
    )


def get_pending_token_submissions():
    """Get pending user submissions of type 'post' for potential token analysis."""
    return fetch_all(
        "SELECT * FROM user_submissions WHERE submission_type = 'post' AND status = 'pending' ORDER BY submitted_at ASC LIMIT 10"
    )


def is_address_investigated(address):
    """Check if a contract address has already been investigated."""
    row = fetch_one(
        "SELECT id FROM articles WHERE investigated_address = %s AND published = true",
        (address.lower(),),
    )
    return row is not None


def get_article_by_address(address):
    """Get a published article ID by investigated address."""
    return fetch_one(
        "SELECT id FROM articles WHERE investigated_address = %s AND published = true",
        (address.lower(),),
    )


def get_pending_investigations():
    """Get pending investigation submissions (for worker mode)."""
    return fetch_all(
        """SELECT id, contract_address, chain, user_analysis, creator
           FROM user_submissions
           WHERE submission_type = 'investigation' AND status = 'pending'
           ORDER BY submitted_at ASC LIMIT 3"""
    )


def update_submission_status(submission_id, status, article_id=None, error=None):
    """Update an investigation submission's processing status."""
    if status == "processing":
        execute(
            "UPDATE user_submissions SET status = %s, processing_started_at = NOW() WHERE id = %s",
            (status, submission_id),
        )
    elif status == "published":
        execute(
            "UPDATE user_submissions SET status = %s, result_article_id = %s WHERE id = %s",
            (status, article_id, submission_id),
        )
    elif status == "failed":
        execute(
            "UPDATE user_submissions SET status = %s, processing_error = %s WHERE id = %s",
            (status, str(error)[:500], submission_id),
        )
    elif status == "duplicate":
        execute(
            "UPDATE user_submissions SET status = %s, result_article_id = %s WHERE id = %s",
            (status, article_id, submission_id),
        )


def insert_investigation_article(article_data):
    """Insert a crash investigation article into the articles table."""
    execute(
        """INSERT INTO articles
            (creator, title, link, content, contentsnippet, guid, isodate,
             risk_level, rugpull_score, red_flags, our_analysis, summary_analysis,
             banner_image, source_feed, scraped_at, processed, published,
             article_type, investigated_address, investigated_chain,
             price_drop_pct, market_cap_at_detection, community_sentiment, onchain_data)
           VALUES
            (%s, %s, %s, %s, %s, %s, NOW(), %s, %s, %s, %s, %s, %s, %s, NOW(), TRUE, TRUE,
             'investigation', %s, %s, %s, %s, %s, %s)
           ON CONFLICT (guid) DO NOTHING""",
        (
            "RugPull News Investigation",
            article_data["title"],
            article_data.get("link", ""),
            article_data.get("our_analysis", ""),
            article_data.get("summary_analysis", ""),
            article_data["guid"],
            article_data.get("risk_level", "MEDIUM RISK"),
            article_data.get("rugpull_score", 0),
            article_data.get("red_flags", "[]"),
            article_data.get("our_analysis", ""),
            article_data.get("summary_analysis", ""),
            article_data.get("banner_image", ""),
            "RugPull News Investigation",
            article_data.get("investigated_address", "").lower(),
            article_data.get("investigated_chain", ""),
            article_data.get("price_drop_pct"),
            article_data.get("market_cap_at_detection"),
            article_data.get("community_sentiment", ""),
            psycopg2.extras.Json(json.loads(article_data["onchain_data"])) if isinstance(article_data.get("onchain_data"), str) else psycopg2.extras.Json(article_data.get("onchain_data")),
        ),
    )
