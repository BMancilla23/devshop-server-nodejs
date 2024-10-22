import { usersTable } from "@db/schemas/users.js";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const createUserSchema = createInsertSchema(usersTable)
  .omit({
    id: true,
    role: true,
  })
  .extend({
    email: z
      .string()
      .email("Invalid email address") // Validación de formato de email
      .transform((email) => email.toLowerCase()), // Convertir a minúsculas
    password: z.string().min(8, "Password must be at least 8 characters long"),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z
      .string()
      .email(
        "Invalid email address" // Validación de formato de email
      )
      .transform((email) => email.toLowerCase()), // Convertir a minúscula
    password: z.string(),
  })
  .strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;

export type LoginUserInput = z.infer<typeof loginUserSchema>;
