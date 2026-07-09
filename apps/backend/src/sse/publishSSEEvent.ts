import redis from "../Redis";
import { SSEPayload } from "../types/sse-types";

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
