export const getAccountCategory = (acc: any) => {
  if (acc.bankLinkId || acc.externalId || acc.institution) return "BANK";
  const t = (acc.type || "").toUpperCase();
  if (t === "CASH" || t === "WALLET") return t;
  return "BANK";
};
