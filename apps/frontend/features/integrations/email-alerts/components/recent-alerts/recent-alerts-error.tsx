type RecentAlertsErrorProps = { refetch: () => void };

const RecentAlertsError = ({ refetch }: RecentAlertsErrorProps) => {
  return (
    <div className="w-full bg-sf-surface border border-sf-border rounded-lg mt-6">
      <div className="py-3 px-4 border-b border-sf-border">
        <h1 className="text-[14px] font-sans font-semibold tracking-normal text-sf-text">
          Recent alert emails
        </h1>
        <p className="text-[12px] font-sans text-sf-text-sub">Last 7 days</p>
      </div>

      <div className="px-4 py-10 flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-semibold text-sf-red">
          Couldn&apos;t load recent alert emails
        </p>
        <p className="text-[12px] text-sf-text-muted">
          Something went wrong while fetching your recent alerts.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-1 text-[12px] font-semibold text-sf-text underline underline-offset-2 hover:text-sf-text-muted cursor-pointer"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default RecentAlertsError;
