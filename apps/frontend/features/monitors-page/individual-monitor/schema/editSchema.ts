import { z } from "zod";

export const editSchema = z.object({
  // monitorType: z.
  //   enum(["http", "https", "tcp", "ssl", "dns", "keyword"], {
  //   }),

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

httpMethod: z
  .enum(["GET", "POST", "PUT", "PATCH", "DELETE"], {
    error: "Invalid http method"
  }),

requestTimeoutMS: z.coerce
  .number()
  .min(1000,
    { error: "Minimum request timeout should be 1000ms" })
    .max(60000,
    { error: "Maximum timeout cannot exceed 60000ms" }),

responseTimeThresholdMS: z.coerce
  .number()
  .int({ error: "Response-time threshold must be an integer" })
  .min(1, { error: "Response-time threshold cannot be below 1ms" })
  .max(60000, { error: "Response-time threshold cannot exceed 60000ms" }),

// requestBodyType: z
//     .enum(["none", "json", "form-encoded", "raw-text"], {
//       error: "messaging type currently not supported"
//     }),

  // contentType: z
  //   .enum(["application/json", "application/x-www-form-urlencoded", "text/plain","none"], {
  //     error: "Invalid content type"
  //   }),

// requestBody: z
//   .string()
//   .nullable(),

  failureThreshold: z.coerce
  .number()
  .min(1,
    { error: "Failure threshold cannot be below 1" })
  .max(10,
    { error: "Failure threshold cannot be above 10" }),

recoveryThreshold: z.coerce
  .number()
  .min(1,
    { error: "Recovery threshold cannot be below 1" })
  .max(10,
    { error: "Recovery threshold cannot be above 10" }),

intervalSeconds: z
  .enum(["30s", "1m", "2m", "5m", "10m", "30m", "1h"], {
  error: "Choose among these check interval values"
  })

}).refine(
  (data) => data.responseTimeThresholdMS <= data.requestTimeoutMS,
  {
    path: ["responseTimeThresholdMS"],
    error: "Response-time threshold cannot exceed the request timeout",
  },
)

export type editSchemaInputProps = z.input<typeof editSchema>
export type editSchemaProps = z.output<typeof editSchema>
