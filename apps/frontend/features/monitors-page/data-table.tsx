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
        | RowSelectionState
        | ((old: RowSelectionState) => RowSelectionState),
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

  // Dummy pagination: hard-coded 10 pages until the backend supplies the real
  // page/totalPages. Later, lift currentPage/totalPages to props driven by the
  // API response and call onPageChange instead of local state.
  const totalPages = totalPage;
  const goToPage = (page: number) =>
    onChangePage(Math.min(Math.max(page, 1), totalPages));

  if (data.length === 0) {
    return (
      <MonitorsEmpty
        isFiltered={isFiltered}
        onClearFilter={onClearFilter}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-sf border border-sf-border bg-sf-surface">
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
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="border-b border-sf-border transition-colors last:border-b-0 hover:bg-sf-bg/70 data-[state=selected]:bg-sf-border-faint"
              >
                {row.getVisibleCells().map((cell) => {
                  const colId = cell.column.id;
                  const w =
                    colId === "select"
                      ? "w-10"
                      : colId === "name"
                        ? "w-[190px] max-w-[190px]"
                        : colId === "url"
                          ? "w-[260px] max-w-[260px]"
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
                      className={`px-4 py-2.5 align-middle ${w} ${align}`}
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

      {/* Footer — dummy 10-page pagination; wire to backend page/totalPages later */}
      <div className="flex items-center justify-center mt-3 px-1">
        <Pagination className="w-auto mx-0">
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
