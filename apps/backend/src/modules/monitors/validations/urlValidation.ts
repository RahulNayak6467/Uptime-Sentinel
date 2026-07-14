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

export const urlSchema = z.object({
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
    }),
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
  httpMethod: z.literal("GET", {
    error: "Only GET checks are currently supported",
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

export type RegisterUrlInput = z.infer<typeof registerUrlSchema>;
