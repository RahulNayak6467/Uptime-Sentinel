import { ChevronLeft, ChevronRight } from "lucide-react";

const pageButtonClass = (isActive: boolean) =>
  `flex h-7 min-w-7 items-center justify-center rounded-sf border px-2 font-mono text-[12px] tabular-nums transition-colors ${
    isActive
      ? "border-sf-blue/40 bg-sf-blue-bg text-sf-blue"
      : "border-sf-border text-sf-text-sub hover:bg-sf-bg hover:text-sf-text"
  }`;

const IncidentsPagination = ({
  currentPage,
  setCurrentPage,
  totalPage,
}: {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPage: number;
}) => {
  const goToPage = (page: number) =>
    setCurrentPage(Math.min(Math.max(page, 1), totalPage));

  return (
    <div className="mt-6 flex items-center justify-between gap-4 border-t border-sf-border px-1 py-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-sf-text-muted">
        Page <span className="text-sf-text-sub">{currentPage}</span> of{" "}
        {totalPage}
      </span>

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

        {Array.from({ length: totalPage }, (_, i) => {
          const page = i + 1;
          const showEllipsisBefore =
            page === currentPage - 2 && currentPage > 4;
          const showEllipsisAfter =
            page === currentPage + 2 && currentPage < totalPage - 3;
          const isVisible =
            page === 1 ||
            page === totalPage ||
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
              className={pageButtonClass(isActive)}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPage}
          aria-label="Next page"
          className="flex h-7 w-7 items-center justify-center rounded-sf border border-sf-border text-sf-text-sub transition-colors hover:bg-sf-bg hover:text-sf-text disabled:pointer-events-none disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default IncidentsPagination;
