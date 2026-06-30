export type typeProps =
  "incident_created" | "incident_resolved" | "check_result";

export type CheckUrlPayload = {
  monitorId: string;
  responseTime: number | null;
  statusCode: number | null;
  nextCheckAt: string;
  status: "UP" | "DOWN";
};

export type IncidentCreatedPayload = {
  monitorId: string;
  incidentId: string;
  severity: string;
  startedAt: string;
};

export type IncidentResolvedPayload = {
  monitorId: string;
  incidentId: string;
  resolvedAt: string;
};

export type SSEPayload =
  CheckUrlPayload | IncidentCreatedPayload | IncidentResolvedPayload;
