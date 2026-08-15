import { PoolClient } from "pg";
import { OCSPStatus, TlsDownCause, TlsStatus, ValidationChecks } from "../../checkers/tls/tls.types";
import { insertDownEvent, recoveredEvent } from "../../modules/tls-checks/services/tlsCertEvents.services";
// import { getActiveIncident, insertIntoIncidentsTable, updateResolvedAt } from "./httpsStateMachine.worker"
import { getActiveIncident, insertIntoIncidentsTable, updateResolvedAt } from "./shared/incidentLifecycle";

export const checkStatus = (status: TlsStatus | "Unreachable"): "UP" | "DOWN" => {
  if (status === "Valid" || status === "Expiring") return "UP";
  return "DOWN";
}

export const runTlsStateMachine = async(client: PoolClient, tls_id: string, status: TlsStatus | "Unreachable", validation: ValidationChecks | null, revocationStatus: OCSPStatus["status"]) => {
  const activeIncident = await getActiveIncident(tls_id);
  const currentState = activeIncident ? "INCIDENT_ACTIVE" : "NO_INCIDENT";
  const state = checkStatus(status) === "UP" ? "TLS_UP" : "TLS_DOWN";

  const transition = {
    "NO_INCIDENT:TLS_UP": () => {
      // Nothing to do
    },
    "NO_INCIDENT:TLS_DOWN": async() => {
      // Find the reason for down
      // Store in incidents table
      // update the incident_updates table
      await insertIntoIncidentsTable(client, tls_id);
      // update the tls_events table
      await insertDownEvent(client, tls_id, status, validation, revocationStatus);
    },
    "INCIDENT_ACTIVE:TLS_UP": async () => {
      // updating resolved At
      await updateResolvedAt(client,activeIncident.id);
      // Creating the recovered event
      await recoveredEvent(client, tls_id);
    },
    "INCIDENT_ACTIVE:TLS_DOWN": () => {
      // Nothing to do
    },

  }
  const action = transition[`${currentState}:${state}`];

  await action();
}
