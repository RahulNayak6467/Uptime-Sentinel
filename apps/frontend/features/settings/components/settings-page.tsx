"use client";

import { useMemo, useState } from "react";
import { settingsNav } from "../data";
import type { SettingsSectionId } from "../types";
import SettingsNav from "./settings-nav";
import AccountSection from "./sections/account-section";
import MonitoringDefaultsSection from "./sections/monitoring-defaults-section";
import NotificationsSection from "./sections/notifications-section";
import EscalationSection from "./sections/escalation-section";
import MaintenanceSection from "./sections/maintenance-section";
import SecuritySection from "./sections/security-section";
import ApiWebhooksSection from "./sections/api-webhooks-section";
import ProbeRegionsSection from "./sections/probe-regions-section";
import StatusPageSection from "./sections/status-page-section";

const renderSection = (id: SettingsSectionId) => {
  switch (id) {
    case "account":
      return <AccountSection />;
    case "monitoring-defaults":
      return <MonitoringDefaultsSection />;
    case "notifications":
      return <NotificationsSection />;
    case "escalation":
      return <EscalationSection />;
    case "maintenance":
      return <MaintenanceSection />;
    case "security":
      return <SecuritySection />;
    case "api-webhooks":
      return <ApiWebhooksSection />;
    case "probe-regions":
      return <ProbeRegionsSection />;
    case "status-page":
      return <StatusPageSection />;
  }
};

const SettingsPage = () => {
  const [active, setActive] = useState<SettingsSectionId>("account");

  const activeItem = useMemo(
    () => settingsNav.flatMap((group) => group.items).find((item) => item.id === active),
    [active],
  );
  const ActiveIcon = activeItem?.icon;

  return (
    <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-8">
        <SettingsNav active={active} onSelect={setActive} />

        <main className="min-w-0 flex-1">
          <header className="mb-6 flex items-center gap-3 px-0.5">
            {ActiveIcon ? (
              <ActiveIcon
                className="size-5 shrink-0 text-sf-text-muted"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            ) : null}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[21px] font-semibold tracking-sf-tight text-sf-text">
                  {activeItem?.label}
                </h1>
                {activeItem?.comingSoon ? (
                  <span className="rounded-sf border border-sf-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-text-muted">
                    Soon
                  </span>
                ) : null}
              </div>
              {activeItem?.description ? <span className="sr-only">{activeItem.description}</span> : null}
            </div>
          </header>

          {renderSection(active)}
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
