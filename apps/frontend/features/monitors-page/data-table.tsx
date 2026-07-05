"use client";

import { useCallback } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
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

interface DataTableProps {
  columns: ColumnDef<MonitorPageData, unknown>[];
  data: MonitorPageData[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: (state: RowSelectionState) => void;
  onChangePage: (page: number) => void;
  currentPage: number;
  totalPage: number;
  isFiltered: boolean;
  onClearFilter: () => void;
}

export function MonitorsDataTable({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
  onChangePage,
  currentPage,
  totalPage,
  isFiltered,
  onClearFilter,
}: DataTableProps) {
  const handleRowSelectionChange = useCallback(
    (
      updater:
        RowSelectionState | ((old: RowSelectionState) => RowSelectionState),
    ) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      onRowSelectionChange(next);
    },
    [rowSelection, onRowSelectionChange],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    state: { rowSelection },
  });

  const totalPages = totalPage;
  const goToPage = (page: number) =>
    onChangePage(Math.min(Math.max(page, 1), totalPages));

  if (data.length === 0) {
    return (
      <MonitorsEmpty isFiltered={isFiltered} onClearFilter={onClearFilter} />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sf-border bg-sf-surface shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-sf-border px-5 py-4">
          <div>
            <h2 className="text-[14px] font-semibold tracking-sf-tight text-sf-text">
              Monitor inventory
            </h2>
            <p className="mt-1 text-[11px] text-sf-text-muted">
              {data.length} endpoint{data.length === 1 ? "" : "s"} on this page
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-sf-text-muted">
            <i className="size-1.5 rounded-full bg-sf-green" />
            Live data
          </span>
        </div>
        <div className="overflow-x-auto">
        <Table>
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
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="border-b border-sf-border/80 transition-colors last:border-b-0 hover:bg-sf-bg/60 data-[state=selected]:bg-sf-blue-bg/40"
              >
                {row.getVisibleCells().map((cell) => {
                  const colId = cell.column.id;
                  const w =
                    colId === "select"
                      ? "w-10"
                      : colId === "name"
                        ? "w-[280px] max-w-[280px]"
                          : "";
                  const align =
                    colId === "select" ||
                    colId === "type" ||
                    colId === "uptime" ||
                    colId === "trend" ||
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

      <div className="flex items-center justify-between border-t border-sf-border bg-sf-bg/20 px-5 py-3">
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.08em] text-sf-text-muted sm:block">
          Page <span className="text-sf-text-sub">{currentPage}</span> of {totalPages}
        </p>
        <Pagination className="mx-0 w-auto">
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
