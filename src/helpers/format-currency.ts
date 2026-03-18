export function formatCurrency(
  value: number,
  options?: {
    currency?: string;
    notation?: Intl.NumberFormatOptions["notation"];
  },
) {
  return new Intl.NumberFormat("en-NG", {
    currency: options?.currency ?? "NGN",
    notation: options?.notation,
    style: "currency",
  }).format(value);
}
