import { Queue } from "bullmq";
import redis from "../redis";
import logger from "../config/logger";
import { PoolClient } from "pg";

const tlsQueue = new Queue("tls-checks", {
  connection: redis,
});

export type TLSCheckJobData = {
  user_id: string;
  tls_id: string;
};

export const addToTlsQueue = async (
  user_id: string,
  tls_id: string,
) => {
  const addJob = await tlsQueue.add(
    "tls-checks",
    {
      user_id,
      tls_id,
    },
    {
      jobId: `tls-checks-${tls_id}-${Date.now()}`,
      attempts: 1,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      priority: 1,
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
  logger.debug({ jobId: addJob.id, monitorId: tls_id }, "tls check job added");

  return addJob;
};

export default tlsQueue;
