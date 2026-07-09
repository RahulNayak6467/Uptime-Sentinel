import { Response } from "express";
import { SSEPayload, typeProps } from "../types/sse-types";
import { formatSSEEvents } from "./sseHelpers";
const connections = new Map<string, Set<Response>>();

export const addConnection = (user_id: string, res: Response) => {
  const is_connected = hasConnection(user_id);

  if (is_connected) {
    const userConnections = connections.get(user_id);
    if (userConnections) {
      userConnections.add(res);
    }
  } else {
    connections.set(user_id, new Set<Response>([res]));
  }
};

export const removeConnection = (
  user_id: string,
  res: Response,
  onLastConnectionRemoved: () => void,
) => {
  const is_connected = hasConnection(user_id);
  if (!is_connected) return;

  const userConnectionResponse = connections.get(user_id);
  if (!userConnectionResponse) return;

  const has_response = userConnectionResponse.has(res);
  if (has_response) {
    userConnectionResponse.delete(res);
  }
  if (userConnectionResponse.size === 0) {
    connections.delete(user_id);
    onLastConnectionRemoved?.();
  }
};

export const hasConnection = (user_id: string) => {
  const check_connection = connections.has(user_id);
  return check_connection;
};

export const broadcast = (
  user_id: string,
  type: typeProps,
  payload: SSEPayload,
) => {
  const is_connected = hasConnection(user_id);
  if (!is_connected) return;

  const getResponses = connections.get(user_id);
  if (!getResponses) return;

  for (const res of getResponses) {
    res.write(formatSSEEvents(type, payload));
  }
};
