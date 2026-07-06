"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import AddRecipientModal from "./add-recipient-modal";

const EmailAlertsHeaders = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sf-page-header">
        <div>
          <h1 className="sf-page-title">Alerting</h1>
          <p className="sf-page-subtitle">Choose who gets notified and when</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-[4px] bg-sf-text px-4 font-sans text-xs font-semibold text-sf-btn-text shadow-sm transition-colors hover:bg-sf-blue hover:text-white active:bg-sf-btn-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sf-blue/30"
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
