"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MonitorPageData } from "./types";
import MonitorsEmpty from "@/components/empty-states/monitors-empty";
import { useRouter } from "next/navigation";
import type { MonitorTab } from "./monitors-filter-tabs";

interface DataTableProps {
  columns: ColumnDef<MonitorPageData, unknown>[];
  data: MonitorPageData[];
  onChangePage: (page: number) => void;
  currentPage: number;
  totalPage: number;
  activeFilter: MonitorTab;
  isFiltered: boolean;
  onClearFilter: () => void;
}

export function MonitorsDataTable({
  columns,
  data,
  onChangePage,
  currentPage,
  totalPage,
  activeFilter,
  isFiltered,
  onClearFilter,
}: DataTableProps) {
  const router = useRouter();

  const handleRoute = (id: string) => {
    router.push(`/dashboard/monitors/${id}`);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const inventoryTitle =
    activeFilter === "all"
      ? "All monitors"
      : `${activeFilter.charAt(0).toUpperCase()}${activeFilter.slice(1)} monitors`;

  const totalPages = totalPage;
  const goToPage = (page: number) =>
    onChangePage(Math.min(Math.max(page, 1), totalPages));

  if (data.length === 0) {
    return (
      <MonitorsEmpty isFiltered={isFiltered} onClearFilter={onClearFilter} />
    );
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-sf-border bg-sf-surface">
      <div className="flex items-center justify-between gap-4 border-b border-sf-border px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">
            {inventoryTitle}
          </h2>
          <p className="mt-1 text-xs text-sf-text-muted">
            {data.length} endpoint{data.length === 1 ? "" : "s"} on this page
          </p>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-sf-text-muted sm:block">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[940px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-sf-border bg-sf-bg/50 hover:bg-sf-bg/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-10 px-4 py-2.5 align-middle text-[10px] font-semibold uppercase tracking-[0.1em] text-sf-text-muted"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => handleRoute(row.original.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleRoute(row.original.id);
                  }
                }}
                tabIndex={0}
                aria-label={`Open ${row.original.name}`}
                className="cursor-pointer border-b border-sf-border/80 transition-colors last:border-b-0 hover:bg-sf-bg/60 focus-visible:bg-sf-bg/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sf-text/15"
              >
                {row.getVisibleCells().map((cell) => {
                  const colId = cell.column.id;
                  const w =
                    colId === "name"
                      ? "w-[280px] max-w-[280px]"
                      : "";
                  const align =
                    colId === "type" ||
                    colId === "uptime" ||
                    colId === "trend" ||
                    colId === "statusCode" ||
                    colId === "interval" ||
                    colId === "nextCheck" ||
                    colId === "state"
                      ? "text-center"
                      : colId === "responseTime"
                        ? "text-right"
                        : "";
                  return (
                    <TableCell
                      key={cell.id}
                      className={`px-4 py-3 align-middle ${w} ${align}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-sf-border bg-sf-bg/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-sf-text-muted sm:block">
          Page <span className="text-sf-text-sub">{currentPage}</span> of{" "}
          {totalPages}
        </p>
        <Pagination className="mx-0 w-full justify-start overflow-x-auto sm:w-auto sm:justify-center">
          <PaginationContent className="min-w-max">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goToPage(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
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
              if (showEllipsisBefore || showEllipsisAfter)
                return (
                  <PaginationItem key={`e-${page}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              if (!isVisible) return null;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => goToPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => goToPage(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
