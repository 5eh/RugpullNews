import os
import sys
from unittest.mock import MagicMock, patch

# Set required env vars before any imports
os.environ.setdefault("DATABASE_URL", "postgresql://test:test@localhost:5432/testdb")
os.environ.setdefault("ANTHROPIC_API_KEY", "sk-ant-test-key")
os.environ.setdefault("CMC_API_KEY", "test-cmc-key")
os.environ.setdefault("MORALIS_API_KEY", "test-moralis-key")
os.environ.setdefault("ETH_RPC_URL", "http://localhost:8545")
os.environ.setdefault("BSC_RPC_URL", "http://localhost:8546")
os.environ.setdefault("POLYGON_RPC_URL", "http://localhost:8547")

# Add scripts dir to path so modules resolve
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

# Mock psycopg2 at module level so db-connecting modules don't crash on import
import unittest.mock as mock
sys.modules["psycopg2"] = mock.MagicMock()
sys.modules["psycopg2.extras"] = mock.MagicMock()
sys.modules["psycopg2.pool"] = mock.MagicMock()
