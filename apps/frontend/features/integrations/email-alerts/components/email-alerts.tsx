import { CheckCircle2, Info, Mail } from "lucide-react";
import EmailRecipients from "./email-recipients";
import EmailTypes from "./email-types";
import DeliveryPreferences from "./delivery-preferences/delivery-preferences";
import QuietHours from "./quiet-hours/quiet-hours";
import RecentAlerts from "./recent-alerts/recent-alerts";

const InfoBanner = () => (
  <div className="mt-4 flex gap-2.5 rounded-lg border border-sf-border bg-sf-border-faint px-4 py-3">
    <Info className="w-4 h-4 text-sf-blue shrink-0 mt-0.5" />
    <p className="text-[12px] leading-5 text-sf-text-sub">
      Add <span className="font-semibold text-sf-text">alerts@uptimesentinel.io</span> to your contacts to improve delivery. SMS, Slack, webhook, and Discord remain unavailable until their channels are configured.
    </p>
  </div>
);

const EmailChannelSummary = () => (
  <section className="sf-panel flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
    <div className="flex min-w-0 items-center gap-3.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-sf-blue/25 bg-sf-blue-bg text-sf-blue">
        <Mail className="size-4.5" />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-sf-text">Email delivery</h2>
          <span className="flex items-center gap-1 rounded-full border border-sf-green-border bg-sf-green-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sf-green">
            <CheckCircle2 className="size-2.5" /> Active
          </span>
        </div>
        <p className="mt-1 truncate text-xs text-sf-text-muted">Primary channel for outage, reminder, and recovery notifications</p>
      </div>
    </div>
    <div className="w-full border-t border-sf-border pt-4 lg:w-auto lg:shrink-0 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0 lg:text-right">
      <p className="break-all font-mono text-xs font-medium text-sf-text">alerts@uptimesentinel.io</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-sf-text-muted">Verified sender</p>
    </div>
  </section>
);

const EmailAlertsInfo = () => {
  return (
    <div>
        <EmailChannelSummary />
        <InfoBanner />
        <div className="mt-6 flex items-end justify-between">
          <div>
            <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">Recipients</h2>
            <p className="mt-1 text-xs text-sf-text-muted">People who receive incident notifications</p>
          </div>
        </div>
        <div className="mt-3">
        <EmailRecipients />
        </div>
        <div className="mt-7">
          <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">Delivery rules</h2>
          <p className="mt-1 text-xs text-sf-text-muted">Control which events are sent and how messages are grouped</p>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <EmailTypes />
          <DeliveryPreferences />
        </div>
        <QuietHours />
        <RecentAlerts />
    </div>
  );
};

export default EmailAlertsInfo;
