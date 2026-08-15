import { Queue } from "bullmq";
import redis from "../redis";
import { TlsDownCause } from "../checkers/tls/tls.types";

const alertEmailQueue = new Queue("alert-email", {
  connection: redis,
});

export const addToDownAlertEmailQueue = async (
  monitor_id: string,
  incident_id: string,
  cause: TlsDownCause | null
) => {
  const addJob = await alertEmailQueue.add(
    "down-alert-email",
    {
      monitor_id,
      incident_id,
      cause,
    },
    {
      jobId: `email-check-${monitor_id}-${Date.now()}`,
      attempts: 4,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 172800,
        count: 10,
      },
      removeOnFail: {
        age: 172800,
        count: 100,
      },
    },
  );

  return addJob;
};

export const addToRecoveryEmailQueue = async (
  monitor_id: string,
  incident_id: string,
) => {
  const addJob = await alertEmailQueue.add(
    "recovery-email",
    {
      monitor_id,
      incident_id,
    },
    {
      jobId: `email-recovery-${monitor_id}-${Date.now()}`,
      attempts: 4,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 172800,
        count: 10,
      },
      removeOnFail: {
        age: 172800,
        count: 100,
      },
    },
  );

  return addJob;
};

export const addReminderEmailQueue = async (
  monitor_id: string,
  incident_id: string,
) => {
  const addJob = await alertEmailQueue.add(
    "reminder-email",
    {
      monitor_id,
      incident_id,
    },
    {
      jobId: `email-reminder-${monitor_id}-${Date.now()}`,
      attempts: 4,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 172800,
        count: 10,
      },
      removeOnFail: {
        age: 172800,
        count: 100,
      },
    },
  );

  return addJob;
};

export const addTlsRenewalEmailQueue = async (
  monitor_id: string,
  issuer: string,
  expiryDate: string,
  fingerprint: string
) => {
  const addJob = await alertEmailQueue.add(
    "renewal-tls-email",
    {
      monitor_id,
      issuer,
      expiryDate,
      fingerprint
    },
    {
      jobId: `renewal-tls-email-${monitor_id}-${Date.now()}`,
      attempts: 4,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 172800,
        count: 10,
      },
      removeOnFail: {
        age: 172800,
        count: 100,
      },
    },
  );

  return addJob;
};

export default alertEmailQueue;
