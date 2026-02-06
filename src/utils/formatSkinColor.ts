export const getBankSkinKey = (institution?: string) => {
  const s = (institution || "").toLowerCase();

  if (s.includes("santander")) return "SANTANDER_RED";
  if (s.includes("scotiabank") || s.includes("scotia")) return "SCOTIABANK_RED";
  if (s.includes("banco de chile") || s.includes("chile")) return "BCH_BLUE";
  if (s.includes("bci")) return "BCI_BLUE";
  if (s.includes("bice")) return "BICE";
  if (s.includes("ita")) return "ITAU";

  return "DEFAULT";
};
