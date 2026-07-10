import { Queue } from "bullmq";
import redis from "../redis";
import logger from "../config/logger";

const monitorQueue = new Queue("monitor-checks", {
  connection: redis,
});

export const addToQueue = async (
  TIMEOUT: number,
  user_id: string,
  url_id: string,
) => {
  const addJob = await monitorQueue.add(
    "monitor-checks",
    {
      TIMEOUT,
      user_id,
      url_id,
    },
    {
      jobId: `monitor-check-${url_id}-${Date.now()}`,
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
  logger.debug({ jobId: addJob.id, monitorId: url_id }, "monitor check job added");

  return addJob;
};

export default monitorQueue;
