"use client";

import { useState } from "react";
import { alertTypes } from "../data";
import { AlertTypesProps } from "../types";

const EmailTypes = () => {
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(alertTypes.map((a) => [a.id, a.enabled])),
  );

  const handleToggle = (id: string) => {
    setEnabledMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-sf-surface border border-sf-border rounded-lg">
      <div className="py-3 px-4 border-b border-b-sf-border">
        <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
          When to send email
        </h1>
        <p className="text-[12px] font-sans text-sf-text-sub">
          Events that trigger an alert email to active recipients
        </p>
      </div>
      <div className="flex flex-col mt-2">
        {alertTypes.map((alert) => (
          <AlertTypesDetails
            key={alert.id}
            alertType={alert.eventType}
            alertInfo={alert.description}
            color={alert.color}
            enabled={enabledMap[alert.id]}
            icon={alert.icon}
            onToggle={() => handleToggle(alert.id)}
            isLast={alert.isLast}
          />
        ))}
      </div>
    </div>
  );
};

const AlertTypesDetails = ({
  icon,
  alertType,
  alertInfo,
  color,
  enabled,
  onToggle,
  isLast,
}: AlertTypesProps & { onToggle: () => void }) => {
  const Icon = icon;
  const doesBorderBottomExist = isLast
    ? "flex gap-2 items-center justify-between  pb-2"
    : "flex gap-2 items-center justify-between border-b  border-sf-border pb-2";
  return (
    <div className="px-4 py-2">
      <div>
        <div className={doesBorderBottomExist}>
          <div className="flex gap-2 items-center">
            <Icon
              style={{ color: color }}
              className="w-7 h-7 px-1 py-1 rounded-sf bg-sf-bg border-sf-border"
            />
            <div className="flex flex-col">
              <h3 className="text-sf-label font-medium font-sans text-sf-text">
                {alertType}
              </h3>
              <p className="text-[12px] text-sf-text-muted font-sans">
                {alertInfo}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer shrink-0 ${
              enabled ? "bg-sf-toggle-on" : "bg-sf-toggle-off"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-sf-bg rounded-full shadow-sm transition-transform duration-200 ease-in-out ${
                enabled ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTypes;
