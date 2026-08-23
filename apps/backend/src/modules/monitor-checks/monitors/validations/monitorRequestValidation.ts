import z from "zod";

export const monitorStatusBodySchema = z.strictObject({
  isActive: z.boolean({
    error: "isActive must be a boolean",
  }),
});

export const monitorListQuerySchema = z.object({
  monitorstatus: z
    .enum(["all", "up", "down", "unknown", "paused"], {
      error: "Invalid monitor status filter",
    })
    .default("all"),
  page: z.coerce
    .number({
      error: "Page must be a number",
    })
    .int({
      error: "Page must be an integer",
    })
    .min(1, {
      error: "Page cannot be below 1",
    })
    .default(1),
  limit: z.coerce
    .number({
      error: "Limit must be a number",
    })
    .int({
      error: "Limit must be an integer",
    })
    .min(1, {
      error: "Limit cannot be below 1",
    })
    .max(100, {
      error: "Limit cannot exceed 100",
    })
    .default(2),
});
