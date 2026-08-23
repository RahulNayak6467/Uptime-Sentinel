import { TlsDownCause } from "../../../checkers/tls/tls.types";
import logger from "../../../config/logger";
import { db } from "../../../db";
import { sendDownAlertEmail } from "../../../emails/downEmail";
import { sendRecoveryEmail } from "../../../emails/recoveredEmail";
import { sendStillDownAlertEmail } from "../../../emails/reminderEmail";
import { sendRenewalEmail } from "../../../emails/renewalEmail";
import { sendExpiryEmail } from "../../../emails/expiryEmail";

export const getMonitorAlertInfo = async (monitor_id: string) => {
  const result = await db.query(
    "SELECT u.email, m.url, m.monitor_name, m.monitor_type FROM user_details u INNER JOIN monitor m ON u.id = m.user_id WHERE m.id = $1",
    [monitor_id],
  );
  const [{ email, url, monitor_name: monitorName, monitor_type: type }] = result.rows;
  return { email, url, monitorName, type };
};

export const getIncidentTimes = async (monitor_id: string, incident_id: string) => {
  const result = await db.query(
    "SELECT id, started_at, resolved_at FROM incidents WHERE monitor_id = $1 AND id = $2",
    [monitor_id, incident_id],
  );
  const [{ id, started_at: startedAt, resolved_at: resolvedAt }] = result.rows;
  return { id, startedAt, resolvedAt };
};

export const insertIntoNotificationsTable = async (
  id: string,
  resendId: string | null,
  status: "sent" | "failed",
  type: "down" | "recovery" | "reminder",
) => {
  const insert_notifications_query =
    "INSERT INTO notification_logs (incident_id,resend_email_id,type,status) VALUES($1,$2,$3,$4)";
  const insert_notifications_values = [id, resendId, type, status];
  await db.query(insert_notifications_query, insert_notifications_values);
};

export const updateLastAlertSentAt = async (incident_id: string) => {
  const updatelast_alert_query =
    "UPDATE incidents SET last_alert_sent_at = NOW() where id = $1";
  const updatelast_alert_values = [incident_id];
  await db.query(updatelast_alert_query, updatelast_alert_values);
};


export const downEmailQuery = async (monitor_id: string, incident_id: string, cause: TlsDownCause | null) => {
  const { email, url, monitorName, type } = await getMonitorAlertInfo(monitor_id);
  const { id, startedAt } = await getIncidentTimes(monitor_id, incident_id);

  const downAlertEmail = await sendDownAlertEmail(type, email, monitorName, url, startedAt, monitor_id, cause);

  if (downAlertEmail === null) {
    await insertIntoNotificationsTable(id, null, "failed", "down");
  } else {
    await updateLastAlertSentAt(incident_id);
    await insertIntoNotificationsTable(id, downAlertEmail.id, "sent", "down");
  }
};

export const recoveryEmailQuery = async (monitor_id: string, incident_id: string) => {
  const { email, url, monitorName, type } = await getMonitorAlertInfo(monitor_id);
  const { id, startedAt, resolvedAt } = await getIncidentTimes(monitor_id, incident_id);

  const recoveryAlertEmail = await sendRecoveryEmail(type, email, monitorName, url, startedAt, resolvedAt, monitor_id);

  if (recoveryAlertEmail === null) {
    await insertIntoNotificationsTable(id, null, "failed", "recovery");
  } else {
    await insertIntoNotificationsTable(id, recoveryAlertEmail.id, "sent", "recovery");
  }
};

export const reminderEmailQuery = async (monitor_id: string, incident_id: string) => {
  const { email, url, monitorName } = await getMonitorAlertInfo(monitor_id);
  const { id, startedAt } = await getIncidentTimes(monitor_id, incident_id);

  const reminderEmail = await sendStillDownAlertEmail(email, monitorName, url, startedAt);

  if (reminderEmail === null) {
    await insertIntoNotificationsTable(id, null, "failed", "reminder");
  } else {
    await updateLastAlertSentAt(incident_id);
    await insertIntoNotificationsTable(id, reminderEmail.id, "sent", "reminder");
  }
};

export const renewalEmailQuery = async (monitor_id: string, issuer: string, expiryDate: string, fingerprint: string) => {
  const { email, url, monitorName } = await getMonitorAlertInfo(monitor_id);

   await sendRenewalEmail(email, monitorName, url, issuer, new Date(expiryDate), fingerprint, monitor_id);
}

export const expiryEmailQuery = async (
  monitor_id: string,
  threshold: number,
  daysRemaining: number,
  issuer: string,
  expiryDate: string,
  fingerprint: string,
) => {
  const { email, url, monitorName } = await getMonitorAlertInfo(monitor_id);

  await sendExpiryEmail(
    email,
    monitorName,
    url,
    issuer,
    new Date(expiryDate),
    daysRemaining,
    threshold,
    fingerprint,
    monitor_id,
  );
};
