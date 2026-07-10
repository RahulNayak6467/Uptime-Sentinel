import z from "zod";

export const pagePaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100, "Cannot set limit values more than 100")
    .default(20),
});
