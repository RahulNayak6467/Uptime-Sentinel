import { Job, Worker } from "bullmq";
import redis from "../Redis";
import { checkUrlHealth } from "../services/url.services";

console.log("monitorWorkers module loaded");
console.log("Redis connection state:", redis.status);

redis.on("connect", () => console.log("Redis connected in worker"));
redis.on("ready", () => console.log("Redis ready in worker"));
redis.on("error", (err) => console.error("Redis error in worker:", err));

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

const processor = async (job: Job) => {
  const { TIMEOUT, user_id, url_id } = job.data;
  console.log("Worker gets the job");

  console.log("TIMEOU: ", TIMEOUT);
  console.log("user_id: ", user_id);
  console.log("url_id: ", url_id);

  const urlMonitorResponse = await checkUrlHealth(TIMEOUT, user_id, url_id);
  console.log(urlMonitorResponse);
  const responseCode = urlMonitorResponse.statusCode;

  if (responseCode === null) {
    throw new Error("Url is down");
  }
  if (responseCode >= 500) {
    throw new Error(`HTTP error ${responseCode} status code`);
  }
};

export const urlCheckWorker = new Worker(
  "monitor-checks",
  processor,
  getWorkerOptions(),
);

urlCheckWorker.on("ready", () => {
  console.log("Monitor Worker connected to Redis and ready");
});

urlCheckWorker.on("error", (error) => {
  console.error("Monitor Worker error:", error);
});

urlCheckWorker.on("completed", (job) => {
  console.log(`Montior Job ${job.id} completed`);
});

urlCheckWorker.on("failed", (job, error) => {
  console.log(`Monitor Job ${job?.id} failed:`, error.message);
  console.error("Stack:", error.stack);
});
