import { Job, Queue } from "bullmq";
import redis from "../redis";
import logger from "../config/logger";
import { QueueConfig } from "./types/queueTypes";
import { MonitorType } from "../db/db-types";


const createCheckQueue = async<T extends QueueConfig>(props: T, queueName: string, checkType: MonitorType) => {

  const checkerQueue = new Queue(queueName, {
    connection: redis,
  });

  const addJob = async (props: T) => {
    const job = await checkerQueue.add(
     queueName,
      props.payload,
      {
        jobId: `${queueName}-${props.payload.url_id}-${Date.now()}`,
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

    logger.debug({ jobId: job.id, monitorId: props.payload.url_id }, `${checkType} check job added`);

    return job;
  }

  return { addJob }
}

// export const tlsQueue  = createCheckQueue({...}, "tls-checks", "tls");
// export const dnsQueue  = createCheckQueue({...}, "dns-checks", "dns");
// export const tcpQueue  = createCheckQueue({...}, "tcp-checks", "tcp");

export default createCheckQueue;
