"use client";

import { useEffect, useRef, useState } from "react";

const SHOW_DELAY_MS = 250;
const MIN_VISIBLE_MS = 450;

interface FetchingIndicatorProps {
  active: boolean;
  label?: string;
}

export function FetchingIndicator({
  active,
  label = "Updating data",
}: FetchingIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const visibleSince = useRef<number | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (active) {
      timeoutId = setTimeout(() => {
        visibleSince.current = Date.now();
        setVisible(true);
      }, SHOW_DELAY_MS);
    } else if (visibleSince.current !== null) {
      const elapsed = Date.now() - visibleSince.current;
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

      timeoutId = setTimeout(() => {
        visibleSince.current = null;
        setVisible(false);
      }, remaining);
    }

    return () => clearTimeout(timeoutId);
  }, [active]);

  return (
    <div
      role="status"
      aria-label={label}
      aria-hidden={!visible}
      className={`pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 overflow-hidden transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-full w-full bg-sf-blue/15">
        <div className="h-full w-1/3 rounded-full bg-sf-blue animate-sf-progress-slide motion-reduce:animate-none" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
