"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { notificationChannels } from "../../data";

const Notifications = () => {
  const [selected, setSelected] = useState("Email");

  return (
    <div className="mt-4 w-full bg-sf-surface">
      <div className="h-full w-full rounded-lg border border-sf-border">
        <div className="w-full rounded-t-lg border-b border-sf-border px-4 py-2">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Notifications
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Choose where alerts are sent when this monitor triggers
          </p>
        </div>
        <div className="flex flex-col gap-3 px-4 py-3">
          <div className="flex gap-2 flex-wrap">
            {notificationChannels.map(({ id, label, icon: Icon, comingSoon }) => (
              <button
                key={id}
                type="button"
                onClick={() => !comingSoon && setSelected(label)}
                className={`flex items-center gap-1.5 rounded-sf-sm border px-3 py-1 font-sans text-[13px] font-medium transition-colors duration-150 ${
                  comingSoon
                    ? "border-sf-border text-sf-text-muted cursor-not-allowed opacity-50"
                    : selected === label
                      ? "bg-sf-text text-sf-btn-text border-sf-text cursor-pointer"
                      : "bg-sf-surface text-sf-text border-sf-border hover:border-sf-text-sub cursor-pointer"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {comingSoon && (
                  <span className="text-[10px] font-semibold px-1 py-0.5 rounded-full bg-sf-bg text-sf-text-muted tracking-wide">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-sf-blue bg-sf-blue-bg px-3 py-2.5">
            <Info className="w-4 h-4 text-sf-blue shrink-0 mt-0.5" />
            <p className="text-[12.5px] font-sans text-sf-blue leading-snug">
              Configure channel details (webhooks, Slack workspace, etc.) in{" "}
              <a href="/settings/alerts" className="font-bold underline">
                Alert settings
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
