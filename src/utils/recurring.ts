import {
  RecurrenceUnit,
  RecurringTransaction,
  RecurringListFilters,
  RecurringFilters,
} from "../types/recurring.types";

const WEEKDAY_LABELS = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

const normalizeText = (value?: string | null) =>
  (value || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const normalizeInterval = (value?: number | null) => {
  if (!value || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.floor(value));
};

export const getWeekdayLabel = (weekday?: number | null) => {
  if (weekday === null || weekday === undefined) return "";
  if (weekday < 0 || weekday > 6) return "";
  return WEEKDAY_LABELS[weekday];
};

export const getRecurrenceLabel = (item: RecurringTransaction) => {
  const interval = normalizeInterval(item.interval);
  const unit: RecurrenceUnit = item.recurrenceUnit;
  if (unit === "MONTHLY") {
    const monthlyRule = item.monthlyRule || "DAY_OF_MONTH";
    const dayText =
      monthlyRule === "LAST_DAY"
        ? "último día"
        : monthlyRule === "LAST_BUSINESS_DAY"
          ? "último día hábil"
          : item.dayOfMonth
            ? `día ${item.dayOfMonth}${
                item.businessDayAdjustment === "PREVIOUS"
                  ? " (hábil anterior)"
                  : ""
              }`
            : "día";
    if (interval === 1) return `Mensual · ${dayText}`;
    return `Cada ${interval} meses · ${dayText}`;
  }
  if (unit === "WEEKLY") {
    const weekday = getWeekdayLabel(item.weekday);
    if (interval === 1) {
      return weekday ? `Semanal · ${weekday}` : "Semanal";
    }
    return weekday
      ? `Cada ${interval} semanas · ${weekday}`
      : `Cada ${interval} semanas`;
  }
  return "Recurrencia";
};

export const formatRecurringDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getNextRunLabel = (item: RecurringTransaction) => {
  if (item.nextRunAt) return formatRecurringDate(item.nextRunAt);
  if (item.startsAt) return formatRecurringDate(item.startsAt);
  return "";
};

export const isRecurringActive = (item: RecurringTransaction) =>
  item.isActive !== false;

export const buildRecurringApiFilters = (
  filters: RecurringListFilters = {},
): RecurringFilters => {
  const api: RecurringFilters = {};
  if (filters.accountId) api.accountId = filters.accountId;
  if (filters.type && filters.type !== "ALL") api.type = filters.type;
  if (filters.status === "ACTIVE") api.isActive = true;
  if (filters.status === "PAUSED") api.isActive = false;
  return api;
};

export const matchesRecurringFilters = (
  item: RecurringTransaction,
  filters: RecurringListFilters = {},
) => {
  if (filters.accountId && item.accountId !== filters.accountId) {
    return false;
  }
  if (filters.type && filters.type !== "ALL" && item.type !== filters.type) {
    return false;
  }
  if (
    filters.recurrenceUnit &&
    filters.recurrenceUnit !== "ALL" &&
    item.recurrenceUnit !== filters.recurrenceUnit
  ) {
    return false;
  }
  if (filters.status === "ACTIVE" && !isRecurringActive(item)) {
    return false;
  }
  if (filters.status === "PAUSED" && isRecurringActive(item)) {
    return false;
  }

  const query = normalizeText(filters.search);
  if (query) {
    const haystack = [
      item.name,
      item.description,
      item.merchant,
      item.recurrenceUnit,
    ]
      .map(normalizeText)
      .join(" ");
    if (!haystack.includes(query)) return false;
  }

  return true;
};

export const filterRecurringList = (
  items: RecurringTransaction[],
  filters: RecurringListFilters = {},
) => items.filter((item) => matchesRecurringFilters(item, filters));

export const sortRecurringByNextRun = (items: RecurringTransaction[]) =>
  [...items].sort((a, b) => {
    const aDate = a.nextRunAt || a.startsAt || "";
    const bDate = b.nextRunAt || b.startsAt || "";
    const aTime = aDate ? new Date(aDate).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = bDate ? new Date(bDate).getTime() : Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
