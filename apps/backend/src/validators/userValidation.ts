import z from "zod";
export const userSchema = z.object({
  email: z.email({ message: "Invalid email format" }).max(255),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters are required" })
    .max(72, { message: "Maximum 72 characters are available" })
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number"),
});

export const userLoginSchema = z.object({
  email: z
    .email({ message: "Invalid email format" })
    .max(255)
    .transform((email) => email.trim().toLowerCase()),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters are required" })
    .max(72, { message: "Maximum 72 characters are available" }),
});
