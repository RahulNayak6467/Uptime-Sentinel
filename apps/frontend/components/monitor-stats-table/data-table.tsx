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

import { Search, SlidersHorizontal } from "lucide-react";
import MonitorsEmpty from "@/components/empty-states/monitors-empty";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage: number;
  changeCurrentPage: (page: number) => void;
  totalPage: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  currentPage,
  changeCurrentPage,
  totalPage,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Dummy pagination: hard-coded 10 pages until the backend supplies the real
  // page/totalPages. Later, lift currentPage/totalPages to props driven by the
  // API response and call onPageChange instead of local state.
  const totalPages = totalPage;
  const goToPage = (page: number) =>
    changeCurrentPage(Math.min(Math.max(page, 1), totalPages));

  if (data.length === 0) {
    return <MonitorsEmpty />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-sf-border bg-sf-surface shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-sf-border px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-sf-text">
            Monitors
          </span>
          <span className="rounded-sf border border-sf-border bg-sf-bg px-1.5 py-0.5 font-mono text-[11px] text-sf-text-sub">
            {data.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-sf border border-sf-border bg-sf-bg px-3 py-1.5 text-sf-text-muted">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <input
              type="text"
              placeholder="Filter monitors"
              className="text-[13px] bg-transparent outline-none placeholder:text-sf-text-muted text-sf-text w-44"
              disabled
            />
          </div>
          <button className="flex cursor-pointer items-center gap-1.5 rounded-sf border border-sf-border px-3 py-1.5 text-[13px] font-medium text-sf-text transition-colors hover:bg-sf-bg">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-sf-border bg-sf-bg/60 hover:bg-sf-bg/60"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-2.5 align-middle font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted"
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
              data-state={row.getIsSelected() && "selected"}
              className="border-b border-sf-border transition-colors last:border-b-0 hover:bg-sf-bg/70"
            >
              {row.getVisibleCells().map((cell) => {
                const widthClass =
                  cell.column.id === "url_name"
                    ? "w-[190px] max-w-[190px]"
                    : cell.column.id === "url"
                      ? "w-[260px] max-w-[260px]"
                      : "";
                const alignClass =
                  cell.column.id === "uptime" ||
                  cell.column.id === "trend" ||
                  cell.column.id === "statusCode" ||
                  cell.column.id === "interval_seconds" ||
                  cell.column.id === "next_check_at" ||
                  cell.column.id === "status"
                    ? "text-center"
                    : cell.column.id === "responseTime"
                      ? "text-right"
                      : "";
                return (
                  <TableCell
                    key={cell.id}
                    className={`px-4 py-2.5 align-middle ${widthClass} ${alignClass}`}
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

      <div className="border-t border-sf-border px-4 py-3">
        <Pagination>
          <PaginationContent>
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

              if (showEllipsisBefore || showEllipsisAfter) {
                return (
                  <PaginationItem key={`ellipsis-${page}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }
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
