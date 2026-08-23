import { z } from "zod";

export const httpMonitorSchema = z
  .object({
    monitorType: z.enum(["http", "https"], {}),

    monitorName: z
      .string()
      .trim()
      .min(2, { message: "Minimum 2 characters are required" })
      .max(50, { message: "Maximum 50 characters are required" }),

    url: z
      .url({ message: "Invalid url" })
      .refine(
        (url) => {
          try {
            const parsedUrl = new URL(url);
            return (
              parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
            );
          } catch (error) {
            console.log(error);
            return false;
          }
        },
        {
          message: "Only url with http and https protocols are allowed",
        },
      ),

    statusCodes: z
      .array(
        z
          .number({ error: "Status code must be a number" })
          .int({ error: "Status code must be an integer" })
          .min(100, { error: "Status code cannot be below 100" })
          .max(599, { error: "Status code cannot exceed 599" }),
      )
      .min(1, { error: "Add at least one expected status code" })
      .refine((codes) => new Set(codes).size === codes.length, {
        error: "Duplicate status codes are not allowed",
      }),

    httpMethod: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
      error: "Invalid http method",
    }),

    requestTimeoutMS: z
      .number()
      .min(1000, { message: "Minimum request timeout should be 1000ms" })
      .max(60000, { message: "Maximum timeout cannot exceed 60000ms" }),

    responseTimeThresholdMS: z
      .number({ error: "Response-time threshold must be a number" })
      .int({ error: "Response-time threshold must be an integer" })
      .min(1, { error: "Response-time threshold cannot be below 1ms" })
      .max(60000, { error: "Response-time threshold cannot exceed 60000ms" }),

    requestBodyType: z.enum(["none", "json", "form-encoded", "raw-text"], {
      error: "messaging type currently not supported",
    }),

    contentType: z.enum(
      ["application/json", "application/x-www-form-urlencoded", "text/plain", "none"],
      {
        error: "Invalid content type",
      },
    ),

    requestBody: z.string().nullable(),

    failureThreshold: z
      .number()
      .min(1, { message: "Failure threshold cannot be below 1" })
      .max(10, { message: "Failure threshold cannot be above 10" }),

    recoveryThreshold: z
      .number()
      .min(1, { message: "Recovery threshold cannot be below 1" })
      .max(10, { message: "Recovery threshold cannot be above 10" }),

    intervalSeconds: z.enum(["30s", "1m", "2m", "5m", "10m", "30m", "1h"], {
      error: "Choose among these check interval values",
    }),
  })
  .refine((data) => data.responseTimeThresholdMS <= data.requestTimeoutMS, {
    path: ["responseTimeThresholdMS"],
    error: "Response-time threshold cannot exceed the request timeout",
  });

export const tlsMonitorSchema = z.object({
  monitorType: z.literal("tls"),

  monitorName: z
    .string()
    .trim()
    .min(2, { message: "Minimum 2 characters are required" })
    .max(50, { message: "Maximum 50 characters are required" }),

  url: z
    .string({ message: "Host is required" })
    .trim()
    .regex(/^(?=.{1,253}$)(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/i, {
      message: "Enter a valid hostname, e.g. example.com (no https://, port, or path)",
    }),

  port: z
    .number({ error: "Port must be a number" })
    .int({ error: "Port must be an integer" })
    .min(1, { message: "Port cannot be below 1" })
    .max(65535, { message: "Port cannot exceed 65535" }),

  minTlsVersion: z.enum(["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"], {
    error: "Invalid TLS version",
  }),

  requestTimeoutMS: z
    .number()
    .min(1000, { message: "Minimum connection timeout should be 1000ms" })
    .max(60000, { message: "Maximum connection timeout cannot exceed 60000ms" }),

  warningThresholdDays: z
    .number({ error: "Warning threshold must be a number" })
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

  responseTimeThresholdMS: z
    .number({ error: "Response-time threshold must be a number" })
    .int({ error: "Response-time threshold must be an integer" })
    .min(1, { error: "Response-time threshold cannot be below 1ms" })
    .max(60000, { error: "Response-time threshold cannot exceed 60000ms" }),

  intervalSeconds: z.enum(["1h", "3h", "6h", "12h", "24h"], {
    error: "Choose among these check interval values",
  }),

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

export const monitorInfoSchema = z.discriminatedUnion("monitorType", [
  httpMonitorSchema,
  tlsMonitorSchema,
]);

export type monitorInfoProps = z.infer<typeof monitorInfoSchema>;
export type httpMonitorProps = z.infer<typeof httpMonitorSchema>;
export type tlsMonitorProps = z.infer<typeof tlsMonitorSchema>;
