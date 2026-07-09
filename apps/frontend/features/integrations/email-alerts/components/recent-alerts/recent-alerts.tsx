"use client";
import { useEffect, useState } from "react";
import {
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { eventBadgeClass } from "../../data";
import { useRecentAlerts } from "@/features/integrations/email-alerts/hooks/useRecentAlerts";
import { formatTimeAgo } from "@/utils/format-time-ago";
import RecentAlertsSkeleton from "./recent-alerts-skeleton";
import RecentAlertsError from "./recent-alerts-error";
import RecentAlertsEmpty from "./recent-alerts-empty";
import { EMAIL_ALERT_LIMIT } from "@/constants/constant";

const RecentAlerts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: emailAlertsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useRecentAlerts(currentPage, EMAIL_ALERT_LIMIT);
  const isPageFetching = isFetching && !isLoading;
  const [showFetchingIndicator, setShowFetchingIndicator] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowFetchingIndicator(isPageFetching);
    }, isPageFetching ? 200 : 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isPageFetching]);

  if (isLoading) {
    return <RecentAlertsSkeleton />;
  }

  if (isError || !emailAlertsData) {
    return <RecentAlertsError refetch={refetch} />;
  }

  if (emailAlertsData.data.length === 0) {
    return <RecentAlertsEmpty />;
  }

  // Dummy pagination: hard-coded 10 pages until the backend supplies the real
  // page/totalPages. Later, lift currentPage/totalPages to props driven by the
  // API response and call onPageChange instead of local state.
  const totalPages = emailAlertsData.pagination.totalPage;
  const goToPage = (page: number) =>
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  const subject = {
    down: "is down",
    recovery: "is recovered",
    reminder: "is still down",
  };

  const requiredData = emailAlertsData.data.map((email) => {
    return {
      id: email.id,
      event: email.type,
      dot: email.type === "recovery" ? "bg-sf-green" : "bg-sf-red",
      subject: `${email.urlName} ${subject[email.type]}`,
      monitor: email.urlName,
      recipients: 4,
      sent: formatTimeAgo(email.sentAt),
      delivery: email.status === "sent" ? "Delivered" : "Failed",
    };
  });

  return (
    <div className="mt-7 w-full rounded-lg border border-sf-border bg-sf-surface shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      <div className="py-3 px-4 border-b border-sf-border flex items-start justify-between">
        <div>
          <h1 className="text-[14px] font-semibold tracking-normal text-sf-text">
            Delivery activity
          </h1>
          <p className="text-[12px] text-sf-text-sub">Recent alert emails · last 7 days</p>
        </div>
        <button
          type="button"
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-sf-sm border border-sf-border px-3 py-1.5 text-[12px] font-medium text-sf-text transition-colors hover:border-sf-text-muted hover:bg-sf-bg"
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
              className="font-sans text-[10px] font-semibold uppercase tracking-widest text-sf-text-muted"
            >
              {col}
            </span>
          ))}
        </div>

        <div className="relative">
          {showFetchingIndicator && (
            <div
              className="absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden bg-sf-border-faint"
              aria-hidden="true"
            >
              <div className="h-full w-1/2 rounded-full bg-sf-blue animate-sf-progress-slide" />
            </div>
          )}
          <div
            aria-busy={showFetchingIndicator}
            className="divide-y divide-sf-border"
          >
            {requiredData.map((alert) => (
              <div
                key={alert.id}
                className="grid grid-cols-[120px_1fr_120px_80px_100px] gap-4 py-3 items-center px-2 -mx-2 rounded-sf hover:bg-sf-border-faint/60 transition-colors"
              >
                <span
                  className={`w-fit text-xs font-semibold font-sans border rounded-md px-2 py-0.5 ${eventBadgeClass[alert.event]}`}
                >
                  {alert.event}
                </span>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${alert.dot}`}
                    />
                    <span className="text-[13px] font-sans font-medium text-sf-text truncate">
                      {alert.subject}
                    </span>
                  </div>
                  <span className="text-xs font-sans text-sf-text-muted pl-3.5">
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

      {/* Footer — dummy 10-page pagination; wire to backend page/totalPages later */}
      <div className="flex items-center justify-between gap-4 border-t border-sf-border px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-sf-text-muted">
            Page <span className="text-sf-text-sub">{currentPage}</span> of{" "}
            {totalPages}
          </span>
          <span
            aria-live="polite"
            className={`inline-flex w-[82px] items-center gap-1.5 rounded-sf border border-sf-border-faint bg-sf-bg px-2 py-1 text-xs font-medium text-sf-text-muted transition-opacity duration-200 ${
              showFetchingIndicator ? "opacity-100" : "opacity-0"
            }`}
          >
            <LoaderCircle className="h-3 w-3 animate-spin text-sf-blue" />
            Updating
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex h-7 w-7 items-center justify-center rounded-sf border border-sf-border text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            const showEllipsisBefore =
              page === currentPage - 2 && currentPage > 4;
            const showEllipsisAfter =
              page === currentPage + 2 && currentPage < totalPages - 3;
            const isVisible =
              page === 1 ||
              page === totalPages ||
              Math.abs(page - currentPage) <= 1;

            if (showEllipsisBefore || showEllipsisAfter) {
              return (
                <span
                  key={`ellipsis-${page}`}
                  className="px-0.5 text-[12px] text-sf-text-muted"
                >
                  …
                </span>
              );
            }
            if (!isVisible) return null;

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                disabled={isActive}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-7 min-w-7 items-center justify-center rounded-sf border px-2 font-mono text-[12px] tabular-nums transition-colors ${
                  isActive
                    ? "border-sf-blue/40 bg-sf-blue-bg text-sf-blue"
                    : "border-sf-border text-sf-text-sub hover:bg-sf-bg hover:text-sf-text"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex h-7 w-7 items-center justify-center rounded-sf border border-sf-border text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentAlerts;
