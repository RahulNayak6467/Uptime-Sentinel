import redis from "../../../redis";

export const alertEmailOptions = () => {
  return {
    connection: redis.duplicate(),
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
