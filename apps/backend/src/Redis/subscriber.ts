import Redis from "ioredis";
import redis from ".";
import { broadcast } from "../sse/sse_connection_management";

const subscriptionsMap = new Map<string, Redis>();

export const subscribeUser = (user_id: string) => {
  const is_subscribed = isSubscribed(user_id);
  if (is_subscribed) return;

  const subscriber = redis.duplicate();

  subscriber.subscribe(`status-updates:${user_id}`, (err) => {
    if (err) {
      console.log("Error while subscribing to the channel", err);
    } else {
      console.log("Subscribed to the channel");
    }
  });

  subscriber.on("message", (channel, message) => {
    try {
      const parsedBody = JSON.parse(message);
      const user_id = channel.split(":")[1];
      broadcast(user_id, parsedBody.type, parsedBody.payload);
    } catch (err) {
      console.log("Bad SSE message, dropping:", err);
      return;
    }
  });

  subscriptionsMap.set(user_id, subscriber);
};

export const unsubscribeUser = async (user_id: string) => {
  const is_subscribed = isSubscribed(user_id);
  if (!is_subscribed) return;

  const userSubscription = subscriptionsMap.get(user_id);
  if (!userSubscription) return;

  await userSubscription.unsubscribe(`status-updates:${user_id}`);
  await userSubscription.quit();
  subscriptionsMap.delete(user_id);
};

export const isSubscribed = (user_id: string) => {
  const check_subscriptions = subscriptionsMap.has(user_id);
  return check_subscriptions;
};
