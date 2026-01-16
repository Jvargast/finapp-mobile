import { z } from "zod";

export const createAccountSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(30, "Máximo 30 caracteres"),
  balance: z
    .string()
    .min(1, "Ingresa un monto")
    .refine((val) => !isNaN(parseFloat(val)), "Debe ser un número válido"),

  type: z.enum(["CASH", "BANK", "WALLET"]).default("BANK"),

  currency: z.enum(["CLP", "USD"]).default("CLP"),

  institution: z.string().optional(),

  color: z.string().default("DEFAULT"), 

  isCredit: z.boolean().default(false),
});

export type CreateAccountFormInputs = z.infer<typeof createAccountSchema>;
