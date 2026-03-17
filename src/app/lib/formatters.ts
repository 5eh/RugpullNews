export function formatPrice(price: number): string {
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

export function formatChange(change: number): string {
  const arrow = change >= 0 ? "↑" : "↓";
  return `${arrow}${Math.abs(change).toFixed(2)}%`;
}
