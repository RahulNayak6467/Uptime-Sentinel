import { Queue } from "bullmq";
import redis from "../Redis";

const alertEmailQueue = new Queue("down-alert-email", {
  connection: redis, // your existing redis client
});

export const addToDownAlertEmailQueue = async (url_id: string) => {
  const addJob = await alertEmailQueue.add(
    "down-alert-email",
    {
      url_id,
    },
    {
      jobId: `email-check-${url_id}-${Date.now()}`,
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
