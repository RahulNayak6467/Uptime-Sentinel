type LoaderProps = { refetch?: () => void };

const Loader = ({}: LoaderProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="sf-panel flex min-h-28 flex-col justify-center gap-2 px-4 py-4"
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
