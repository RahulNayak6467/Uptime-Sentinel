const IncidentHeader = () => {
  return (
    <header className="flex min-h-[88px] items-center border-b border-sf-border bg-sf-surface px-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-sf-tight text-sf-text">
          Incidents
        </h1>
        <p className="mt-1 truncate text-xs text-sf-text-muted">
          Track outages, investigation updates, and recovery
        </p>
      </div>
    </header>
  );
};

export default IncidentHeader;
