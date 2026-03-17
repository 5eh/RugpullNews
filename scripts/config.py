import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

DATABASE_URL = os.environ.get("DATABASE_URL", "")
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
MORALIS_API_KEY = os.environ.get("MORALIS_API_KEY", "")
CMC_API_KEY = os.environ.get("CMC_API_KEY", "")
ETH_RPC_URL = os.environ.get("ETH_RPC_URL", "")
BSC_RPC_URL = os.environ.get("BSC_RPC_URL", "")
POLYGON_RPC_URL = os.environ.get("POLYGON_RPC_URL", "")

CLAUDE_MODEL = "claude-sonnet-4-20250514"
MAX_ARTICLES_PER_RUN = 20

# Rugcheck pipeline settings
CRASH_THRESHOLD_PCT = -60       # minimum 24h drop to investigate
MIN_MARKET_CAP_USD = 10_000     # ignore dust tokens
MAX_INVESTIGATIONS_PER_RUN = 5  # quality over quantity
