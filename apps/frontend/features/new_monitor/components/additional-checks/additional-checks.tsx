"use client";

import { useState } from "react";
import { ShieldCheck, Globe, Plug, Pencil, X, type LucideIcon } from "lucide-react";
import SectionHeader from "../section-header";

export type CheckKey = "tls" | "dns" | "tcp";

type CheckDef = {
  key: CheckKey;
  icon: LucideIcon;
  label: string;
  description: string;
};

export type CheckConfig = Record<string, string>;

export type AdditionalChecksState = {
  enabled: Record<CheckKey, boolean>;
  config: Record<CheckKey, CheckConfig>;
};

const checks: CheckDef[] = [
  {
    key: "tls",
    icon: ShieldCheck,
    label: "TLS certificate",
    description: "Expiry, chain of trust, and validation for this host.",
  },
  {
    key: "dns",
    icon: Globe,
    label: "DNS records",
    description: "Resolution health and record changes.",
  },
  {
    key: "tcp",
    icon: Plug,
    label: "TCP port",
    description: "Raw port reachability and connect latency.",
  },
];

const defaultConfig: Record<CheckKey, CheckConfig> = {
  tls: { host: "", interval: "12h", port: "443", minVersion: "TLSv1.2", timeout: "10000", warningDays: "30", expiryAlerts: "1,7,14,30" },
  dns: { host: "", interval: "12h", recordType: "A", resolver: "", expectedValue: "" },
  tcp: { host: "", interval: "5m", port: "", timeout: "5000" },
};

const slowIntervals = ["1h", "3h", "6h", "12h", "24h"];
const fastIntervals = ["1m", "5m", "15m", "30m", "1h"];
const tlsVersions = ["TLSv1.2", "TLSv1.3"];
const dnsRecordTypes = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"];

const fieldInput =
  "h-9 w-full rounded-sf-sm border border-sf-border bg-sf-bg px-2.5 text-[13px] text-sf-text outline-none focus:border-sf-blue";
const fieldLabel =
  "text-[11px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted";

// One-line summary of the saved config, shown under the label.
const summarize = (key: CheckKey, cfg: CheckConfig): string => {
  const host = cfg.host?.trim() ? `${cfg.host} · ` : "";
  if (key === "tls")
    return `${host}Port ${cfg.port} · ${cfg.minVersion} · every ${cfg.interval}`;
  if (key === "dns")
    return `${host}${cfg.recordType} record${cfg.resolver ? ` · ${cfg.resolver}` : ""} · every ${cfg.interval}`;
  return `${host}Port ${cfg.port || "—"} · timeout ${cfg.timeout}ms · every ${cfg.interval}`;
};

const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={onClick}
    className={`flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition-colors ${
      on ? "justify-end bg-sf-blue" : "justify-start bg-sf-toggle-off"
    }`}
  >
    <span className="size-4 rounded-full bg-white shadow-sm" />
  </button>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className={fieldLabel}>{label}</span>
    <span className="mt-1.5 block">{children}</span>
  </label>
);

const ConfigModal = ({
  check,
  draft,
  setDraft,
  onSave,
  onCancel,
}: {
  check: CheckDef;
  draft: CheckConfig;
  setDraft: (c: CheckConfig) => void;
  onSave: () => void;
  onCancel: () => void;
}) => {
  const set = (k: string, v: string) => setDraft({ ...draft, [k]: v });
  const Icon = check.icon;
  const saveDisabled = check.key === "tcp" && !draft.port.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-3 py-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-sf-border bg-sf-surface shadow-sf-card">
        <header className="flex items-center justify-between border-b border-sf-border px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md border border-sf-blue/30 bg-sf-blue-bg text-sf-blue">
              <Icon className="size-4" />
            </span>
            <h2 className="text-sm font-semibold text-sf-text">
              Configure {check.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex size-7 items-center justify-center rounded-md text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="grid gap-3.5 px-5 py-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Host / target">
              <input
                value={draft.host}
                onChange={(e) => set("host", e.target.value)}
                placeholder="Leave blank to use the monitor's host"
                className={`${fieldInput} font-mono`}
              />
            </Field>
          </div>

          <Field label="Check interval">
            <select
              value={draft.interval}
              onChange={(e) => set("interval", e.target.value)}
              className={fieldInput}
            >
              {(check.key === "tcp" ? fastIntervals : slowIntervals).map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </Field>

          {check.key === "tls" && (
            <>
              <Field label="Port">
                <input
                  type="number"
                  min={1}
                  max={65535}
                  value={draft.port}
                  onChange={(e) => set("port", e.target.value)}
                  className={`${fieldInput} font-mono`}
                />
              </Field>
              <Field label="Minimum TLS version">
                <select
                  value={draft.minVersion}
                  onChange={(e) => set("minVersion", e.target.value)}
                  className={fieldInput}
                >
                  {tlsVersions.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Connection timeout (ms)">
                <input
                  type="number"
                  min={1000}
                  max={60000}
                  step={1000}
                  value={draft.timeout}
                  onChange={(e) => set("timeout", e.target.value)}
                  className={`${fieldInput} font-mono`}
                />
              </Field>
              <Field label="Expiry warning (days)">
                <input
                  type="number"
                  min={1}
                  value={draft.warningDays}
                  onChange={(e) => set("warningDays", e.target.value)}
                  className={`${fieldInput} font-mono`}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Expiry alert thresholds (days, comma-separated)">
                  <input
                    value={draft.expiryAlerts}
                    onChange={(e) => set("expiryAlerts", e.target.value)}
                    placeholder="1,7,14,30"
                    className={`${fieldInput} font-mono`}
                  />
                </Field>
              </div>
            </>
          )}

          {check.key === "dns" && (
            <>
              <Field label="Record type">
                <select
                  value={draft.recordType}
                  onChange={(e) => set("recordType", e.target.value)}
                  className={fieldInput}
                >
                  {dnsRecordTypes.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="Resolver (blank = system)">
                <input
                  value={draft.resolver}
                  onChange={(e) => set("resolver", e.target.value)}
                  placeholder="1.1.1.1"
                  className={`${fieldInput} font-mono`}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Expected value (optional, for change alerts)">
                  <input
                    value={draft.expectedValue}
                    onChange={(e) => set("expectedValue", e.target.value)}
                    placeholder="e.g. 76.76.21.21"
                    className={`${fieldInput} font-mono`}
                  />
                </Field>
              </div>
            </>
          )}

          {check.key === "tcp" && (
            <>
              <Field label="Target port (required)">
                <input
                  type="number"
                  min={1}
                  max={65535}
                  value={draft.port}
                  onChange={(e) => set("port", e.target.value)}
                  placeholder="e.g. 5432"
                  className={`${fieldInput} font-mono`}
                />
              </Field>
              <Field label="Connect timeout (ms)">
                <input
                  type="number"
                  min={1000}
                  max={60000}
                  step={1000}
                  value={draft.timeout}
                  onChange={(e) => set("timeout", e.target.value)}
                  className={`${fieldInput} font-mono`}
                />
              </Field>
            </>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-sf-border px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 rounded-sf-sm border border-sf-border bg-sf-surface px-3 text-xs font-semibold text-sf-text-sub transition-colors hover:border-sf-text-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            className="h-8 rounded-sf-sm bg-sf-text px-4 text-xs font-semibold text-sf-btn-text transition-colors hover:bg-sf-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </footer>
      </div>
    </div>
  );
};

const AdditionalChecks = ({
  onChange,
}: {
  onChange?: (state: AdditionalChecksState) => void;
}) => {
  const [enabled, setEnabled] = useState<Record<CheckKey, boolean>>({
    tls: false,
    dns: false,
    tcp: false,
  });
  const [config, setConfig] = useState<Record<CheckKey, CheckConfig>>(defaultConfig);
  const [modalKey, setModalKey] = useState<CheckKey | null>(null);
  const [draft, setDraft] = useState<CheckConfig>({});

  const openConfig = (key: CheckKey) => {
    setDraft({ ...config[key] });
    setModalKey(key);
  };

  const onToggle = (key: CheckKey) => {
    if (enabled[key]) {
      const nextEnabled = { ...enabled, [key]: false }; // turn off
      setEnabled(nextEnabled);
      onChange?.({ enabled: nextEnabled, config });
    } else {
      openConfig(key); // must configure before enabling
    }
  };

  const onSave = () => {
    if (!modalKey) return;
    const nextConfig = { ...config, [modalKey]: draft };
    const nextEnabled = { ...enabled, [modalKey]: true };
    setConfig(nextConfig);
    setEnabled(nextEnabled);
    onChange?.({ enabled: nextEnabled, config: nextConfig });
    setModalKey(null);
  };

  const selectedCount = Object.values(enabled).filter(Boolean).length;
  const activeCheck = checks.find((c) => c.key === modalKey);

  return (
    <div className="mt-4 w-full">
      <div className="relative h-full w-full overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sm">
        <SectionHeader
          title="Additional checks"
          description="Also monitor this host's certificate, DNS, and TCP reachability. Each runs as its own monitor on its own schedule."
          badge={selectedCount > 0 ? `${selectedCount} selected` : "Optional"}
        />
        <div className="divide-y divide-sf-border">
          {checks.map((check) => {
            const Icon = check.icon;
            const on = enabled[check.key];
            return (
              <div key={check.key} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      on
                        ? "border-sf-blue/30 bg-sf-blue-bg text-sf-blue"
                        : "border-sf-border bg-sf-bg text-sf-text-muted"
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-sf-text">
                      {check.label}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-sf-text-muted">
                      {check.description}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-sf-text-muted">
                      {on ? summarize(check.key, config[check.key]) : "Not enabled"}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {on && (
                    <button
                      type="button"
                      onClick={() => openConfig(check.key)}
                      className="flex items-center gap-1.5 rounded-sf-sm border border-sf-border bg-sf-surface px-2.5 py-1 text-xs font-medium text-sf-text-sub transition-colors hover:border-sf-text-muted hover:text-sf-text"
                    >
                      <Pencil className="size-3" />
                      Edit
                    </button>
                  )}
                  <Toggle on={on} onClick={() => onToggle(check.key)} />
                </div>
              </div>
            );
          })}
        </div>

        {selectedCount > 0 && (
          <div className="border-t border-sf-border bg-sf-bg/50 px-5 py-3">
            <p className="text-[11px] leading-5 text-sf-text-muted">
              These are created as separate monitors linked to this host. You can
              refine alert rules and advanced options later on each monitor's page.
            </p>
          </div>
        )}
      </div>

      {activeCheck && (
        <ConfigModal
          check={activeCheck}
          draft={draft}
          setDraft={setDraft}
          onSave={onSave}
          onCancel={() => setModalKey(null)}
        />
      )}
    </div>
  );
};

export default AdditionalChecks;
