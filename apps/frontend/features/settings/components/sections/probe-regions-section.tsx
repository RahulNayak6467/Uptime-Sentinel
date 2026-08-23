"use client";

import { MapPin, ShieldCheck } from "lucide-react";
import {
  PrimaryButton,
  SelectInput,
  SettingCard,
  SettingRow,
  Toggle,
} from "../form-controls";

const regions = [
  { name: "US-East", location: "Ashburn, VA", on: true },
  { name: "US-West", location: "Portland, OR", on: true },
  { name: "EU-West", location: "Dublin, IE", on: true },
  { name: "EU-Central", location: "Frankfurt, DE", on: true },
  { name: "AP-South", location: "Mumbai, IN", on: true },
  { name: "AP-Northeast", location: "Tokyo, JP", on: false },
  { name: "SA-East", location: "São Paulo, BR", on: false },
];

const quorumOptions = ["1 of 7 regions", "2 of 7 regions", "3 of 7 regions", "All regions"];
const notificationDelayOptions = ["None", "1 minute", "2 minutes", "5 minutes"];

const ProbeRegionsSection = () => (
  <div className="space-y-4">
    <SettingCard
      icon={MapPin}
      title="Probe regions"
      description="Every check runs from each enabled region in parallel"
      footer={<PrimaryButton>Save regions</PrimaryButton>}
    >
      <div className="overflow-hidden rounded-md border border-sf-border bg-sf-bg/10 px-3">
        {regions.map((region) => (
          <SettingRow key={region.name} label={region.name} description={region.location}>
            <Toggle defaultChecked={region.on} />
          </SettingRow>
        ))}
      </div>
    </SettingCard>

    <SettingCard
      icon={ShieldCheck}
      title="Failure confirmation"
      description="How a failing check becomes a confirmed incident across regions"
      footer={<PrimaryButton>Save defaults</PrimaryButton>}
    >
      <SettingRow
        label="Region quorum"
        description="How many regions must agree before an incident opens"
      >
        <SelectInput fullWidth={false} defaultValue="2 of 7 regions">
          {quorumOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </SelectInput>
      </SettingRow>
      <SettingRow
        label="Notification delay"
        description="Wait after confirmation before alerting, to absorb brief blips"
      >
        <SelectInput fullWidth={false} defaultValue="1 minute">
          {notificationDelayOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </SelectInput>
      </SettingRow>
      <SettingRow
        label="Ignore single-region failures"
        description="Log them without opening an incident or alerting"
      >
        <Toggle defaultChecked />
      </SettingRow>
    </SettingCard>
  </div>
);

export default ProbeRegionsSection;
