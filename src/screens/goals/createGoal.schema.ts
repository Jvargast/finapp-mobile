import { z } from "zod";
import { GoalType } from "../../types/goal.types";

const GoalTypeEnum = z.nativeEnum(GoalType);

const parseNumber = (val: string) => {
  if (!val) return 0;
  let clean = val.replace(/\./g, "");
  clean = clean.replace(",", ".");
  const result = Number(clean);
  return isNaN(result) ? 0 : result;
};

export const createGoalSchema = z.object({
  name: z.string().min(3, "Mínimo 3 caracteres").max(50),

  type: GoalTypeEnum,

  currency: z
    .enum(["CLP", "USD", "EUR", "UF", "CAD", "BTC"])
    .refine((val) => !!val, { message: "Selecciona una moneda" }),

  targetAmount: z
    .string()
    .min(1, "Ingresa el monto")
    .transform(parseNumber)
    .refine((val) => val > 0, "Debe ser mayor a 0"),

  currentAmount: z
    .string()
    .optional()
    .transform((val) => (val ? parseNumber(val) : 0)),

  deadline: z.date(),

  interestRate: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val.replace(",", ".")) : undefined)),

  monthlyQuota: z
    .string()
    .optional()
    .transform((val) => (val ? parseNumber(val) : 0)),

  estimatedYield: z
    .string()
    .optional()
    .transform((val) => (val ? parseNumber(val) : 0)),
});

export type CreateGoalFormInputs = z.input<typeof createGoalSchema>;

export type CreateGoalFormOutput = z.output<typeof createGoalSchema>;
