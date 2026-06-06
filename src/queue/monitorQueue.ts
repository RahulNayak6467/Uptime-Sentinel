import { Queue } from "bullmq";
import redis from "../Redis";

const monitorQueue = new Queue("monitor-checks", {
  connection: redis, // your existing redis client
});

export const addToQueue = async (
  TIMEOUT: number,
  user_id: string,
  url_id: string,
) => {
  console.log("Job added to queue");
  await monitorQueue.add(
    "monitor-checks",
    {
      TIMEOUT,
      user_id,
      url_id,
    },
    {
      attempts: 3,
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
};

export default monitorQueue;
