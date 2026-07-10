"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { IndividualOverviewStatsProps } from "../types";
import type { EditMonitorDraftState, EditMonitorTabKey } from "./types";
import {
  DnsSection,
  GeneralSettingsSection,
  HttpRulesSection,
  NotificationsSection,
  SslSection,
  ThresholdsSection,
} from "./components/edit-monitor-sections";
import { EditMonitorFooter } from "./components/edit-monitor-footer";
import { EditMonitorSidebar } from "./components/edit-monitor-sidebar";
import { EditMonitorSummary } from "./components/edit-monitor-summary";

const getMonitorStatusMeta = (monitor: IndividualOverviewStatsProps) => {
  if (!monitor.isActive) {
    return {
      label: "Paused",
      badge: "border-sf-border bg-sf-bg text-sf-text-muted",
    };
  }

  if (monitor.status === "UP") {
    return {
      label: "Operational",
      badge: "border-sf-green-border bg-sf-green-bg text-sf-green",
    };
  }

  if (monitor.status === "DOWN") {
    return {
      label: "Down",
      badge: "border-sf-red-border bg-sf-red-bg text-sf-red",
    };
  }

  return {
    label: "Pending first check",
    badge: "border-sf-amber-border bg-sf-amber-bg text-sf-amber",
  };
};

const initialDraftState: EditMonitorDraftState = {
  activeTab: "general",
  selectedMethod: "GET",
  requestBodyType: "none",
  contentType: "",
  followRedirects: true,
  keywordMode: "Must contain",
  sslEnabled: true,
  dnsEnabled: false,
  dnsRecord: "A",
  selectedNotification: "Email",
};

export const EditMonitorModal = ({
  monitor,
  onClose,
}: {
  monitor: IndividualOverviewStatsProps;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState<EditMonitorDraftState>(initialDraftState);
  const statusMeta = getMonitorStatusMeta(monitor);

  const updateDraft = (patch: Partial<EditMonitorDraftState>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-3 py-4 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-monitor-title"
        className="flex max-h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-sf-card"
      >
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-sf-border px-4 py-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id="edit-monitor-title"
                className="text-base font-semibold tracking-sf-tight text-sf-text"
              >
                Edit monitor
              </h2>
              <span
                className={`rounded-sf border px-2 py-0.5 text-xs font-semibold ${statusMeta.badge}`}
              >
                {statusMeta.label}
              </span>
              <span className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 text-xs font-semibold text-sf-text-muted">
                HTTP/HTTPS
              </span>
            </div>
            <p className="mt-1 truncate font-mono text-xs text-sf-text-muted">
              {monitor.url}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit monitor modal"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-sf-text-muted transition-colors hover:bg-sf-bg hover:text-sf-text"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[200px_minmax(0,1fr)_240px]">
          <EditMonitorSidebar
            activeTab={draft.activeTab}
            onTabChange={(activeTab: EditMonitorTabKey) =>
              updateDraft({ activeTab })
            }
          />
          <div className="min-h-0 overflow-y-auto bg-sf-surface">
            <div className="mx-auto max-w-3xl space-y-5 px-5 py-4">
              {draft.activeTab === "general" && (
                <GeneralSettingsSection monitor={monitor} />
              )}
              {draft.activeTab === "http" && (
                <HttpRulesSection
                  state={draft}
                  setSelectedMethod={(selectedMethod) =>
                    updateDraft({
                      selectedMethod,
                      requestBodyType: "none",
                      contentType: "",
                    })
                  }
                  setRequestBodyType={(requestBodyType) =>
                    updateDraft({ requestBodyType })
                  }
                  setContentType={(contentType) => updateDraft({ contentType })}
                  setFollowRedirects={(followRedirects) =>
                    updateDraft({ followRedirects })
                  }
                  setKeywordMode={(keywordMode) => updateDraft({ keywordMode })}
                />
              )}
              {draft.activeTab === "thresholds" && <ThresholdsSection />}
              {draft.activeTab === "ssl" && (
                <SslSection
                  monitor={monitor}
                  state={draft}
                  setSslEnabled={(sslEnabled) => updateDraft({ sslEnabled })}
                />
              )}
              {draft.activeTab === "dns" && (
                <DnsSection
                  state={draft}
                  setDnsEnabled={(dnsEnabled) => updateDraft({ dnsEnabled })}
                  setDnsRecord={(dnsRecord) => updateDraft({ dnsRecord })}
                />
              )}
              {draft.activeTab === "notifications" && (
                <NotificationsSection
                  state={draft}
                  setSelectedNotification={(selectedNotification) =>
                    updateDraft({ selectedNotification })
                  }
                />
              )}
            </div>
          </div>
          <EditMonitorSummary monitor={monitor} draft={draft} />
        </div>

        <EditMonitorFooter onCancel={onClose} />
      </section>
    </div>
  );
};
