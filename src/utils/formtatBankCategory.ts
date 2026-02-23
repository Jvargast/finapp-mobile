export const getAccountCategory = (acc: any) => {
  if (acc.bankLinkId || acc.externalId || acc.institution) return "BANK";
  const t = (acc.type || "").toUpperCase();
  if (t === "CASH") return "CASH";
  if (t === "WALLET" || t === "CREDIT_CARD" || t === "OTHER") return "WALLET";
  return "BANK";
};
