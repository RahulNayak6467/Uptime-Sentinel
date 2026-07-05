"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type SSEStatus = "connecting" | "live" | "reconnecting";

const SSEStatusContext = createContext<SSEStatus>("connecting");

export const useSSEStatus = () => useContext(SSEStatusContext);

/**
 * Owns a single EventSource used purely to observe the SSE connection's health,
 * so the UI can honestly show whether the real-time stream is up. Kept separate
 * from the data hooks: this connection carries no payload handling, it only maps
 * the socket lifecycle (open / error-and-retry) to a status the badge can read.
 */
export default function SSEStatusProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] = useState<SSEStatus>("connecting");
  const sourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_SSE_ENDPOINT ??
      "http://localhost:5000/sse/events";

    const source = new EventSource(url, { withCredentials: true });
    sourceRef.current = source;

    source.onopen = () => setStatus("live");

    // EventSource auto-reconnects on transient errors (readyState stays
    // CONNECTING). We only fall back to "connecting" from the fatal CLOSED
    // state; otherwise it's an active retry the user should see as such.
    source.onerror = () => {
      setStatus(
        source.readyState === EventSource.CLOSED ? "connecting" : "reconnecting",
      );
    };

    return () => {
      source.close();
      sourceRef.current = null;
    };
  }, []);

  return (
    <SSEStatusContext.Provider value={status}>
      {children}
    </SSEStatusContext.Provider>
  );
}
