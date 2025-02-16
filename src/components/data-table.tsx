"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationOptions,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useCallback, useEffect } from "react"
import { Columns3, Filter, FilterX, ListChecks, ListFilter, SlidersHorizontal } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import user from "@/db/schema/users"
import { Label } from "./ui/label"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  totalCount?: number,
  paginationState?: PaginationState,
  onPaginationChange: (pagination: PaginationState) => void,
  addnew: () => void
  isLoading?: boolean
  filterComponent?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  paginationState,
  onPaginationChange,
  addnew,
  isLoading,
  filterComponent
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [showFilter, setShowFilter] = React.useState(false)
  const [pagination, setPagination] = React.useState<PaginationState>(paginationState ?? { pageIndex: 0, pageSize: 10 });
  const [visiblePrevious, setVisiblePrevious] = React.useState(false)
  const [visibleNext, setVisibleNext] = React.useState(false)
  const table = useReactTable({
    data:data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, 
    rowCount: totalCount,
    onPaginationChange: setPagination,    
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,    
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })
useEffect(() => {
  onPaginationChange(table.getState().pagination);
}, [table.getState().pagination]);  

return (
    <div>
      <div className="flex items-center ">
        <div className="flex w-full  items-center space-x-2 py-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"sm"}>
                <SlidersHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {filterComponent && (
            <Button
              variant="outline"
              size={"sm"}
              onClick={() => setShowFilter(!showFilter)}
            >
              {showFilter ? <FilterX /> : <Filter />}
            </Button>
          )}
          {showFilter && filterComponent}
        </div>
        <div className="ml-auto">
          <Button variant="outline" size={"sm"} onClick={addnew}>
            Add
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          {isLoading == true && (
            <TableBody>
              {[...Array(4)].map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
          {isLoading == false && (
            <TableBody>
              {}
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className=" text-sm text-muted-foreground">
          {totalCount} of {table.getRowModel().rows.length} row(s) .
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            table.previousPage();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Label>{table.getState().pagination.pageIndex + 1}</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {         
            table.nextPage();
          }}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
