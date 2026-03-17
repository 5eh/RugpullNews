"""
RSS Feed Scraper - powered by Scrapling + feedparser.
Uses Scrapling's Fetcher for reliable HTTP with anti-bot TLS fingerprinting,
then feedparser for RSS/Atom XML parsing.
"""

import feedparser
import hashlib
import logging
import re
from datetime import datetime
from io import BytesIO

from scrapling.fetchers import Fetcher

logger = logging.getLogger(__name__)

FEED_TIMEOUT = 20  # seconds


def fetch_feed(source):
    """Fetch and parse an RSS feed using Scrapling, returning normalized entries."""
    url = source["url"]
    source_name = source["name"]
    logger.info(f"Fetching feed: {source_name} ({url})")

    try:
        page = Fetcher.get(
            url,
            stealthy_headers=True,
            timeout=FEED_TIMEOUT,
        )

        if page.status != 200:
            logger.warning(f"{source_name} returned status {page.status}")
            return []

        feed = feedparser.parse(BytesIO(page.body))

        if feed.bozo and not feed.entries:
            logger.warning(f"Feed parse error for {source_name}: {feed.bozo_exception}")
            return []

        articles = []
        for entry in feed.entries:
            article = normalize_entry(entry, source_name, url)
            if article:
                articles.append(article)

        logger.info(f"Fetched {len(articles)} entries from {source_name}")
        return articles

    except Exception as e:
        logger.error(f"Error fetching {source_name}: {e}")
        return []


def normalize_entry(entry, source_name, feed_url):
    """Normalize a feedparser entry into our article format."""
    guid = getattr(entry, "id", None) or getattr(entry, "link", None)
    if not guid:
        raw = f"{getattr(entry, 'title', '')}{getattr(entry, 'link', '')}"
        guid = hashlib.sha256(raw.encode()).hexdigest()

    title = getattr(entry, "title", "Untitled")
    link = getattr(entry, "link", "")

    # Extract content
    content = ""
    if hasattr(entry, "content") and entry.content:
        content = entry.content[0].get("value", "")
    elif hasattr(entry, "summary"):
        content = entry.summary or ""
    elif hasattr(entry, "description"):
        content = entry.description or ""

    # Content snippet (plain text, first 200 chars)
    snippet = ""
    if hasattr(entry, "summary_detail"):
        snippet = getattr(entry.summary_detail, "value", "")
    elif hasattr(entry, "summary"):
        snippet = entry.summary or ""
    snippet = re.sub(r"<[^>]+>", "", snippet).strip()[:200]

    # Date handling
    published = getattr(entry, "published", "")
    isodate = None
    if hasattr(entry, "published_parsed") and entry.published_parsed:
        try:
            isodate = datetime(*entry.published_parsed[:6]).isoformat()
        except Exception:
            pass
    if not isodate:
        isodate = datetime.utcnow().isoformat()

    creator = getattr(entry, "author", source_name)
    dc_creator = getattr(entry, "author", source_name)

    # Extract banner image
    banner_image = ""
    if hasattr(entry, "media_content") and entry.media_content:
        banner_image = entry.media_content[0].get("url", "")
    elif hasattr(entry, "media_thumbnail") and entry.media_thumbnail:
        banner_image = entry.media_thumbnail[0].get("url", "")
    else:
        img_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', content)
        if img_match:
            banner_image = img_match.group(1)

    return {
        "title": title,
        "link": link,
        "pubdate": published,
        "dc_creator": dc_creator,
        "content": content,
        "contentsnippet": snippet,
        "guid": guid,
        "isodate": isodate,
        "creator": creator,
        "banner_image": banner_image,
        "source_feed": source_name,
    }
