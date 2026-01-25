export const formatBudgetPeriod = (month: number, year: number) => {
  const date = new Date(year, month - 1);
  const text = new Intl.DateTimeFormat("es-CL", {
    month: "long",
    year: "numeric",
  }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const creationDate = (budget: any) =>
  new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(budget.createdAt || Date.now()));
