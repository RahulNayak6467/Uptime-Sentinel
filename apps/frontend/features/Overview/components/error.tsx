type ErrorProps = { refetch: () => void };

const Error = ({ refetch }: ErrorProps) => {
  return (
    <div className="px-4 py-6 flex flex-col items-center justify-center gap-2 border-b border-sf-border bg-sf-surface text-center">
      <p className="text-sm font-semibold text-sf-red">
        Couldn&apos;t load overview stats
      </p>
      <p className="text-[12px] text-sf-text-muted">
        Something went wrong while fetching your dashboard metrics.
      </p>
      <button
        onClick={() => refetch()}
        className="mt-1 text-[12px] font-semibold text-sf-text underline underline-offset-2 hover:text-sf-text-muted"
      >
        Retry
      </button>
    </div>
  );
};

export default Error;
