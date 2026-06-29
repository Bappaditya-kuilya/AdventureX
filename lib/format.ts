export function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
