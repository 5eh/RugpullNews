"""
On-chain analyzer - thin wrapper around chain_intel for backward compatibility.
The real work happens in chain_intel.py using Scrapling-powered scraping.
"""

import logging
from scraper.chain_intel import full_token_analysis

logger = logging.getLogger(__name__)


def analyze_contract(address, chain="ethereum"):
    """Run full token analysis via chain_intel."""
    return full_token_analysis(address, chain)
