"use client";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import {
  MoreHorizontal,
  Pencil,
  SquareArrowOutUpRight,
  Trash2,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { User, UserFilter } from "@/lib/types";
import UserFilterForm from "./userFilter";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers } from "@/services/userService";

type UserTableProps = {  
  onDelete: (user: User) => void;
  onEdit: (user: User) => void;
  onView: (user: User) => void; 
  onAddnew: () => void;
};
export default function UserTable({onDelete, onEdit, onView,onAddnew}: UserTableProps) {
 
  const [selectedUser, setSelectedUser] = useState<User | null>(null);  
 
 const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
 const [sort,setSort]=useState<{column:string,order:"asc"|"desc"}>();
 const [filter,SetFilter]=useState<UserFilter>();

  const { data,isLoading ,refetch,isFetching,error } = useQuery<{ data: User[]; totalCount: number }>({
    queryKey: ["users", filter,pagination,sort],
    refetchOnWindowFocus: false,
    queryFn:async () =>{
      const response = await getUsers({
        pageIndex: pagination.pageIndex, 
        pageSize: pagination.pageSize,
        sortBy: sort?.column,
        sortOrder: sort?.order,
        ...filter,
      });
      console.log("Data from server:", response);
      return response;
    },  
    placeholderData: keepPreviousData,   
  });
  if (error) {
    console.error("Error fetching users:", error);
  }

  const handleAction = (id: number, action: string) => {
    const user = data?.data.find((user) => user.id === id);
    if (user) {
      setSelectedUser(user);
      if (action === "edit") {      
        onEdit(user);
      } else if (action === "view") {       
        onView(user);
      } else if (action === "delete") {
        onDelete(user);        
      }
    }
  };
  const addnewUser = () => {   
    onAddnew();
  };
 const handlerefetch=useCallback(() => {  
  refetch();
 },[])
  const handleFilter = useCallback((fv: UserFilter) => {
    SetFilter(fv);
    console.log(fv);
  }, []);

  const handlePaginationChange=useCallback((pagination: { pageIndex: number; pageSize: number })=>{
          setPagination(pagination);
          console.log("Pagination changed:", pagination);           
  },[])
const actionsColumn = (
    handleAction: (id: number, action: string) => void
  ): ColumnDef<User>[] => [
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
  // Define Columns
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    // {
    //   accessorKey: "employeeId",
    //   header: "Employee Id",
    // },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return <SortingButton column={column} title="Name" />;
      },
    },
    {
      accessorKey: "userName",
      header: ({ column }) => {
        return <SortingButton column={column} title="User Name" />;
      },
    },
    {
      accessorKey: "mobileNumber",
      header: ({ column }) => {
        return <SortingButton column={column} title="Mobile Number" />;
      },
    },
    {
      accessorKey: "userType",
      header: ({ column }) => {
        return <SortingButton column={column} title="User Type" />;
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    ...actionsColumn(handleAction),
  ];

  return (
    <div className="container ">
      <DataTable
      key={'user'}
        columns={columns}
        data={data?.data||[]}
        totalCount={data?.totalCount}
        paginationState={pagination}
        onPaginationChange={handlePaginationChange}
        addnew={addnewUser}
        referesh={handlerefetch}
        isLoading={isLoading||isFetching}
        filterComponent={<UserFilterForm getFilter={handleFilter} />}
      />

    </div>
  );
}

export function SortingButton({ column, title }: any) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
