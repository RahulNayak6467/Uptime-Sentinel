import { ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { alertEmails, eventBadgeClass } from "../../data";

const RecentAlerts = () => {
  return (
    <div className="w-full bg-sf-surface border border-sf-border rounded-lg mt-6">
      <div className="py-3 px-4 border-b border-sf-border flex items-start justify-between">
        <div>
          <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
            Recent alert emails
          </h1>
          <p className="text-[12px] font-sans text-sf-text-sub">Last 7 days</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-sf-border rounded-lg text-[13px] font-sans font-medium text-sf-text hover:bg-sf-bg transition-colors cursor-pointer shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View all
        </button>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-[120px_1fr_120px_80px_100px] gap-4 py-2.5 border-b border-sf-border">
          {["Event", "Subject", "Recipients", "Sent", "Delivery"].map((col) => (
            <span
              key={col}
              className="text-[11px] font-semibold font-sans text-sf-text-muted uppercase tracking-widest"
            >
              {col}
            </span>
          ))}
        </div>

        <div className="divide-y divide-sf-border">
          {alertEmails.map((alert) => (
            <div
              key={alert.id}
              className="grid grid-cols-[120px_1fr_120px_80px_100px] gap-4 py-3 items-center"
            >
              <span
                className={`w-fit text-[11px] font-semibold font-sans border rounded-md px-2 py-0.5 ${eventBadgeClass[alert.event]}`}
              >
                {alert.event}
              </span>

              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${alert.dot}`} />
                  <span className="text-[13px] font-sans font-medium text-sf-text truncate">
                    {alert.subject}
                  </span>
                </div>
                <span className="text-[11px] font-sans text-sf-text-muted pl-3.5">
                  {alert.monitor}
                </span>
              </div>

              <span className="text-[13px] font-sans text-sf-text-sub">
                {alert.recipients} recipients
              </span>

              <span className="text-[13px] font-sans text-sf-text-muted">
                {alert.sent}
              </span>

              <div className="flex items-center gap-1">
                {alert.delivery === "Delivered" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-sf-green shrink-0" />
                    <span className="text-[13px] font-sans font-semibold text-sf-green">
                      Delivered
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-sf-red shrink-0" />
                    <span className="text-[13px] font-sans font-semibold text-sf-red">
                      Failed
                    </span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentAlerts;
