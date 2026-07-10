import redis from "../../redis";
import { SSEPayload } from "../types";

export const publishSSEEvent = async (
  userId: string,
  type: string,
  payload: SSEPayload,
) => {
  await redis.publish(
    `status-updates:${userId}`,
    JSON.stringify({ type, payload }),
  );
};
