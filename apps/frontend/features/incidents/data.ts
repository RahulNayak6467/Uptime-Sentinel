export const incidentListData = [
  // Dummy: incident detected automatically, user has not filled the details form yet.
  // Only fields available in incidents + monitor + url_checks; no human-written text.
  {
    id: crypto.randomUUID(),
    status: "active" as const,
    service: "Payments API",
    date: "Jun 15",
    occurredAt: "2026-06-15T17:05:00",
    time: "17:05",
    duration: "8m (ongoing)",
    endpoint: "https://api.statusforge.dev/payments",
    startedAt: "Jun 15, 2026 at 17:05",
    triggerLabel: "HTTP status",
    triggerValue: "503",
    expanded: true,
    updates: [],
  },
  {
    id: crypto.randomUUID(),
    title: "Checkout Service outage",
    status: "active" as const,
    service: "Checkout Service",
    date: "Jun 15",
    occurredAt: "2026-06-15T14:32:00",
    time: "14:32",
    duration: "13m (ongoing)",
    description: "HTTP 503 — upstream payment provider timeout.",
    endpoint: "https://api.statusforge.dev/checkout",
    startedAt: "Jun 15, 2026 at 14:32",
    triggerLabel: "HTTP status",
    triggerValue: "503 Service Unavailable",
    updates: [
      {
        id: crypto.randomUUID(),
        status: "detected" as const,
        time: "14:32",
        message:
          "Three consecutive checks returned HTTP 503. Incident opened automatically.",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "API elevated response times",
    status: "resolved" as const,
    service: "API Gateway",
    date: "Jun 10",
    occurredAt: "2026-06-10T08:25:00",
    time: "08:25",
    duration: "47 min",
    description:
      "p95 response times >400ms. Auto-resolved after upstream capacity increased.",
    endpoint: "https://api.statusforge.dev/v1",
    startedAt: "Jun 10, 2026 at 08:25",
    resolvedAt: "Jun 10, 2026 at 09:12",
    triggerLabel: "p95 latency",
    triggerValue: "486 ms (threshold: 400 ms)",
    expanded: true,
    updates: [
      {
        id: crypto.randomUUID(),
        status: "detected" as const,
        time: "08:25",
        message:
          "p95 latency exceeded the 400ms degraded threshold across us-east and eu-west.",
      },
      {
        id: crypto.randomUUID(),
        status: "investigating" as const,
        time: "08:31",
        message:
          "Traffic spike correlated with a marketing campaign launch. Connection pool saturated.",
      },
      {
        id: crypto.randomUUID(),
        status: "monitoring" as const,
        time: "08:58",
        message:
          "Autoscaler added 4 gateway instances. Latency trending back to baseline.",
      },
      {
        id: crypto.randomUUID(),
        status: "resolved" as const,
        time: "09:12",
        message:
          "p95 sustained under 180ms for 10 minutes. Incident auto-resolved.",
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: "Auth Service intermittent failures",
    status: "resolved" as const,
    service: "Auth Service",
    date: "May 28",
    occurredAt: "2026-05-28T03:12:00",
    time: "03:12",
    duration: "22 min",
    description:
      "JWT validation errors for a subset of users due to certificate rotation.",
    endpoint: "https://auth.statusforge.dev/verify",
    startedAt: "May 28, 2026 at 03:12",
    resolvedAt: "May 28, 2026 at 03:34",
    triggerLabel: "HTTP status",
    triggerValue: "401 Unauthorized",
    updates: [
      {
        id: crypto.randomUUID(),
        status: "detected" as const,
        time: "03:12",
        message:
          "Authentication checks began failing after certificate rotation.",
      },
      {
        id: crypto.randomUUID(),
        status: "resolved" as const,
        time: "03:34",
        message:
          "Validation returned to normal and the incident auto-resolved.",
      },
    ],
  },
];

export const IncidentsData = [
  {
    id: crypto.randomUUID(),
    title: "Active",
    information: 1,
    color: "red",
  },
  {
    id: crypto.randomUUID(),
    title: "This Month",
    information: 3,
    color: "white",
  },
  {
    id: crypto.randomUUID(),
    title: "Avg Duration",
    information: "27 min",
    color: "white",
  },
  {
    id: crypto.randomUUID(),
    title: "MTTR (30D)",
    information: "34 min",
    color: "white",
  },
];
