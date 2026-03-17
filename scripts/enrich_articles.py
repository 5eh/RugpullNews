#!/usr/bin/env python3
"""
One-time article enrichment script.
Generates structured news-style analysis from raw RSS content.
Assigns fallback images, proper red flags, and risk scoring based on keywords.
"""

import sys, os, re, json, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

import psycopg2
from psycopg2.extras import RealDictCursor

DB_URL = os.environ.get("DATABASE_URL", "")

# Fallback images by topic category
FALLBACK_IMAGES = {
    "hack": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "exploit": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    "scam": "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
    "rug": "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
    "fraud": "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&q=80",
    "regulation": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "sec": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "law": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&q=80",
    "bitcoin": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    "btc": "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800&q=80",
    "ethereum": "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    "eth": "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=800&q=80",
    "defi": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    "nft": "https://images.unsplash.com/photo-1646463910745-0ce050e1132f?w=800&q=80",
    "default": "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
}

# Keywords that indicate risk
HIGH_RISK_KEYWORDS = [
    "rug pull", "rugpull", "exit scam", "honeypot", "stolen", "hack", "exploit",
    "drained", "theft", "phishing", "ponzi", "fraud", "arrest", "indicted",
    "laundering", "million stolen", "billion stolen",
]
MEDIUM_RISK_KEYWORDS = [
    "vulnerability", "bug", "loss", "liquidat", "crash", "dump", "suspicious",
    "investigation", "warning", "concern", "risk", "attack", "breach", "compromis",
    "shutdown", "insolvenc", "bankrupt", "collapse",
]
LOW_RISK_KEYWORDS = [
    "partnership", "launch", "update", "upgrade", "growth", "adoption",
    "regulation", "compliance", "security", "audit", "review",
]


def strip_html(text):
    """Remove HTML tags and decode entities."""
    clean = re.sub(r"<[^>]+>", "", text or "")
    clean = html.unescape(clean)
    return clean.strip()


def get_fallback_image(title, content):
    """Pick the best fallback image based on article keywords."""
    combined = (title + " " + content).lower()
    for keyword, url in FALLBACK_IMAGES.items():
        if keyword == "default":
            continue
        if keyword in combined:
            return url
    return FALLBACK_IMAGES["default"]


def compute_risk(title, content):
    """Compute risk_level and rugpull_score from content keywords."""
    combined = (title + " " + (content or "")).lower()

    high_hits = sum(1 for kw in HIGH_RISK_KEYWORDS if kw in combined)
    med_hits = sum(1 for kw in MEDIUM_RISK_KEYWORDS if kw in combined)

    score = min(high_hits * 18 + med_hits * 7, 100)

    if score >= 60:
        return "HIGH RISK", score
    elif score >= 25:
        return "MEDIUM RISK", score
    else:
        return "LOW RISK", score


def extract_red_flags(title, content):
    """Extract specific red flags from article content."""
    combined = (title + " " + (content or "")).lower()
    flags = []

    patterns = [
        (r"(\$[\d,.]+\s*(?:million|billion|m|b))\s*(?:stolen|lost|drained|hacked|exploited)", "Funds compromised: {}"),
        (r"rug\s*pull", "Identified as potential rug pull"),
        (r"honeypot", "Honeypot characteristics detected"),
        (r"exit\s*scam", "Exit scam indicators present"),
        (r"unverified\s*contract", "Contract code not verified"),
        (r"anonymous\s*team", "Anonymous or unidentifiable team"),
        (r"ponzi", "Ponzi scheme characteristics"),
        (r"phishing", "Phishing attack vector identified"),
        (r"exploit(?:ed|s)?", "Security exploit identified"),
        (r"hack(?:ed|s)?", "System was compromised by hackers"),
        (r"drain(?:ed|s)?", "Funds were drained from the protocol"),
        (r"liquidat(?:ed|ion)", "Significant liquidation event"),
        (r"vulnerability", "Security vulnerability identified"),
        (r"arrest(?:ed)?|indict(?:ed|ment)", "Legal action taken against individuals"),
        (r"laundering", "Money laundering allegations"),
        (r"shutdown|shut\s*down", "Project or service shut down"),
        (r"insolvenc|bankrupt", "Insolvency or bankruptcy reported"),
    ]

    for pattern, template in patterns:
        match = re.search(pattern, combined)
        if match:
            if "{}" in template and match.groups():
                flags.append(template.format(match.group(1).strip()))
            else:
                flags.append(template)

    return flags if flags else ["Under review - analysis pending"]


def generate_analysis(title, content, source, snippet):
    """Generate a structured news analysis from the raw content."""
    clean_content = strip_html(content)
    clean_snippet = strip_html(snippet)

    # Use the full content if available, otherwise the snippet
    body = clean_content if len(clean_content) > len(clean_snippet) else clean_snippet

    if not body or len(body) < 50:
        return f"This article from {source} covers \"{title}\". Our editorial team is currently reviewing this story for a comprehensive analysis. Check back soon for our detailed assessment including risk factors, red flags, and implications for the broader crypto ecosystem."

    # Break content into sentences
    sentences = re.split(r'(?<=[.!?])\s+', body)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 20]

    if not sentences:
        return f"This article from {source} reports on \"{title}\". {body[:400]}"

    # Build structured analysis
    parts = []

    # Opening context paragraph
    if len(sentences) >= 2:
        parts.append(f"{sentences[0]} {sentences[1]}")
    else:
        parts.append(sentences[0])

    # Middle detail paragraphs - use remaining content
    remaining = " ".join(sentences[2:]) if len(sentences) > 2 else ""
    if remaining:
        # Split into roughly equal paragraphs
        mid = len(remaining) // 2
        split_point = remaining.find(". ", mid)
        if split_point > 0:
            parts.append(remaining[:split_point + 1].strip())
            parts.append(remaining[split_point + 1:].strip())
        else:
            parts.append(remaining.strip())

    # Closing implications paragraph
    risk_level, _ = compute_risk(title, body)
    if risk_level == "HIGH RISK":
        parts.append(f"This incident underscores ongoing security challenges in the cryptocurrency space. Investors and users are advised to exercise heightened caution and verify all claims independently. RugPull News will continue monitoring this situation for further developments.")
    elif risk_level == "MEDIUM RISK":
        parts.append(f"While the full implications remain to be seen, this development warrants attention from market participants. Users should conduct their own due diligence and stay informed about evolving risks in the space.")
    else:
        parts.append(f"This development reflects the continuing evolution of the cryptocurrency ecosystem. As the space matures, staying informed about both opportunities and risks remains essential for all participants.")

    return "\n\n".join(p for p in parts if p)


def generate_summary(title, content, source):
    """Generate a concise summary for article cards."""
    clean = strip_html(content)
    if clean and len(clean) > 50:
        # Take first sentence or first 180 chars
        first_sentence = re.split(r'(?<=[.!?])\s+', clean)[0]
        if len(first_sentence) <= 200:
            return first_sentence
        return clean[:197] + "..."
    return f"Analysis of {title[:150]} - sourced from {source}."


def enrich_all():
    conn = psycopg2.connect(DB_URL, cursor_factory=RealDictCursor)
    cur = conn.cursor()

    # Get all articles
    cur.execute("SELECT id, title, content, contentsnippet, our_analysis, banner_image, source_feed, red_flags FROM articles ORDER BY id")
    articles = cur.fetchall()
    print(f"Processing {len(articles)} articles...")

    updated = 0
    for art in articles:
        needs_update = False
        updates = {}

        title = art["title"]
        content = art["content"] or ""
        snippet = art["contentsnippet"] or ""
        source = art["source_feed"] or "Unknown"

        # 1. Fix analysis if it's just copied content or too short
        current_analysis = art["our_analysis"] or ""
        if len(current_analysis) < 100 or current_analysis == content[:500]:
            analysis = generate_analysis(title, content, source, snippet)
            updates["our_analysis"] = analysis
            updates["summary_analysis"] = generate_summary(title, content, source)
            needs_update = True

        # 2. Fix risk scoring
        risk_level, score = compute_risk(title, content)
        current_flags = art["red_flags"] or "[]"
        if current_flags in ('["Pending AI analysis"]', '["AI analysis unavailable"]', '[]', ''):
            flags = extract_red_flags(title, content)
            updates["risk_level"] = risk_level
            updates["rugpull_score"] = score
            updates["red_flags"] = json.dumps(flags)
            needs_update = True

        # 3. Fix missing banner image
        if not art["banner_image"] or art["banner_image"].strip() == "":
            updates["banner_image"] = get_fallback_image(title, content)
            needs_update = True

        # 4. Fix missing/short content snippet
        if not snippet or len(snippet) < 30:
            clean = strip_html(content)
            if clean:
                updates["contentsnippet"] = clean[:200]
                needs_update = True

        if needs_update:
            set_clauses = ", ".join(f"{k} = %s" for k in updates)
            values = list(updates.values()) + [art["id"]]
            cur.execute(f"UPDATE articles SET {set_clauses} WHERE id = %s", values)
            updated += 1
            print(f"  [{art['id']}] {title[:55]}... -> {updates.get('risk_level', '-')}")

    conn.commit()
    cur.close()
    conn.close()
    print(f"\nDone! Updated {updated}/{len(articles)} articles.")


if __name__ == "__main__":
    enrich_all()
