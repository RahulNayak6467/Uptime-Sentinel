import { z } from "zod";
import { IncidentUpdateStatus } from "../types";

export const CLOCK_TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export type IncidentUpdateSchemaOptions = {
  startedAt: Date | string;
  incidentStatus: "active" | "resolved";
  /** Statuses the current lifecycle state permits the user to submit. */
  availableStatuses?: IncidentUpdateStatus[];
  /** Editing an existing note: status and time are fixed, only the message changes. */
  isEdit?: boolean;
};

export const buildIncidentUpdateSchema = ({
  startedAt,
  incidentStatus,
  availableStatuses = [],
  isEdit = false,
}: IncidentUpdateSchemaOptions) => {
  // A string startedAt would make `occurredAt < startedAt` always false
  // (Date-to-string comparison), silently disabling the check.
  const startedAtDate =
    startedAt instanceof Date ? startedAt : new Date(startedAt);

  return z
    .object({
      title: z
        .string()
        .trim()
        .max(100, { message: "Title must be 100 characters or fewer" }),
      status: z.enum(["detected", "investigating", "monitoring", "resolved"]),
      message: z
        .string()
        .trim()
        .min(1, { message: "Message is required" })
        .max(500, { message: "Message must be 500 characters or fewer" }),
      timeMode: z.enum(["now", "custom"]),
      selectedDate: z.date().nullable(),
      customClockTime: z.string(),
    })
    .superRefine((data, ctx) => {
      if (!isEdit) {
        if (!availableStatuses.includes(data.status)) {
          ctx.addIssue({
            code: "custom",
            path: ["status"],
            message:
              incidentStatus === "resolved"
                ? "A resolved incident can only receive its final resolved note."
                : "Choose an available status for the incident's current stage.",
          });
        }
      }

      if (
        (data.status === "detected" || data.status === "resolved") &&
        data.timeMode === "custom"
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["timeMode"],
          message: "Detected and Resolved notes use the server timestamp.",
        });
      }

      if (data.timeMode !== "custom") return;

      if (data.selectedDate === null) {
        ctx.addIssue({
          code: "custom",
          path: ["selectedDate"],
          message: "Pick a date",
        });
      }
      if (!CLOCK_TIME_REGEX.test(data.customClockTime)) {
        ctx.addIssue({
          code: "custom",
          path: ["customClockTime"],
          message: "Enter a valid time between 00:00 and 23:59.",
        });
      }

      if (
        data.selectedDate === null ||
        !CLOCK_TIME_REGEX.test(data.customClockTime)
      ) {
        return;
      }

      const [hour, minute] = data.customClockTime.split(":").map(Number);
      const occurredAt = new Date(data.selectedDate);
      occurredAt.setHours(hour, minute, 0, 0);

      if (occurredAt.getTime() > Date.now()) {
        ctx.addIssue({
          code: "custom",
          path: ["customClockTime"],
          message: "Update time cannot be in the future.",
        });
      }
      if (occurredAt.getTime() < startedAtDate.getTime()) {
        ctx.addIssue({
          code: "custom",
          path: ["customClockTime"],
          message: "Update time cannot be before the incident started.",
        });
      }
    });
};

export type incidentUpdateFormProps = z.infer<
  ReturnType<typeof buildIncidentUpdateSchema>
>;
