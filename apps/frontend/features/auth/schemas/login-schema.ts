import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid input format" }).max(255),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters are required" })
    .max(72, { message: "Maximum 72 characters are available" })
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number"),
});

export type loginSchemaProps = z.infer<typeof loginSchema>;
