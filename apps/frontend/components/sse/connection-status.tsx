"use client";

import { useSSEStatus, type SSEStatus } from "./sse-status-provider";

type Variant = "pill" | "compact";

const config: Record<
  SSEStatus,
  { label: string; dot: string; pill: string; text: string; ping: boolean }
> = {
  live: {
    label: "Live",
    dot: "bg-sf-green",
    pill: "border-sf-green-border/80 bg-sf-green-bg text-sf-green",
    text: "text-sf-green",
    ping: true,
  },
  reconnecting: {
    label: "Reconnecting",
    dot: "bg-sf-amber",
    pill: "border-sf-amber-border/80 bg-sf-amber-bg text-sf-amber",
    text: "text-sf-amber",
    ping: false,
  },
  connecting: {
    label: "Connecting",
    dot: "bg-sf-text-muted",
    pill: "border-sf-border bg-sf-bg text-sf-text-muted",
    text: "text-sf-text-muted",
    ping: false,
  },
};

function StatusDot({ dot, ping }: { dot: string; ping: boolean }) {
  return (
    <span className="relative flex size-1.5">
      {ping ? (
        <span
          className={`absolute inline-flex size-full animate-ping rounded-full opacity-50 ${dot}`}
        />
      ) : (
        <span
          className={`absolute inline-flex size-full animate-pulse rounded-full opacity-60 ${dot}`}
        />
      )}
      <span className={`relative inline-flex size-1.5 rounded-full ${dot}`} />
    </span>
  );
}

/**
 * Shows the real state of the SSE stream. Replaces the previously hardcoded
 * "Live" badge so the UI never claims real-time updates while the stream is
 * actually down.
 */
export default function ConnectionStatus({
  variant = "pill",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const status = useSSEStatus();
  const c = config[status];

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center gap-2 px-2.5 py-1 ${className}`}
        title={`Real-time stream: ${c.label}`}
      >
        <StatusDot dot={c.dot} ping={c.ping} />
        <span className={`text-xs font-medium ${c.text}`}>{c.label}</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] ${c.pill} ${className}`}
      title={`Real-time stream: ${c.label}`}
    >
      <StatusDot dot={c.dot} ping={c.ping} />
      {c.label}
    </span>
  );
}
