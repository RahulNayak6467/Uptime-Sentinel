import "../config/env";
import { Job, Worker } from "bullmq";
import redis from "../redis";
import { sendDownAlertEmail } from "../emails/downEmail";
import { sendRecoveryEmail } from "../emails/recoveredEmail";
import { sendStillDownAlertEmail } from "../emails/reminderEmail";
import { db } from "../db";
import logger from "../config/logger";
import { insertIntoNotificationsTable, reminderEmailQuery, renewalEmailQuery, updateLastAlertSentAt } from "./statemachine/shared/workerHelper";
import { alertEmailOptions } from "./statemachine/shared/alertEmailConfig";
import { downEmailQuery, recoveryEmailQuery } from "./statemachine/shared/workerHelper";

logger.info("monitorWorkers module loaded");
logger.info({ status: redis.status }, "Redis connection state:");

redis.on("connect", () => logger.info("Redis connected in worker"));
redis.on("ready", () => logger.info("Redis ready in worker"));
redis.on("error", (err) =>
  logger.error({ err }, "Redis error in worker:", err),
);

const processor = async (job: Job) => {
  if (job.name === "down-alert-email") {
    const { monitor_id, incident_id, cause } = job.data;
    await downEmailQuery(monitor_id, incident_id, cause);

  } else if (job.name === "recovery-email") {
    const { monitor_id, incident_id } = job.data;
    await recoveryEmailQuery(monitor_id, incident_id);

  } else if (job.name === "reminder-email") {
    const { monitor_id, incident_id } = job.data;
    await reminderEmailQuery(monitor_id, incident_id);
  } else if (job.name === "renewal-tls-email") {
    const { monitor_id, issuer, expiryDate, fingerprint } = job.data;
    await renewalEmailQuery(monitor_id, issuer, expiryDate, fingerprint);
  }

};

export const emailAlertWorker = new Worker(
  "alert-email",
  processor,
  alertEmailOptions(),
);

emailAlertWorker.on("ready", () => {
  logger.info(
    { emailWorkerStatus: "READY" },
    "Email Alert worker connected to Redis and ready",
  );
});

emailAlertWorker.on("error", (err) => {
  logger.error(
    { emailWorkerStatus: "ERROR", err },
    "Email Alert worker error",
  );
});

emailAlertWorker.on("completed", (job) => {
  logger.info(
    { emailWorkerStatus: "COMPLETED", jobId: job.id },
    "Email Alert worker Job Completed",
  );
});

emailAlertWorker.on("failed", (job, err) => {
  logger.error(
    {
      emailWorkerStatus: "FAILED",
      err: err.message,
      jobId: job?.id,
      stack: err.stack,
    },
    "Email Alert worker Job Failed",
  );
});
