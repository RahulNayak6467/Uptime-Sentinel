import { SSEPayload, typeProps } from "../types/sse-types";

export const formatSSEEvents = (
  // event_id: string,
  type: typeProps,
  payload: SSEPayload,
) => {
  const formatted_data = JSON.stringify(payload);
  // return `id: ${event_id}\nevent: ${type}\ndata: ${formatted_data}\n\n`;
  return `event: ${type}\ndata: ${formatted_data}\n\n`;
};
