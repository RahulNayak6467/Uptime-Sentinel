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

import { ArrowUpRight, RadioTower } from "lucide-react";
import MonitorsEmpty from "@/components/empty-states/monitors-empty";
import Link from "next/link";

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

  const totalPages = totalPage;
  const goToPage = (page: number) =>
    changeCurrentPage(Math.min(Math.max(page, 1), totalPages));

  if (data.length === 0) {
    return <MonitorsEmpty />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sf-border bg-sf-surface shadow-sm">
      <div className="flex flex-col gap-3 border-b border-sf-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sf-blue-bg text-sf-blue">
            <RadioTower className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-sf-text">
                All monitors
              </span>
              <span className="rounded-full bg-sf-bg px-2 py-0.5 font-mono text-xs text-sf-text-muted ring-1 ring-inset ring-sf-border">
                {data.length} shown
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-sf-text-muted">
              Live status and recent response performance
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/monitors"
          className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-sf-border bg-sf-surface px-3 py-2 text-xs font-semibold text-sf-text-sub shadow-sm transition-all hover:border-sf-text-muted/50 hover:text-sf-text"
        >
          View all
          <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[860px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-sf-border bg-sf-bg/60 hover:bg-sf-bg/60"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2.5 align-middle font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-sf-text-muted"
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
      </div>

      <div className="flex flex-col gap-3 border-t border-sf-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
