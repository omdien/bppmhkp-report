// src/utils/formating.ts

/**
 * Format angka tanpa desimal, pakai pemisah ribuan
 * @param value angka yang mau diformat
 * @returns string hasil format
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

/**
 * Format angka jadi 2 desimal
 * @param value angka yang mau diformat
 * @returns string hasil format
 */
export function formatNumber2Dec(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format angka jadi mata uang (IDR atau USD) dengan 2 desimal
 * @param value angka yang mau diformat
 * @param currency jenis mata uang ("IDR" | "USD")
 * @returns string hasil format
 */
export function formatCurrency(
  value: number,
  currency: "IDR" | "USD"
): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
