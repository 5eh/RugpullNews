import { NextRequest, NextResponse } from "next/server";

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

// Our simplified response type
interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  color: "green" | "red";
  formattedPrice: string;
  formattedChange: string;
}

interface ApiResponse {
  success: boolean;
  data?: CoinPrice[];
  error?: string;
  timestamp: string;
}

// Format price to appropriate decimal places
const formatPrice = (price: number): string => {
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
};

const formatChange = (change: number): string => {
  const arrow = change >= 0 ? "↑" : "↓";
  return `${arrow}${Math.abs(change).toFixed(2)}%`;
};

export async function GET() {
  try {
    const API_KEY =
      process.env.CMC_API_KEY || "38bda73c-8a05-4f81-81cc-221b875f66ce";
    const symbols = "BTC,ETH,DOT,DOGE";

    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=USD`,
      {
        method: "GET",
        headers: {
          "X-CMC_PRO_API_KEY": API_KEY,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `CMC API Error: ${response.status} ${response.statusText}`,
      );
    }

    const cmcData: CMCResponse = await response.json();

    // Transform the data
    const coinPrices: CoinPrice[] = Object.values(cmcData.data).map((coin) => {
      const price = coin.quote.USD.price;
      const change24h = coin.quote.USD.percent_change_24h;

      return {
        symbol: coin.symbol,
        name: coin.name,
        price: price,
        change24h: change24h,
        color: change24h >= 0 ? "green" : "red",
        formattedPrice: formatPrice(price),
        formattedChange: formatChange(change24h),
      };
    });

    const symbolOrder = ["BTC", "ETH", "DOT", "DOGE"];
    coinPrices.sort((a, b) => {
      const indexA = symbolOrder.indexOf(a.symbol);
      const indexB = symbolOrder.indexOf(b.symbol);
      return indexA - indexB;
    });

    const apiResponse: ApiResponse = {
      success: true,
      data: coinPrices,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(apiResponse, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    });
  } catch (error) {
    console.error("Error fetching crypto prices:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Optional: Add POST method to update symbols dynamically
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { symbols } = body;

    if (!symbols || !Array.isArray(symbols)) {
      return NextResponse.json(
        { success: false, error: "Invalid symbols array provided" },
        { status: 400 },
      );
    }

    // Similar logic as GET but with custom symbols
    const API_KEY =
      process.env.CMC_API_KEY || "38bda73c-8a05-4f81-81cc-221b875f66ce";
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
      throw new Error(
        `CMC API Error: ${response.status} ${response.statusText}`,
      );
    }

    const cmcData: CMCResponse = await response.json();

    const coinPrices: CoinPrice[] = Object.values(cmcData.data).map((coin) => {
      const price = coin.quote.USD.price;
      const change24h = coin.quote.USD.percent_change_24h;

      return {
        symbol: coin.symbol,
        name: coin.name,
        price: price,
        change24h: change24h,
        color: change24h >= 0 ? "green" : "red",
        formattedPrice: formatPrice(price),
        formattedChange: formatChange(change24h),
      };
    });

    // Sort by provided order
    coinPrices.sort((a, b) => {
      const indexA = symbols.indexOf(a.symbol);
      const indexB = symbols.indexOf(b.symbol);
      return indexA - indexB;
    });

    const apiResponse: ApiResponse = {
      success: true,
      data: coinPrices,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error("Error fetching crypto prices:", error);

    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
