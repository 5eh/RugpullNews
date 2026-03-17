"use client";

import { useCryptoPrices } from "@/app/hooks/useCryptoPrices";

const ALL_SYMBOLS = ["BTC", "ETH", "DOT", "DOGE"];
const MOBILE_SYMBOLS = ["BTC", "ETH", "DOT"];

interface CryptoTickerProps {
  isMobile: boolean;
}

export function CryptoTicker({ isMobile }: CryptoTickerProps) {
  const { cryptoPrices, loading } = useCryptoPrices();
  const symbols = isMobile ? MOBILE_SYMBOLS : ALL_SYMBOLS;

  return (
    <div
      className="border-b border-gray-700/30 overflow-x-auto"
      aria-label="Cryptocurrency prices"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-1 md:py-3">
        <div className="flex items-center justify-center space-x-3 md:space-x-6 overflow-x-auto whitespace-nowrap pb-1 w-full scrollbar-hide">
          {symbols.map((symbol) => {
            if (loading) {
              return (
                <span key={symbol} className="inline-block text-xs md:text-sm">
                  {symbol}: <span className="text-gray-400">N/A</span>
                </span>
              );
            }

            const coin = cryptoPrices.find((c) => c.symbol === symbol);
            return coin ? (
              <span key={coin.symbol} className="inline-block text-xs md:text-sm">
                {coin.symbol}:{" "}
                <span className={coin.color === "green" ? "text-green-400" : "text-red-400"}>
                  {coin.formattedPrice} {coin.formattedChange}
                </span>
              </span>
            ) : (
              <span key={symbol} className="inline-block text-xs md:text-sm">
                {symbol}: <span className="text-gray-400">N/A</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
