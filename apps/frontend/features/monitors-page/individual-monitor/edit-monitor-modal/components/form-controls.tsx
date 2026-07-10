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

export const SegmentedControl = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-wrap gap-1 rounded-md border border-sf-border bg-sf-border-faint p-1">
    {options.map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onChange(option)}
        className={`h-8 cursor-pointer rounded px-3 text-xs font-semibold transition-colors ${
          value === option
            ? "bg-sf-surface text-sf-text shadow-sm"
            : "text-sf-text-muted hover:text-sf-text"
        }`}
      >
        {option}
      </button>
    ))}
  </div>
);

export const ToggleRow = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
}) => (
  <button
    type="button"
    onClick={onChange}
    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md border border-sf-border bg-sf-bg/35 px-3 py-3 text-left transition-colors hover:border-sf-text-muted/50"
  >
    <span>
      <span className="block text-[13px] font-semibold text-sf-text">
        {label}
      </span>
      <span className="mt-0.5 block text-xs text-sf-text-muted">
        {description}
      </span>
    </span>
    <span
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        checked ? "bg-sf-blue" : "bg-sf-toggle-off"
      }`}
    >
      <span
        className={`absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </span>
  </button>
);

