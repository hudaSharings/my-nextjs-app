"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Adjust the import path
import { Button } from "@/components/ui/button"
import {
    ColumnDef,
    ColumnFiltersState,
    ExpandedState,
    PaginationOptions,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
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

  import { Filter, FilterX, RefreshCcw, SlidersHorizontal, SquarePlus } from "lucide-react"
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Fragment, ReactNode, useState } from "react";


// Sample data for the tree view table

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[],
  childDataName:string,
  data: TData[],
  totalCount?: number,
  paginationState?: PaginationState,
  onPaginationChange?: (pagination: PaginationState) => void,
  addnew: () => void
  referesh: () => void
  isLoading?: boolean
  filterComponent?: ReactNode
}

function TreeViewTable<TData, TValue>({
    columns,
    childDataName,
    data,
    totalCount,
    paginationState,
    onPaginationChange,
    addnew,
    referesh,
    isLoading,
    filterComponent
  }: DataTableProps<TData, TValue>) {
    const [expanded, setExpanded] = useState<ExpandedState>({})
      const [sorting, setSorting] = useState<SortingState>([])
      const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
      const [columnVisibility, setColumnVisibility] =useState<VisibilityState>({})
      const [rowSelection, setRowSelection] = useState({})
      const [showFilter, setShowFilter] = useState(false)
      const [pagination, setPagination] = useState<PaginationState>(paginationState ?? { pageIndex: 0, pageSize: 10 });

    const table = useReactTable({
      data, // Use the correct variable
      columns: columns,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination,
        expanded,
      },
      onExpandedChange: setExpanded,
      getSubRows: (row: any) => row[childDataName], // Correct key
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      manualPagination: true,
      rowCount: totalCount,
      onPaginationChange: setPagination,
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      debugTable: true,
    });

    const handleRefresh = () => { 
      table.resetPagination();
      referesh();
    }

  return (
    <div>
      <div className="flex items-center ">
        <div className="flex w-full  items-center space-x-2 py-2 h-8">
          <div className="mt-6 h-9 flex">
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
              className="ml-2"
            >
              {showFilter ? <FilterX /> : <Filter />}
            </Button>
          )}
          </div>
          {showFilter && filterComponent}
        </div>
        <div className="py-2 ml-2 mt-4 flex h-12">
          <div className="ml-auto">
            <Button
              variant="outline"
              size={"sm"}
              className="mr-2"
              onClick={handleRefresh}
            >
              <RefreshCcw />
            </Button>
          </div>
          <div className="ml-auto">
            <Button variant="outline" size={"sm"} onClick={addnew}>
              <SquarePlus />
            </Button>
          </div>
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
          {isLoading === true && (
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
          {isLoading === false && (
            <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell: any) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                </Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
          {/* {table.getRowModel().rows.length}  of {totalCount} row(s) . */}
          Total Records : {totalCount}
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
};

export default TreeViewTable;
