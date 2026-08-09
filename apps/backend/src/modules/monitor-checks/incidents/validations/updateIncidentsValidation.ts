import z from "zod";

export const incidentUpdateDataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(100, { message: "Title cannot be more than 100 characters" })
    .nullable(),
  type: z.enum(["detected", "resolved"]),
  message: z
    .string()
    .trim()
    .min(1, { message: "Message is required" })
    .max(500, { message: "Message must be 500 characters or fewer" }),
  incident_id: z.uuid("Incident ID must be a valid UUID"),
});
