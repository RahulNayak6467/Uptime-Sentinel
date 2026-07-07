import Redis from "ioredis";
import redis from ".";
import { broadcast } from "../sse/sse_connection_management";
import logger from "../config/logger";

const subscriptionsMap = new Map<string, Redis>();

export const subscribeUser = (user_id: string) => {
  const is_subscribed = isSubscribed(user_id);
  if (is_subscribed) return;

  const subscriber = redis.duplicate();

  subscriber.subscribe(`status-updates:${user_id}`, (err) => {
    if (err) {
      logger.error({ err, user_id }, "Error while subscribing to the channel");
    } else {
      logger.info({ user_id }, "Subscribed to the channel");
    }
  });

  subscriber.on("message", (channel, message) => {
    try {
      const parsedBody = JSON.parse(message);
      const user_id = channel.split(":")[1];
      broadcast(user_id, parsedBody.type, parsedBody.payload);
    } catch (err) {
      logger.error({ err }, "Bad SSE message, dropping:");
      return;
    }
  });

  subscriptionsMap.set(user_id, subscriber);

  logger.debug({ userId: user_id }, "user subscribed");
};

export const unsubscribeUser = async (user_id: string) => {
  const is_subscribed = isSubscribed(user_id);
  if (!is_subscribed) return;

  const userSubscription = subscriptionsMap.get(user_id);
  if (!userSubscription) return;

  await userSubscription.unsubscribe(`status-updates:${user_id}`);
  await userSubscription.quit();
  subscriptionsMap.delete(user_id);

  logger.debug({ userId: user_id }, "user subscriptions deleted");
};

export const isSubscribed = (user_id: string) => {
  const check_subscriptions = subscriptionsMap.has(user_id);
  return check_subscriptions;
};
