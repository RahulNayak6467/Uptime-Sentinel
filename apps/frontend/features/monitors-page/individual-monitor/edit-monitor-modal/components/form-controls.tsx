import type { ReactNode } from "react";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted";

export const Field = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    <span className="mt-1.5 block">{children}</span>
    {hint && (
      <span className="mt-1 block text-xs text-sf-text-muted">{hint}</span>
    )}
  </label>
);
