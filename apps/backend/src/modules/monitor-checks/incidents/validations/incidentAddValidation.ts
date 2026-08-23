import z from "zod";

export const incidentAddSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(100, { message: "Title cannot be more than 100" })
    .nullable(),
  type: z.enum(["investigating", "monitoring"]),
  message: z
    .string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(500, { message: "Message must be 500 characters or fewer" }),
  occurredAt: z.iso.datetime().nullable(),
  incident_id: z.uuid("Incident ID must be a valid UUID"),
});
