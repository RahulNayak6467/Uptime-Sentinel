import assert from "node:assert/strict";
import test from "node:test";
import { IncidentsDataProps } from "../../../../db/db-types";
import { mapIncidentListRow } from "./incidentResponse";
import {
  incidentListQuerySchema,
  incidentStatusPredicate,
} from "../validations/incidentListValidation";

test("maps the real incident-opening failure context", () => {
  const row: IncidentsDataProps = {
    id: "incident-1",
    is_active: true,
    monitor_name: "Checkout API",
    monitor_type: "https",
    started_at: "2026-08-15T08:00:00.000Z",
    resolved_at: null,
    url: "https://example.com/checkout",
    failure_status_code: 503,
    failure_reason: null,
  };

  assert.deepEqual(mapIncidentListRow(row), {
    id: "incident-1",
    monitorName: "Checkout API",
    monitorType: "https",
    url: "https://example.com/checkout",
    resolvedAt: null,
    startedAt: "2026-08-15T08:00:00.000Z",
    failureStatusCode: 503,
    failureReason: null,
    isActive: true,
  });
});

test("builds only allow-listed incident status predicates", () => {
  assert.equal(incidentStatusPredicate("all"), "");
  assert.equal(
    incidentStatusPredicate("active"),
    "AND i.is_active = true",
  );
  assert.equal(
    incidentStatusPredicate("resolved"),
    "AND i.is_active = false",
  );
});

test("validates the incident status query and defaults to all", () => {
  assert.deepEqual(incidentListQuerySchema.parse({}), { status: "all" });
  assert.deepEqual(incidentListQuerySchema.parse({ status: "active" }), {
    status: "active",
  });
  assert.throws(() => incidentListQuerySchema.parse({ status: "invalid" }));
});
