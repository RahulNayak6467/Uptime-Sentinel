import { Job, Worker } from "bullmq";
import redis from "../Redis";
import { checkUrlHealth } from "../services/url.services";
import { runStateMachine } from "../utils/stateMachine.worker";
import { db } from "../db";
import logger from "../config/logger";

logger.info({}, "monitorWorkers module loaded");
logger.info({ status: redis.status }, "Redis connection state:");

redis.on("connect", () => logger.info({}, "Redis connected in worker"));
redis.on("ready", () => logger.info({}, "Redis ready in worker"));
redis.on("error", (err) =>
  logger.error({ err }, "Redis error in worker:", err),
);

const getWorkerOptions = () => {
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

const updateMonitorStatus = async (
  status: "UP" | "DOWN",
  user_id: string,
  url_id: string,
) => {
  const update_monitor_query =
    "UPDATE monitor SET status = $1 where id = $2 and user_id = $3";
  const update_monitor_values = [status, url_id, user_id];

  await db.query(update_monitor_query, update_monitor_values);
};

const processor = async (job: Job) => {
  const { TIMEOUT, user_id, url_id } = job.data;

  console.log("Worker gets the job");

  const urlMonitorResponse = await checkUrlHealth(TIMEOUT, user_id, url_id);
  await updateMonitorStatus(urlMonitorResponse.status, user_id, url_id);
  await runStateMachine(url_id, urlMonitorResponse.status);
};

export const urlCheckWorker = new Worker(
  "monitor-checks",
  processor,
  getWorkerOptions(),
);

urlCheckWorker.on("ready", () => {
  logger.info(
    { urlWorkerStatus: "READY" },
    "Url check  Worker connected to Redis and ready",
  );
});

urlCheckWorker.on("error", (err) => {
  logger.error({ urlWorkerStatus: "ERROR", err }, "Url check worker error");
});

urlCheckWorker.on("completed", (job) => {
  logger.info(
    { urlWorkerStatus: "COMPLETED", jobId: job.id },
    "Url check worker Job Completed",
  );
});

urlCheckWorker.on("failed", (job, err) => {
  logger.error(
    {
      urlWorkerStatus: "FAILED",
      err: err.message,
      jobId: job?.id,
      stack: err.stack,
    },
    "Url check worker Job Failed",
  );
});
