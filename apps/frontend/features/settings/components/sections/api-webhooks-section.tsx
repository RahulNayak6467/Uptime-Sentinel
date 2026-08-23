"use client";

import { ExternalLink, Gauge, Link2, Plus, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";
import {
  GhostButton,
  Pill,
  PrimaryButton,
  SettingCard,
  SettingRow,
  Toggle,
} from "../form-controls";

const apiKeys = [
  { name: "Production CI", token: "sf_live_8Kd2…a91F", scope: "Read / Write", scopeTone: "blue" as const, created: "Mar 4, 2026", lastUsed: "2h ago" },
  { name: "Terraform", token: "sf_live_3Pq7…c04B", scope: "Read / Write", scopeTone: "blue" as const, created: "Jan 22, 2026", lastUsed: "Yesterday" },
  { name: "Grafana (read)", token: "sf_live_9Lm5…f72D", scope: "Read only", scopeTone: "neutral" as const, created: "Dec 8, 2025", lastUsed: "5m ago" },
  { name: "Status embed", token: "sf_live_1Zx0…b66A", scope: "Read only", scopeTone: "neutral" as const, created: "Nov 30, 2025", lastUsed: "14 days ago" },
];

const ApiWebhooksSection = () => (
  <div className="space-y-4">
    <SettingCard
      icon={Link2}
      title="API keys"
      description="Keys authenticate requests to the StatusForge REST API"
      footer={
        <PrimaryButton>
          <span className="inline-flex items-center gap-1.5">
            <Plus className="size-3.5" />
            Create API key
          </span>
        </PrimaryButton>
      }
    >
      <div className="overflow-x-auto rounded-md border border-sf-border bg-sf-bg/10">
        <table className="w-full min-w-[720px] text-left">
          <thead className="border-b border-sf-border bg-sf-bg/20 text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted">
            <tr>
              <th className="px-3 py-1.5">Name</th>
              <th className="px-3 py-1.5">Token</th>
              <th className="px-3 py-1.5">Scope</th>
              <th className="px-3 py-1.5">Created</th>
              <th className="px-3 py-1.5">Last used</th>
              <th className="w-24 px-3 py-1.5"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sf-border-faint">
            {apiKeys.map((key) => (
              <tr key={key.name}>
                <td className="whitespace-nowrap px-3 py-2 text-[13px] font-semibold text-sf-text">
                  {key.name}
                </td>
                <td className="px-3 py-2">
                  <code className="whitespace-nowrap rounded border border-sf-border-faint bg-sf-bg px-2 py-1 font-mono text-[11.5px] text-sf-text-muted">
                    {key.token}
                  </code>
                </td>
                <td className="whitespace-nowrap px-3 py-2">
                  <Pill tone={key.scopeTone}>{key.scope}</Pill>
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-sf-text-muted">
                  {key.created}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-sf-text-muted">
                  {key.lastUsed}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`Rotate ${key.name} key`}
                      className="flex h-7 w-9 items-center justify-center rounded-[3px] text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text"
                    >
                      <RefreshCw className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${key.name} key`}
                      className="flex h-7 w-9 items-center justify-center rounded-[3px] text-sf-text-muted transition-colors hover:bg-sf-red-bg hover:text-sf-red"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-start gap-2.5 rounded-md border border-sf-border bg-sf-bg/10 px-3 py-2.5">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-sf-text-muted" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-sf-text-muted">
          A token is shown in full only once, at creation. Store it somewhere safe — you can rotate or
          revoke keys at any time.
        </p>
      </div>
    </SettingCard>

    <SettingCard
      icon={Gauge}
      title="API behaviour"
      description="How the REST API and webhooks behave"
    >
      <SettingRow label="Rate limit" description="Requests per minute allowed per API key">
        <span className="rounded border border-sf-border-faint bg-sf-bg px-2 py-1 font-mono text-[11.5px] text-sf-text-muted">
          1,000 / min
        </span>
      </SettingRow>
      <SettingRow
        label="API version"
        description="Current REST API version · deprecated versions are announced in advance"
      >
        <span className="rounded border border-sf-border-faint bg-sf-bg px-2 py-1 font-mono text-[11.5px] text-sf-text-muted">
          v1
        </span>
      </SettingRow>
      <SettingRow
        label="Webhook signing secret"
        description="Verify payload authenticity with the HMAC-SHA256 signature header"
      >
        <span className="flex items-center gap-2">
          <span className="rounded border border-sf-border-faint bg-sf-bg px-2 py-1 font-mono text-[11.5px] text-sf-text-muted">
            whsec_4f…8c2
          </span>
          <GhostButton>
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="size-3.5" />
              Rotate
            </span>
          </GhostButton>
        </span>
      </SettingRow>
      <SettingRow
        label="Webhook retries"
        description="Failed deliveries retry 5 times with exponential backoff"
      >
        <Toggle defaultChecked />
      </SettingRow>
      <SettingRow label="API documentation" description="Reference for the REST API and webhook payloads">
        <GhostButton>
          <span className="inline-flex items-center gap-1.5">
            <ExternalLink className="size-3.5" />
            Open docs
          </span>
        </GhostButton>
      </SettingRow>
    </SettingCard>
  </div>
);

export default ApiWebhooksSection;
