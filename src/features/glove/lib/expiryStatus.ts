export type ExpiryStatus = "OK" | "PRÓXIMO A VENCER" | "VENCIDO";

export function computeExpiryStatus(expiredDate: string | null | undefined): ExpiryStatus | null {
  if (!expiredDate) return null;

  const exp = new Date(expiredDate);
  if (isNaN(exp.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "VENCIDO";
  if (diffDays <= 30) return "PRÓXIMO A VENCER";
  return "OK";
}

export function worstExpiryStatus(statuses: (ExpiryStatus | null)[]): ExpiryStatus | null {
  if (statuses.includes("VENCIDO")) return "VENCIDO";
  if (statuses.includes("PRÓXIMO A VENCER")) return "PRÓXIMO A VENCER";
  if (statuses.includes("OK")) return "OK";
  return null;
}
