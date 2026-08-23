import z from "zod";

const urlField = z.url({
  error: "Invalid URL",
}).refine(
  (url) => {
    const protocol = new URL(url).protocol;
    return protocol === "http:" || protocol === "https:";
  },
  {
    error: "Only URLs with HTTP and HTTPS protocols are allowed",
  },
);

export const TLS_ALERT_EVENTS = [
  "expiring",
  "expired_or_invalid",
  "hostname_mismatch",
  "renewal",
  "revocation",
  "weak_config",
  "recovery",
] as const;

const responseTimeThresholdField = z
  .number({
    error: "Response-time threshold must be a number",
  })
  .int({
    error: "Response-time threshold must be an integer",
  })
  .min(1, {
    error: "Minimum response-time threshold is 1ms",
  })
  .max(60000, {
    error: "Maximum response-time threshold is 60000ms",
  });


export const registerUrlSchema = z.object({
  monitorType: z
    .enum(["http", "https"], {
    error: "Invalid monitor type",
  }),
  url: urlField,
  monitorName: z
    .string({
      error: "Monitor name must be a string",
    })
    .trim()
    .min(2, {
      error: "Minimum 2 characters are required",
    })
    .max(50, {
      error: "Maximum 50 characters are allowed",
    }),
  intervalSeconds: z
    .number({
      error: "Interval must be a number",
    })
    .int({
      error: "Interval must be a whole number of seconds",
    })
    .min(30, {
      error: "Minimum interval time should be 30 seconds",
    }),
  contentType: z.enum(
    [
      "application/json",
      "application/x-www-form-urlencoded",
      "text/plain",
      "none",
    ],
    {
      error: "Invalid content type",
    },
  ),
  failureThreshold: z
    .number({
      error: "Failure threshold must be a number",
    })
    .int({
      error: "Failure threshold must be an integer",
    })
    .min(1, {
      error: "Failure threshold cannot be below 1",
    })
    .max(10, {
      error: "Failure threshold cannot exceed 10",
    }),
  httpMethod: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
    error: "Invalid HTTP method",
  }),
  requestBody: z
    .string({
      error: "Request body must be a string",
    })
    .nullable(),
  requestBodyType: z.enum(["none", "json", "form-encoded", "raw-text"], {
    error: "Invalid request body type",
  }),
  requestTimeoutMS: z
    .number({
      error: "Request timeout must be a number",
    })
    .int({
      error: "Request timeout must be an integer",
    })
    .min(1000, {
      error: "Minimum request timeout is 1000ms",
    })
    .max(60000, {
      error: "Maximum request timeout is 60000ms",
    }),
  responseTimeThresholdMS: responseTimeThresholdField,
  statusCodes: z
    .array(
      z
        .number({
          error: "Status code must be a number",
        })
        .int({
          error: "Status code must be an integer",
        })
        .min(100, {
          error: "Status code cannot be below 100",
        })
        .max(599, {
          error: "Status code cannot exceed 599",
        }),
      {
        error: "Status codes must be an array",
      },
    )
    .min(1, {
      error: "Add at least one expected status code",
    })
    .refine((codes) => new Set(codes).size === codes.length, {
      error: "Duplicate status codes are not allowed",
    }),
  recoveryThreshold: z
    .number({
      error: "Recovery threshold must be a number",
    })
    .int({
      error: "Recovery threshold must be an integer",
    })
    .min(1, {
      error: "Recovery threshold cannot be below 1",
    })
    .max(10, {
      error: "Recovery threshold cannot exceed 10",
    }),
});


export const urlSchema =z.object({
  url: urlField
    .optional(),
  monitorName: z
    .string({
      error: "Monitor name must be a string",
    })
    .trim()
    .min(2, {
      error: "Minimum 2 characters are required",
    })
    .max(50, {
      error: "Maximum 50 characters are allowed",
    })
    .optional(),
  intervalSeconds: z
    .number({
      error: "Interval must be a number",
    })
    .int({
      error: "Interval must be a whole number of seconds",
    })
    .min(30, {
      error: "Minimum interval time should be 30 seconds",
    })
    .optional()
  ,
  contentType: z
    .enum(
      [
        "application/json",
        "application/x-www-form-urlencoded",
        "text/plain",
        "none",
      ],
      {
        error: "Invalid content type",
      },
    )
    .optional(),
  failureThreshold: z
    .number({
      error: "Failure threshold must be a number",
    })
    .int({
      error: "Failure threshold must be an integer",
    })
    .min(1, {
      error: "Failure threshold cannot be below 1",
    })
    .max(10, {
      error: "Failure threshold cannot exceed 10",
    })
    .optional()
  ,
  httpMethod: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
    error: "Invalid HTTP method",
  })
  .optional()
  ,
  requestBody: z
    .string({
      error: "Request body must be a string",
    })
    .nullable()
    .optional(),
  requestBodyType: z
    .enum(["none", "json", "form-encoded", "raw-text"], {
      error: "Invalid request body type",
    })
    .optional(),
  requestTimeoutMS: z
    .number({
      error: "Request timeout must be a number",
    })
    .int({
      error: "Request timeout must be an integer",
    })
    .min(1000, {
      error: "Minimum request timeout is 1000ms",
    })
    .max(60000, {
      error: "Maximum request timeout is 60000ms",
    })
    .optional()
  ,
  responseTimeThresholdMS: responseTimeThresholdField
    . optional(),
  statusCodes: z
    .array(
      z
        .number({
          error: "Status code must be a number",
        })
        .int({
          error: "Status code must be an integer",
        })
        .min(100, {
          error: "Status code cannot be below 100",
        })
        .max(599, {
          error: "Status code cannot exceed 599",
        }),
      {
        error: "Status codes must be an array",
      },
    )
    .min(1, {
      error: "Add at least one expected status code",
    })
    .refine((codes) => new Set(codes).size === codes.length, {
      error: "Duplicate status codes are not allowed",
    })
    .optional(),
  recoveryThreshold: z
    .number({
      error: "Recovery threshold must be a number",
    })
    .int({
      error: "Recovery threshold must be an integer",
    })
    .min(1, {
      error: "Recovery threshold cannot be below 1",
    })
    .max(10, {
      error: "Recovery threshold cannot exceed 10",
    })
    .optional()
})



export type RegisterUrlInput = z.infer<typeof registerUrlSchema>;

export const registerTlsSchema = z.strictObject({
  monitorType: z
    .enum(["tls"],{
    error: "Monitor type must be tls",
  }),
  monitorName: z
    .string({
      error: "Monitor name must be a string",
    })
    .trim()
    .min(2, {
      error: "Minimum 2 characters are required",
    })
    .max(50, {
      error: "Maximum 50 characters are allowed",
    }),
  url: z
   .string({ error: "Host is required" })
   .trim()
   .toLowerCase()
   .regex(
     /^(?=.{1,253}$)(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/i,
     { error: "Enter a valid hostname, e.g. example.com (no https://, port, or path)" }
   ),
  intervalSeconds: z
    .number({
      error: "Interval must be a number",
    })
    .int({
      error: "Interval must be a whole number of seconds",
    })
    .min(3600, {
      error: "Minimum interval time should be 1hour",
    })
    .default(43200),
  requestTimeoutMS: z
    .number({
      error: "Request timeout must be a number",
    })
    .int({
      error: "Request timeout must be an integer",
    })
    .min(10000, {
      error: "Minimum request timeout is 10000ms",
    })
    .max(60000, {
      error: "Maximum request timeout is 60000ms",
    })
    .default(10000),

  port: z.number({
    error: "Port number should be an integer between 1 to 65535",
  })
    .int({
      error:"Port number should be an integer between 1 to 65535",
    })
    .min(1, {
      error: "Port number cannot be below 1"
    })
    .max(65535, {
      error: "Port number cannot exceed 65535",
    })
    .default(443),

  minTlsVersion: z
    .enum(["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"])
    .default("TLSv1.2"),

  warningThresholdDays: z
    .number({
      error: "Warning Threshold Days must be integer"
    })
    .int({
      error: "Warning Threshold Days must be integer"
    })
    .default(30),

  expiryAlertThresholds: z.array(
    z
      .number({
      error: "The alert thresholds must be integer"
      })
      .int({
      error: "The alert thresholds must be integer"
      })
      .min(1, {
      error: "Alert threshold days must be at least 1"
      })
      .max(365, {
      error: "Alert threshold days cannot exceed 365"
      })
  )
    .min(1, {
      error: "Add at least one expiry alert threshold"
    })
    .refine((days) => new Set(days).size === days.length, {
      error: "Duplicate alert thresholds are not allowed"
    })
    .default([1, 7, 14, 30]),
  responseTimeThresholdMS: responseTimeThresholdField
    .default(10000),
  enabledAlerts: z
    .array(
      z.enum(TLS_ALERT_EVENTS, { error: "Invalid alert event" }),
      { error: "Enabled alerts must be an array" },
    )
    .min(1, { error: "Enable at least one alert" })
    .refine((events) => new Set(events).size === events.length, {
      error: "Duplicate alerts are not allowed",
    })
    .default([...TLS_ALERT_EVENTS]),
})

export type RegisterTlsInput = z.infer<typeof registerTlsSchema>


export const registerMonitorSchema = z
  .discriminatedUnion("monitorType", [registerUrlSchema, registerTlsSchema])
  .refine(
    (data) =>
      data.monitorType === "tls" ||
      data.responseTimeThresholdMS <= data.requestTimeoutMS,
    {
      path: ["responseTimeThresholdMS"],
      error: "Response-time threshold cannot exceed the request timeout",
    },
  );

export type RegisterMonitorInput = z.infer<typeof registerMonitorSchema>

export const registerMonitorQuerySchema = z.object({
  monitorId: z.uuid({ error: "Invalid monitor id" }).optional(),
});

export type RegisterMonitorQuery = z.infer<typeof registerMonitorQuerySchema>

// Partial-update schema for TLS monitors. Every field optional; the controller
// rejects an empty payload and the service only writes the fields present.
export const updateTlsSchema = z.object({
  monitorType: z.literal("tls").optional(),
  monitorName: z
    .string({ error: "Monitor name must be a string" })
    .trim()
    .min(2, { error: "Minimum 2 characters are required" })
    .max(50, { error: "Maximum 50 characters are allowed" })
    .optional(),
  url: z
    .string({ error: "Host is required" })
    .trim()
    .toLowerCase()
    .regex(/^(?=.{1,253}$)(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/i, {
      error: "Enter a valid hostname, e.g. example.com (no https://, port, or path)",
    })
    .optional(),
  intervalSeconds: z
    .number({ error: "Interval must be a number" })
    .int({ error: "Interval must be a whole number of seconds" })
    .min(3600, { error: "Minimum interval time should be 1hour" })
    .optional(),
  requestTimeoutMS: z
    .number({ error: "Request timeout must be a number" })
    .int({ error: "Request timeout must be an integer" })
    .min(10000, { error: "Minimum request timeout is 10000ms" })
    .max(60000, { error: "Maximum request timeout is 60000ms" })
    .optional(),
  responseTimeThresholdMS: responseTimeThresholdField.optional(),
  port: z
    .number({ error: "Port number should be an integer between 1 to 65535" })
    .int({ error: "Port number should be an integer between 1 to 65535" })
    .min(1, { error: "Port number cannot be below 1" })
    .max(65535, { error: "Port number cannot exceed 65535" })
    .optional(),
  minTlsVersion: z.enum(["TLSv1", "TLSv1.1", "TLSv1.2", "TLSv1.3"]).optional(),
  warningThresholdDays: z
    .number({ error: "Warning Threshold Days must be integer" })
    .int({ error: "Warning Threshold Days must be integer" })
    .min(1, { error: "Warning threshold cannot be below 1 day" })
    .max(365, { error: "Warning threshold cannot exceed 365 days" })
    .optional(),
  expiryAlertThresholds: z
    .array(
      z
        .number({ error: "The alert thresholds must be integer" })
        .int({ error: "The alert thresholds must be integer" })
        .min(1, { error: "Alert threshold days must be at least 1" })
        .max(365, { error: "Alert threshold days cannot exceed 365" }),
    )
    .min(1, { error: "Add at least one expiry alert threshold" })
    .refine((days) => new Set(days).size === days.length, {
      error: "Duplicate alert thresholds are not allowed",
    })
    .optional(),
  enabledAlerts: z
    .array(z.enum(TLS_ALERT_EVENTS, { error: "Invalid alert event" }))
    .min(1, { error: "Enable at least one alert" })
    .refine((events) => new Set(events).size === events.length, {
      error: "Duplicate alerts are not allowed",
    })
    .optional(),
});

export type UpdateTlsInput = z.infer<typeof updateTlsSchema>
