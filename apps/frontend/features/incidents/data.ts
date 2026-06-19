export const incidentListData = [
  {
    id: crypto.randomUUID(),
    title: "Checkout Service outage",
    status: "active" as const,
    service: "Checkout Service",
    date: "Jun 15",
    time: "14:32",
    duration: "13m (ongoing)",
    description: "HTTP 503 — upstream payment provider timeout.",
  },
  {
    id: crypto.randomUUID(),
    title: "API elevated response times",
    status: "resolved" as const,
    service: "API Gateway",
    date: "Jun 10",
    time: "08:25",
    duration: "47 min",
    description: "p95 response times >400ms. Auto-resolved after upstream capacity increased.",
  },
  {
    id: crypto.randomUUID(),
    title: "Auth Service intermittent failures",
    status: "resolved" as const,
    service: "Auth Service",
    date: "May 28",
    time: "03:12",
    duration: "22 min",
    description: "JWT validation errors for a subset of users due to certificate rotation.",
  },
];

export const IncidentsData = [
  {
    id: crypto.randomUUID(),
    title: "Active",
    information: 1,
    color: "var(--color-sf-red)",
  },
  {
    id: crypto.randomUUID(),
    title: "This Month",
    information: 3,
    color: "var(--color-sf-text)",
  },
  {
    id: crypto.randomUUID(),
    title: "Avg Duration",
    information: "27 min",
    color: "var(--color-sf-text)",
  },
  {
    id: crypto.randomUUID(),
    title: "MTTR (30D)",
    information: "34 min",
    color: "var(--color-sf-text)",
  },
];
