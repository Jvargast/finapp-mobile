export const formatMoney = (amount: number, currencyCode: string = "CLP") => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: currencyCode === "CLP" ? 0 : 2,
  }).format(amount);
};
export const formatGoalAmount = (amount: number, currencyId: string) => {
  const config: Record<string, { style?: string; currency?: string; prefix?: string; fraction: number }> = {
    CLP: { style: "currency", currency: "CLP", fraction: 0 },
    USD: { style: "currency", currency: "USD", fraction: 2 },
    EUR: { style: "currency", currency: "EUR", fraction: 2 },
    CAD: { style: "currency", currency: "CAD", fraction: 2 },
    UF: { prefix: "UF", fraction: 2 },
    BTC: { prefix: "₿", fraction: 8 },
  };

  const conf = config[currencyId] || config["CLP"];

  if (conf.style === "currency") {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: conf.currency,
      minimumFractionDigits: conf.fraction,
      maximumFractionDigits: conf.fraction,
    }).format(amount);
  }

  const numberPart = new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: conf.fraction,
    maximumFractionDigits: conf.fraction,
  }).format(amount);

  return `${conf.prefix} ${numberPart}`;
};
