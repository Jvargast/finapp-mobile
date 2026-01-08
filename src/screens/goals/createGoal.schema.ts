import { z } from "zod";
import { GoalType } from "../../types/goal.types";

const GoalTypeEnum = z.nativeEnum(GoalType);

export const createGoalSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre es muy corto (mínimo 3 letras)")
    .max(50, "El nombre es muy largo"),

  type: GoalTypeEnum,

  targetAmount: z
    .string()
    .min(1, "Ingresa el monto objetivo")
    .transform((val) => Number(val.replace(/[^0-9]/g, "")))
    .refine((val) => val > 0, "El objetivo debe ser mayor a 0"),

  currentAmount: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val.replace(/[^0-9]/g, "")) : 0)),

  deadline: z
    .date()
    .refine((date) => date > new Date(), {
      message: "La fecha debe ser en el futuro",
    }),

  interestRate: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val.replace(",", ".")) : undefined))
    .refine(
      (val) => val === undefined || (val >= 0 && val <= 100),
      "La tasa debe estar entre 0% y 100%"
    ),
});

export type CreateGoalFormValues = z.infer<typeof createGoalSchema>;
