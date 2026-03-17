import psycopg2
from psycopg2.extras import RealDictCursor
from config import DATABASE_URL


def get_connection():
    """Create a new database connection."""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


def execute(sql, params=None):
    """Execute a query and return affected row count."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            conn.commit()
            return cur.rowcount
    finally:
        conn.close()


def fetch_all(sql, params=None):
    """Execute a query and return all rows as dicts."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()
    finally:
        conn.close()


def fetch_one(sql, params=None):
    """Execute a query and return a single row as dict."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchone()
    finally:
        conn.close()
