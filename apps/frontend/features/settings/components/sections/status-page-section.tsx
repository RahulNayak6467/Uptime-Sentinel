"use client";

import { useState } from "react";
import { Globe, Mail, SlidersHorizontal } from "lucide-react";
import {
  Field,
  Pill,
  PrimaryButton,
  SelectInput,
  SettingCard,
  SettingRow,
  TextInput,
  Toggle,
} from "../form-controls";

const visibilityOptions = [
  { value: "public", label: "Public", description: "Anyone can view the page and subscribe to updates" },
  { value: "password", label: "Password protected", description: "Visitors must enter a shared password" },
  { value: "private", label: "Private", description: "Only you can view it" },
];

const uptimeHistoryOptions = ["30 days", "60 days", "90 days"];
const themeOptions = ["Match system", "Light", "Dark"];

const RadioOption = ({
  label,
  description,
  selected,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`flex w-full items-start gap-3 rounded-[3px] border px-4 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-sf-blue/25 ${
      selected
        ? "border-sf-blue bg-sf-blue-bg"
        : "border-sf-border bg-sf-surface hover:border-sf-text-muted/60"
    }`}
  >
    <span
      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
        selected ? "border-sf-blue bg-sf-surface" : "border-sf-border bg-sf-bg"
      }`}
    >
      {selected ? <span className="size-2 rounded-full bg-sf-blue" /> : null}
    </span>
    <span>
      <span className="block text-[13px] font-semibold text-sf-text">{label}</span>
      <span className="mt-0.5 block text-xs text-sf-text-muted">{description}</span>
    </span>
  </button>
);

const StatusPageSection = () => {
  const [visibility, setVisibility] = useState("public");

  return (
    <div className="space-y-4">
      <SettingCard
        icon={Globe}
        title="Public status page"
        description="What your visitors see at your status URL"
        footer={<PrimaryButton>Save</PrimaryButton>}
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <Field label="Page name">
            <TextInput defaultValue="StatusForge" />
          </Field>
          <Field label="Support URL" hint="contact link shown on the page">
            <TextInput type="url" defaultValue="https://statusforge.io/support" />
          </Field>
        </div>
        <div className="space-y-2">
          {visibilityOptions.map((option) => (
            <RadioOption
              key={option.value}
              label={option.label}
              description={option.description}
              selected={visibility === option.value}
              onSelect={() => setVisibility(option.value)}
            />
          ))}
        </div>
        <div className="mt-4">
          <SettingRow label="Custom domain" description="CNAME verified · TLS certificate auto-renewing">
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs text-sf-text-muted">status.example.com</span>
              <Pill tone="green">Verified</Pill>
            </span>
          </SettingRow>
          <SettingRow label="Search engine indexing" description="Allow the page to appear in search results">
            <Toggle defaultChecked />
          </SettingRow>
        </div>
      </SettingCard>

      <SettingCard
        icon={SlidersHorizontal}
        title="Appearance & content"
        description="What the status page shows"
        footer={<PrimaryButton>Save</PrimaryButton>}
      >
        <SettingRow label="Theme" description="Colour scheme visitors see">
          <SelectInput fullWidth={false} defaultValue="Match system">
            {themeOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </SelectInput>
        </SettingRow>
        <SettingRow label="Uptime history shown" description="How much history the timeline covers">
          <SelectInput fullWidth={false} defaultValue="90 days">
            {uptimeHistoryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </SelectInput>
        </SettingRow>
        <SettingRow label="Show uptime percentage" description="Display the rolling uptime figure per monitor">
          <Toggle defaultChecked />
        </SettingRow>
        <SettingRow label="Show response times" description="Publish latency charts alongside availability">
          <Toggle />
        </SettingRow>
        <SettingRow label="Show maintenance windows" description="Display scheduled work on the timeline">
          <Toggle defaultChecked />
        </SettingRow>
      </SettingCard>

      <SettingCard
        icon={Mail}
        title="Subscribers"
        description="How visitors receive incident updates"
        footer={<PrimaryButton>Save</PrimaryButton>}
      >
        <SettingRow label="Allow email subscriptions" description="Visitors get emailed when you publish an incident">
          <Toggle defaultChecked />
        </SettingRow>
        <SettingRow label="Allow RSS feed" description="Publish an RSS feed of incidents">
          <Toggle defaultChecked />
        </SettingRow>
      </SettingCard>
    </div>
  );
};

export default StatusPageSection;
