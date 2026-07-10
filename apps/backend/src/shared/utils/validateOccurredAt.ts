export type OccurredAtError =
  "INVALID_FORMAT" | "IN_FUTURE" | "BEFORE_INCIDENT_START";

export const TIME_ERROR_MESSAGES: Record<OccurredAtError, string> = {
  INVALID_FORMAT: "occurredAt must be a valid ISO date-time.",
  IN_FUTURE: "Update time cannot be in the future.",
  BEFORE_INCIDENT_START: "Update time cannot be before the incident started.",
};

export const validateOccurredAt = (
  occurredAt: string | null,
  startedAt: Date,
): OccurredAtError | null => {
  if (occurredAt === null) {
    return null;
  }

  const occurred = new Date(occurredAt).getTime();

  if (Number.isNaN(occurred)) {
    return "INVALID_FORMAT";
  }
  if (occurred > Date.now()) {
    return "IN_FUTURE";
  }
  if (occurred < startedAt.getTime()) {
    return "BEFORE_INCIDENT_START";
  }
  return null;
};
