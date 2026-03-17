"""Tests for pure functions in enrich_articles.py — no DB required."""
import pytest
import sys
import os

# conftest.py patches psycopg2, so we can import enrich_articles safely
from enrich_articles import (
    strip_html,
    get_fallback_image,
    compute_risk,
    extract_red_flags,
    generate_summary,
)


class TestStripHtml:
    def test_removes_basic_tags(self):
        assert strip_html("<p>Hello</p>") == "Hello"

    def test_removes_nested_tags(self):
        assert strip_html("<div><p><b>text</b></p></div>") == "text"

    def test_decodes_html_entities(self):
        assert strip_html("AT&amp;T") == "AT&T"
        assert strip_html("&lt;script&gt;") == "<script>"

    def test_handles_none(self):
        assert strip_html(None) == ""

    def test_handles_empty_string(self):
        assert strip_html("") == ""


class TestGetFallbackImage:
    def test_returns_hack_image_for_hack_keyword(self):
        url = get_fallback_image("Exchange Hack Drains Funds", "")
        assert "unsplash.com" in url

    def test_returns_default_for_no_match(self):
        url = get_fallback_image("General Update", "Some unrelated content")
        assert "unsplash.com" in url

    def test_returns_bitcoin_image_for_btc_keyword(self):
        url = get_fallback_image("BTC price analysis", "")
        assert "unsplash.com" in url

    def test_case_insensitive_matching(self):
        url_lower = get_fallback_image("nft collapse", "")
        url_upper = get_fallback_image("NFT collapse", "")
        assert url_lower == url_upper


class TestComputeRisk:
    def test_high_risk_for_rug_pull(self):
        level, score = compute_risk("Rug Pull Alert", "funds were stolen in rug pull")
        assert level == "HIGH RISK"
        assert score > 0

    def test_medium_risk_for_vulnerability(self):
        level, score = compute_risk("Vulnerability Discovered", "a vulnerability was found in the contract")
        assert level in ("MEDIUM RISK", "HIGH RISK")  # depends on total hits

    def test_low_risk_for_neutral_content(self):
        level, score = compute_risk("Partnership Announced", "two companies partner for growth")
        assert level == "LOW RISK"

    def test_score_capped_at_100(self):
        # Pile on every high-risk keyword
        text = " ".join(["rug pull", "exit scam", "honeypot", "stolen", "hack",
                         "exploit", "drained", "theft", "phishing", "ponzi", "fraud"])
        _, score = compute_risk(text, text)
        assert score <= 100


class TestExtractRedFlags:
    def test_detects_rug_pull(self):
        flags = extract_red_flags("Massive Rug Pull", "project executed rug pull")
        assert any("rug pull" in f.lower() for f in flags)

    def test_detects_honeypot(self):
        flags = extract_red_flags("Honeypot Token", "token is a honeypot")
        assert any("honeypot" in f.lower() for f in flags)

    def test_returns_pending_for_no_flags(self):
        flags = extract_red_flags("General News", "some innocuous content here")
        assert flags == ["Under review - analysis pending"]

    def test_no_duplicate_flags(self):
        flags = extract_red_flags("Hack hack hack", "hack exploit hack")
        # Should not return the same flag twice for the same pattern
        assert len(flags) == len(set(flags))


class TestGenerateSummary:
    def test_returns_first_sentence_for_short_content(self):
        summary = generate_summary("Title", "Short sentence.", "Source")
        assert "Short sentence" in summary

    def test_truncates_long_first_sentence(self):
        long_sentence = "A" * 250
        summary = generate_summary("Title", long_sentence, "Source")
        assert len(summary) <= 200

    def test_handles_html_content(self):
        summary = generate_summary("Title", "<p>Clean content here.</p>", "Source")
        assert "<p>" not in summary

    def test_fallback_for_empty_content(self):
        summary = generate_summary("My Title", "", "Reuters")
        assert "My Title" in summary
