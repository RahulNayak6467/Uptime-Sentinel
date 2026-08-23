type LoaderProps = { refetch?: () => void };

const Loader = ({}: LoaderProps) => {
  return (
    <section>
      <div className="mb-3 space-y-2">
        <div className="h-2 w-28 animate-pulse rounded bg-sf-border" />
        <div className="h-4 w-36 animate-pulse rounded bg-sf-border" />
      </div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="sf-panel flex min-h-[132px] flex-col justify-between p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-2 w-20 rounded bg-sf-border animate-pulse" />
            <div className="size-6 rounded-sf-sm bg-sf-border animate-pulse" />
          </div>
          <div className="mt-2 space-y-2">
            <div className="h-6 w-16 rounded bg-sf-border animate-pulse" />
            <div className="h-2 w-24 rounded bg-sf-border animate-pulse" />
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-sf-border animate-pulse" />
        </div>
      ))}
    </div>
    </section>
  );
};

export default Loader;
