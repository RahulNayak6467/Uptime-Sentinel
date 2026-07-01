"use client";

import { useState } from "react";
import IncidentUpdateModal from "./components/incident-update-modal";

const IncidentHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 border-b border-sf-border bg-sf-surface">
        <div className="flex items-center gap-3">
          <h1 className="text-[16px] font-bold text-sf-text font-sans">
            Incidents
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sf-label font-semibold font-sans text-sf-btn-text bg-sf-text rounded-sf hover:bg-sf-btn-hover active:bg-sf-btn-active transition-colors cursor-pointer"
          >
            <span>+</span>
            <span>Log incident update</span>
          </button>
        </div>
      </header>

      <IncidentUpdateModal
        open={open}
        onClose={() => setOpen(false)}
        service="API Gateway"
        overallStatus="active"
      />
    </>
  );
};

export default IncidentHeader;
