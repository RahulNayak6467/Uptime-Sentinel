"use client";

import { useState } from "react";
import { User } from "lucide-react";
import AddRecipientModal from "./add-recipient-modal";

const EmailAlertsHeaders = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
        <div className="flex items-center gap-3">
          <h1 className="text-[16px] font-bold text-sf-text font-sans">Alerts</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sf-label font-semibold font-sans text-sf-btn-text bg-sf-text rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer"
          >
            <div className="flex">
              <User className="h-5 w-5" />
              <span>+</span>
            </div>
            <span>Add recipient</span>
          </button>
        </div>
      </header>

      <AddRecipientModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default EmailAlertsHeaders;
