"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import AddRecipientModal from "./add-recipient-modal";

const EmailAlertsHeaders = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sf-page-header">
        <div className="min-w-0">
          <h1 className="sf-page-title">Alerting</h1>
          <p className="sf-page-subtitle">Choose who gets notified and when</p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[4px] bg-sf-text px-4 font-sans text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30 sm:flex-none"
          >
            <UserPlus className="size-3.5" />
            <span>Add recipient</span>
          </button>
        </div>
      </header>

      <AddRecipientModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default EmailAlertsHeaders;
