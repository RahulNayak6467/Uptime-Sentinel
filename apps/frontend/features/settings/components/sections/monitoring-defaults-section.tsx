"use client";

import { useState } from "react";
import { Globe, ShieldAlert, ShieldCheck, SlidersHorizontal, Wifi } from "lucide-react";
import {
  dataRetentionOptions,
  dnsRecordTypeOptions,
  expiryWarningOptions,
  fastIntervalOptions,
  httpMethodOptions,
  minTlsVersionOptions,
  monitorTypeTabs,
  requestTimeoutOptions,
  responseTimeThresholdOptions,
  retryDelayOptions,
  retryOptions,
  slowIntervalOptions,
  type MonitorTypeTab,
} from "../../data";
import {
  Field,
  PrimaryButton,
  SegmentedControl,
  SelectInput,
  SettingCard,
  SettingRow,
  TextInput,
  Toggle,
} from "../form-controls";

// TLS and DNS run on the slow lane (hours), HTTP and TCP on the fast lane.
const isSlowLane = (type: MonitorTypeTab) => type === "TLS" || type === "DNS";

const SelectField = ({
  label,
  hint,
  options,
  defaultValue,
}: {
  label: string;
  hint?: string;
  options: string[];
  defaultValue: string;
}) => (
  <Field label={label} hint={hint}>
    <SelectInput defaultValue={defaultValue}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </SelectInput>
  </Field>
);

// Shared across every type — only the interval range changes with the lane.
const CommonDefaultsCard = ({ intervals }: { intervals: string[] }) => (
  <SettingCard
    icon={SlidersHorizontal}
    title="Check defaults"
    description="Applied to new monitors of this type unless overridden per monitor"
    footer={<PrimaryButton>Save defaults</PrimaryButton>}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <SelectField label="Check interval" options={intervals} defaultValue={intervals[0]} />
      <SelectField label="Request timeout" options={requestTimeoutOptions} defaultValue="10 seconds" />
      <SelectField label="Retries before failing" options={retryOptions} defaultValue="3 attempts" />
      <SelectField label="Retry delay" options={retryDelayOptions} defaultValue="20 seconds" />
      <SelectField label="Data retention" options={dataRetentionOptions} defaultValue="13 months" />
    </div>
  </SettingCard>
);

const HttpDefaultsCard = () => (
  <SettingCard
    icon={Globe}
    title="HTTP defaults"
    description="Response rules for HTTP/HTTPS monitors"
    footer={<PrimaryButton>Save defaults</PrimaryButton>}
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Expected status codes">
        <TextInput defaultValue="200-299, 301, 302" className="font-mono" />
      </Field>
      <SelectField label="Default method" options={httpMethodOptions} defaultValue="GET" />
      <SelectField
        label="Response-time threshold"
        options={responseTimeThresholdOptions}
        defaultValue="1 second"
      />
    </div>
    <div className="mt-2">
      <SettingRow
        label="Follow redirects"
        description="Follow up to 5 redirects before recording the result"
      >
        <Toggle defaultChecked />
      </SettingRow>
    </div>
  </SettingCard>
);

const TlsDefaultsCard = () => (
  <SettingCard
    icon={ShieldCheck}
    title="TLS defaults"
    description="Certificate policy for TLS monitors"
    footer={<PrimaryButton>Save defaults</PrimaryButton>}
  >
    <div className="mb-2">
      <Field label="Expiry alert thresholds" hint="days before expiry — comma-separated">
        <TextInput defaultValue="30, 14, 7, 1" className="font-mono" />
      </Field>
    </div>
    <SettingRow
      label="Verify TLS certificate"
      description="Reject untrusted, expired or mismatched certificates"
    >
      <Toggle defaultChecked />
    </SettingRow>
    <SettingRow label="Minimum TLS version" description="Reject handshakes below this version">
      <SelectInput fullWidth={false} defaultValue="TLSv1.2">
        {minTlsVersionOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </SelectInput>
    </SettingRow>
    <SettingRow
      label="Certificate expiry warning"
      description="Days remaining before the status flips to “Expiring”"
    >
      <SelectInput fullWidth={false} defaultValue="30 days">
        {expiryWarningOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </SelectInput>
    </SettingRow>
  </SettingCard>
);

const DnsDefaultsCard = () => (
  <SettingCard
    icon={Globe}
    title="DNS defaults"
    description="Resolution rules for DNS monitors"
    footer={<PrimaryButton>Save defaults</PrimaryButton>}
  >
    <SettingRow label="Default record type" description="Record resolved when a monitor is created">
      <SelectInput fullWidth={false} defaultValue="A">
        {dnsRecordTypeOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </SelectInput>
    </SettingRow>
    <SettingRow
      label="Alert on DNS record change"
      description="Compare each answer against the stored snapshot"
    >
      <Toggle defaultChecked />
    </SettingRow>
  </SettingCard>
);

const TcpDefaultsCard = () => (
  <SettingCard
    icon={Wifi}
    title="TCP defaults"
    description="Connection rules for TCP monitors"
  >
    <p className="text-[13px] text-sf-text-muted">
      TCP monitors use the check defaults above. The port is configured per monitor.
    </p>
  </SettingCard>
);

const typeSpecificCard: Record<MonitorTypeTab, () => React.ReactElement> = {
  HTTP: HttpDefaultsCard,
  TCP: TcpDefaultsCard,
  TLS: TlsDefaultsCard,
  DNS: DnsDefaultsCard,
};

const MonitoringDefaultsSection = () => {
  const [type, setType] = useState<MonitorTypeTab>("HTTP");
  const intervals = isSlowLane(type) ? slowIntervalOptions : fastIntervalOptions;
  const TypeCard = typeSpecificCard[type];

  return (
    <div className="space-y-4">
      <SegmentedControl options={monitorTypeTabs} value={type} onChange={setType} />

      <CommonDefaultsCard intervals={intervals} />

      <TypeCard />

      <SettingCard
        icon={ShieldAlert}
        title="Incident thresholds"
        description="How many consecutive checks confirm a state change on new monitors"
        footer={<PrimaryButton>Save defaults</PrimaryButton>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mark down after" hint="consecutive failures">
            <TextInput type="number" min={1} max={10} defaultValue={2} />
          </Field>
          <Field label="Mark up after" hint="consecutive successes">
            <TextInput type="number" min={1} max={10} defaultValue={2} />
          </Field>
        </div>
      </SettingCard>
    </div>
  );
};

export default MonitoringDefaultsSection;
