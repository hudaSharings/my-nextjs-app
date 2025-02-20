import TreeViewTable from "@/components/treeview-table";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Shift } from "@/lib/types/shift";
import { ShiftFilter } from "@/lib/types";
import { getShifts } from "@/services/shiftService";
import ShiftFilterForm from "./shiftFilter";
type ShiftTableProps = {  
  onDelete: (shift: Shift) => void;
  onEdit: (shift: Shift) => void;
  onView: (shift: Shift) => void; 
  onAddnew: () => void;
};
export default function Page({onDelete, onEdit, onView,onAddnew}: ShiftTableProps) {

        const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
        const [filter,SetFilter]=useState<ShiftFilter>();

        const [ShiftData,setShiftData] = useState<Shift[]>([]);

     const { data,isLoading ,refetch,isFetching,error } = useQuery<{ data: Shift[]; totalCount: number }>({
       queryKey: ["shifts", filter,pagination],
       refetchOnWindowFocus: false,
       queryFn:async () =>{
         const response = await getShifts({
           pageIndex: pagination.pageIndex, 
           pageSize: pagination.pageSize,
           ...filter,
         });
         console.log("Data from server:", response);
         return response;
       },  
       placeholderData: keepPreviousData,   
     });
      if (error) {
        console.error("Error fetching shifts:", error);
      }
      
    const handleAction = (shift: Shift, action: string) => {
      if (shift) {
        if (action === "edit") {      
          onEdit(shift);
        } else if (action === "view") {       
          onView(shift);
        } else if (action === "delete") {
          onDelete(shift);    
        }
      }
    };
    const actionsColumn = (
          handleAction: (shift: Shift, action: string) => void
        ): ColumnDef<Shift>[] => [
          {
            id: "actions",
            cell: ({ row }) => {
              const payment = row.original;
      
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleAction(payment, "edit")}
                    >
                      {" "}
                      <Pencil />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction(payment, "view")}
                    >
                      <SquareArrowOutUpRight />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction(payment, "delete")}
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            },
          },
        ]
    const columns = useMemo<ColumnDef<any>[]>(
      () => [
        {
          accessorKey: "name",
          header: ({ table }) => (
            <>
              <button
                {...{
                  onClick: table.getToggleAllRowsExpandedHandler(),
                }}
              >
                {table.getIsAllRowsExpanded() ? "↡" : "↪"}
              </button>{" "}
              Name
            </>
          ),
          cell: ({ row, getValue }) => (
            <div
              className="flex"
              style={{
                paddingLeft: `${row.depth * 2}rem`,
                cursor: "pointer"
            }}
            >
              {row.getCanExpand() ? (
                <button
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? "↡" : "↪"}
                </button>
              ) : (
                null
              )}{null}
              <div>{getValue<any>()}</div>
            </div>
          ),
          footer: (props) => props.column.id,
        },
        {
          accessorKey: 'fromTime',
          header: () => 'FromTime',
          footer: props => props.column.id,
        },
        {
          accessorKey: 'toTime',
          header: () => <span>To Time</span>,
          footer: props => props.column.id,
        },
        {
          accessorKey: 'tolerance',
          header: 'Tolerance',
          footer: props => props.column.id,
        },
        {
          accessorKey: 'expectedHours',
          header: 'Expected Hours',
          footer: props => props.column.id,
        },
        {
          accessorKey: 'isSplit',
          header: 'Is Split',
          footer: props => props.column.id,
        },
        {
          accessorKey: 'isActive',
          header: 'Is Active',
          footer: props => props.column.id,
        },
        ...actionsColumn(handleAction),
      ],
      []
    );

    useEffect(() => {
      if(data?.data){
        setShiftData(data?.data)
      }
    },[data?.data]);

    useEffect(() => {
      debugger;
      console.log(ShiftData)
    },[ShiftData])

    return (
        <TreeViewTable 
        key={'shift'}
        data={data?.data ?? []} 
        columns={columns} 
        totalCount={data?.totalCount}
        childDataName={"splits"} 
        isLoading={isFetching || isLoading} 
        addnew={onAddnew} 
        referesh={refetch} 
        onPaginationChange={setPagination}
        filterComponent={<ShiftFilterForm getFilter={SetFilter} />}
        />          
    )
}