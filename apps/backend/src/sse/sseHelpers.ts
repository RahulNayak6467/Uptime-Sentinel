import { SSEPayload, typeProps } from "../types/sse-types";

export const formatSSEEvents = (type: typeProps, payload: SSEPayload) => {
  const formatted_data = JSON.stringify(payload);

  return `event: ${type}\ndata: ${formatted_data}\n\n`;
};
