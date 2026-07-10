type SectionHeaderProps = {
  step?: string;
  title: string;
  description: string;
  badge?: string;
};

const SectionHeader = ({ step, title, description, badge }: SectionHeaderProps) => (
  <div className="flex flex-col gap-3 border-b border-sf-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
    <div className="flex min-w-0 items-center gap-3">
      {step && (
        <span className="shrink-0 font-mono text-xs font-semibold text-sf-text-muted">
          {step}
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-sf-text-muted">{description}</p>
      </div>
    </div>
    {badge && (
      <span className="rounded-sf border border-sf-border bg-sf-bg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sf-text-muted">
        {badge}
      </span>
    )}
  </div>
);

export default SectionHeader;
