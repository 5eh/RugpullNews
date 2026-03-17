"""
Blockchain Intelligence Module - powered by Scrapling.
Scrapes blockchain explorers and DEX aggregators for on-chain contract
and token intelligence used in scam detection scoring.

Targets:
  - Etherscan / BSCScan / Polygonscan  (contract verification, holder distribution)
  - DexScreener                         (liquidity, pair data, price action)
  - Token Sniffer / GoPlusLabs API      (automated audit results)

This module does NOT use RPC nodes. It scrapes public explorer pages using
Scrapling's TLS fingerprint impersonation to avoid anti-bot blocks.
"""

import json
import logging
import re
import time

import requests as http_requests
from scrapling.fetchers import Fetcher

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# Explorer URL templates
# ──────────────────────────────────────────────
EXPLORERS = {
    "ethereum": {
        "base": "https://etherscan.io",
        "token": "https://etherscan.io/token/{address}",
        "address": "https://etherscan.io/address/{address}",
        "tx_list": "https://etherscan.io/txs?a={address}",
    },
    "bsc": {
        "base": "https://bscscan.com",
        "token": "https://bscscan.com/token/{address}",
        "address": "https://bscscan.com/address/{address}",
        "tx_list": "https://bscscan.com/txs?a={address}",
    },
    "polygon": {
        "base": "https://polygonscan.com",
        "token": "https://polygonscan.com/token/{address}",
        "address": "https://polygonscan.com/address/{address}",
        "tx_list": "https://polygonscan.com/txs?a={address}",
    },
}

DEXSCREENER_TOKEN = "https://api.dexscreener.com/latest/dex/tokens/{address}"
HONEYPOT_IS = "https://api.honeypot.is/v2/IsHoneypot?address={address}&chainID={chain_id}"

CHAIN_IDS = {"ethereum": "1", "bsc": "56", "polygon": "137"}

FETCH_DELAY = 1.5  # seconds between requests to same domain


def _fetch(url):
    """Fetch a URL with Scrapling's stealth headers and Chrome impersonation."""
    try:
        page = Fetcher.get(url, stealthy_headers=True, timeout=20, impersonate="chrome")
        if page.status == 200:
            return page
        logger.warning(f"Status {page.status} for {url}")
        return None
    except Exception as e:
        logger.error(f"Fetch error for {url}: {e}")
        return None


def _fetch_json_api(url, verify_ssl=True):
    """Fetch a JSON API using plain requests (for APIs where Scrapling's TLS causes issues)."""
    try:
        resp = http_requests.get(url, timeout=15, verify=verify_ssl, headers={
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
        resp.raise_for_status()
        return resp.json()
    except http_requests.exceptions.SSLError:
        if verify_ssl:
            logger.warning(f"SSL error for {url}, retrying without verification")
            return _fetch_json_api(url, verify_ssl=False)
        logger.error(f"SSL error for {url} even without verification")
        return None
    except Exception as e:
        logger.error(f"API fetch error for {url}: {e}")
        return None


# ──────────────────────────────────────────────
# Etherscan / BSCScan / Polygonscan Scrapers
# ──────────────────────────────────────────────
def scrape_token_page(address, chain="ethereum"):
    """
    Scrape a token's explorer page for:
    - Contract verification status
    - Total holders count
    - Total supply
    - Top holders concentration (if accessible)
    """
    explorer = EXPLORERS.get(chain)
    if not explorer:
        return {"error": f"Unsupported chain: {chain}"}

    url = explorer["token"].format(address=address)
    logger.info(f"Scraping token page: {url}")
    page = _fetch(url)
    if not page:
        return {"error": f"Failed to fetch {url}"}

    result = {
        "address": address,
        "chain": chain,
        "explorer_url": url,
        "contract_verified": False,
        "token_name": None,
        "total_supply": None,
        "holders_count": None,
        "flags": [],
    }

    # Token name from page title
    title = page.css("title::text").get()
    if title:
        match = re.match(r"^\s*(.+?)\s*\((\w+)\)", title)
        if match:
            result["token_name"] = match.group(1).strip()

    # Contract verification
    verified_badge = page.css("#ContentPlaceHolder1_divSummary .badge")
    source_link = page.css('a[href*="contract"]')
    body_text = page.body.decode("utf-8", errors="ignore")
    if "Contract Source Code Verified" in body_text:
        result["contract_verified"] = True
    elif verified_badge:
        result["contract_verified"] = True

    if not result["contract_verified"]:
        result["flags"].append("Contract source code is NOT verified")

    # Total supply
    supply_el = page.css("#ContentPlaceHolder1_hdnTotalSupply")
    if supply_el:
        val = supply_el[0].attrib.get("value", "")
        if val:
            result["total_supply"] = val

    # Holders count
    holders_text = re.search(r"([\d,]+)\s*holders?", body_text, re.IGNORECASE)
    if holders_text:
        result["holders_count"] = holders_text.group(1).replace(",", "")

    # Low holder count flag
    if result["holders_count"]:
        try:
            count = int(result["holders_count"])
            if count < 100:
                result["flags"].append(f"Extremely low holder count: {count}")
            elif count < 500:
                result["flags"].append(f"Low holder count: {count}")
        except ValueError:
            pass

    return result


def scrape_contract_page(address, chain="ethereum"):
    """
    Scrape a contract/address page for:
    - Contract vs EOA
    - Transaction count
    - Balance
    - Creator address
    - Contract age
    """
    explorer = EXPLORERS.get(chain)
    if not explorer:
        return {"error": f"Unsupported chain: {chain}"}

    url = explorer["address"].format(address=address)
    logger.info(f"Scraping contract page: {url}")
    page = _fetch(url)
    if not page:
        return {"error": f"Failed to fetch {url}"}

    body_text = page.body.decode("utf-8", errors="ignore")
    result = {
        "address": address,
        "chain": chain,
        "is_contract": False,
        "tx_count": None,
        "balance": None,
        "creator": None,
        "flags": [],
    }

    # Check if contract
    if "Contract" in (page.css("title::text").get() or ""):
        result["is_contract"] = True
    if "Contract Creation" in body_text or "bytecode" in body_text.lower():
        result["is_contract"] = True

    # Transaction count
    tx_match = re.search(r"([\d,]+)\s*transactions?", body_text, re.IGNORECASE)
    if tx_match:
        result["tx_count"] = tx_match.group(1).replace(",", "")

    # Creator
    creator_match = re.search(
        r'Contract Creator.*?href="/address/(0x[a-fA-F0-9]{40})"',
        body_text,
    )
    if creator_match:
        result["creator"] = creator_match.group(1)

    # Balance
    balance_el = page.css("#ContentPlaceHolder1_divFilteredHolderBalance .text-muted")
    if not balance_el:
        balance_match = re.search(r"Balance.*?([\d,.]+)\s*(?:ETH|BNB|MATIC)", body_text)
        if balance_match:
            result["balance"] = balance_match.group(1)

    return result


def scrape_top_holders(address, chain="ethereum"):
    """
    Scrape the top holders page to analyze concentration risk.
    High concentration in few wallets = rug pull risk.
    """
    explorer = EXPLORERS.get(chain)
    if not explorer:
        return {"error": f"Unsupported chain: {chain}"}

    url = f"{explorer['base']}/token/tokenholderchart/{address}"
    logger.info(f"Scraping top holders: {url}")
    page = _fetch(url)
    if not page:
        return {"error": f"Failed to fetch {url}"}

    holders = []
    rows = page.css("table tbody tr")
    for row in rows[:25]:  # Top 25 holders
        cells = row.css("td")
        if len(cells) >= 3:
            addr_el = cells[1].css("a")
            addr = addr_el[0].attrib.get("href", "").split("/")[-1] if addr_el else ""
            pct_text = cells[2].css("::text").get() or ""
            pct_match = re.search(r"([\d.]+)%", pct_text)
            pct = float(pct_match.group(1)) if pct_match else 0.0
            holders.append({"address": addr, "percentage": pct})

    # Analyze concentration
    flags = []
    if holders:
        top1_pct = holders[0]["percentage"] if holders else 0
        top10_pct = sum(h["percentage"] for h in holders[:10])

        if top1_pct > 50:
            flags.append(f"CRITICAL: Single wallet holds {top1_pct}% of supply")
        elif top1_pct > 20:
            flags.append(f"Top wallet holds {top1_pct}% of supply")

        if top10_pct > 80:
            flags.append(f"CRITICAL: Top 10 wallets hold {top10_pct:.1f}% of supply")
        elif top10_pct > 50:
            flags.append(f"High concentration: Top 10 hold {top10_pct:.1f}%")

    return {
        "address": address,
        "chain": chain,
        "top_holders": holders,
        "top1_percentage": holders[0]["percentage"] if holders else 0,
        "top10_percentage": sum(h["percentage"] for h in holders[:10]),
        "flags": flags,
    }


# ──────────────────────────────────────────────
# DexScreener API (public, no auth needed)
# ──────────────────────────────────────────────
def scrape_dexscreener(address):
    """
    Query DexScreener for DEX pair data:
    - Liquidity (locked or not)
    - Price action / volume
    - Pair age
    - Buy/sell ratio
    """
    url = DEXSCREENER_TOKEN.format(address=address)
    logger.info(f"Querying DexScreener: {url}")
    data = _fetch_json_api(url)
    if not data:
        return {"error": "Failed to fetch DexScreener data"}

    pairs = data.get("pairs") or []
    if not pairs:
        return {
            "address": address,
            "pairs_found": 0,
            "flags": ["No DEX pairs found - token may not be traded"],
        }

    # Analyze the main pair (highest liquidity)
    pairs.sort(key=lambda p: float(p.get("liquidity", {}).get("usd", 0) or 0), reverse=True)
    main_pair = pairs[0]

    liquidity_usd = float(main_pair.get("liquidity", {}).get("usd", 0) or 0)
    volume_24h = float(main_pair.get("volume", {}).get("h24", 0) or 0)
    price_change_24h = float(main_pair.get("priceChange", {}).get("h24", 0) or 0)
    pair_created = main_pair.get("pairCreatedAt")
    dex_name = main_pair.get("dexId", "unknown")
    chain_id = main_pair.get("chainId", "unknown")
    buys_24h = main_pair.get("txns", {}).get("h24", {}).get("buys", 0)
    sells_24h = main_pair.get("txns", {}).get("h24", {}).get("sells", 0)

    flags = []

    # Liquidity analysis
    if liquidity_usd < 1000:
        flags.append(f"CRITICAL: Near-zero liquidity (${liquidity_usd:,.0f})")
    elif liquidity_usd < 10000:
        flags.append(f"Very low liquidity (${liquidity_usd:,.0f})")
    elif liquidity_usd < 50000:
        flags.append(f"Low liquidity (${liquidity_usd:,.0f})")

    # Volume analysis
    if volume_24h == 0:
        flags.append("Zero 24h trading volume")
    elif liquidity_usd > 0 and volume_24h / liquidity_usd > 10:
        flags.append(f"Suspicious volume/liquidity ratio: {volume_24h / liquidity_usd:.1f}x")

    # Price crash detection
    if price_change_24h < -50:
        flags.append(f"Price crashed {price_change_24h:.1f}% in 24h")
    elif price_change_24h < -30:
        flags.append(f"Major price drop: {price_change_24h:.1f}% in 24h")

    # Buy/sell ratio
    total_txns = (buys_24h or 0) + (sells_24h or 0)
    if total_txns > 0:
        sell_ratio = (sells_24h or 0) / total_txns
        if sell_ratio > 0.8:
            flags.append(f"Heavy sell pressure: {sell_ratio * 100:.0f}% of txns are sells")

    return {
        "address": address,
        "chain": chain_id,
        "dex": dex_name,
        "pairs_found": len(pairs),
        "liquidity_usd": liquidity_usd,
        "volume_24h": volume_24h,
        "price_change_24h": price_change_24h,
        "buys_24h": buys_24h,
        "sells_24h": sells_24h,
        "pair_created_at": pair_created,
        "flags": flags,
    }


# ──────────────────────────────────────────────
# GoPlus Security API (free, no auth)
# ──────────────────────────────────────────────
def scrape_honeypot(address, chain="ethereum"):
    """
    Query Honeypot.is API for comprehensive token security audit:
    - Honeypot simulation (can you actually sell?)
    - Buy/sell/transfer tax
    - Contract source analysis (open source, proxy, proxy calls)
    - Token holder count
    - Risk level assessment
    """
    chain_id = CHAIN_IDS.get(chain, "1")
    url = HONEYPOT_IS.format(chain_id=chain_id, address=address)
    logger.info(f"Querying Honeypot.is: {url}")
    data = _fetch_json_api(url)
    if not data:
        return {"error": "Failed to fetch Honeypot.is data"}

    flags = []

    # Honeypot check
    honeypot_result = data.get("honeypotResult", {})
    is_honeypot = honeypot_result.get("isHoneypot", False)
    if is_honeypot:
        flags.append("CRITICAL: Confirmed HONEYPOT - cannot sell tokens")

    # Simulation
    sim = data.get("simulationResult", {})
    sim_success = data.get("simulationSuccess", True)
    if not sim_success:
        flags.append("CRITICAL: Buy/sell simulation FAILED - likely honeypot")

    buy_tax = sim.get("buyTax", 0) or 0
    sell_tax = sim.get("sellTax", 0) or 0
    transfer_tax = sim.get("transferTax", 0) or 0

    if sell_tax > 50:
        flags.append(f"CRITICAL: {sell_tax}% sell tax")
    elif sell_tax > 10:
        flags.append(f"High sell tax: {sell_tax}%")
    elif sell_tax > 5:
        flags.append(f"Elevated sell tax: {sell_tax}%")

    if buy_tax > 10:
        flags.append(f"High buy tax: {buy_tax}%")

    if transfer_tax > 0:
        flags.append(f"Transfer tax: {transfer_tax}%")

    # Contract code analysis
    code = data.get("contractCode", {})
    if not code.get("openSource", True):
        flags.append("Contract source code is NOT open source")
    if code.get("isProxy", False):
        flags.append("Proxy contract - logic can be changed at any time")
    if code.get("hasProxyCalls", False):
        flags.append("Contract makes proxy/delegate calls")

    # Summary risk
    summary = data.get("summary", {})
    risk_level = summary.get("riskLevel", 0)
    summary_flags = summary.get("flags", [])
    for sf in summary_flags:
        flags.append(f"Honeypot.is flag: {sf}")

    # Token info
    token = data.get("token", {})
    token_name = token.get("name", "")
    total_holders = token.get("totalHolders", 0)

    if total_holders and total_holders < 100:
        flags.append(f"Extremely low holder count: {total_holders}")
    elif total_holders and total_holders < 500:
        flags.append(f"Low holder count: {total_holders}")

    return {
        "address": address,
        "chain": chain,
        "token_name": token_name,
        "total_holders": total_holders,
        "is_honeypot": is_honeypot,
        "simulation_success": sim_success,
        "buy_tax": buy_tax,
        "sell_tax": sell_tax,
        "transfer_tax": transfer_tax,
        "is_open_source": code.get("openSource", True),
        "is_proxy": code.get("isProxy", False),
        "has_proxy_calls": code.get("hasProxyCalls", False),
        "risk_level_numeric": risk_level,
        "flags": flags,
    }


# ──────────────────────────────────────────────
# Wallet Transaction Pattern Analysis
# ──────────────────────────────────────────────
def scrape_wallet_transactions(address, chain="ethereum"):
    """
    Scrape recent transactions for a wallet address to detect:
    - Rapid fund movement patterns (wash trading)
    - Large single outflows (potential exit)
    - Interaction with known mixer contracts
    - Rapid token deployment patterns (serial scammer)
    """
    explorer = EXPLORERS.get(chain)
    if not explorer:
        return {"error": f"Unsupported chain: {chain}"}

    url = explorer["tx_list"].format(address=address)
    logger.info(f"Scraping wallet txns: {url}")
    page = _fetch(url)
    if not page:
        return {"error": f"Failed to fetch {url}"}

    txns = []
    rows = page.css("table tbody tr")
    for row in rows[:50]:  # Last 50 transactions
        cells = row.css("td")
        if len(cells) < 7:
            continue

        tx_hash = cells[1].css("a::attr(href)").get() or ""
        method = cells[2].css("::text").get() or ""
        from_addr = cells[4].css("a::attr(href)").get() or ""
        to_addr = cells[6].css("a::attr(href)").get() or ""
        value_text = cells[7].css("::text").get() if len(cells) > 7 else ""

        txns.append({
            "hash": tx_hash.split("/")[-1] if tx_hash else "",
            "method": method.strip(),
            "from": from_addr.split("/")[-1] if from_addr else "",
            "to": to_addr.split("/")[-1] if to_addr else "",
            "value": (value_text or "").strip(),
        })

    # Analyze patterns
    flags = []

    if not txns:
        flags.append("No recent transaction history found")
        return {"address": address, "chain": chain, "transactions": [], "flags": flags}

    # Check for serial contract deployment
    create_count = sum(1 for t in txns if "create" in t["method"].lower())
    if create_count >= 5:
        flags.append(f"Serial deployer: {create_count} contract creations in recent history")
    elif create_count >= 3:
        flags.append(f"Multiple contract deployments: {create_count}")

    # Check for rapid outflows to many different addresses
    unique_to = set(t["to"] for t in txns if t["to"])
    if len(unique_to) > 30:
        flags.append(f"Funds sent to {len(unique_to)} unique addresses - possible distribution/wash pattern")

    # Check for common mixer/tumbler interactions
    KNOWN_MIXERS = ["0xd90e2f925da726b50c4ed8d0fb90ad053324f31b"]  # Tornado Cash Router
    mixer_hits = [t for t in txns if t["to"].lower() in KNOWN_MIXERS]
    if mixer_hits:
        flags.append(f"CRITICAL: {len(mixer_hits)} interactions with known mixing services")

    return {
        "address": address,
        "chain": chain,
        "tx_count": len(txns),
        "unique_recipients": len(unique_to),
        "contract_creates": create_count,
        "flags": flags,
    }


# ──────────────────────────────────────────────
# Full Token Intelligence Report
# ──────────────────────────────────────────────
def full_token_analysis(address, chain="ethereum"):
    """
    Run ALL intelligence checks on a token address and compile a full report.
    This is the main entry point for comprehensive scam analysis.
    """
    logger.info(f"=== Full token analysis: {address} on {chain} ===")

    report = {
        "address": address,
        "chain": chain,
        "all_flags": [],
        "risk_score": 0,
    }

    # 1. Token page (verification, holders, supply)
    token_data = scrape_token_page(address, chain)
    report["token_info"] = token_data
    report["all_flags"].extend(token_data.get("flags", []))
    time.sleep(FETCH_DELAY)

    # 2. Top holders concentration
    holders_data = scrape_top_holders(address, chain)
    report["holders"] = holders_data
    report["all_flags"].extend(holders_data.get("flags", []))
    time.sleep(FETCH_DELAY)

    # 3. DexScreener liquidity and trading data
    dex_data = scrape_dexscreener(address)
    report["dex"] = dex_data
    report["all_flags"].extend(dex_data.get("flags", []))

    # 4. Honeypot.is automated security audit
    honeypot_data = scrape_honeypot(address, chain)
    report["security"] = honeypot_data
    report["all_flags"].extend(honeypot_data.get("flags", []))

    # 5. Creator wallet analysis (if we found a creator)
    creator = None
    if token_data.get("creator"):
        creator = token_data["creator"]
    # Also check contract page for creator
    if not creator:
        time.sleep(FETCH_DELAY)
        contract_data = scrape_contract_page(address, chain)
        report["contract"] = contract_data
        report["all_flags"].extend(contract_data.get("flags", []))
        creator = contract_data.get("creator")

    if creator:
        time.sleep(FETCH_DELAY)
        wallet_data = scrape_wallet_transactions(creator, chain)
        report["creator_wallet"] = wallet_data
        report["all_flags"].extend(wallet_data.get("flags", []))

    # Calculate risk score (0-100) based on flags
    score = 0
    for flag in report["all_flags"]:
        flag_lower = flag.lower()
        if "critical" in flag_lower:
            score += 25
        elif "high" in flag_lower or "not verified" in flag_lower or "not open source" in flag_lower:
            score += 15
        elif "low" in flag_lower or "serial" in flag_lower:
            score += 10
        else:
            score += 5

    report["risk_score"] = min(score, 100)

    # Determine risk level
    if report["risk_score"] >= 75:
        report["risk_level"] = "HIGH RISK"
    elif report["risk_score"] >= 40:
        report["risk_level"] = "MEDIUM RISK"
    else:
        report["risk_level"] = "LOW RISK"

    logger.info(
        f"=== Analysis complete: score={report['risk_score']}, "
        f"level={report['risk_level']}, flags={len(report['all_flags'])} ==="
    )

    return report
