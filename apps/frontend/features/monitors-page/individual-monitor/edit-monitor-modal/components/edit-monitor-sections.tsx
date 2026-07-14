import {
  AlertTriangle,
  ChevronDown,
  Info,
  LockKeyhole,
  Search,
} from "lucide-react";
import {
  bodyMethods,
  checkFamilies,
  editMonitorIntervals,
  editMonitorMethods,
  formInputClass,
  monitoringRegions,
  notificationChannels,
  requestBodyTypes,
} from "../constants";
import type { IndividualOverviewStatsProps } from "../../types";
import type { EditMonitorDraftState } from "../types";
import { Field, SegmentedControl, ToggleRow } from "./form-controls";

type SectionProps = {
  monitor: IndividualOverviewStatsProps;
  state: EditMonitorDraftState;
  setSelectedMethod: (value: EditMonitorDraftState["selectedMethod"]) => void;
  setRequestBodyType: (value: string) => void;
  setContentType: (value: string) => void;
  setKeywordMode: (value: string) => void;
  setSslEnabled: (value: boolean) => void;
  setDnsEnabled: (value: boolean) => void;
  setDnsRecord: (value: string) => void;
  setSelectedNotification: (value: string) => void;
};

export const GeneralSettingsSection = ({
  monitor,
}: {
  monitor: IndividualOverviewStatsProps;
}) => (
  <section className="space-y-5">
    <div>
      <h3 className="text-sm font-semibold text-sf-text">General settings</h3>
      <p className="mt-1 text-xs text-sf-text-muted">
        Identity, target URL, schedule, and request timeout.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Monitor name">
        <input className={formInputClass} defaultValue={monitor.monitorName} />
      </Field>
      <Field label="Primary type" hint="Locked for this monitor">
        <button
          type="button"
          disabled
          className="flex h-10 w-full items-center justify-between rounded-md border border-sf-border bg-sf-bg/35 px-3 text-[13px] font-semibold text-sf-text-muted"
        >
          {monitor.monitorType.toUpperCase()}
          <LockKeyhole className="size-3.5" />
        </button>
      </Field>
      <Field label="URL">
        <input className={formInputClass} defaultValue={monitor.url} />
      </Field>
      <Field label="Check interval">
        <div className="relative">
          <select
            className={`${formInputClass} appearance-none pr-9`}
            defaultValue={String(monitor.intervalSeconds)}
          >
            {editMonitorIntervals.map((interval) => (
              <option key={interval.value} value={interval.value}>
                {interval.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-sf-text-muted" />
        </div>
      </Field>
      <Field label="Timeout" hint="Maximum request time before the check fails">
        <div className="relative">
          <input
            className={`${formInputClass} pr-12`}
            defaultValue={monitor.requestTimeoutMS}
            type="number"
            min={1000}
            max={60000}
            step={1000}
          />
          <span className="absolute right-3 top-2.5 text-xs text-sf-text-muted">
            ms
          </span>
        </div>
      </Field>
    </div>
    <CheckFamiliesPanel />
    <MonitoringRegionsPanel />
  </section>
);

export const HttpRulesSection = ({
  monitor,
  state,
  setSelectedMethod,
  setRequestBodyType,
  setContentType,
  setKeywordMode,
}: Pick<
  SectionProps,
  | "monitor"
  | "state"
  | "setSelectedMethod"
  | "setRequestBodyType"
  | "setContentType"
  | "setKeywordMode"
>) => (
  <section className="space-y-5">
    <div>
      <h3 className="text-sm font-semibold text-sf-text">HTTP health rules</h3>
      <p className="mt-1 text-xs text-sf-text-muted">
        Decide which responses count as healthy for this endpoint.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Expected status codes" hint="Comma-separated values">
        <input
          className={formInputClass}
          defaultValue={monitor.statusCodes.join(", ")}
        />
      </Field>
      <Field label="HTTP method">
        <SegmentedControl
          options={editMonitorMethods}
          value={state.selectedMethod}
          onChange={(method) =>
            setSelectedMethod(
              method as EditMonitorDraftState["selectedMethod"],
            )
          }
        />
      </Field>
    </div>
    {bodyMethods.includes(state.selectedMethod) && (
      <RequestBodyPanel
        bodyType={state.requestBodyType}
        contentType={state.contentType}
        method={state.selectedMethod}
        setBodyType={setRequestBodyType}
        setContentType={setContentType}
      />
    )}
    <div className="rounded-md border border-sf-border bg-sf-bg/25 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Search className="size-4 text-sf-blue" />
        <h4 className="text-[13px] font-semibold text-sf-text">
          Keyword rule
        </h4>
      </div>
      <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
        <Field label="Mode">
          <SegmentedControl
            options={["Disabled", "Must contain", "Must not contain"]}
            value={state.keywordMode}
            onChange={setKeywordMode}
          />
        </Field>
        <Field label="Keyword">
          <input
            className={formInputClass}
            disabled={state.keywordMode === "Disabled"}
            defaultValue="ok"
          />
        </Field>
      </div>
    </div>
  </section>
);

export const ThresholdsSection = ({
  monitor,
}: {
  monitor: IndividualOverviewStatsProps;
}) => (
  <section className="space-y-5">
    <div>
      <h3 className="text-sm font-semibold text-sf-text">
        State transition thresholds
      </h3>
      <p className="mt-1 text-xs text-sf-text-muted">
        Avoid noisy status changes from one temporary failed check.
      </p>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <ThresholdField
        label="Mark down after"
        hint="Consecutive failed checks required before DOWN"
        defaultValue={monitor.failureThreshold}
        unit="failures"
      />
      <ThresholdField
        label="Mark up after"
        hint="Consecutive successful checks required before UP"
        defaultValue={monitor.recoveryThreshold}
        unit="successes"
      />
    </div>
    <div className="rounded-md border border-sf-amber-border bg-sf-amber-bg px-4 py-3">
      <div className="flex gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-sf-amber" />
        <p className="text-xs leading-5 text-sf-amber">
          Check history still records every failure. The monitor status changes
          only when the configured threshold is reached.
        </p>
      </div>
    </div>
  </section>
);

const CheckFamiliesPanel = () => (
  <div className="rounded-md border border-sf-border bg-sf-bg/25 p-4">
    <div>
      <h4 className="text-[13px] font-semibold text-sf-text">
        Check families
      </h4>
      <p className="mt-1 text-xs text-sf-text-muted">
        The primary type stays locked; V7 rules can be edited in their own tabs.
      </p>
    </div>
    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {checkFamilies.map(({ label, description, icon: Icon, state }) => (
        <div
          key={label}
          className="rounded-md border border-sf-border bg-sf-surface px-3 py-2"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <Icon className="size-3.5 shrink-0 text-sf-text-muted" />
              <span className="truncate text-xs font-semibold text-sf-text">
                {label}
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-sf-border-faint px-1.5 py-0.5 text-[10px] font-semibold text-sf-text-muted">
              {state}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-sf-text-muted">
            {description}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const MonitoringRegionsPanel = () => (
  <div className="rounded-md border border-sf-border bg-sf-bg/25 p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h4 className="text-[13px] font-semibold text-sf-text">
          Monitoring regions
        </h4>
        <p className="mt-1 text-xs text-sf-text-muted">
          Multi-region checks are planned and shown here for create/edit
          consistency.
        </p>
      </div>
      <span className="rounded-full border border-sf-border bg-sf-surface px-2 py-0.5 text-[10px] font-semibold text-sf-text-muted">
        Planned
      </span>
    </div>
    <div className="mt-3 flex flex-wrap gap-2 opacity-45">
      {monitoringRegions.map((region) => (
        <button
          key={region}
          type="button"
          disabled
          className="rounded-sf-sm border border-sf-border bg-sf-surface px-3 py-1 text-[12px] font-medium text-sf-text"
        >
          {region}
        </button>
      ))}
    </div>
  </div>
);

const RequestBodyPanel = ({
  method,
  bodyType,
  contentType,
  setBodyType,
  setContentType,
}: {
  method: string;
  bodyType: string;
  contentType: string;
  setBodyType: (value: string) => void;
  setContentType: (value: string) => void;
}) => {
  const selectedType = requestBodyTypes.find((type) => type.id === bodyType);

  const selectBodyType = (id: string) => {
    const nextType = requestBodyTypes.find((type) => type.id === id);
    setBodyType(id);
    setContentType(nextType?.contentType ?? "");
  };

  return (
    <div className="rounded-md border border-sf-border bg-sf-bg/25 p-4">
      <div className="flex items-baseline gap-2">
        <h4 className="text-[13px] font-semibold text-sf-text">
          Request body
        </h4>
        <span className="text-xs text-sf-text-muted">
          Sent with the {method} request
        </span>
      </div>
      <div className="mt-3">
        <SegmentedControl
          options={requestBodyTypes.map((type) => type.label)}
          value={selectedType?.label ?? "None"}
          onChange={(label) => {
            const nextType = requestBodyTypes.find(
              (type) => type.label === label,
            );
            if (nextType) selectBodyType(nextType.id);
          }}
        />
      </div>
      {bodyType !== "none" && (
        <div className="mt-4 grid gap-4">
          <Field label="Content-Type header">
            <input
              className={formInputClass}
              value={contentType}
              onChange={(event) => setContentType(event.target.value)}
            />
          </Field>
          <Field label="Body content">
            <textarea
              rows={6}
              className="w-full resize-y rounded-md border border-sf-border bg-sf-bg/45 px-3 py-2 font-mono text-[13px] text-sf-text outline-none transition-colors placeholder:text-sf-text-muted focus:border-sf-text-sub focus:bg-sf-surface focus:shadow-sf-focus"
              placeholder='{"status":"ok"}'
            />
          </Field>
        </div>
      )}
    </div>
  );
};

const ThresholdField = ({
  label,
  hint,
  defaultValue,
  unit,
}: {
  label: string;
  hint: string;
  defaultValue: number;
  unit: string;
}) => (
  <Field label={label} hint={hint}>
    <div className="relative">
      <input
        className={`${formInputClass} pr-20`}
        type="number"
        min={1}
        defaultValue={defaultValue}
      />
      <span className="absolute right-3 top-2.5 text-xs text-sf-text-muted">
        {unit}
      </span>
    </div>
  </Field>
);

export const SslSection = ({
  monitor,
  state,
  setSslEnabled,
}: Pick<SectionProps, "monitor" | "state" | "setSslEnabled">) => {
  let host = monitor.url;
  try {
    host = new URL(monitor.url).hostname;
  } catch {
    host = monitor.url;
  }

  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-sf-text">
          SSL certificate checks
        </h3>
        <p className="mt-1 text-xs text-sf-text-muted">
          Track certificate expiry for HTTPS endpoints.
        </p>
      </div>
      <ToggleRow
        checked={state.sslEnabled}
        onChange={() => setSslEnabled(!state.sslEnabled)}
        label="Enable SSL expiry monitoring"
        description="Create warning events before the certificate expires."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Alert before expiry">
          <div className="relative">
            <input
              className={`${formInputClass} pr-14`}
              disabled={!state.sslEnabled}
              defaultValue={14}
              type="number"
            />
            <span className="absolute right-3 top-2.5 text-xs text-sf-text-muted">
              days
            </span>
          </div>
        </Field>
        <Field label="Certificate host">
          <input
            className={formInputClass}
            disabled={!state.sslEnabled}
            defaultValue={host}
          />
        </Field>
      </div>
    </section>
  );
};

export const DnsSection = ({
  state,
  setDnsEnabled,
  setDnsRecord,
}: Pick<SectionProps, "state" | "setDnsEnabled" | "setDnsRecord">) => (
  <section className="space-y-5">
    <div>
      <h3 className="text-sm font-semibold text-sf-text">
        DNS record monitoring
      </h3>
      <p className="mt-1 text-xs text-sf-text-muted">
        Store DNS snapshots and detect record changes.
      </p>
    </div>
    <ToggleRow
      checked={state.dnsEnabled}
      onChange={() => setDnsEnabled(!state.dnsEnabled)}
      label="Enable DNS checks"
      description="Resolve the selected record type during scheduled checks."
    />
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Record type">
        <SegmentedControl
          options={["A", "AAAA", "CNAME", "MX", "TXT", "NS"]}
          value={state.dnsRecord}
          onChange={setDnsRecord}
        />
      </Field>
      <Field label="Expected records">
        <input
          className={formInputClass}
          disabled={!state.dnsEnabled}
          placeholder="76.76.21.21"
        />
      </Field>
    </div>
    <ToggleRow
      checked={state.dnsEnabled}
      onChange={() => setDnsEnabled(!state.dnsEnabled)}
      label="Detect record changes"
      description="Alert when resolved records differ from the previous snapshot."
    />
  </section>
);

export const NotificationsSection = ({
  state,
  setSelectedNotification,
}: Pick<SectionProps, "state" | "setSelectedNotification">) => (
  <section className="space-y-5">
    <div>
      <h3 className="text-sm font-semibold text-sf-text">Notifications</h3>
      <p className="mt-1 text-xs text-sf-text-muted">
        Choose where incident alerts for this monitor should be delivered.
      </p>
    </div>
    <div className="flex flex-wrap gap-2">
      {notificationChannels.map(({ label, icon: Icon, comingSoon }) => {
        const active = state.selectedNotification === label;

        return (
          <button
            key={label}
            type="button"
            disabled={comingSoon}
            onClick={() => setSelectedNotification(label)}
            className={`flex h-9 items-center gap-1.5 rounded-sf-sm border px-3 text-[13px] font-medium transition-colors ${
              comingSoon
                ? "cursor-not-allowed border-sf-border text-sf-text-muted opacity-50"
                : active
                  ? "cursor-pointer border-sf-text bg-sf-text text-sf-btn-text"
                  : "cursor-pointer border-sf-border bg-sf-surface text-sf-text hover:border-sf-text-sub"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
            {comingSoon && (
              <span className="rounded-full bg-sf-bg px-1 py-0.5 text-[10px] font-semibold text-sf-text-muted">
                Soon
              </span>
            )}
          </button>
        );
      })}
    </div>
    <div className="flex items-start gap-2 rounded-md border border-sf-border bg-sf-bg/35 px-3 py-2.5">
      <Info className="mt-0.5 size-4 shrink-0 text-sf-text-muted" />
      <p className="text-xs leading-5 text-sf-text-muted">
        Channel credentials and destination settings stay in alert settings.
        This modal controls which channel this monitor uses.
      </p>
    </div>
  </section>
);
