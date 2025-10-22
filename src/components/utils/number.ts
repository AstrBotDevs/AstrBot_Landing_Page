"use client";

export function formatCompactNumber(n: number): string {
  if (!Number.isFinite(n)) return "";
  if (n >= 1_000_000_000) return (Math.round((n / 1_000_000_000) * 10) / 10).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (Math.round((n / 1_000_000) * 10) / 10).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (Math.round((n / 1_000) * 10) / 10).toFixed(1).replace(/\.0$/, "") + "k";
  return Math.round(n).toLocaleString();
}
