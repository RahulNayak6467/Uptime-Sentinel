"use client";

import { useState } from "react";
import { alertConditionsProps } from "../../types";

const AlertTypes = ({
  alertType,
  alertText,
  alertMessage,
}: alertConditionsProps) => {
  const [values, setValues] = useState(2);
  return (
    <div className="flex justify-between items-center border-b border-b-sf-border pb-4 pt-4">
      <div>
        <p className="text-sf-text font-semibold text-[14px] font-sans">
          {alertType}
        </p>
        <p className="text-[12px] text-sf-text-muted font-sans">{alertText}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center border border-sf-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setValues((n) => Math.max(1, n - 1))}
            className="px-3 py-1 text-sf-text-sub hover:bg-sf-bg transition-colors cursor-pointer text-[14px]"
          >
            −
          </button>
          <span className="px-3 py-1 text-[14px] font-sans text-sf-text border-x border-sf-border min-w-[2.5rem] text-center">
            {values}
          </span>
          <button
            type="button"
            onClick={() => setValues((n) => n + 1)}
            className="px-3 py-1 text-sf-text-sub hover:bg-sf-bg transition-colors cursor-pointer text-[14px]"
          >
            +
          </button>
        </div>
        <span className="text-[13px] text-sf-text-muted font-sans w-14">
          {alertMessage}
        </span>
      </div>
    </div>
  );
};

export default AlertTypes;
