import "../config/env";
import { Job, Worker } from "bullmq";
import redis from "../Redis";
import {
  sendDownAlertEmail,
  sendEmailVerification,
  sendRecoveryEmail,
} from "../services/emailVerification.services";
import { db } from "../db";

console.log("monitorWorkers module loaded");
console.log("Redis connection state:", redis.status);

redis.on("connect", () => console.log("Redis connected in worker"));
redis.on("ready", () => console.log("Redis ready in worker"));
redis.on("error", (err) => console.error("Redis error in worker:", err));

const alertEmailOptions = () => {
  return {
    connection: redis,
    concurrency: 10,
    lockDuration: 30000,
    removeOnComplete: {
      age: 172800,
      count: 10,
    },
    removeOnFail: {
      age: 172800,
      count: 100,
    },
  };
};

const insertIntoNotificationsTable = async (
  id: string,
  resendId: string | null,
  status: "sent" | "failed",
  type: "down" | "recovery",
) => {
  const insert_notifications_query =
    "INSERT INTO notification_logs (incident_id,resend_email_id,type,status) VALUES($1,$2,$3,$4)";
  const insert_notifications_values = [id, resendId, type, status];
  await db.query(insert_notifications_query, insert_notifications_values);
};
const processor = async (job: Job) => {
  console.log("Job Name:", job.name);
  if (job.name === "down-alert-email") {
    const { url_id, incident_id } = job.data;
    const getEmailAndUrlInfo = await db.query(
      "SELECT u.email,m.url,m.url_name from user_details u inner join monitor m on u.id = m.user_id where m.id = $1",
      [url_id],
    );
    const [{ email, url, url_name: urlName }] = getEmailAndUrlInfo.rows;
    const getStartedAt = await db.query(
      "SELECT id,started_at from incidents where monitor_id = $1 and id = $2",
      [url_id, incident_id],
    );
    const [{ id, started_at: startedAt }] = getStartedAt.rows;

    const downAlertEmail = await sendDownAlertEmail(
      email,
      urlName,
      url,
      startedAt,
    );
    if (downAlertEmail === null) {
      await insertIntoNotificationsTable(id, null, "failed", "down");
    } else {
      await insertIntoNotificationsTable(id, downAlertEmail.id, "sent", "down");
    }
  } else if (job.name === "recovery-email") {
    const { url_id, incident_id } = job.data;
    const getEmailAndUrlInfo = await db.query(
      "SELECT u.email,m.url,m.url_name from user_details u inner join monitor m on u.id = m.user_id where m.id = $1",
      [url_id],
    );
    const [{ email, url, url_name: urlName }] = getEmailAndUrlInfo.rows;
    const getStartedAt = await db.query(
      "SELECT id,started_at,resolved_at from incidents where monitor_id = $1 and id = $2",
      [url_id, incident_id],
    );
    const [{ id, started_at: startedAt, resolved_at: resolvedAt }] =
      getStartedAt.rows;
    const recoveryAlertEmail = await sendRecoveryEmail(
      email,
      urlName,
      url,
      startedAt,
      resolvedAt,
    );
    if (recoveryAlertEmail === null) {
      await insertIntoNotificationsTable(id, null, "failed", "recovery");
    } else {
      await insertIntoNotificationsTable(
        id,
        recoveryAlertEmail.id,
        "sent",
        "recovery",
      );
    }
  }
};

export const emailAlertWorker = new Worker(
  "alert-email",
  processor,
  alertEmailOptions(),
);
