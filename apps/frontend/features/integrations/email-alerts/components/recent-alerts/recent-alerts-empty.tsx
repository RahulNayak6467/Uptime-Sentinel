import { MailCheck } from "lucide-react";

const RecentAlertsEmpty = () => {
  return (
    <div className="w-full bg-sf-surface border border-sf-border rounded-lg mt-6">
      <div className="py-3 px-4 border-b border-sf-border">
        <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
          Recent alert emails
        </h1>
        <p className="text-[12px] font-sans text-sf-text-sub">Last 7 days</p>
      </div>

      <div className="px-4 py-12 flex flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center justify-center size-10 rounded-full bg-sf-green-bg">
          <MailCheck className="w-5 h-5 text-sf-green" />
        </div>
        <p className="text-sm font-semibold text-sf-text">
          No alerts in the last 7 days
        </p>
        <p className="text-[12px] text-sf-text-muted max-w-xs">
          All your monitors have stayed healthy. Alert emails show up here when a
          monitor goes down or recovers.
        </p>
      </div>
    </div>
  );
};

export default RecentAlertsEmpty;
