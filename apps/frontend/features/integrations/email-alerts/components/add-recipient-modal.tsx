"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";

type ScopeOption = "all" | "critical" | "custom";

const SCOPE_OPTIONS: { value: ScopeOption; label: string; description: string }[] = [
  { value: "all", label: "All monitors", description: "Notified for every monitor" },
  { value: "critical", label: "Critical only", description: "Monitors tagged as critical" },
  { value: "custom", label: "Custom", description: "Choose specific monitors" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddRecipientModal = ({ open, onClose }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [scope, setScope] = useState<ScopeOption>("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2 text-[13px] font-sans bg-sf-bg border border-sf-border rounded-sf text-sf-text placeholder:text-sf-text-muted focus:outline-none focus:ring-2 focus:ring-sf-text/10 focus:border-sf-text-sub transition-colors";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add recipient"
      description="This person will receive alert emails for the selected monitors."
    >
      <form onSubmit={handleSubmit}>
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              placeholder="e.g. alex@acme.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          {/* Scope */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold font-sans text-sf-text-sub uppercase tracking-wide">
              Alert scope
            </label>
            <div className="flex flex-col gap-1.5">
              {SCOPE_OPTIONS.map((opt) => {
                const selected = scope === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sf border cursor-pointer transition-colors ${
                      selected
                        ? "border-sf-text bg-sf-text/5"
                        : "border-sf-border hover:border-sf-text-sub bg-sf-bg"
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                        selected
                          ? "border-sf-text bg-sf-text"
                          : "border-sf-border bg-sf-bg"
                      }`}
                    >
                      {selected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sf-btn-text" />
                      )}
                    </span>
                    <input
                      type="radio"
                      name="scope"
                      value={opt.value}
                      checked={selected}
                      onChange={() => setScope(opt.value)}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-sans font-semibold text-sf-text leading-snug">
                        {opt.label}
                      </span>
                      <span className="font-sans text-xs text-sf-text-muted">
                        {opt.description}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-sf-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-[13px] font-sans font-medium text-sf-text-sub bg-sf-bg border border-sf-border rounded-[4px] hover:bg-sf-border-faint hover:text-sf-text transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-[13px] font-sans font-semibold text-sf-btn-text bg-sf-text rounded-[4px] hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer"
          >
            Add recipient
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRecipientModal;
