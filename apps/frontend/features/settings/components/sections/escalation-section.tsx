"use client";

import { Info, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { GhostButton, Pill, PrimaryButton, SettingCard } from "../form-controls";

// Single-user escalation: re-alert on a different channel if an incident stays
// unacknowledged (no team rotation).
const tiers = [
  { step: 1, delay: "Immediately", delayTone: "amber" as const, channel: "Email" },
  { step: 2, delay: "After 5m", delayTone: "neutral" as const, channel: "SMS" },
  { step: 3, delay: "After 15m", delayTone: "neutral" as const, channel: "Slack" },
];

const EscalationSection = () => (
  <div className="space-y-4">
    <SettingCard
      icon={Zap}
      title="Escalation policy"
      description="How an incident is re-alerted if it stays unacknowledged"
      footer={
        <>
          <GhostButton>
            <span className="inline-flex items-center gap-1.5">
              <Plus className="size-3.5" />
              Add tier
            </span>
          </GhostButton>
          <PrimaryButton>Save policy</PrimaryButton>
        </>
      }
    >
      <div className="space-y-1">
        {tiers.map((tier, index) => (
          <div key={tier.step} className="relative flex items-center gap-4 py-3 pl-9">
            {index < tiers.length - 1 ? (
              <span className="absolute bottom-0 left-[15px] top-9 w-px bg-sf-border-faint" />
            ) : null}
            <span className="absolute left-0 top-3 flex size-8 items-center justify-center rounded-full border border-sf-border text-xs font-semibold text-sf-text-muted">
              {tier.step}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Pill tone={tier.delayTone}>{tier.delay}</Pill>
                <span className="text-[13px] font-semibold text-sf-text">{tier.channel}</span>
              </div>
              <p className="mt-0.5 text-xs text-sf-text-muted">
                Re-notify on {tier.channel} if the incident is still open
              </p>
            </div>
            <div className="flex items-center gap-2 text-sf-text-muted">
              <Pencil className="size-3.5 cursor-pointer hover:text-sf-text" />
              <Trash2 className="size-3.5 cursor-pointer hover:text-sf-red" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-md border border-sf-border bg-sf-bg/25 px-3 py-2.5">
        <Info className="mt-0.5 size-3.5 shrink-0 text-sf-text-muted" />
        <p className="text-xs text-sf-text-muted">
          Acknowledging an incident stops the escalation chain immediately.
        </p>
      </div>
    </SettingCard>
  </div>
);

export default EscalationSection;
