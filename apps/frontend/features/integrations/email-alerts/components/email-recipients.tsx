"use client";

import { useState } from "react";
import { Recipient, RecipientRowProps } from "../types";
import { initialRecipients } from "../data";
import AddRecipientModal from "./add-recipient-modal";

const KebabIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="2.5" r="1.1" fill="currentColor" />
    <circle cx="7" cy="7" r="1.1" fill="currentColor" />
    <circle cx="7" cy="11.5" r="1.1" fill="currentColor" />
  </svg>
);

const RecipientRow = ({ recipient, onToggle }: RecipientRowProps) => {
  const scopeClass =
    recipient.scopeVariant === "blue"
      ? "text-sf-blue border-sf-blue/30 bg-sf-blue-bg"
      : "text-sf-text border-sf-border bg-sf-surface";

  return (
    <div className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-sf-border-faint/70">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-sf-blue/20 bg-sf-blue-bg">
        <span className="text-[11px] font-semibold text-sf-blue">
          {recipient.initials}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-semibold font-sans text-sf-text leading-none">
            {recipient.name}
          </span>
          {recipient.isYou && (
            <span className="text-[11px] font-medium font-sans px-1.5 py-0.5 rounded-full bg-sf-blue-bg text-sf-blue border border-sf-blue/20 leading-none">
              you
            </span>
          )}
        </div>
        <span className="text-[12px] font-mono text-sf-text-muted">
          {recipient.email}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`rounded-sf-sm border px-2.5 py-1 text-[11px] font-medium leading-none ${scopeClass}`}
        >
          {recipient.scope}
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={recipient.enabled}
          onClick={() => onToggle(recipient.id)}
          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
            recipient.enabled ? "bg-sf-toggle-on" : "bg-sf-toggle-off"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-sf-bg rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
              recipient.enabled ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>

        <button
          type="button"
          className="p-1 rounded-md text-sf-text-muted hover:text-sf-text hover:bg-sf-bg transition-colors cursor-pointer"
        >
          <KebabIcon />
        </button>
      </div>
    </div>
  );
};

const EmailRecipients = () => {
  const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);
  const [addOpen, setAddOpen] = useState(false);

  const activeCount = recipients.filter((r) => r.enabled).length;

  const handleToggle = (id: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  };

  return (
    <div className="w-full bg-sf-surface">
      <div className="h-full w-full rounded-lg border border-sf-border shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="w-full border-b border-sf-border py-3 px-4 flex items-start justify-between rounded-t-lg">
          <div>
            <h1 className="text-[14px] font-semibold tracking-normal text-sf-text">
              Recipient list
            </h1>
            <p className="text-[12px] font-sans text-sf-text-sub">
              {activeCount} active · alert emails are sent to everyone enabled
              below
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-sf-sm border border-sf-border px-3 py-1.5 text-[12px] font-medium text-sf-text transition-colors hover:border-sf-text-muted hover:bg-sf-bg"
          >
            <span className="text-[15px] leading-none font-light">+</span>
            Add
          </button>
        </div>

        <div className="divide-y divide-sf-border">
          {recipients.map((recipient) => (
            <RecipientRow
              key={recipient.id}
              recipient={recipient}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </div>

      <AddRecipientModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default EmailRecipients;
