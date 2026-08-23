import { z } from "zod";

export const editTlsSchema = z.object({
  monitorName: z
    .string()
    .trim()
    .min(2, { message: "Minimum 2 characters are required" })
    .max(50, { message: "Maximum 50 characters are required" }),

  url: z
    .string()
    .trim()
    .regex(/^(?=.{1,253}$)(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/i, {
      message: "Enter a valid hostname, e.g. example.com (no https://, port, or path)",
    }),

  intervalSeconds: z.enum(["1h", "3h", "6h", "12h", "24h"], {
    error: "Choose among these check interval values",
  }),

  requestTimeoutMS: z.coerce
    .number()
    .int({ error: "Connection timeout must be an integer" })
    .min(10000, { error: "Minimum connection timeout is 10000ms" })
    .max(60000, { error: "Maximum connection timeout cannot exceed 60000ms" }),

  responseTimeThresholdMS: z.coerce
    .number()
    .int({ error: "Handshake threshold must be an integer" })
    .min(1, { error: "Handshake threshold cannot be below 1ms" })
    .max(60000, { error: "Handshake threshold cannot exceed 60000ms" }),

  port: z.coerce
    .number()
    .int({ error: "Port must be an integer" })
    .min(1, { message: "Port cannot be below 1" })
    .max(65535, { message: "Port cannot exceed 65535" }),

  minTlsVersion: z.enum(["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"], {
    error: "Invalid TLS version",
  }),

  warningThresholdDays: z.coerce
    .number()
    .int({ error: "Warning threshold must be an integer" })
    .min(1, { message: "Warning threshold cannot be below 1 day" })
    .max(365, { message: "Warning threshold cannot exceed 365 days" }),

  expiryAlertThresholds: z
    .string()
    .trim()
    .refine(
      (value) => {
        const days = value
          .split(",")
          .map((part) => part.trim())
          .filter(Boolean);

        if (days.length === 0) return false;

        const parsed = days.map(Number);
        const allValid = parsed.every(
          (day) => Number.isInteger(day) && day >= 1 && day <= 365,
        );
        const noDuplicates = new Set(parsed).size === parsed.length;

        return allValid && noDuplicates;
      },
      {
        message: "Enter comma-separated days between 1 and 365, no duplicates",
      },
    ),

  enabledAlerts: z
    .array(
      z.enum([
        "expiring",
        "expired_or_invalid",
        "hostname_mismatch",
        "renewal",
        "revocation",
        "weak_config",
        "recovery",
      ]),
    )
    .min(1, { message: "Enable at least one alert event" }),
});

export type editTlsSchemaInputProps = z.input<typeof editTlsSchema>;
export type editTlsSchemaProps = z.output<typeof editTlsSchema>;
