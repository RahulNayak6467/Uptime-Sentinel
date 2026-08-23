"use client";

import { Download, Monitor } from "lucide-react";
import {
  GhostButton,
  Pill,
  SettingCard,
  SettingRow,
} from "../form-controls";

const sessions = [
  { device: "Chrome · macOS", location: "Mumbai, IN", lastActive: "Active now", current: true },
  { device: "Safari · iPhone", location: "Mumbai, IN", lastActive: "2 hours ago", current: false },
];

const SecuritySection = () => (
  <div className="space-y-4">
    <SettingCard
      icon={Monitor}
      title="Active sessions"
      description="Devices currently signed in to your account"
      footer={<GhostButton className="border-sf-red-border text-sf-red hover:border-sf-red">Sign out everywhere</GhostButton>}
    >
      {sessions.map((session) => (
        <SettingRow
          key={session.device}
          label={session.device}
          description={`${session.location} · ${session.lastActive}`}
        >
          {session.current ? <Pill tone="green">This device</Pill> : <GhostButton>Sign out</GhostButton>}
        </SettingRow>
      ))}
    </SettingCard>

    <SettingCard icon={Download} title="Your data" description="Export everything stored in your account">
      <SettingRow
        label="Export my data"
        description="Download monitors, incidents and check history as JSON or CSV"
      >
        <GhostButton>Request export</GhostButton>
      </SettingRow>
    </SettingCard>
  </div>
);

export default SecuritySection;
