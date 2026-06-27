"use client";

import { useCallback } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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

interface DataTableProps {
  columns: ColumnDef<MonitorPageData, unknown>[];
  data: MonitorPageData[];
  rowSelection: RowSelectionState;
  onRowSelectionChange: (state: RowSelectionState) => void;
}

export function MonitorsDataTable({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
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
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    state: { rowSelection },
    initialState: { pagination: { pageSize: 16 } },
  });

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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sf-text-muted text-[13px]"
                >
                  No monitors found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center mt-3 px-1">
        <Pagination className="w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                aria-disabled={!table.getCanPreviousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, i) => {
              const page = i + 1;
              const current = table.getState().pagination.pageIndex + 1;
              const showEllipsisBefore = page === current - 2 && current > 4;
              const showEllipsisAfter =
                page === current + 2 && current < table.getPageCount() - 3;
              const isVisible =
                page === 1 ||
                page === table.getPageCount() ||
                Math.abs(page - current) <= 1;
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
                    isActive={page === current}
                    onClick={() => table.setPageIndex(i)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                aria-disabled={!table.getCanNextPage()}
                className={
                  !table.getCanNextPage()
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
