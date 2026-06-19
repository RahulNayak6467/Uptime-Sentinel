"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-sf border border-sf-border bg-sf-surface">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sf-border">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-sf-text">Monitors</span>
          <span className="text-[15px] text-sf-text-sub">{data.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-sf-border rounded-sf bg-sf-surface text-sf-text-muted">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <input
              type="text"
              placeholder="Filter monitors"
              className="text-[13px] bg-transparent outline-none placeholder:text-sf-text-muted text-sf-text w-44"
              disabled
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-sf-text border border-sf-border rounded-sf hover:bg-sf-bg transition-colors cursor-pointer">
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
              className="border-b border-sf-border hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.09em] text-sf-text-muted align-bottom"
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
                data-state={row.getIsSelected() && "selected"}
                className="border-b border-sf-border hover:bg-sf-border-faint/60 transition-colors"
              >
                {row.getVisibleCells().map((cell) => {
                  const widthClass =
                    cell.column.id === "name"
                      ? "w-[190px]"
                      : cell.column.id === "url"
                        ? "w-[240px]"
                        : "";
                  return (
                    <TableCell
                      key={cell.id}
                      className={`px-4 py-2.5 align-middle ${widthClass}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="border-t border-sf-border px-4 py-3">
        <Pagination>
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
