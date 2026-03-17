"use client";

import { useState, useEffect } from "react";

export interface CoinPrice {
  symbol: string;
  price: number;
  formattedPrice: string;
  change: number;
  formattedChange: string;
  color: string;
}

interface ApiResponse {
  success: boolean;
  data?: CoinPrice[];
  error?: string;
}

export function useCryptoPrices(refreshIntervalMs = 60000) {
  const [cryptoPrices, setCryptoPrices] = useState<CoinPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/get-prices");
        const data: ApiResponse = await response.json();
        if (data.success && data.data) {
          setCryptoPrices(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch crypto prices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, refreshIntervalMs);
    return () => clearInterval(interval);
  }, [refreshIntervalMs]);

  return { cryptoPrices, loading };
}
