import { Client } from "@/lib/types/client";
import { getClients } from "@/services/clientService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { SortingButton } from "../users/UsersTable";
import { DataTable } from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { ClientFilter } from "@/lib/types";
import ClientFilterComp from "./clientFilter";

type ClientTableProps = {  
  onDelete: (client: Client) => void;
  onEdit: (client: Client) => void;
  onView: (client: Client) => void; 
  onAddnew: () => void;
};
export default function ClientTable({onDelete, onEdit, onView,onAddnew}: ClientTableProps) {

    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
    const [filter,SetFilter]=useState<ClientFilter>();
    const [focus,setFocus] = useState<boolean>(false);
   
     const { data,isLoading ,refetch,isFetching,error } = useQuery<{ data: Client[]; totalCount: number }>({
       queryKey: ["clients", filter,pagination],
       refetchOnWindowFocus: focus,
       queryFn:async () =>{
         const response = await getClients({
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
       console.error("Error fetching clients:", error);
     }

     const handleAction = (id: number, action: string) => {
      const client = data?.data.find((client) => client.id === id);
      if (client) {
        if (action === "edit") {      
          onEdit(client);
        } else if (action === "view") {       
          onView(client);
        } else if (action === "delete") {
          onDelete(client);        
        }
      }
    };

     const actionsColumn = (
      handleAction: (id: number, action: string) => void
    ): ColumnDef<Client>[] => [
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
                  onClick={() => handleAction(payment.id, "edit")}
                >
                  {" "}
                  <Pencil />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleAction(payment.id, "view")}
                >
                  <SquareArrowOutUpRight />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleAction(payment.id, "delete")}
                >
                  <Trash2 />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <SortingButton column={column} title="Name" />;
      },
    },
    {
      accessorKey: "region",
      header: ({ column }) => {
        return <SortingButton column={column} title="Region" />;
      },
    },
    {
      accessorKey: "country",
      header: ({ column }) => {
        return <SortingButton column={column} title="Country" />;
      },
    },
    {
      accessorKey: "language",
      header: ({ column }) => {
        return <SortingButton column={column} title="Language" />;
      },
    },
    ...actionsColumn(handleAction),
  ];
     return (
      <>
      <div className="text-center">
        isRefresh On WindowFocus <input type="checkbox" checked={focus} onChange={()=>setFocus(focus?false:true)}></input>
      </div>
       <DataTable
       key={'client'}
         columns={columns}
         data={data?.data ?? []}
         totalCount={data?.totalCount ?? 0}
         paginationState={pagination}
         onPaginationChange={setPagination}
         isLoading={isLoading||isFetching}
         filterComponent={<ClientFilterComp getFilter={SetFilter} />}
         addnew={onAddnew}
         referesh={refetch}
       />
       </>
     )
   

}