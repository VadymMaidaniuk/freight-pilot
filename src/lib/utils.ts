import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function safeNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number(value);
}
