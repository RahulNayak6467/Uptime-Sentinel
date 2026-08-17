import { Job, Worker } from "bullmq";
import redis from "../redis";
import logger from "../config/logger";
import { TLSCheckJobData } from "../queue/tlsQueue";
import { insertToDB } from "../modules/tls-checks/services/insertTlsDB.services";
import { checkTlsHealth } from "../modules/tls-checks/services/tls.services";
import { runTlsStateMachine } from "./statemachine/tlsStateMachine.worker";
import { addTlsRenewalEmailQueue } from "../queue/alertEmailQueue";

logger.info({}, "tlsWorkers module loaded");
logger.info({ status: redis.status }, "Redis connection state:");

redis.on("connect", () => logger.info({}, "Redis connected in worker"));
redis.on("ready", () => logger.info({}, "Redis ready in worker"));
redis.on("error", (err) =>
  logger.error({ err }, "Redis error in worker:", err),
);

const getWorkerOptions = () => {
  return {
    connection: redis.duplicate(),
    concurrency: 5,
    lockDuration: 90000,
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

const processor = async (job: Job<TLSCheckJobData>) => {
  const { user_id, tls_id } = job.data;

  try {
    const tlsCheckData = await checkTlsHealth(user_id, tls_id);
    const isRenewed = await insertToDB(tls_id, tlsCheckData);
    logger.info({isRenewed}, "Check whether Tls certificate is renewed")
    if (isRenewed) {
      await addTlsRenewalEmailQueue(tls_id, tlsCheckData.certificate?.leaf_certificate.issuer as string, tlsCheckData.certificate?.leaf_certificate.valid_to as string, tlsCheckData.certificate?.leaf_certificate.finger_print as string);
    }
  }
  catch (err) {
    logger.error({ err });
    throw err;
  }
}

export const tlsCheckWorker = new Worker(
  "tls-checks",
  processor,
  getWorkerOptions(),
);

tlsCheckWorker.on("ready", () => {
  logger.info(
    { tlsWorkerStatus: "READY" },
    "Tls check worker connected to Redis and ready",
  );
});

tlsCheckWorker.on("error", (err) => {
  logger.error({ tlsWorkerStatus: "ERROR", err }, "Tls check worker error");
});

tlsCheckWorker.on("completed", (job) => {
  logger.info(
    { tlsWorkerStatus: "COMPLETED", jobId: job.id },
    "Tls check worker Job Completed",
  );
});

tlsCheckWorker.on("failed", (job, err) => {
  logger.error(
    {
      tlsWorkerStatus: "FAILED",
      err: err.message,
      jobId: job?.id,
      stack: err.stack,
    },
    "Tls check worker Job Failed",
  );
});
