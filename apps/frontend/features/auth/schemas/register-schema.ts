import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Minimum 2 characters are requried for name" })
      .max(100, { message: "Maximum 100 characters are available for name" }),
    email: z.string({ message: "Invalid input format" }).max(255),
    password: z
      .string()
      .min(8, { message: "Minimum 8 characters are required" })
      .max(72, { message: "Maximum 72 characters are available" })
      .regex(/[A-Z]/, "Must contain uppercase")
      .regex(/[0-9]/, "Must contain number"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  });

export type registerSchemaProps = z.infer<typeof registerSchema>;
