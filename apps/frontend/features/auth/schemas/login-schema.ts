import { z } from "zod";

export const loginSchema = z.object({
  email: z.string({ message: "Invalid input format" }).max(255),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters are required" })
    .max(72, { message: "Maximum 72 characters are available" }),
});

export type loginSchemaProps = z.infer<typeof loginSchema>;
