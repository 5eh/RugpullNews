-- RugPull News Database Schema
-- Run: psql $DATABASE_URL -f scripts/schema.sql

BEGIN;

-- Articles table - matches frontend Article interface
CREATE TABLE IF NOT EXISTS articles (
    id              SERIAL PRIMARY KEY,
    creator         TEXT NOT NULL DEFAULT 'RugPull News',
    title           TEXT NOT NULL,
    link            TEXT,
    pubdate         TEXT,
    dc_creator      TEXT,
    content         TEXT,
    contentsnippet  TEXT,
    guid            TEXT UNIQUE,
    isodate         TIMESTAMPTZ DEFAULT NOW(),
    risk_level      TEXT,
    rugpull_score   INTEGER DEFAULT 0,
    red_flags       TEXT,           -- JSON string array
    our_analysis    TEXT,
    summary_analysis TEXT,
    banner_image    TEXT,
    -- Scraper metadata columns
    source_feed     TEXT,
    scraped_at      TIMESTAMPTZ,
    processed       BOOLEAN DEFAULT FALSE,
    published       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    -- Rugcheck investigation columns
    article_type            TEXT DEFAULT 'rss',         -- 'rss' or 'investigation'
    investigated_address    TEXT,                        -- contract address that triggered investigation
    investigated_chain      TEXT,                        -- ethereum, bsc, polygon, solana, etc.
    price_drop_pct          NUMERIC,                    -- 24h price drop at time of detection
    market_cap_at_detection NUMERIC,                    -- market cap when flagged
    community_sentiment     TEXT,                        -- JSON: scraped community posts & sentiment
    onchain_data            JSONB                        -- full chain_intel report snapshot
);

-- User submissions table for posts and guides
CREATE TABLE IF NOT EXISTS user_submissions (
    id                  SERIAL PRIMARY KEY,
    submission_type     TEXT NOT NULL CHECK (submission_type IN ('post', 'guide', 'investigation')),
    -- Common fields
    title               TEXT NOT NULL,
    content             TEXT NOT NULL,
    -- Post-specific fields
    creator             TEXT,
    link                TEXT,
    contentsnippet      TEXT,
    risk_level          TEXT,
    rugpull_score       INTEGER DEFAULT 0,
    red_flags           TEXT,           -- JSON string
    our_analysis        TEXT,
    summary_analysis    TEXT,
    banner_image        TEXT,
    isodate             TEXT,
    -- Guide-specific fields
    author_name         TEXT,
    category            TEXT,
    experience_level    TEXT,
    summary             TEXT,
    key_takeaways       TEXT,           -- JSON string
    sections            TEXT,           -- JSON string
    sources             TEXT,
    author_credentials  TEXT,
    -- Investigation-specific fields
    contract_address    TEXT,                    -- smart contract to investigate
    chain               TEXT DEFAULT 'ethereum', -- blockchain network
    user_analysis       TEXT,                    -- user's optional analysis/context
    submitter_ip        TEXT,                    -- for rate limiting
    processing_started_at TIMESTAMPTZ,
    processing_error    TEXT,
    result_article_id   INTEGER REFERENCES articles(id),
    -- Metadata
    status              TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'published', 'failed', 'duplicate', 'approved', 'rejected')),
    submitted_at        TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at         TIMESTAMPTZ,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- RSS feed sources for the scraper
CREATE TABLE IF NOT EXISTS scrape_sources (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    url         TEXT NOT NULL UNIQUE,
    feed_type   TEXT DEFAULT 'rss',
    enabled     BOOLEAN DEFAULT TRUE,
    last_scraped TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Scrape log for deduplication
CREATE TABLE IF NOT EXISTS scrape_log (
    id          SERIAL PRIMARY KEY,
    guid        TEXT NOT NULL,
    source_id   INTEGER REFERENCES scrape_sources(id),
    title       TEXT,
    scraped_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(guid)
);

-- Article reports for community fact-checking
CREATE TABLE IF NOT EXISTS article_reports (
    id              SERIAL PRIMARY KEY,
    article_id      INTEGER NOT NULL REFERENCES articles(id),
    report_type     TEXT NOT NULL CHECK (report_type IN ('inaccuracy', 'misleading', 'outdated', 'missing_context', 'other')),
    description     TEXT NOT NULL,
    reporter_email  TEXT,
    status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_article_reports_article_id ON article_reports (article_id);
CREATE INDEX IF NOT EXISTS idx_article_reports_status ON article_reports (status);
CREATE INDEX IF NOT EXISTS idx_articles_published_isodate ON articles (published, isodate DESC);
CREATE INDEX IF NOT EXISTS idx_articles_guid ON articles (guid);
CREATE INDEX IF NOT EXISTS idx_articles_source_feed ON articles (source_feed);
CREATE INDEX IF NOT EXISTS idx_articles_article_type ON articles (article_type);
CREATE INDEX IF NOT EXISTS idx_articles_investigated_address ON articles (investigated_address);
CREATE INDEX IF NOT EXISTS idx_scrape_log_guid ON scrape_log (guid);
CREATE INDEX IF NOT EXISTS idx_user_submissions_type_status ON user_submissions (submission_type, status);
CREATE INDEX IF NOT EXISTS idx_user_submissions_contract_address ON user_submissions (contract_address);
CREATE INDEX IF NOT EXISTS idx_user_submissions_ip_time ON user_submissions (submitter_ip, submitted_at DESC);

-- Seed RSS feed sources
INSERT INTO scrape_sources (name, url) VALUES
    ('Crypto.news',         'https://crypto.news/feed/'),
    ('CCN',                 'https://www.ccn.com/feed/'),
    ('Web3 Is Going Great', 'https://web3isgoinggreat.com/feed.xml'),
    ('Rekt News',           'https://rekt.news/feed.xml'),
    ('CoinDesk',            'https://www.coindesk.com/arc/outboundfeeds/rss/'),
    ('The Block',           'https://www.theblock.co/rss.xml'),
    ('Chainalysis Blog',    'https://blog.chainalysis.com/feed/')
ON CONFLICT (url) DO NOTHING;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

COMMIT;
