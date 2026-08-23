"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";

// Shared input/select styling. Kept without a width so callers pick full/auto.
const control =
  "h-10 rounded-sf border border-sf-border bg-sf-bg/20 px-3 text-[12.5px] text-sf-text outline-none transition-[border-color,box-shadow] placeholder:text-sf-text-muted/70 hover:border-sf-text-muted/60 focus:border-sf-blue focus:shadow-sf-focus";

/* ------------------------------------------------------------------ */
/* Card — one settings block (icon + title + description, body, footer) */
/* ------------------------------------------------------------------ */
export const SettingCard = ({
  icon: Icon,
  title,
  description,
  children,
  footer,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <section className="overflow-hidden rounded-md border border-sf-border bg-sf-surface">
    <header className="flex items-start gap-3 border-b border-sf-border px-4 py-3 sm:px-[18px]">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-sf-border bg-sf-bg/20 text-sf-text-muted">
        <Icon className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">{title}</h2>
        <p className="mt-0.5 text-[11.5px] leading-relaxed text-sf-text-muted">{description}</p>
      </div>
    </header>
    <div className="px-4 py-3 sm:px-[18px]">{children}</div>
    {footer ? (
      <div className="flex flex-wrap justify-end gap-2 border-t border-sf-border bg-sf-bg/10 px-4 py-2.5 sm:px-[18px]">
        {footer}
      </div>
    ) : null}
  </section>
);

/* ------------------------------------------------------------------ */
/* Field — stacked label + control, used inside grids                  */
/* ------------------------------------------------------------------ */
export const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <label className="block min-w-0">
    <span className="text-[12.5px] font-medium text-sf-text">
      {label}
      {hint ? <span className="ml-1.5 text-xs font-normal text-sf-text-muted">{hint}</span> : null}
    </span>
    <span className="mt-1.5 block">{children}</span>
  </label>
);

/* ------------------------------------------------------------------ */
/* SettingRow — label + description on the left, a control on the right */
/* ------------------------------------------------------------------ */
export const SettingRow = ({
  label,
  description,
  children,
  tone = "default",
}: {
  label: string;
  description?: string;
  children: ReactNode;
  tone?: "default" | "danger";
}) => (
  <div className="flex flex-col items-start justify-between gap-2.5 border-b border-sf-border-faint py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-5">
    <div className="min-w-0">
      <p className={`text-[13px] font-medium ${tone === "danger" ? "text-sf-red" : "text-sf-text"}`}>{label}</p>
      {description ? <p className="mt-1 text-[12px] leading-relaxed text-sf-text-muted">{description}</p> : null}
    </div>
    <div className="max-w-full shrink-0 self-stretch sm:self-auto">{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */
export const TextInput = (props: ComponentProps<"input">) => (
  <input {...props} className={`${control} w-full ${props.className ?? ""}`} />
);

export const SelectInput = ({
  fullWidth = true,
  children,
  className,
  ...props
}: ComponentProps<"select"> & { fullWidth?: boolean }) => (
  <div className={`relative ${fullWidth ? "w-full" : "w-auto"}`}>
    <select
      {...props}
      className={`${control} ${fullWidth ? "w-full" : "w-auto"} appearance-none pr-9 ${className ?? ""}`}
    >
      {children}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-sf-text-muted"
      aria-hidden="true"
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* SegmentedControl — pick one option from a small set (e.g. type tabs) */
/* ------------------------------------------------------------------ */
export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) => (
  <div className="inline-flex max-w-full overflow-x-auto rounded-[3px] border border-sf-border bg-sf-bg/20 p-0.5">
    {options.map((option) => (
      <button
        key={option}
        type="button"
        onClick={() => onChange(option)}
        className={`h-7 min-w-max rounded-[2px] px-4 text-[12px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sf-blue/25 ${
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

/* ------------------------------------------------------------------ */
/* Toggle — self-managing switch (presentational until wired)          */
/* ------------------------------------------------------------------ */
export const Toggle = ({
  defaultChecked = false,
  disabled = false,
}: {
  defaultChecked?: boolean;
  disabled?: boolean;
}) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={() => setOn((value) => !value)}
      className={`flex h-6 w-11 shrink-0 items-center rounded-full border px-0.5 outline-none transition-[background-color,border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-sf-blue/30 disabled:cursor-not-allowed disabled:opacity-50 ${
        on ? "border-sf-blue bg-sf-blue" : "border-sf-border bg-sf-bg"
      }`}
    >
      <span
        className={`size-[18px] rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform ${
          on ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* Pill — small status badge                                           */
/* ------------------------------------------------------------------ */
const pillTone = {
  green: "border-sf-green-border bg-sf-green-bg text-sf-green",
  blue: "border-sf-blue/20 bg-sf-blue-bg text-sf-blue",
  amber: "border-sf-amber-border bg-sf-amber-bg text-sf-amber",
  neutral: "border-sf-border bg-sf-bg text-sf-text-muted",
};

export const Pill = ({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof pillTone;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex items-center rounded-sf border px-1.5 py-0.5 text-[10.5px] font-medium ${pillTone[tone]}`}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */
export const PrimaryButton = (props: ComponentProps<"button">) => (
  <button
    type="button"
    {...props}
    className={`inline-flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-[3px] bg-sf-blue px-4 text-[12px] font-semibold text-white outline-none transition-colors hover:bg-sf-blue/90 focus-visible:ring-2 focus-visible:ring-sf-blue/35 ${props.className ?? ""}`}
  />
);

export const GhostButton = (props: ComponentProps<"button">) => (
  <button
    type="button"
    {...props}
    className={`inline-flex h-8 min-w-24 items-center justify-center gap-1.5 rounded-[3px] border border-sf-border bg-sf-bg/20 px-4 text-[12px] font-medium text-sf-text outline-none transition-colors hover:border-sf-text-muted hover:bg-sf-bg/40 focus-visible:ring-2 focus-visible:ring-sf-blue/25 ${props.className ?? ""}`}
  />
);
