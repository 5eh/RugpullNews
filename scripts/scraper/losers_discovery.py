"""
Losers Discovery Module — finds tokens that crashed 60%+ in 24h.

Sources (all free tier):
  1. CoinMarketCap /v1/cryptocurrency/listings/latest (sorted by 24h loss)
  2. Moralis /market-data/erc20s/top-losers
  3. GeckoTerminal /networks/{chain}/new_pools (new pools that crashed)

Outputs a deduplicated list of CrashedToken dicts ready for investigation.
"""

import logging
import time
from dataclasses import dataclass, asdict

import requests as http_requests

from config import CMC_API_KEY, MORALIS_API_KEY, CRASH_THRESHOLD_PCT, MIN_MARKET_CAP_USD

logger = logging.getLogger(__name__)

REQUEST_TIMEOUT = 20

# Tokens to ignore (stablecoins, wrapped, well-known infrastructure)
IGNORE_SYMBOLS = {
    "USDT", "USDC", "BUSD", "DAI", "TUSD", "USDP", "GUSD", "FRAX", "LUSD",
    "WETH", "WBTC", "WBNB", "WMATIC", "STETH", "RETH", "CBETH",
}

# Chain name normalization
CHAIN_MAP = {
    "1": "ethereum", "eth": "ethereum", "ethereum": "ethereum",
    "56": "bsc", "bsc": "bsc", "binance": "bsc", "bnb": "bsc",
    "binance-smart-chain": "bsc", "bnb-smart-chain": "bsc",
    "137": "polygon", "polygon": "polygon", "matic": "polygon",
    "polygon-ecosystem-token": "polygon",
    "42161": "arbitrum", "arbitrum": "arbitrum",
    "43114": "avalanche", "avalanche": "avalanche", "avax": "avalanche",
    "8453": "base", "base": "base",
    "solana": "solana",
}


@dataclass
class CrashedToken:
    """A token detected with a significant price crash."""
    name: str
    symbol: str
    contract_address: str
    chain: str
    price_usd: float
    price_change_24h: float       # negative percentage
    market_cap_usd: float
    volume_24h_usd: float
    source: str                    # which API found it
    cmc_id: int | None = None      # CoinMarketCap ID if available
    rank: int | None = None


def _normalize_chain(raw):
    """Normalize chain identifiers to our standard names."""
    if not raw:
        return "unknown"
    return CHAIN_MAP.get(str(raw).lower(), str(raw).lower())


def _should_skip(symbol, name):
    """Filter out stablecoins, wrapped tokens, and obvious non-rug tokens."""
    if not symbol:
        return True
    sym = symbol.upper()
    if sym in IGNORE_SYMBOLS:
        return True
    name_lower = (name or "").lower()
    if any(term in name_lower for term in ["wrapped", "bridged", "staked", "liquid staking"]):
        return True
    return False


# ──────────────────────────────────────────────
# Source 1: CoinMarketCap Listings (Free Tier)
# ──────────────────────────────────────────────
def discover_cmc_losers(threshold_pct=None, min_mcap=None):
    """
    Fetch CMC listings sorted by worst 24h performance.
    Free tier: 30 calls/min, 10k calls/month.
    Returns tokens that dropped more than threshold_pct in 24h.
    """
    if not CMC_API_KEY:
        logger.warning("CMC_API_KEY not set — skipping CMC discovery")
        return []

    threshold = threshold_pct or CRASH_THRESHOLD_PCT
    mcap_floor = min_mcap or MIN_MARKET_CAP_USD

    url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
    params = {
        "sort": "percent_change_24h",
        "sort_dir": "asc",
        "limit": 200,
        "aux": "platform,cmc_rank",
        "cryptocurrency_type": "tokens",    # only tokens, not L1 coins
    }
    headers = {
        "X-CMC_PRO_API_KEY": CMC_API_KEY,
        "Accept": "application/json",
    }

    try:
        resp = http_requests.get(url, params=params, headers=headers, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error(f"CMC API error: {e}")
        return []

    results = []
    for coin in data.get("data", []):
        symbol = coin.get("symbol", "")
        name = coin.get("name", "")
        if _should_skip(symbol, name):
            continue

        quote = coin.get("quote", {}).get("USD", {})
        pct_24h = quote.get("percent_change_24h", 0) or 0
        mcap = quote.get("market_cap", 0) or 0
        price = quote.get("price", 0) or 0
        volume = quote.get("volume_24h", 0) or 0

        # Must meet crash threshold
        if pct_24h > threshold:
            continue

        # Must have some market cap (filters dust)
        if mcap < mcap_floor:
            continue

        # Get contract address from platform field
        platform = coin.get("platform")
        if not platform or not platform.get("token_address"):
            continue

        chain = _normalize_chain(platform.get("slug", platform.get("name", "")))

        results.append(CrashedToken(
            name=name,
            symbol=symbol,
            contract_address=platform["token_address"],
            chain=chain,
            price_usd=price,
            price_change_24h=pct_24h,
            market_cap_usd=mcap,
            volume_24h_usd=volume,
            source="coinmarketcap",
            cmc_id=coin.get("id"),
            rank=coin.get("cmc_rank"),
        ))

    logger.info(f"CMC: found {len(results)} tokens with >{abs(threshold)}% 24h drop")
    return results


# ──────────────────────────────────────────────
# Source 2: Moralis Top Losers (Free Tier)
# ──────────────────────────────────────────────
def discover_moralis_losers(threshold_pct=None):
    """
    Fetch Moralis top ERC-20 tokens and filter for big losers.
    Uses /top-tokens endpoint (available on free tier) and sorts client-side.
    Free tier: 40k compute units/day.
    """
    if not MORALIS_API_KEY:
        logger.warning("MORALIS_API_KEY not set — skipping Moralis discovery")
        return []

    threshold = threshold_pct or CRASH_THRESHOLD_PCT

    url = "https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-tokens"
    headers = {
        "X-API-Key": MORALIS_API_KEY,
        "Accept": "application/json",
    }

    try:
        resp = http_requests.get(url, headers=headers, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error(f"Moralis API error: {e}")
        return []

    def _safe_float(val, default=0):
        """Convert to float, handling 'null' strings and None."""
        if val is None or val == "null" or val == "":
            return default
        try:
            return float(val)
        except (ValueError, TypeError):
            return default

    results = []
    for token in data if isinstance(data, list) else []:
        symbol = token.get("token_symbol", "")
        name = token.get("token_name", "")
        if _should_skip(symbol, name):
            continue

        pct_24h = _safe_float(token.get("price_24h_percent_change"))
        if pct_24h > threshold:
            continue

        address = token.get("contract_address", "")
        if not address:
            continue

        results.append(CrashedToken(
            name=name,
            symbol=symbol,
            contract_address=address,
            chain="ethereum",       # Moralis top-tokens is ERC-20 only
            price_usd=_safe_float(token.get("price_usd")),
            price_change_24h=pct_24h,
            market_cap_usd=_safe_float(token.get("market_cap_usd")),
            volume_24h_usd=0,       # not provided by this endpoint
            source="moralis",
        ))

    # Sort by worst drop
    results.sort(key=lambda t: t.price_change_24h)

    logger.info(f"Moralis: found {len(results)} ERC-20 tokens with >{abs(threshold)}% 24h drop")
    return results


# ──────────────────────────────────────────────
# Source 3: GeckoTerminal New Pools (Free, No Auth)
# ──────────────────────────────────────────────
GECKO_CHAINS = ["eth", "bsc", "polygon_pos", "arbitrum", "base", "avalanche"]
GECKO_CHAIN_MAP = {
    "eth": "ethereum", "bsc": "bsc", "polygon_pos": "polygon",
    "arbitrum": "arbitrum", "base": "base", "avalanche": "avalanche",
}


def discover_gecko_crashed_pools(threshold_pct=None, min_mcap=None):
    """
    Fetch recently created DEX pools from GeckoTerminal and filter for crashes.
    Free: 30 req/min, no auth needed.
    New pools that have already crashed hard = prime rug pull candidates.
    """
    threshold = threshold_pct or CRASH_THRESHOLD_PCT
    mcap_floor = min_mcap or MIN_MARKET_CAP_USD
    results = []

    for gecko_chain in GECKO_CHAINS:
        url = f"https://api.geckoterminal.com/api/v2/networks/{gecko_chain}/new_pools"
        params = {"page": 1}

        try:
            resp = http_requests.get(url, params=params, timeout=REQUEST_TIMEOUT, headers={
                "Accept": "application/json",
            })
            if resp.status_code == 429:
                logger.warning(f"GeckoTerminal rate limited on {gecko_chain}")
                time.sleep(3)
                continue
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            logger.error(f"GeckoTerminal error for {gecko_chain}: {e}")
            continue

        pools = data.get("data", [])
        for pool in pools:
            attrs = pool.get("attributes", {})

            pct_24h = float(attrs.get("price_change_percentage", {}).get("h24", "0") or 0)
            if pct_24h > threshold:
                continue

            fdv = float(attrs.get("fdv_usd") or 0)
            mcap = float(attrs.get("market_cap_usd") or 0) or fdv
            if mcap < mcap_floor:
                continue

            # Extract base token address from relationships or name
            name = attrs.get("name", "")
            # Pool name format: "TOKEN / WETH" — get the base token
            base_name = name.split(" / ")[0].strip() if " / " in name else name
            base_symbol = base_name

            # Get token address from pool address link
            pool_address = attrs.get("address", "")

            # Try to extract token address from included relationships
            rels = pool.get("relationships", {})
            base_token_data = rels.get("base_token", {}).get("data", {})
            base_token_id = base_token_data.get("id", "")
            # Format: "network_address" e.g. "eth_0x1234..."
            token_address = ""
            if "_" in base_token_id:
                token_address = base_token_id.split("_", 1)[1]

            if not token_address or not token_address.startswith("0x"):
                continue

            if _should_skip(base_symbol, base_name):
                continue

            chain = GECKO_CHAIN_MAP.get(gecko_chain, gecko_chain)
            volume = float(attrs.get("volume_usd", {}).get("h24", 0) or 0)

            results.append(CrashedToken(
                name=base_name,
                symbol=base_symbol,
                contract_address=token_address,
                chain=chain,
                price_usd=float(attrs.get("base_token_price_usd") or 0),
                price_change_24h=pct_24h,
                market_cap_usd=mcap,
                volume_24h_usd=volume,
                source="geckoterminal",
            ))

        time.sleep(1)  # Rate limit: 30/min across all chains

    logger.info(f"GeckoTerminal: found {len(results)} crashed new pools across {len(GECKO_CHAINS)} chains")
    return results


# ──────────────────────────────────────────────
# Unified Discovery
# ──────────────────────────────────────────────
def discover_all_losers(threshold_pct=None, min_mcap=None):
    """
    Run all discovery sources and return a deduplicated, ranked list
    of crashed tokens ready for investigation.

    Deduplication: by contract address (case-insensitive).
    Ranking: worst drop first, with preference for tokens found by multiple sources.
    """
    threshold = threshold_pct or CRASH_THRESHOLD_PCT
    min_cap = min_mcap or MIN_MARKET_CAP_USD

    all_tokens = []

    # Run all sources
    cmc = discover_cmc_losers(threshold, min_cap)
    all_tokens.extend(cmc)

    moralis = discover_moralis_losers(threshold)
    all_tokens.extend(moralis)

    gecko = discover_gecko_crashed_pools(threshold, min_cap)
    all_tokens.extend(gecko)

    if not all_tokens:
        logger.info("No crashed tokens found across any source")
        return []

    # Deduplicate by address (keep the one with most data / worst drop)
    by_address = {}
    for token in all_tokens:
        key = token.contract_address.lower()
        if key not in by_address:
            by_address[key] = {"token": token, "sources": {token.source}}
        else:
            existing = by_address[key]
            existing["sources"].add(token.source)
            # Keep the record with more market cap data
            if token.market_cap_usd > existing["token"].market_cap_usd:
                existing["token"] = token

    # Build final list — multi-source tokens get priority
    results = []
    for key, entry in by_address.items():
        token = entry["token"]
        token.source = ",".join(sorted(entry["sources"]))
        results.append(token)

    # Sort: multi-source first, then by worst drop
    results.sort(key=lambda t: (-len(t.source.split(",")), t.price_change_24h))

    logger.info(
        f"Discovery complete: {len(results)} unique tokens "
        f"(CMC:{len(cmc)}, Moralis:{len(moralis)}, Gecko:{len(gecko)})"
    )

    return results


if __name__ == "__main__":
    import sys
    sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.dirname(__import__("os").path.abspath(__file__))))
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

    tokens = discover_all_losers()
    print(f"\n{'='*80}")
    print(f"Found {len(tokens)} crashed tokens:")
    print(f"{'='*80}")
    for i, t in enumerate(tokens[:20], 1):
        print(f"{i:2d}. {t.symbol:10s} {t.price_change_24h:+7.1f}% | ${t.market_cap_usd:>14,.0f} mcap | {t.chain:10s} | {t.contract_address[:20]}... | via {t.source}")
