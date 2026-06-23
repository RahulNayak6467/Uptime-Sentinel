type LoaderProps = { refetch?: () => void };

const Loader = ({}: LoaderProps) => {
  return (
    <div className="flex">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="px-3 py-3 flex-1 flex flex-col gap-2 border-r border-b border-sf-border bg-sf-surface"
        >
          <div className="h-2 w-16 rounded bg-sf-border animate-pulse" />
          <div className="h-6 w-12 rounded bg-sf-border animate-pulse" />
          <div className="h-2 w-14 rounded bg-sf-border animate-pulse" />
        </div>
      ))}
    </div>
  );
};

export default Loader;
