"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { notificationChannels } from "../../data";

const Notifications = () => {
  const [selected, setSelected] = useState("Email");

  return (
    <div className="w-full bg-sf-surface mt-6">
      <div className="w-full h-full border border-sf-border rounded-lg">
        <div className="w-full border-b border-sf-border py-3 px-4 rounded-t-lg">
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Notifications
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">
            Choose where alerts are sent when this monitor triggers
          </p>
        </div>
        <div className="px-4 py-4 flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            {notificationChannels.map(({ id, label, icon: Icon, comingSoon }) => (
              <button
                key={id}
                type="button"
                onClick={() => !comingSoon && setSelected(label)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-sans text-[13px] font-medium transition-colors duration-150 ${
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

          <div className="flex items-start gap-2 bg-sf-blue-bg border border-sf-blue rounded-lg px-3 py-2.5">
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
