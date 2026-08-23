"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { notificationChannels } from "../../data";
import SectionHeader from "../section-header";

const Notifications = () => {
  const [selected, setSelected] = useState("Email");

  return (
    <div className="mt-4 w-full">
      <div className="h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader step="06" title="Notifications" description="Choose where incident alerts are delivered" />
        <div className="flex flex-col gap-4 p-5">
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
                      ? "cursor-pointer border-sf-text bg-sf-text text-sf-btn-text"
                      : "bg-sf-surface text-sf-text border-sf-border hover:border-sf-text-sub cursor-pointer"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {comingSoon && (
                  <span className="text-xs font-semibold px-1 py-0.5 rounded-full bg-sf-bg text-sf-text-muted tracking-wide">
                    Soon
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-md border border-sf-border bg-sf-bg px-3 py-2.5">
            <Info className="mt-0.5 size-4 shrink-0 text-sf-text-muted" />
            <p className="font-sans text-[12px] leading-snug text-sf-text-sub">
              Incident alerts are delivered by email to your account address.
              Additional channels (Slack, webhooks, SMS) are coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
