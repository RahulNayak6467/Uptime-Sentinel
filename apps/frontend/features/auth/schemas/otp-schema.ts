import { z } from "zod";

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 digits" })
    .regex(/^\d+$/, { message: "OTP must contain only digits" }),
});

export type OtpSchemaProps = z.infer<typeof otpSchema>;
