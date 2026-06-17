import z from "zod";
export const userSchema = z.object({
  email: z.email({ message: "Invalid email format" }).max(255),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters are required" })
    .max(72, { message: "Maximum 72 characters are available" }),
});
