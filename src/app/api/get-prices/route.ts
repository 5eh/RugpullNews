import { NextRequest } from "next/server";
import { apiError } from "@/app/lib/security";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/app/lib/rate-limit";

interface CoinData {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      percent_change_24h: number;
    };
  };
}

interface CMCResponse {
  data: {
    [key: string]: CoinData;
  };
}

interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  color: "green" | "red";
  formattedPrice: string;
  formattedChange: string;
}

function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(4)}`;
  }
}

function formatChange(change: number): string {
  const arrow = change >= 0 ? "↑" : "↓";
  return `${arrow}${Math.abs(change).toFixed(2)}%`;
}

async function fetchPrices(symbols: string[], order: string[]): Promise<Response> {
  const API_KEY = process.env.CMC_API_KEY;
  if (!API_KEY) {
    return apiError("Price service unavailable", 503);
  }

  const symbolString = symbols.join(",");

  const response = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbolString}&convert=USD`,
    {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`CMC API Error: ${response.status} ${response.statusText}`);
  }

  const cmcData: CMCResponse = await response.json();

  const coinPrices: CoinPrice[] = Object.values(cmcData.data).map((coin) => {
    const price = coin.quote.USD.price;
    const change24h = coin.quote.USD.percent_change_24h;

    return {
      symbol: coin.symbol,
      name: coin.name,
      price,
      change24h,
      color: change24h >= 0 ? "green" : "red",
      formattedPrice: formatPrice(price),
      formattedChange: formatChange(change24h),
    };
  });

  coinPrices.sort((a, b) => {
    const indexA = order.indexOf(a.symbol);
    const indexB = order.indexOf(b.symbol);
    return indexA - indexB;
  });

  return Response.json(
    {
      success: true,
      data: coinPrices,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    },
  );
}

export async function GET() {
  try {
    const symbols = ["BTC", "ETH", "DOT", "DOGE"];
    return await fetchPrices(symbols, symbols);
  } catch (error) {
    return apiError("Failed to fetch prices", 500, error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = checkRateLimit(`prices:${ip}`, RATE_LIMITS.getPricesPost);
    if (!allowed) {
      return apiError("Rate limit exceeded. Try again shortly.", 429);
    }

    const body = await request.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return apiError("Invalid symbols array provided", 400);
    }

    if (symbols.length > 20) {
      return apiError("Maximum 20 symbols allowed", 400);
    }

    const symbolRegex = /^[A-Z]{1,10}$/;
    for (const sym of symbols) {
      if (typeof sym !== "string" || !symbolRegex.test(sym)) {
        return apiError(`Invalid symbol: ${String(sym).slice(0, 10)}. Must be 1-10 uppercase letters.`, 400);
      }
    }

    return await fetchPrices(symbols, symbols);
  } catch (error) {
    return apiError("Failed to fetch prices", 500, error);
  }
}
